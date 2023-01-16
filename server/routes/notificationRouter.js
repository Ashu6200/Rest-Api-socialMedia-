const notificationRouter = require("express").Router();
const Notification = require('../model/notificationModel');
const verificationToken = require('../middleware/verificationToken');

notificationRouter.get('/createnotification', verificationToken, async (req, res) => {
    try {
        const { id, recipients, url, text, content, image } = req.body;
        if (recipients.includes(req.user._id.toString())) return;
        const notify = new Notification({
            id,
            recipients,
            url,
            text,
            content,
            image,
            user: req.user._id,
        });

        await notify.save();
        return res.json({ notify });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
})
notificationRouter.delete("/notifications/:id", verificationToken, async (req, res) => {
    try {
        const notify = await Notification.findOneAndDelete({
            id: req.params.id,
            url: req.query.url,
        });
        return res.json({ notify });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
})
notificationRouter.get('/allnotifications', async (req, res) => {
    try {
        const notifies = await Notification.find({ recipients: req.user._id })
            .sort("-createdAt")
            .populate("user", "avatar username");

        return res.json({ notifies });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
})

notificationRouter.put('/isReadNotify/:id', verificationToken, async (req, res) => {
    try {
        const notifies = await Notification.findOneAndUpdate(
            { _id: req.params.id },
            {
                isRead: true,
            }
        );

        return res.json({ notifies });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
})
router.delete("/deleteAllNotify", verificationToken, async (req, res) => {

    try {
        const notifies = await Notification.deleteMany({ recipients: req.user._id });
        return res.json({ notifies });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});