const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment",
        },
    ],
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
}, {
    timestamps: true,
});
module.exports = mongoose.model('post', PostSchema);
