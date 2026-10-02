const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  toggleUserActive,
  changeUserRole,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require admin
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/toggle-active', toggleUserActive);
router.patch(
  '/users/:id/role',
  [body('role').isIn(['requester', 'volunteer', 'admin']).withMessage('Invalid role')],
  changeUserRole
);

module.exports = router;