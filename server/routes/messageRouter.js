const messageRouter = require('express').Router()
const Conversations = require('../model/conversationModel');
const Messages = require('../model/messageModel');
const verificationToken = require('../middleware/verificationToken');

messageRouter.post("/message", verificationToken, async (req, res) => {
    try {
        const { recipient, text, media } = req.body;
        if (!recipient || (!text.trim() && media.length === 0)) return;

        const newConversation = await Conversations.findOneAndUpdate(
            {
                $or: [
                    { recipients: [req.user._id, recipient] },
                    { recipients: [recipient, req.user._id] },
                ],
            },
            {
                recipients: [req.user._id, recipient],
                text,
                media,
            },
            { new: true, upsert: true }
        );

        const newMessage = new Messages({
            conversation: newConversation._id,
            sender: req.user._id,
            recipient,
            text,
            media,
        });

        await newMessage.save();

        res.json({ msg: "Created." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},);

messageRouter.get("/conversations", verificationToken, async (req, res) => {
    try {
        const features = new Conversations.find({
            recipients: req.user._id
        }).req.query

        const conversations = await features.query
            .sort("-updatedAt")
            .populate("recipients", "avatar username fullname");

        res.json({
            conversations,
            result: conversations.length,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},
);

messageRouter.get("/message/:id", verificationToken, async (req, res) => {
    try {
        const features = new
            Messages.find({
                $or: [
                    { sender: req.user._id, recipient: req.params.id },
                    { sender: req.params.id, recipient: req.user._id },
                ],
            }).req.query;

        const messages = await features.query
            .sort("-createdAt");

        res.json({
            messages,
            result: messages.length,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},);