const userRouter = require('express').Router();
const User = require('../model/userModel');
const verificationToken = require('../middleware/verificationToken');


//folowing and unfllowing 
userRouter.put('follow/:id', verificationToken, async (req, res,) => {
    if (req.params.id !== req.body.user) {
        const user = await User.findById(req.params.id);
        const otheruser = await User.findById(req.body.user);

        if (!user.followers.includes(req.body.user)) {
            await user.updateOne({ $push: { followers: req.body.user } });
            await otheruser.updateOne({ $push: { following: req.params.id } });
            return res.status(200).json("User has followed");
        } else {
            await user.updateOne({ $pull: { followers: req.body.user } });
            await otheruser.updateOne({ $pull: { following: req.params.id } });
            return res.status(200).json("User has Unfollowed");
        }
    } else {
        return res.status(400).json("You can't follow yourself")
    }
})

userRouter.post('/update/:id',verificationToken, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                const secpass = await bcrypt.hash(req.body.password, salt);
                req.body.password = secpass;
                const updateuser = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                });
                await updateuser.save();
                res.status(200).json(updateuser);
            }
        } else {
            return res.status(400).json("Your are not allow to update this user details ")
        }
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
});

userRouter.delete('/delete/:id', verificationToken,async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json('User has been deleted!');
        } else {
            res.status(404).json('User has not been deleted!');
        }
    } catch (err) {
        console.log('Can`t be deleted!');
    }
});

userRouter.get("/all/user/:id",verificationToken, async (req, res) => {
    try {
        const allUser = await User.find();
        const user = await User.findById(req.params.id);
        const followinguser = await Promise.all(
            user.following.map((item) => {
                return item;
            })
        )
        let UserToFollow = allUser.filter((val) => {
            return !followinguser.find((item) => {
                return val._id.toString() === item;
            })
        })

        let filteruser = await Promise.all(
            UserToFollow.map((item) => {
                const { email, followers, following, password, ...others } = item._doc;
                return others
            })
        )

        res.status(200).json(filteruser)
    } catch (error) {

    }
});

userRouter.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    };
})

module.exports = userRouter;