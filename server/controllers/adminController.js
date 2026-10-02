const { validationResult } = require('express-validator');
const User = require('../models/User');
const HelpRequest = require('../models/HelpRequest');

// ----------------------------------------------------------
// @desc    Get all users (search + filter)
// @route   GET /api/admin/users
// @access  Private / Admin
// ----------------------------------------------------------
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, isActive, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive === 'true') query.isActive = true;
    if (isActive === 'false') query.isActive = false;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Get single user details + activity summary
// @route   GET /api/admin/users/:id
// @access  Private / Admin
// ----------------------------------------------------------
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [asRequester, asVolunteer, completedAsVolunteer] = await Promise.all([
      HelpRequest.countDocuments({ requesterId: user._id }),
      HelpRequest.countDocuments({ volunteerId: user._id }),
      HelpRequest.countDocuments({ volunteerId: user._id, status: 'Completed' }),
    ]);

    res.status(200).json({
      success: true,
      user,
      activity: {
        asRequester,
        asVolunteer,
        completedAsVolunteer,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/toggle-active
// @access  Private / Admin
// ----------------------------------------------------------
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent self-deactivation
    if (String(user._id) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Change user role (admin can promote/demote)
// @route   PATCH /api/admin/users/:id/role
// @access  Private / Admin
// ----------------------------------------------------------
const changeUserRole = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (String(user._id) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated',
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  toggleUserActive,
  changeUserRole,
};