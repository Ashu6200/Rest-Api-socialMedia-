const postRouter = require('express').Router();
const Post = require('../model/postModel');
const User = require('../model/userModel');
const verificationToken = require('../middleware/verificationToken');

//create a post
postRouter.post('/createpost', verificationToken, async (req, res) => {
    try {
        const { content, image } = req.body;
        const newPost = new Post({
            content, image, user: req.user.id
        })
        const post = await newPost.save();
        res.status(200).json(post);
    } catch (error) {
        return res.status(500).json("Internal error occured")
    }
})
// get the post 
postRouter.get('/post/:id', verificationToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json("Not found")
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json("Internal error occured")
    }
});

// update the post 
postRouter.post("/updatepost/:id", verificationToken, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        post = await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        })
        let updatePost = await post.save();
        res.status(200).json(updatePost);
    } catch (error) {
        return res.status(500).json("Error updating post", error);
    }

})
// delete the post
postRouter.delete("/deletepost/: id", verificationToken, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete({ _id: req.params.id, user: req.body._id })
        await Comments.deleteMany({ _id: { $in: post.comments } });
        res.status(200).json({
            msg: "Post deleted successfully.",
            newPost: {
                ...post,
                user: req.user
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
})

// likeand unlike post
postRouter.post("/:id/like", verificationToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.user)) {
            await Post.updateOne({ $push: { likes: req.body.user } })
            return res.status(200).json("Post has been liked")
        } else {
            await post.updateOne({ $pull: { like: req.user.id } });
            return res.status(200).json("Post has been unlike")
        }
    } catch (error) {
        return res.status(500).json("Internal error post")

    }

})


//get posts form specific user
postRouter.get("/userpost/:id", verificationToken, async (req, res) => {
    try {
        const mypost = await Post.find({ user: req.params.id });
        if (!mypost) {
            return res.status(400).json("You don't have any post")
        }

        res.status(200).json(mypost)
    } catch (error) {
        res.status(500).json("Internal server error")
    }

})


//get all save posts
postRouter.get("/savepost", verificationToken, async (req, res) => {
    try {
        const posts = await Post.find({ _id: { $in: req.user.saved } });
        const post = posts.sort("-createdAt");
        res.status(200).json(post)
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})

// saved and unsave post
postRouter.post("/savepost/:id", verificationToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user.saved.includes(req.body.Post)) {
            await Post.updateOne({ $push: { saved: req.body.Post } })
            return res.status(200).json("Post had been saved successfully");
        } else {
            await Post.updateOne({ $pull: { saved: req.body.Post } })
            return res.status(200).json("Post had been unsved successfully");
        }


    } catch (error) {
        return res.status(500).json("Internal server error")
    }

})
module.exports = postRouter;