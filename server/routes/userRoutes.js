const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  updateProfilePicture,
  changePassword,
  getAccountInfo,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Validation chains
const updateProfileValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('Valid phone number is required'),
  body('bio').optional().isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

// Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/profile/picture', protect, upload.single('image'), updateProfilePicture);
router.put('/password', protect, changePasswordValidation, changePassword);
router.get('/account', protect, getAccountInfo);

module.exports = router;