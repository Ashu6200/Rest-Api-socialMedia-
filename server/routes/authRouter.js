const authRouter = require('express').Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const User = require('../model/userModel');


authRouter.post('/register',
    body('email').isEmail(),
    body('username').isLength({ min: 4 }),
    body('password').isLength({ min: 6 }),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json("some error occured")
            }
            const { fullname, username, email, password, gender, avatar } = req.body;
            let newUserName = username.toLowerCase().replace(/ /g, "");
            const checkUsername = await username.findOne({ username: newUserName });
            if (checkUsername) {
                return res.status(400).json({ msg: "This username is already taken." });
            }
            const checkEmail = await email.findOne({ email: email });
            if (checkEmail) {
                return res.status(200).json({ msg: "This email is already taken." });
            }

            const passwordHash = await bcrypt.hash(password, 12);
            const newUser = await User({
                fullname,
                username: newUserName,
                email,
                password: passwordHash,
                gender,
                avatar,
            })
            const user = await newUser.save();
            res.send({
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                password: user.password,
                gender: user.gender,
                avatar: user.avatar,
            });
        } catch (error) {
            res.status(500).json({ msg: "Internal Server Error" });
        }
    })

authRouter.post('/login',
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(200).json({ msg: "This email is not present" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Email or Password is incorrect." });
            }
            res.send({
                user: {
                    ...user._doc
                }
            });
        } catch (error) {
            res.status(500).json({ msg: "Internal Server Error" });
        }
    }
)
module.exports = authRouter;