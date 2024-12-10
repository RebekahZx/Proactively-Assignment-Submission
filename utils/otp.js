


const nodemailer = require('nodemailer');

// Function to generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure the transporter globally
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.TEST_MAIL, // Use environment variables
    pass:process.env.APP_PASS
  }
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Proactive Team" <email@gmail.com>`, 
      to: email, // Recipient email
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. Please use this to verify your account.`,
      html: `<p>Your OTP is <b>${otp}</b>. Please use this to verify your account.</p>`
    });

    console.log(`OTP sent to ${email}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

module.exports = {
  generateOtp,
  sendOtpEmail
};