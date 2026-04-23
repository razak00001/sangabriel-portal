const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'mrazak338@gmail.com',
  from: '16165753canadainc@gmail.com',
  subject: 'Test Email - ' + new Date().toISOString(),
  text: 'This is a simple test email.',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent');
  })
  .catch((error) => {
    console.error('❌ Error:');
    if (error.response) {
      console.error(JSON.stringify(error.response.body, null, 2));
    } else {
      console.error(error.message);
    }
  });
