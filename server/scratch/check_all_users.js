const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({}, 'name email role');
  console.log('--- USERS ---');
  users.forEach(u => console.log(`${u.name} (${u.email}) - Role: ${u.role}`));
  await mongoose.disconnect();
}

checkUsers();
