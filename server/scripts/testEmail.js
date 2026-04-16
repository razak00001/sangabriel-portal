const { sendEmail } = require('../utils/emailService');
const dotenv = require('dotenv');
const path = require('path');

// Load env from one level up
dotenv.config({ path: path.join(__dirname, '../.env') });

const testEmail = async () => {
  console.log('--- Testing SendGrid Email Delivery ---');
  console.log('Using API Key:', process.env.SENDGRID_API_KEY ? 'Present' : 'Missing');
  console.log('Using From Email:', process.env.SENDGRID_FROM_EMAIL);
  
  const recipient = 'test@example.com'; // Change this to a real email to test actual delivery
  
  const result = await sendEmail({
    to: recipient,
    subject: 'San Gabriel Portal - Test Email',
    text: 'This is a test email from the San Gabriel Portal system.',
    html: '<strong>Success!</strong> This is a test email from the San Gabriel Portal system.'
  });

  if (result) {
    console.log('SUCCESS: Email request accepted by SendGrid.');
  } else {
    console.log('FAILURE: Email request failed. Check logs for details.');
  }
  
  process.exit(result ? 0 : 1);
};

testEmail();
