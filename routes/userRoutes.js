const { register, login, setAvatar, getAllUsers, github, githubMe, logout, getContributedRepos, getUserImage } = require('../controllers/usersController');
const router = require('express').Router();

// POST
router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);

// GET
router.get("/github", github);
router.get("/github/me", githubMe);
router.get("/allUsers/:id", getAllUsers);
router.get("/logout", logout);
router.get("/contributedRepos/:username", getContributedRepos);
router.get("/getUserImage/:username", getUserImage);

module.exports = router;