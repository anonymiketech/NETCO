import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "NETCO VPN <onboarding@resend.dev>";

function netcoHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#0d1526;border-radius:12px;border:1px solid #1e2d4a;overflow:hidden;max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1526 0%,#0a1929 100%);padding:32px 40px;border-bottom:1px solid #1e2d4a;text-align:center;">
              <div style="font-size:28px;font-weight:900;letter-spacing:2px;">
                <span style="color:#ffffff;">NET</span><span style="color:#00e5ff;">CO</span>
              </div>
              <div style="color:#4fc3f7;font-size:11px;letter-spacing:3px;margin-top:4px;">CONNECT • PROTECT • EMPOWER</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1e2d4a;text-align:center;">
              <p style="color:#4a5568;font-size:12px;margin:0;">© ${new Date().getFullYear()} NETCO VPN. Fast. Secure. Always Connected.</p>
              <p style="color:#4a5568;font-size:11px;margin:8px 0 0;">Kenya's Premium VPN Provider</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendConfirmationEmail(email: string, confirmUrl: string) {
  const body = `
    <h2 style="color:#ffffff;font-size:22px;margin:0 0 12px;">Verify Your Email</h2>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
      Welcome to NETCO VPN! Click the button below to confirm your email address and activate your account.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${confirmUrl}"
         style="display:inline-block;background:linear-gradient(135deg,#00e5ff,#0077b6);color:#0a0f1e;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
        Confirm Email Address
      </a>
    </div>
    <p style="color:#64748b;font-size:13px;text-align:center;margin:0;">
      This link expires in 24 hours. If you didn't create a NETCO account, you can safely ignore this email.
    </p>`;

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirm your NETCO VPN account",
    html: netcoHtml("Confirm your email", body),
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const body = `
    <h2 style="color:#ffffff;font-size:22px;margin:0 0 12px;">Reset Your Password</h2>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
      We received a request to reset your NETCO VPN password. Click the button below to create a new password.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}"
         style="display:inline-block;background:linear-gradient(135deg,#00e5ff,#0077b6);color:#0a0f1e;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
        Reset Password
      </a>
    </div>
    <p style="color:#64748b;font-size:13px;text-align:center;margin:0;">
      This link expires in 1 hour. If you didn't request a password reset, please ignore this email.
    </p>`;

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your NETCO VPN password",
    html: netcoHtml("Reset your password", body),
  });
}

export async function sendWelcomeEmail(email: string) {
  const body = `
    <h2 style="color:#ffffff;font-size:22px;margin:0 0 12px;">Welcome to NETCO VPN!</h2>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
      Your account is now active. You can now purchase VPN configurations for Safaricom, Airtel, and Telkom — with instant delivery and device-locked security.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#0a1929;border-radius:8px;padding:16px 20px;border-left:3px solid #00e5ff;">
          <p style="color:#00e5ff;font-size:12px;font-weight:700;letter-spacing:1px;margin:0 0 4px;">GET STARTED</p>
          <p style="color:#94a3b8;font-size:14px;margin:0;">Browse our plans and pick the one that fits your needs — VPN Unlimited, Capped, or WiFi Services.</p>
        </td>
      </tr>
    </table>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://netco-platform.vercel.app/pricing"
         style="display:inline-block;background:linear-gradient(135deg,#00e5ff,#0077b6);color:#0a0f1e;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
        Browse Plans
      </a>
    </div>`;

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to NETCO VPN — You're all set!",
    html: netcoHtml("Welcome to NETCO VPN", body),
  });
}
