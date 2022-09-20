const messageModel = require("../model/messageModel");
const userModel = require("../model/userModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const user = await userModel.findById(from);
        const msg = await messageModel.create({
            message: { text: message },
            repoId: to,
            sender: { id: from, username: user.username, avatarImage: user.avatarImage }
        });
        if (msg) return res.json({
            fromSelf: msg.sender.id.toString() === from,
            message: msg,
        })
        return res.json({ msg: "Failed tı add messages to the database." })
    } catch (error) {
        next(error)

    }
};
module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await messageModel.find({
            repoId: to
        }).sort({ updatedAt: 1 });
        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.id.toString() === from,
                message: msg,
            };
        })
        res.json(projectMessages);
    } catch (error) {
        next(error)
    }
};