// models/pendingNotificationModel.js
const mongoose = require('mongoose');

const pendingNotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    notification: { type: Object, required: true },
    forAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: '7d' } // auto-delete after 7 days
});

module.exports = mongoose.model('PendingNotification', pendingNotificationSchema);