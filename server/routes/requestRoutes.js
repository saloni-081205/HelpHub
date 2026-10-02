const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  cancelRequest,
  deleteRequest,
  acceptRequest,
  updateStatus,
  getMyStats,
  getVolunteerStats,
  getAdminStats,
  adminDeleteRequest,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const HelpRequest = require('../models/HelpRequest');

// ---- Validation chain for create/update ----
const requestValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 120 })
    .withMessage('Title must be 5–120 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be 10–1000 characters'),
  body('category')
    .isIn(HelpRequest.CATEGORIES)
    .withMessage('Invalid category'),
  body('urgency')
    .optional()
    .isIn(HelpRequest.URGENCIES)
    .withMessage('Invalid urgency'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('contactName')
    .trim()
    .notEmpty()
    .withMessage('Contact name is required'),
  body('contactPhone')
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('Valid contact phone is required'),
  body('requiredDate')
    .notEmpty()
    .withMessage('Required date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
];

// ---- Stats (before :id route) ----
router.get('/stats/me', protect, authorize('requester'), getMyStats);
router.get('/stats/volunteer', protect, authorize('volunteer'), getVolunteerStats);
router.get('/stats/admin', protect, authorize('admin'), getAdminStats);

// ---- CRUD ----
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequestById);

router.post(
  '/',
  protect,
  authorize('requester'),
  upload.single('image'),
  requestValidation,
  createRequest
);

router.put(
  '/:id',
  protect,
  authorize('requester'),
  upload.single('image'),
  requestValidation,
  updateRequest
);

router.patch('/:id/cancel', protect, authorize('requester'), cancelRequest);
router.delete('/:id', protect, authorize('requester'), deleteRequest);

// ---- Volunteer ----
router.patch('/:id/accept', protect, authorize('volunteer'), acceptRequest);
router.patch('/:id/status', protect, authorize('volunteer'), updateStatus);

// ---- Admin ----
router.delete('/:id/admin', protect, authorize('admin'), adminDeleteRequest);

module.exports = router;