require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function fixAccountingUser() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const User = require('./models/User');

  // Check if accounting user exists
  let user = await User.findOne({ email: 'accounting@sangabriel.com' });
  
  if (user) {
    console.log('Found user:', user.name, '| Role:', user.role, '| Status:', user.status);
    // Fix role if wrong
    if (user.role !== 'Accounting') {
      user.role = 'Accounting';
      await user.save();
      console.log('✅ Fixed role to Accounting');
    }
    // Reset password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash('password123', salt);
    user.status = 'Active';
    await user.save();
    console.log('✅ Password reset to password123');
  } else {
    console.log('User not found, creating...');
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('password123', salt);
    user = await User.create({
      name: 'Alice Accounting',
      email: 'accounting@sangabriel.com',
      password: hashed,
      role: 'Accounting',
      status: 'Active'
    });
    console.log('✅ Created accounting user:', user.email);
  }

  // Also verify all test accounts exist
  const testAccounts = [
    { email: 'admin@sangabriel.com', role: 'Admin', name: 'Admin User' },
    { email: 'pm@sangabriel.com', role: 'Project Manager', name: 'PM User' },
    { email: 'designer@sangabriel.com', role: 'Designer', name: 'David Designer' },
    { email: 'installer@sangabriel.com', role: 'Installer', name: 'Ivan Installer' },
    { email: 'customer@sangabriel.com', role: 'Customer', name: 'Customer User' },
    { email: 'accounting@sangabriel.com', role: 'Accounting', name: 'Alice Accounting' },
  ];

  console.log('\n--- All Test Accounts ---');
  for (const acc of testAccounts) {
    const u = await User.findOne({ email: acc.email });
    if (u) {
      console.log(`✅ ${acc.email} | role: ${u.role} | status: ${u.status}`);
    } else {
      console.log(`❌ MISSING: ${acc.email}`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

fixAccountingUser().catch(console.error);
