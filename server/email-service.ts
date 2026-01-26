import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email
  };
}

async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendCredentialsEmail(
  toEmail: string, 
  name: string, 
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const appUrl = 'https://geckogreen.gigarev.com/login';

    const result = await client.emails.send({
      from: fromEmail || 'Arena AI <arena@updates.gigarev.com>',
      to: toEmail,
      subject: 'Welcome to the Arena - Time to Become a Sales Champion',
      html: `
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: #0a0a0a; padding: 32px 30px; text-align: left;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td>
                  <div style="display: inline-block;">
                    <span style="color: #22c55e; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">arena ai</span>
                    <span style="color: #6b7280; font-size: 12px; display: block; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;">by gigarev</span>
                  </div>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                  <span style="background: rgba(34, 197, 94, 0.1); color: #22c55e; font-size: 11px; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid rgba(34, 197, 94, 0.2);">Sales Training Portal</span>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; background: #ffffff;">
            <h1 style="color: #0a0a0a; margin: 0 0 8px 0; font-size: 26px; font-weight: 600;">Welcome to the Arena, ${name}!</h1>
            <p style="color: #22c55e; font-size: 15px; font-weight: 500; margin: 0 0 24px 0;">Your journey to becoming a sales champion starts now.</p>
            
            <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin-bottom: 28px;">
              You've been selected to train with the best. The Arena is where good sales reps become <strong style="color: #0a0a0a;">unstoppable closers</strong>. Every objection you'll face, every tough customer scenario - we've built AI-powered training to help you conquer them all.
            </p>
            
            <!-- Credentials Card -->
            <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 16px 0; font-weight: 600;">Your Access Credentials</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #6b7280; font-size: 14px;">Email</span>
                  </td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="color: #0a0a0a; font-size: 14px; font-weight: 500;">${toEmail}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 14px;">Password</span>
                  </td>
                  <td style="padding: 8px 0; border-top: 1px solid #e5e7eb; text-align: right;">
                    <code style="background: #22c55e; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: 600;">${password}</code>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Your Mission -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #22c55e;">
              <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Your Path to Certification</p>
              <ul style="color: #15803d; margin: 0; padding-left: 18px; line-height: 1.8; font-size: 14px;">
                <li><strong>Master the chapters</strong> - Learn winning sales techniques</li>
                <li><strong>Dominate the roleplays</strong> - Battle AI homeowners until you win</li>
                <li><strong>Crush the quizzes</strong> - Score 90%+ to prove you're ready</li>
                <li><strong>Earn your badge</strong> - Become a Certified Sales Champion</li>
              </ul>
            </div>
            
            <!-- Motivational Quote -->
            <p style="color: #6b7280; font-size: 14px; font-style: italic; text-align: center; margin: 28px 0; padding: 0 20px;">
              "Champions are built in the Arena. Every rep who came before you started right here. Now it's your turn."
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="${appUrl}" style="display: inline-block; background: #22c55e; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">
                Enter the Arena
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
              For security, we recommend changing your password after your first login.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="padding: 24px 30px; background: #0a0a0a; text-align: center;">
            <p style="color: #22c55e; font-size: 14px; margin: 0 0 4px 0; font-weight: 600;">Let's go, champ. See you inside.</p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Arena AI by GigaRev
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Send credentials email error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

export async function sendPasswordResetEmail(
  toEmail: string,
  name: string,
  resetLink: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();

    await client.emails.send({
      from: fromEmail || 'Arena AI <arena@updates.gigarev.com>',
      to: toEmail,
      subject: 'Arena AI - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Arena AI</h1>
          </div>
          
          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Hi ${name}, we received a request to reset your password. Click the button below to set a new password.
            </p>
            
            <a href="${resetLink}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              Reset Password
            </a>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Send password reset email error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

export async function sendBillingResetCode(
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    const toEmail = 'tabish@gigarev.com';

    await client.emails.send({
      from: fromEmail || 'Arena AI <arena@updates.gigarev.com>',
      to: toEmail,
      subject: 'Arena AI - Billing Reset Verification Code',
      html: `
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #0a0a0a; padding: 32px 30px; text-align: center;">
            <span style="color: #22c55e; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">arena ai</span>
            <span style="color: #6b7280; font-size: 12px; display: block; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;">by gigarev</span>
          </div>
          
          <div style="padding: 40px 30px; background: #ffffff; text-align: center;">
            <h1 style="color: #0a0a0a; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Billing Reset Request</h1>
            <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin-bottom: 32px;">
              A request has been made to reset all billing/usage data for Arena AI. Use the verification code below to confirm this action.
            </p>
            
            <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0; font-weight: 600;">Verification Code</p>
              <div style="font-size: 48px; font-weight: 700; letter-spacing: 12px; color: #22c55e; font-family: monospace;">
                ${code}
              </div>
            </div>
            
            <p style="color: #dc2626; font-size: 14px; margin-top: 24px; font-weight: 500;">
              ⚠️ This action will permanently delete all usage session data.
            </p>
            
            <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
              If you did not request this reset, please ignore this email.
            </p>
          </div>
          
          <div style="padding: 24px 30px; background: #0a0a0a; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Arena AI by GigaRev - ${new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Send billing reset code error:', error);
    return { success: false, error: error.message || 'Failed to send verification email' };
  }
}

export async function sendHardDeleteCode(
  code: string,
  userName: string,
  userRole: string,
  repCount?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    const toEmail = 'tabish@gigarev.com';

    const isManager = userRole === 'manager';
    const warningText = isManager && repCount && repCount > 0
      ? `This action will permanently delete ${userName}, their ${repCount} team member${repCount > 1 ? 's' : ''}, and all associated usage data.`
      : `This action will permanently delete ${userName} and all their usage data.`;

    await client.emails.send({
      from: fromEmail || 'Arena AI <arena@updates.gigarev.com>',
      to: toEmail,
      subject: `Arena AI - Hard Delete Verification: ${userName}`,
      html: `
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #0a0a0a; padding: 32px 30px; text-align: center;">
            <span style="color: #22c55e; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">arena ai</span>
            <span style="color: #6b7280; font-size: 12px; display: block; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;">by gigarev</span>
          </div>
          
          <div style="padding: 40px 30px; background: #ffffff; text-align: center;">
            <h1 style="color: #0a0a0a; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Hard Delete Request</h1>
            <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin-bottom: 16px;">
              A hard delete has been requested for:
            </p>
            <p style="color: #0a0a0a; font-size: 18px; font-weight: 600; margin-bottom: 32px;">
              ${userName} (${userRole})
            </p>
            
            <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0; font-weight: 600;">Verification Code</p>
              <div style="font-size: 48px; font-weight: 700; letter-spacing: 12px; color: #22c55e; font-family: monospace;">
                ${code}
              </div>
            </div>
            
            <p style="color: #dc2626; font-size: 14px; margin-top: 24px; font-weight: 500;">
              ⚠️ ${warningText}
            </p>
            
            <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
              This code expires in 10 minutes. If you did not request this deletion, please ignore this email.
            </p>
          </div>
          
          <div style="padding: 24px 30px; background: #0a0a0a; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Arena AI by GigaRev - ${new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Send hard delete code error:', error);
    return { success: false, error: error.message || 'Failed to send verification email' };
  }
}
