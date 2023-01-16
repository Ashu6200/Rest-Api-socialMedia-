const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "conversation"
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "user"
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        text: String,
        media: Array,
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('message', MessageSchema);