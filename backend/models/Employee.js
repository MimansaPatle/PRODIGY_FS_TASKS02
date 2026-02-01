const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[0-9]{9,15}$/, 'Please enter a valid phone number (9-15 digits)']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: {
      values: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'],
      message: 'Please select a valid department'
    }
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary cannot be negative'],
    max: [10000000, 'Salary cannot exceed 10,000,000']
  },
  joinDate: {
    type: Date,
    required: [true, 'Join date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Terminated'],
    default: 'Active'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  profilePicture: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Generate employee ID before saving
EmployeeSchema.pre('save', async function(next) {
  if (!this.employeeId || this.isNew) {
    try {
      const count = await mongoose.model('Employee').countDocuments();
      this.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Index for better query performance
EmployeeSchema.index({ email: 1 });
EmployeeSchema.index({ employeeId: 1 });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ status: 1 });

module.exports = mongoose.model('Employee', EmployeeSchema);