import nodemailer from 'nodemailer';

// Create transporter for SMTP
const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const secure = process.env.EMAIL_SSL === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async (to, subject, html, text = '') => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || `FindIt <${process.env.EMAIL_USER}>`;

  if (!transporter) {
    console.log('\n=== EMAIL NOT SENT (Config missing) ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('===================================\n');
    return false;
  }

  try {
    console.log(`\n[EMAIL] Sending to ${to}...`);
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html,
    });

    console.log('[EMAIL] Sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed:', error.message);
    return false;
  }
};

const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to FindIt!';
  const html = `
    <h1>Welcome to FindIt, ${user.name}!</h1>
    <p>Thank you for joining our community. We're here to help you find lost items and reunite found items with their owners.</p>
    <p>Get started by reporting a lost or found item, browsing the feed, or creating search alerts.</p>
  `;
  return await sendEmail(user.email, subject, html);
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset Request</h1>
    <p>Hello ${user.name},</p>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  return await sendEmail(user.email, subject, html);
};

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

export {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendMatchNotification,
  sendMessageNotification,
};

