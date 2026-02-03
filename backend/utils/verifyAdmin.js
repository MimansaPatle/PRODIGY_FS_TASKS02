require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const verifyAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin exists
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      console.log('💡 Run: node utils/seedAdmin.js to create admin user');
      process.exit(1);
    }
    
    console.log('✅ Admin user verified');
    console.log('📧 Username: admin');
    console.log('🔑 Password: [HIDDEN FOR SECURITY]');
    console.log(`👤 Role: ${admin.role}`);
    console.log(`🟢 Status: ${admin.isActive ? 'Active' : 'Inactive'}`);
    console.log(`📅 Created: ${admin.createdAt}`);
    
    // Test password verification (using default password)
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const isPasswordValid = await admin.matchPassword(defaultPassword);
    console.log(`🔐 Password Test: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying admin:', error.message);
    process.exit(1);
  }
};

verifyAdmin();