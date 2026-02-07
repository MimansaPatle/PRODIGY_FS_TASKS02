const { body, validationResult } = require('express-validator');

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    console.log('Validation middleware errors:', {
      url: req.url,
      method: req.method,
      body: JSON.stringify(req.body, null, 2),
      errors: errorMessages
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Login validation rules
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  handleValidationErrors
];

// Employee validation rules
const validateEmployee = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Employee name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[0-9]{9,15}$/)
    .withMessage('Please provide a valid phone number (9-15 digits)'),
  
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  
  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isIn(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'])
    .withMessage('Please select a valid department'),
  
  body('salary')
    .notEmpty()
    .withMessage('Salary is required')
    .isNumeric()
    .withMessage('Salary must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Salary cannot be negative');
      }
      if (value > 999999999) {
        throw new Error('Salary cannot exceed 999,999,999');
      }
      return true;
    }),
  
  body('joinDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      // Set time to start of day for fair comparison
      date.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      if (date > now) {
        throw new Error('Join date cannot be in the future');
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Terminated'])
    .withMessage('Status must be Active, Inactive, or Terminated'),
  
  handleValidationErrors
];

// Employee update validation (all fields optional)
const validateEmployeeUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[0-9]{9,15}$/)
    .withMessage('Please provide a valid phone number (9-15 digits)'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  
  body('department')
    .optional()
    .isIn(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'])
    .withMessage('Please select a valid department'),
  
  body('salary')
    .optional()
    .isNumeric()
    .withMessage('Salary must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Salary cannot be negative');
      }
      if (value > 999999999) {
        throw new Error('Salary cannot exceed 999,999,999');
      }
      return true;
    }),

  body('joinDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      if (value) {
        const date = new Date(value);
        const now = new Date();
        // Set time to start of day for fair comparison
        date.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        if (date > now) {
          throw new Error('Join date cannot be in the future');
        }
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Terminated'])
    .withMessage('Status must be Active, Inactive, or Terminated'),
  
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateEmployee,
  validateEmployeeUpdate,
  handleValidationErrors
};