// Email service using nodemailer.
// Falls back to console logging when SMTP is not configured (development mode only).

import nodemailer from 'nodemailer';

let transporter = null;

export function getTransporter() {
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

export async function verifySmtpConfig() {
  const transport = getTransporter();
  if (!transport) {
    return { configured: false, message: 'SMTP not configured. Running in development console-only mode.' };
  }
  try {
    await transport.verify();
    return { configured: true, message: 'SMTP connection established successfully.' };
  } catch (err) {
    console.error('[email] SMTP verification failed:', err.message);
    return { configured: false, error: err.message };
  }
}

export async function sendEmail({ to, subject, html, text }) {
  const transport = getTransporter();

  if (!transport) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[email] SMTP not configured. Cannot send email to ${to}.`);
    } else {
      console.error('[email] Error: SMTP credentials missing in production environment.');
    }
    return { sent: false, error: 'SMTP credentials not configured' };
  }

  try {
    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@schub.local',
      to,
      subject,
      html,
      text,
    });
    return { sent: true, messageId: info?.messageId || 'sent' };
  } catch (err) {
    console.error('[email] send failed:', err.message);
    return { sent: false, error: err.message };
  }
}

export async function sendOtpEmail(to, otp) {
  const brandTeal = '#0F766E';
  const brandCoral = '#F97316';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 118, 110, 0.08); border: 1px solid #E2E8F0;">
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; background: linear-gradient(135deg, rgba(15, 118, 110, 0.05), rgba(249, 115, 22, 0.05)); border-bottom: 1px solid #F1F5F9;">
              <h2 style="margin: 0; color: ${brandTeal}; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Smart Community Help Hub</h2>
              <p style="margin: 4px 0 0; color: #64748B; font-size: 13px;">Empowering Communities &bull; Fostering Trust</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0F172A; text-align: center;">Verification Code</h1>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #475569; text-align: center;">
                Please use the one-time verification code below to securely complete your action on Smart Community Help Hub.
              </p>
              
              <div style="background-color: #F0FDFA; border: 1.5px dashed ${brandTeal}; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: ${brandTeal}; display: inline-block;">
                  ${otp}
                </span>
                <p style="margin: 8px 0 0; font-size: 12px; color: #0D9488; font-weight: 500;">
                  Valid for 10 minutes &bull; Single-use only
                </p>
              </div>

              <div style="background-color: #FFF7ED; border-left: 3px solid ${brandCoral}; border-radius: 6px; padding: 12px 14px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #9A3412; line-height: 1.5;">
                  <strong>Security Reminder:</strong> Never share this code with anyone. Our team will never ask you for your verification code.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748B; text-align: center;">
                If you did not request this verification code, you can safely ignore this email. No changes will be made to your account.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                &copy; ${new Date().getFullYear()} Smart Community Help Hub. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to,
    subject: 'Smart Community Help Hub - Verification Code',
    html,
    text: `Your Smart Community Help Hub verification code is: ${otp}\n\nThis code expires in 10 minutes and is single-use only.\nNever share this code with anyone. If you did not request this code, please ignore this email.`,
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

export async function sendMoneyReceiptEmail({ to, name, ref, amount, occasionLabel, causeLabel, ngoName }) {
  return sendEmail({
    to,
    subject: `Your donation receipt ${ref}`,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto">
        <h2>Thank you${name && name !== 'Anonymous Donor' ? `, ${name}` : ''}!</h2>
        <p>Your ${occasionLabel || 'gift'} is complete. Here is your receipt:</p>
        <table style="width:100%;border-collapse:collapse;margin-top:8px">
          <tr><td style="padding:8px 0;color:#666">Receipt no.</td><td style="padding:8px 0;font-weight:bold;text-align:right;font-family:monospace">${ref}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Amount</td><td style="padding:8px 0;font-weight:bold;text-align:right">₹${amount}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Cause</td><td style="padding:8px 0;text-align:right">${causeLabel || ''}</td></tr>
          <tr><td style="padding:8px 0;color:#666">NGO</td><td style="padding:8px 0;text-align:right">${ngoName || ''}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Status</td><td style="padding:8px 0;text-align:right">Completed</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:16px">Birthday Giving Complete &hearts; — 100% of your contribution goes to the cause.</p>
      </div>`,
    text: `Thank you for your donation!\nReceipt: ${ref}\nAmount: ₹${amount}\nCause: ${causeLabel}\nNGO: ${ngoName}\nStatus: Completed`,
  });
}
