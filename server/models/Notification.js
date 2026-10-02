const mongoose = require('mongoose');

const TYPES = [
  'request_created',
  'request_accepted',
  'request_started',
  'request_completed',
  'request_cancelled',
  'request_assigned',
];

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    type: {
      type: String,
      enum: { values: TYPES, message: 'Invalid notification type' },
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpRequest',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

notificationSchema.statics.TYPES = TYPES;

module.exports = mongoose.model('Notification', notificationSchema);