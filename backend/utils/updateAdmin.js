const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ username: 'admin' });
    
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    console.log('Current admin user:', adminUser);

    // Add email field if it doesn't exist
    if (!adminUser.email) {
      adminUser.email = 'admin@prodigy.com';
      await adminUser.save();
      console.log('Admin user updated with email');
    } else {
      console.log('Admin user already has email:', adminUser.email);
    }

    // Fetch updated user
    const updatedUser = await User.findOne({ username: 'admin' });
    console.log('Updated admin user:', updatedUser);

  } catch (error) {
    console.error('Error updating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

updateAdminUser();