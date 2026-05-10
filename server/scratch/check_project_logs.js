const mongoose = require('mongoose');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
require('dotenv').config();

async function checkLogs() {
  await mongoose.connect(process.env.MONGODB_URI);
  const projectId = '69ffc467b1944ceebaa67341';
  const logs = await ActivityLog.find({ projectId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5);
    
  console.log('--- LATEST LOGS ---');
  logs.forEach(l => {
    console.log(`${l.createdAt.toISOString()} - ${l.user?.name}: ${l.action}`);
    console.log('Details:', JSON.stringify(l.details, null, 2));
  });
  await mongoose.disconnect();
}

checkLogs();
