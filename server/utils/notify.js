const Notification = require('../models/Notification');

/**
 * Create a notification.
 * @param {Object} opts
 * @param {String} opts.userId - recipient user id
 * @param {String} opts.message
 * @param {String} opts.type
 * @param {String} [opts.link]
 * @param {String} [opts.requestId]
 */
const createNotification = async ({ userId, message, type, link = '', requestId = null }) => {
  try {
    if (!userId) return null;
    return await Notification.create({ userId, message, type, link, requestId });
  } catch (err) {
    // Notifications should never break the main flow
    console.error('Notification error:', err.message);
    return null;
  }
};

module.exports = { createNotification };