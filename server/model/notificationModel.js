const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        recipients: [mongoose.Schema.Types.ObjectId],
        url: {
            type: String,
        },
        text: {
            type: String,
        },
        content: {
            type: String,
        },
        image: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('notify', NotificationSchema);