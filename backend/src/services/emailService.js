const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // If email credentials are not configured, return null
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email helper
const sendEmail = async (to, subject, html, text = '') => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('Email service not configured. Email would be sent to:', to);
    console.log('Subject:', subject);
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"FindIt" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to FindIt!';
  const html = `
    <h1>Welcome to FindIt, ${user.name}!</h1>
    <p>Thank you for joining our community. We're here to help you find lost items and reunite found items with their owners.</p>
    <p>Get started by:</p>
    <ul>
      <li>Reporting a lost or found item</li>
      <li>Browsing the feed to find matches</li>
      <li>Creating search alerts for automatic notifications</li>
    </ul>
    <p>Happy finding!</p>
  `;

  return await sendEmail(user.email, subject, html);
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset Request</h1>
    <p>Hello ${user.name},</p>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return await sendEmail(user.email, subject, html);
};

// Send match notification email
const sendMatchNotification = async (user, item) => {
  const subject = 'New Item Match Found!';
  const html = `
    <h1>Great News!</h1>
    <p>Hello ${user.name},</p>
    <p>A new item matching your search alert has been posted:</p>
    <h2>${item.title}</h2>
    <p><strong>Status:</strong> ${item.status}</p>
    <p><strong>Category:</strong> ${item.category}</p>
    <p><strong>Location:</strong> ${item.location}</p>
    <p><a href="${process.env.FRONTEND_URL}/item/${item._id}">View Item</a></p>
  `;

  return await sendEmail(user.email, subject, html);
};

// Send message notification email
const sendMessageNotification = async (user, sender, item) => {
  const subject = 'New Message on FindIt';
  const html = `
    <h1>New Message</h1>
    <p>Hello ${user.name},</p>
    <p>You have received a new message from ${sender.name} regarding:</p>
    <h2>${item.title}</h2>
    <p><a href="${process.env.FRONTEND_URL}/chat/${item._id}/${sender._id}">View Conversation</a></p>
  `;

  return await sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendMatchNotification,
  sendMessageNotification,
};

