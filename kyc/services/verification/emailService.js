const nodemailer = require('nodemailer');

// Send verification email
const sendVerificationEmail = async (email, status) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const subject = status === 'verified' 
      ? 'KYC Verification Successful' 
      : 'KYC Verification Failed';

    const html = status === 'verified'
      ? `<h1>Verification Successful</h1><p>Your identity has been verified.</p>`
      : `<h1>Verification Failed</h1><p>Verification failed. Please try again.</p>`;

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject,
      html
    });

    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

module.exports = { sendVerificationEmail };
