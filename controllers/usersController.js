const User = require("../model/userModel");
const axios = require('axios');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const userModel = require("../model/userModel");
dotenv.config();

module.exports.register = async (req, res, next) => {
    try {
        const { username, github } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            axios.post("https://mylittlecode-api.herokuapp.com/api/auth/login", { username })
            return res.json({ msg: "User already used", status: false });
        }
        const user = await User.create({ username, github });

        return res.json({ status: true, user });
    } catch (error) {
        next(error)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user)
            return res.json({ msg: "User already used", status: false });
        return res.json({ status: true, user });
    } catch (error) {
        next(error)
    }
}

async function getGithubUser(code) {
    axios.defaults.headers.post['Accept'] = 'application/json';
    const githubToken = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
    }).then((res) => res.data)
        .catch((err) => {
            return res.status(500).send({ status: false, error: err.message })
        });

    const accessToken = githubToken.access_token;
    return axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` }
    }).then((result) => {
        result.data.accessToken = accessToken;
        return result.data;
    })
        .catch((err) => {
            console.log("Error getting user from Github");
            console.log(err.message);
        });
}

module.exports.github = async (req, res, next) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.send({ success: false, msg: "Error: no code" });
        }

        const githubUser = await getGithubUser(code);
        if (!githubUser) { return res.status(401).send({ success: false, msg: "Error getting user from Github" }); }
        const userExists = await User.findOne({ username: githubUser.login });

        if (userExists) {
            const token = jwt.sign({ ...githubUser, user: userExists }, process.env.SECRET);
            req.session[process.env.COOKIE_NAME] = token;
            return res.send({ success: true, token });
        }

        const user = await User.create({
            username: githubUser.login,
            github: githubUser.html_url
        });
        const newUser = { ...githubUser, user };

        const token = jwt.sign(newUser, process.env.SECRET);
        req.session[process.env.COOKIE_NAME] = token;
        return res.send({ success: true, token });
    } catch (error) {
        next(error)
    }
}

module.exports.githubMe = async (req, res, next) => {
    const user = req.session[process.env.COOKIE_NAME];
    if (!user) return res.send({ status: false, msg: "User not found" })
    try {
        const decode = jwt.verify(user, process.env.SECRET);
        return res.send({ status: true, user: decode });
    } catch (error) {
        next(error)
    }
}
module.exports.setAvatar = async (req, res, next) => {
    const userToken = req.session[process.env.COOKIE_NAME];
    const user = jwt.decode(userToken, process.env.SECRET);
    if (!user) return res.send({ status: false, msg: "User not found" })
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        });
        user.user.isAvatarImageSet = true;
        user.user.avatarImage = avatarImage;
        const token = jwt.sign(user, process.env.SECRET);

        req.session[process.env.COOKIE_NAME] = token;
        req.session.reload(function (err) {
            console.log(err);
        })
        return res.json({ isSet: true, image: avatarImage });
    } catch (error) {
        next(error)
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email", "username", "avatarImage", "_id"
        ])
        return res.json(users)
    } catch (error) {
        next(error)
    }
}

module.exports.getContributedRepos = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = jwt.decode(req.session[process.env.COOKIE_NAME], process.env.SECRET);
        if (!user) return res.status(401).send({ message: "Authentication failed!" });
        const userRepos = await axios.get(`https://api.github.com/users/${username}/repos`, {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        })
            .then((res) => res.data)
            .catch((err) => {
                return res.status(500).send({ status: false, error: err.message })
            });
        const reposAndcontributors = [];
        for (let index = 0; index < userRepos.length; index++) {
            const repo = userRepos[index];
            const contributors = [];

            if ((repo.watchers > 1 && repo.private === false) || (repo.fork == true)) {
                if (repo.fork == true) {
                    const forkedRepo = await axios.get(`https://api.github.com/repos/${username}/${repo.name}`, {
                        headers: { Authorization: `Bearer ${user.accessToken}` }
                    }).then(result => result.data.parent)
                        .catch((err) => {
                            return res.status(500).send({ status: false, error: err.message })
                        });
                    const forkedRepoContributors = await axios.get(`${forkedRepo.contributors_url}`, {
                        headers: { Authorization: `Bearer ${user.accessToken}` }
                    }).then((result) => result.data)
                        .catch((err) => {
                            return err.response.status;
                            // res.status(500).send({ status: false, error: err.message })
                        });

                    if (forkedRepoContributors !== 404 && forkedRepoContributors.find(x => x.login == username) && forkedRepoContributors.length > 1) {
                        for (let index = 0; index < forkedRepoContributors.length; index++) {
                            const contributor = forkedRepoContributors[index];
                            const userExists = await userModel.findOne({ username: contributor.login })
                            if (userExists) {
                                contributor.isAccount = true;
                                contributor.user = userExists;
                                contributors.push(contributor);
                            } else {
                                contributor.isAccount = false;
                                contributors.push(contributor);
                            }
                        }
                        reposAndcontributors.push({ repo: forkedRepo, contributors });
                    }

                } else {
                    await axios.get(`${repo.contributors_url}`, {
                        headers: { Authorization: `Bearer ${user.accessToken}` }
                    })
                        .then(async (result) => {
                            if (result.data.length > 1) {
                                for (let index = 0; index < result.data.length; index++) {
                                    const contributor = result.data[index];
                                    const userExists = await userModel.findOne({ username: contributor.login })
                                    if (userExists) {
                                        contributor.isAccount = true;
                                        contributor.user = userExists;
                                        contributors.push(contributor);
                                    } else {
                                        contributor.isAccount = false;
                                        contributors.push(contributor);
                                    }
                                }
                                reposAndcontributors.push({ repo, contributors });
                            }
                        }).catch((err) => {
                            return res.status(500).send({ status: false, error: err.message })
                        });
                }

            }
        }
        return res.send(reposAndcontributors);
    } catch (error) {
        next(error)
    }
}

module.exports.getUserImage = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (user) {
            return res.send({ status: true, avatarImage: user.avatarImage });
        }
        return res.send({ status: false });
    } catch (error) {
        next(error);
    }
}

module.exports.logout = async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(400).send('Unable to log out')
            } else {
                return res.send('Logout successful')
            }
        });
    } catch (error) {
        next(error)
    }
}


