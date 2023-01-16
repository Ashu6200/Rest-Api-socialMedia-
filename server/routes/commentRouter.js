const commentRouter = require('express').Router();
const Comment = require('../model/commentModal');
const Post = require('../model/postModel');
const verificationToken = require('../middleware/verificationToken');


commentRouter.post('/comments', verificationToken, async (req, res) => {
    try {
        const { postId, content, tag, reply, postUserId } = req.body;
        const post = await findOne({ postId: postId });
        if (!post) {
            return res.status(404).json({ msg: "Post does not exist." });
        }
        if (reply) {
            const cm = await Comment.findById(reply);
            if (!cm) {
                return res.status(400).json({ msg: "Comment does not exist." });
            }
        }
        const newComment = new Comment({
            user: req.user._id,
            content,
            tag,
            reply,
            postUserId,
            postId
        })
        await Post.findOneAndUpdate(
            { _id: postId },
            {
                $push: { comments: newComment._id },
            },
            { new: true }
        );
        await newComment.save();
        res.json({ newComment });
    } catch (error) {
        return res.status(500).json({ msg: err.message });
    }
})


commentRouter.patch('/updateComment/:id', verificationToken, async (req, res) => {
    try {
        const { content } = req.body;
        await Comment.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { content }
        );
        res.json({ msg: "updated successfully." }, content);
    } catch (error) {
        return res.status(500).json({ msg: err.message });
    }
})

commentRouter.post("/:id/like", verificationToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment.likes.includes(req.body.user)) {
            await comment.updateOne({ $push: { likes: req.body.user } })
            return res.status(200).json("Post has been liked")
        } else {
            await comment.updateOne({ $pull: { likes: req.user.id } });
            return res.status(200).json("Post has been unlike")
        }
    } catch (error) {
        return res.status(500).json("Internal error post")

    }

})

commentRouter.delete("/delete/:id", verificationToken, async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({
            _id: req.params.id,
            $or: [
                { user: req.user._id },
                { postUserId: req.user._id }
            ]
        });

        await Posts.findOneAndUpdate({ _id: comment.postId }, {
            $pull: { comments: req.params.id }
        });
        res.json({ msg: "Comment deleted successfully." });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
})

module.exports = commentRouter;