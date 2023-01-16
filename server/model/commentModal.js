const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        tag: Object,
        reply: mongoose.Schema.Types.ObjectId,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }],
        postId: mongoose.Schema.Types.ObjectId,
        postUserId: mongoose.Schema.Types.ObjectId,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("comment", CommentSchema);
