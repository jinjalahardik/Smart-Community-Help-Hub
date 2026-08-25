// Email service using nodemailer.
// Falls back to console logging when SMTP is not configured (development mode).

import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const transport = getTransporter();

  if (!transport) {
    console.log(`[email] (dev mode, not sent) To: ${to} | Subject: ${subject}`);
    console.log(`[email] Body preview: ${(text || '').slice(0, 200)}`);
    return { sent: false, mode: 'dev' };
  }

  try {
    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@schub.local',
      to,
      subject,
      html,
      text,
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('[email] send failed:', err.message);
    return { sent: false, error: err.message };
  }
}

export async function sendOtpEmail(to, otp) {
  return sendEmail({
    to,
    subject: 'Smart Community Help Hub - Verification Code',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto">
        <h2>Verification Code</h2>
        <p>Your one-time password (OTP) is:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:4px;text-align:center;padding:16px;background:#f0f0f0;border-radius:8px">${otp}</p>
        <p>This code expires in 10 minutes.</p>
        <p style="color:#888;font-size:12px">If you did not request this, please ignore this email.</p>
      </div>`,
    text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
  });
}

export async function sendPasswordResetEmail(to, resetLink) {
  return sendEmail({
    to,
    subject: 'Smart Community Help Hub - Password Reset',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto">
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#0F766E;color:#fff;text-decoration:none;border-radius:6px">Reset Password</a>
        <p style="color:#888;font-size:12px;margin-top:16px">This link expires in 1 hour. If you did not request this, please ignore this email.</p>
      </div>`,
    text: `Reset your password: ${resetLink}`,
  });
}

export async function sendWelcomeEmail(to, name) {
  return sendEmail({
    to,
    subject: 'Welcome to Smart Community Help Hub',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto">
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for joining Smart Community Help Hub.</p>
        <p>You can now start making a difference in your community.</p>
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="display:inline-block;padding:12px 24px;background:#0F766E;color:#fff;text-decoration:none;border-radius:6px">Go to Dashboard</a>
      </div>`,
    text: `Welcome to Smart Community Help Hub, ${name}!`,
  });
}
