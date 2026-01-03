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
    
    const appUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'https://your-arena-ai-app.replit.app';

    const result = await client.emails.send({
      from: fromEmail || 'Arena AI <arena@updates.gigarev.com>',
      to: toEmail,
      subject: 'Welcome to the Arena - Your Training Begins Now',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a;">
          <!-- Hero Header -->
          <div style="background: linear-gradient(135deg, #0d2818 0%, #1a472a 50%, #0d2818 100%); padding: 40px 30px; text-align: center; border-bottom: 3px solid #22c55e;">
            <div style="font-size: 48px; margin-bottom: 10px;">&#9876;&#65039;</div>
            <h1 style="color: #22c55e; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">ARENA AI</h1>
            <p style="color: #86efac; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 4px; text-transform: uppercase;">Sales Training Academy</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; background: linear-gradient(180deg, #111111 0%, #1a1a1a 100%);">
            <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">Welcome to the Arena, ${name}!</h2>
            
            <p style="color: #d1d5db; line-height: 1.8; font-size: 16px; margin-bottom: 25px;">
              You've been chosen to join an elite training program designed to forge <strong style="color: #22c55e;">sales champions</strong>. 
              Like gladiators of old, you'll enter the Arena to sharpen your skills, face challenging scenarios, and emerge victorious.
            </p>
            
            <div style="background: linear-gradient(135deg, #14532d 0%, #166534 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #22c55e;">
              <p style="color: #86efac; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Your Battle Credentials</p>
              <p style="margin: 0 0 10px 0; color: #ffffff;"><strong>Email:</strong> ${toEmail}</p>
              <p style="margin: 0; color: #ffffff;"><strong>Password:</strong> <code style="background: #22c55e; color: #0a0a0a; padding: 4px 12px; border-radius: 4px; font-weight: bold;">${password}</code></p>
            </div>
            
            <div style="background: #1f2937; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">&#127942; YOUR MISSION:</p>
              <ul style="color: #d1d5db; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Complete training chapters to master sales techniques</li>
                <li>Conquer voice roleplays against AI homeowner personas</li>
                <li>Achieve 90%+ on all quizzes to prove your mastery</li>
                <li>Earn your <strong style="color: #22c55e;">Certified Sales Champion</strong> badge</li>
              </ul>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; font-style: italic; text-align: center; margin: 25px 0;">
              "Champions aren't made in the gym. They are made from something deep inside them—a desire, a dream, a vision."
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${appUrl}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #0a0a0a; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);">
                &#9876;&#65039; Enter the Arena
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 25px;">
              For security, we recommend changing your password after your first login.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="padding: 25px; background: #0a0a0a; text-align: center; border-top: 1px solid #22c55e;">
            <p style="color: #22c55e; font-size: 14px; margin: 0 0 5px 0; font-weight: bold;">Good luck, warrior. See you in the Arena!</p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Arena AI by GigaRev - Forging Sales Champions
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
