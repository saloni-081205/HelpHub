const Notification = require('../models/Notification');

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const { unread, limit = 30 } = req.query;

    const query = { userId: req.user.id };
    if (unread === 'true') query.isRead = false;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).limit(Number(limit)),
      Notification.countDocuments({ userId: req.user.id, isRead: false }),
    ]);

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const n = await Notification.findOne({ _id: req.params.id, userId: req.user.id });
    if (!n) return res.status(404).json({ success: false, message: 'Notification not found' });

    n.isRead = true;
    await n.save();

    res.status(200).json({ success: true, notification: n });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    const n = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!n) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
const clearAll = async (req, res, next) => {
  try {
    await Notification.deleteMany({ userId: req.user.id });
    res.status(200).json({ success: true, message: 'Cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll,
};