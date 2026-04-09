require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@nectola.com' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit();
    }

    // Create a new admin
    const admin = new User({
      name: 'Admin',
      email: 'admin@nectola.com',
      password: 'password123',
      role: 'Admin',
      status: 'Active'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();
