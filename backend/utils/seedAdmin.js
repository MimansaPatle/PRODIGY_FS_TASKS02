require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }
    
    // Create default admin
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    
    const admin = new User({
      username: 'admin',
      password: defaultPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Default admin created successfully');
    console.log('📧 Username: admin');
    console.log('🔑 Password: [HIDDEN FOR SECURITY]');
    console.log('⚠️  Please change the default password after first login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();