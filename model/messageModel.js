const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        text: {
            type: String,
            required: true
        },
    },
    repoId: {
        type: Number,
        required: true
    },
    sender: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        username: {
            type: String,
            ref: "Users",
            required: true
        },
        avatarImage: {
            type: String,
            ref: "Users",
            required: true
        }
    },
}, { timestamps: true });

module.exports = mongoose.model("Messages", messageSchema);