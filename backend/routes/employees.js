const express = require('express');
const router = express.Router();

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} = require('../controllers/employeeController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const { validateEmployee, validateEmployeeUpdate } = require('../middleware/validate');

// Apply authentication to all routes
router.use(protect);

// @route   GET /api/employees/stats
// @desc    Get employee statistics
// @access  Private
router.get('/stats', getEmployeeStats);

// @route   GET /api/employees
// @desc    Get all employees with pagination and filtering
// @access  Private
router.get('/', getEmployees);

// @route   GET /api/employees/:id
// @desc    Get single employee by ID
// @access  Private
router.get('/:id', getEmployeeById);

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private (Admin only)
router.post('/', adminOnly, validateEmployee, createEmployee);

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private (Admin only)
router.put('/:id', adminOnly, validateEmployeeUpdate, updateEmployee);

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (Admin only)
router.delete('/:id', adminOnly, deleteEmployee);

module.exports = router;