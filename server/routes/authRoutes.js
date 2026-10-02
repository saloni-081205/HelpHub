const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ---- Register validation ----
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['requester', 'volunteer', 'admin'])
    .withMessage('Role must be requester, volunteer, or admin'),
];

// ---- Login validation ----
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// ---- Routes ----
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;