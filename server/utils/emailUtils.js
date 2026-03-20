import nodemailer from 'nodemailer';

/**
 * sendPasswordResetEmail
 *
 * FIX: Added `tls: { rejectUnauthorized: false }` which is required for most
 * shared hosting SMTP and Gmail App Password setups.
 * Added full error logging so you can see exactly what goes wrong in the console.
 *
 * For Gmail specifically:
 *   1. Enable 2-Factor Authentication on your Google account
 *   2. Go to https://myaccount.google.com/apppasswords
 *   3. Generate a new App Password (select "Mail" + "Other device")
 *   4. Use that 16-char password as SMTP_PASS (no spaces)
 *
 * In .env:
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=yourname@gmail.com
 *   SMTP_PASS=xxxxxxxxxxxx   ← 16-char app password, NO spaces
 *   CLIENT_URL=http://localhost:3000
 */
export const sendPasswordResetEmail = async (toEmail, rawToken, firstName) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${rawToken}`;

  // ── Dev mode (no SMTP configured) ────────────────────────────────────────
  if (!process.env.SMTP_HOST) {
    console.log('\n📧 [DEV MODE] Password reset link:');
    console.log(`   To:   ${toEmail}`);
    console.log(`   Link: ${resetUrl}\n`);
    return { success: true, mode: 'console' };
  }

  // ── Production SMTP ───────────────────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,  // true only for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,  // FIX: required for many SMTP setups
    },
  });

  // Verify connection before sending (gives clear error if creds are wrong)
  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.error('❌ SMTP connection failed:', verifyErr.message);
    console.error('   Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in your .env');
    throw new Error('Email service unavailable. Please try again later.');
  }

  try {
    const info = await transporter.sendMail({
      from:    `"Snapalyze" <${process.env.SMTP_USER}>`,
      to:      toEmail,
      subject: 'Reset your Snapalyze password',
      html: buildResetEmailHtml(firstName, resetUrl),
    });
    console.log('✅ Reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (sendErr) {
    console.error('❌ Email send failed:', sendErr.message);
    throw new Error('Failed to send reset email. Please try again.');
  }
};

// ── Email HTML template ───────────────────────────────────────────────────────
const buildResetEmailHtml = (firstName, resetUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#eef3f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0"
          style="background:#fff;border-radius:16px;border:1px solid #dde5ed;overflow:hidden;max-width:560px;">

          <!-- Header with brand gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e7bc4,#1a6b6b);padding:32px 40px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;letter-spacing:0.5px;">
                🔍 Snapalyze
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#0d2e3f;margin:0 0 16px;font-size:20px;">
                Hi ${firstName}, reset your password
              </h2>
              <p style="color:#4a6070;line-height:1.7;margin:0 0 24px;">
                We received a request to reset the password for your Snapalyze account.
                Click the button below to set a new password.
                <strong>This link expires in 1 hour.</strong>
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="border-radius:10px;background:linear-gradient(135deg,#1e7bc4,#1560a0);">
                    <a href="${resetUrl}"
                      style="display:inline-block;padding:14px 36px;color:#fff;text-decoration:none;
                             font-weight:700;font-size:15px;border-radius:10px;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#4a6070;font-size:13px;line-height:1.6;margin:0 0 16px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="background:#f0f5fa;border-radius:8px;padding:12px 16px;
                         font-family:monospace;font-size:12px;color:#1e7bc4;
                         word-break:break-all;margin:0 0 32px;">
                ${resetUrl}
              </p>

              <p style="color:#94a3b8;font-size:12px;margin:0;">
                If you didn't request this, you can safely ignore this email.
                Your password will not change.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0f5fa;padding:20px 40px;text-align:center;
                        border-top:1px solid #dde5ed;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} Snapalyze · AI-powered image analysis
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