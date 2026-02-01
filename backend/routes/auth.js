const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  logoutUser
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { validateLogin, handleValidationErrors } = require('../middleware/validate');

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, loginUser);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  protect,
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  handleValidationErrors
], updateUserProfile);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
  protect,
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
], changePassword);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logoutUser);

module.exports = router;