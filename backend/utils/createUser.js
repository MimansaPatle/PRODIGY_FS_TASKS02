require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createUser = async () => {
  try {
    await connectDB();
    
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log('Usage: node createUser.js <username> <password> [role]');
      console.log('Example: node createUser.js john password123 admin');
      console.log('Available roles: admin, hr (default: admin)');
      process.exit(1);
    }
    
    const [username, password, role = 'admin'] = args;
    
    // Validate role
    if (!['admin', 'hr'].includes(role)) {
      console.error('❌ Invalid role. Available roles: admin, hr');
      process.exit(1);
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      console.log(`❌ User '${username}' already exists`);
      process.exit(1);
    }
    
    // Create new user
    const user = new User({
      username,
      password,
      role
    });
    
    await user.save();
    console.log('✅ User created successfully');
    console.log(`📧 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: ${role}`);
    console.log('⚠️  Please ensure the user changes their password after first login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
};

createUser();