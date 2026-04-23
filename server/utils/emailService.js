const sgMail = require('@sendgrid/mail');

// Set API Key from environment variable
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Send an email using SendGrid
 * @param {Object} options { to, subject, text, html }
 */
const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Email skipped: SENDGRID_API_KEY is not defined.');
    return false;
  }

  // Ensure API Key is set (in case it wasn't set at module load time)
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@sangabrielsolutions.com',
    subject,
    text,
    html: html || text,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    const errorMsg = error.response ? error.response.body : error.message;
    console.error('SendGrid Error:', JSON.stringify(errorMsg, null, 2));
    return false;
  }
};

/**
 * Send a welcome email to a new user
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to San Gabriel Portal';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4338ca;">Welcome, ${user.name}!</h2>
      <p>Your account has been created on the San Gabriel Portal.</p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Role:</strong> ${user.role}</p>
        <p style="margin: 5px 0 0 0;"><strong>Email:</strong> ${user.email}</p>
      </div>
      <p>You can log in and start collaborating on your projects using the link below:</p>
      <a href="http://localhost:3000/login" style="display: inline-block; background: #4338ca; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Log In to Portal</a>
      <p style="margin-top: 30px; font-size: 0.875rem; color: #64748b;">If you have any questions, please contact your project manager.</p>
    </div>
  `;
  
  return await sendEmail({ to: user.email, subject, html, text: `Welcome to San Gabriel Portal, ${user.name}!` });
};

/**
 * Send a project notification email
 */
const sendProjectNotificationEmail = async (recipient, title, message) => {
  const subject = `Notification: ${title}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h3 style="color: #4338ca;">${title}</h3>
      <p>${message}</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 0.875rem; color: #64748b;">Visit the portal to see full details.</p>
      <a href="http://localhost:3000/dashboard" style="display: inline-block; background: #4338ca; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 0.875rem;">View Dashboard</a>
    </div>
  `;

  return await sendEmail({ to: recipient.email, subject, html, text: `${title}: ${message}` });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendProjectNotificationEmail
};
