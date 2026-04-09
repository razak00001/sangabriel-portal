require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const users = [
  {
    name: 'Admin User',
    email: 'admin@sangabriel.com',
    password: 'password123',
    role: 'Admin',
    status: 'Active'
  },
  {
    name: 'Sarah PM',
    email: 'pm@sangabriel.com',
    password: 'password123',
    role: 'Project Manager',
    status: 'Active'
  },
  {
    name: 'David Designer',
    email: 'designer@sangabriel.com',
    password: 'password123',
    role: 'Designer',
    status: 'Active'
  },
  {
    name: 'Mike Installer',
    email: 'installer@sangabriel.com',
    password: 'password123',
    role: 'Installer',
    status: 'Active'
  },
  {
    name: 'John Customer',
    email: 'customer@sangabriel.com',
    password: 'password123',
    role: 'Customer',
    status: 'Active'
  },
  {
    name: 'Alice Accounting',
    email: 'accounting@sangabriel.com',
    password: 'password123',
    role: 'Accounting',
    status: 'Active'
  }
];

const seedAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`ℹ️ User already exists: ${userData.email}`);
      }
    }

    console.log('🏁 Seeding completed!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedAllUsers();
