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
      ? `https://${process.env.REPLIT_DEV_DOMAIN}/login`
      : 'https://marketstar-training.replit.app/login';

    const result = await client.emails.send({
      from: fromEmail || 'MarketStar Training <training@marketstar.com>',
      to: toEmail,
      subject: 'Welcome to MarketStar Sales Training',
      html: `
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: #0a0a0a; padding: 32px 30px; text-align: left;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td>
                  <div style="display: inline-block;">
                    <span style="color: #1A2B8C; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">MarketStar</span>
                    <span style="color: #6b7280; font-size: 12px; display: block; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;">Sales Enablement</span>
                  </div>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                  <span style="background: rgba(26, 43, 140, 0.1); color: #1A2B8C; font-size: 11px; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid rgba(26, 43, 140, 0.2);">Sales Training Portal</span>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; background: #ffffff;">
            <h1 style="color: #0a0a0a; margin: 0 0 8px 0; font-size: 26px; font-weight: 600;">Welcome to MarketStar Sales Training, ${name}!</h1>
            <p style="color: #1A2B8C; font-size: 15px; font-weight: 500; margin: 0 0 24px 0;">Your journey to becoming a sales professional starts now.</p>
            
            <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin-bottom: 28px;">
              You've been selected to train with the best. MarketStar Sales Training is where good sales reps become <strong style="color: #0a0a0a;">unstoppable closers</strong>. Every objection you'll face, every tough customer scenario - we've built AI-powered training to help you conquer them all.
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
                    <code style="background: #1A2B8C; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: 600;">${password}</code>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Your Mission -->
            <div style="background: linear-gradient(135deg, #eef0f8 0%, #dde1f3 100%); padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #1A2B8C;">
              <p style="color: #1A2B8C; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Your Path to Certification</p>
              <ul style="color: #2a3b9c; margin: 0; padding-left: 18px; line-height: 1.8; font-size: 14px;">
                <li><strong>Master the chapters</strong> - Learn winning sales techniques</li>
                <li><strong>Dominate the roleplays</strong> - Practice with AI buyers until you win</li>
                <li><strong>Crush the quizzes</strong> - Score 75%+ to prove you're ready</li>
                <li><strong>Earn your badge</strong> - Become a Certified Sales Professional</li>
              </ul>
            </div>
            
            <!-- Motivational Quote -->
            <p style="color: #6b7280; font-size: 14px; font-style: italic; text-align: center; margin: 28px 0; padding: 0 20px;">
              "Great sales professionals are made through great training. Every rep who came before you started right here. Now it's your turn."
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="${appUrl}" style="display: inline-block; background: #1A2B8C; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(26, 43, 140, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">
                Start Training
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
              For security, we recommend changing your password after your first login.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="padding: 24px 30px; background: #0a0a0a; text-align: center;">
            <p style="color: #1A2B8C; font-size: 14px; margin: 0 0 4px 0; font-weight: 600;">Let's get started. See you inside.</p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              MarketStar Sales Enablement
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
      from: fromEmail || 'MarketStar Training <training@marketstar.com>',
      to: toEmail,
      subject: 'MarketStar - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1A2B8C 0%, #E84C8A 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">MarketStar</h1>
          </div>
          
          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Hi ${name}, we received a request to reset your password. Click the button below to set a new password.
            </p>
            
            <a href="${resetLink}" style="display: inline-block; background: #1A2B8C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
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
    const toEmail = 'admin@marketstar.com';

    await client.emails.send({
      from: fromEmail || 'MarketStar Training <training@marketstar.com>',
      to: toEmail,
      subject: 'MarketStar - Billing Reset Verification Code',
      html: `
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #0a0a0a; padding: 32px 30px; text-align: center;">
            <span style="color: #1A2B8C; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">MarketStar</span>
            <span style="color: #6b7280; font-size: 12px; display: block; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;">Sales Enablement</span>
          </div>
          
          <div style="padding: 40px 30px; background: #ffffff; text-align: center;">
            <h1 style="color: #0a0a0a; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Billing Reset Request</h1>
            <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin-bottom: 32px;">
              A request has been made to reset all billing/usage data for MarketStar. Use the verification code below to confirm this action.
            </p>
            
            <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0; font-weight: 600;">Verification Code</p>
              <div style="font-size: 48px; font-weight: 700; letter-spacing: 12px; color: #1A2B8C; font-family: monospace;">
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
              MarketStar Sales Enablement - ${new Date().toLocaleDateString()}
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
    const toEmail = 'admin@marketstar.com';

    const isManager = userRole === 'manager';
    const warningText = isManager && repCount && repCount > 0
      ? `This action will permanently delete ${userName}, their ${repCount} team member${repCount > 1 ? 's' : ''}, and all associated usage data.`
      : `This action will permanently delete ${userName} and all their usage data.`;

    await client.emails.send({
      from: fromEmail || 'MarketStar Training <training@marketstar.com>',
      to: toEmail,
      subject: `MarketStar - Hard Delete Verification: ${userName}`,
      html: `
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #0a0a0a; padding: 32px 30px; text-align: center;">
            <span style="color: #1A2B8C; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">MarketStar</span>
            <span style="color: #6b7280; font-size: 12px; display: block; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;">Sales Enablement</span>
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
              <div style="font-size: 48px; font-weight: 700; letter-spacing: 12px; color: #1A2B8C; font-family: monospace;">
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
              MarketStar Sales Enablement - ${new Date().toLocaleDateString()}
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

export async function sendCertificationEmail(
  repEmail: string,
  repName: string,
  managerEmail: string | null,
  certificationToken: string | null = null
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const appUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}/dashboard`
      : 'https://marketstar-training.replit.app/dashboard';
    const certificateUrl = certificationToken 
      ? (process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}/certificate/${certificationToken}`
        : `https://marketstar-training.replit.app/certificate/${certificationToken}`)
      : null;
    const ccList = managerEmail ? [managerEmail] : [];

    await client.emails.send({
      from: fromEmail || 'MarketStar Training <training@marketstar.com>',
      to: repEmail,
      cc: ccList,
      subject: '🏆 Congratulations! You Are Now a Certified MarketStar Sales Professional!',
      html: `
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header with Trophy -->
          <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); padding: 40px 30px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 16px;">🏆</div>
            <h1 style="color: #1A2B8C; font-size: 32px; font-weight: 800; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Certified</h1>
            <p style="color: #ffffff; font-size: 18px; margin: 0; font-weight: 500;">Sales Professional</p>
            <div style="margin-top: 20px;">
              <span style="background: linear-gradient(135deg, #1A2B8C 0%, #E84C8A 100%); color: #ffffff; font-size: 11px; padding: 8px 20px; border-radius: 25px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; display: inline-block; box-shadow: 0 4px 15px rgba(26, 43, 140, 0.4);">MarketStar Elite</span>
            </div>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 45px 30px; background: #ffffff;">
            <h2 style="color: #0a0a0a; margin: 0 0 12px 0; font-size: 28px; font-weight: 700;">Congratulations, ${repName}! 🎉</h2>
            <p style="color: #1A2B8C; font-size: 17px; font-weight: 600; margin: 0 0 28px 0;">You've proven yourself in training. Now it's time to dominate the field.</p>
            
            <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin-bottom: 28px;">
              You've completed every training chapter, mastered 16+ AI roleplay scenarios, and crushed the quizzes. You're no longer a trainee – you're a <strong style="color: #0a0a0a;">Certified MarketStar Sales Professional</strong>.
            </p>
            
            <!-- Achievement Card -->
            <div style="background: linear-gradient(135deg, #eef0f8 0%, #dde1f3 100%); padding: 28px; border-radius: 16px; margin: 28px 0; border: 2px solid #1A2B8C; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -20px; right: -20px; font-size: 80px; opacity: 0.15;">🏆</div>
              <div style="text-align: center;">
                <p style="color: #1A2B8C; font-size: 13px; font-weight: 700; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 2px;">Your Accomplishments</p>
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="position: relative; z-index: 1;">
                  <tr>
                    <td style="padding: 12px 8px; text-align: center; width: 33%;">
                      <div style="font-size: 28px; margin-bottom: 6px;">📚</div>
                      <div style="color: #1A2B8C; font-weight: 700; font-size: 20px;">100%</div>
                      <div style="color: #2a3b9c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Chapters</div>
                    </td>
                    <td style="padding: 12px 8px; text-align: center; width: 33%; border-left: 1px solid #c5cae9; border-right: 1px solid #c5cae9;">
                      <div style="font-size: 28px; margin-bottom: 6px;">🎯</div>
                      <div style="color: #1A2B8C; font-weight: 700; font-size: 20px;">16+</div>
                      <div style="color: #2a3b9c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Roleplays</div>
                    </td>
                    <td style="padding: 12px 8px; text-align: center; width: 33%;">
                      <div style="font-size: 28px; margin-bottom: 6px;">✨</div>
                      <div style="color: #1A2B8C; font-weight: 700; font-size: 20px;">75%+</div>
                      <div style="color: #2a3b9c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Quiz Avg</div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            
            <!-- What's Next -->
            <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 28px 0; border-left: 4px solid #0a0a0a;">
              <p style="color: #0a0a0a; font-size: 15px; font-weight: 700; margin: 0 0 14px 0;">What's Next?</p>
              <ul style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 2; font-size: 15px;">
                <li><strong style="color: #0a0a0a;">Hit the field</strong> – Apply everything you've learned with real buyers</li>
                <li><strong style="color: #0a0a0a;">Drive revenue</strong> – Every meeting is an opportunity to deliver value</li>
                <li><strong style="color: #0a0a0a;">Stack those wins</strong> – Your training investment is about to pay off</li>
                <li><strong style="color: #0a0a0a;">Lead by example</strong> – Show the rookies how it's done</li>
              </ul>
            </div>
            
            ${certificateUrl ? `
            <!-- Share Your Achievement -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 24px; border-radius: 12px; margin: 28px 0; border: 2px solid #f59e0b; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 8px;">🎖️</div>
              <p style="color: #92400e; font-size: 15px; font-weight: 700; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">Share Your Achievement</p>
              <p style="color: #78350f; font-size: 14px; margin: 0 0 16px 0; line-height: 1.6;">
                Show off your hard work! Share your official MarketStar Sales Professional certificate with colleagues or on LinkedIn.
              </p>
              <a href="${certificateUrl}" style="display: inline-block; background: #f59e0b; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                View My Certificate
              </a>
            </div>
            ` : ''}
            
            <!-- Motivational Quote -->
            <div style="text-align: center; margin: 35px 0; padding: 0 15px;">
              <p style="color: #0a0a0a; font-size: 20px; font-weight: 600; font-style: italic; margin: 0 0 8px 0; line-height: 1.5;">
                "Training made you ready. The field will make you legendary."
              </p>
              <p style="color: #1A2B8C; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">– MarketStar Sales Team</p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 35px;">
              <a href="${appUrl}" style="display: inline-block; background: linear-gradient(135deg, #1A2B8C 0%, #E84C8A 100%); color: #ffffff; padding: 18px 50px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 6px 20px rgba(26, 43, 140, 0.35); text-transform: uppercase; letter-spacing: 1px;">
                View Your Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="padding: 28px 30px; background: #0a0a0a; text-align: center;">
            <p style="color: #1A2B8C; font-size: 16px; margin: 0 0 6px 0; font-weight: 700;">Now go conquer! 🚀</p>
            <p style="color: #6b7280; font-size: 13px; margin: 0;">
              MarketStar Sales Enablement • Certified
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Send certification email error:', error);
    return { success: false, error: error.message || 'Failed to send certification email' };
  }
}

export async function sendQuizReminderEmail(
  toEmail: string,
  name: string,
  quizScore: number,
  roleplaysPassed: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    const quizzesUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}/quizzes`
      : 'https://marketstar-training.replit.app/quizzes';

    await client.emails.send({
      from: fromEmail || 'MarketStar Training <training@marketstar.com>',
      to: toEmail,
      subject: "You're Almost Certified — Complete Your Quizzes!",
      html: `
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #0a0a0a; padding: 32px 30px; text-align: left;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td>
                  <span style="color: #1A2B8C; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">MarketStar</span>
                  <span style="color: #6b7280; font-size: 12px; display: block; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;">Sales Enablement</span>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="padding: 40px 30px; background: #ffffff;">
            <h1 style="color: #0a0a0a; margin: 0 0 8px 0; font-size: 26px; font-weight: 700;">
              Hey ${name}, you're so close! 🔥
            </h1>
            <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin-bottom: 24px;">
              Great news — you've already passed <strong>${roleplaysPassed} roleplays</strong>. That's the hardest part done!
            </p>
            
            <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 24px; border-radius: 12px; margin: 24px 0; border: 2px solid #f59e0b;">
              <p style="color: #92400e; font-size: 14px; font-weight: 700; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
                📋 One Step Left
              </p>
              <p style="color: #78350f; font-size: 16px; margin: 0; line-height: 1.6;">
                Score <strong>75% or higher</strong> on your quizzes to earn your MarketStar certification.
                ${quizScore > 0 ? `Your current average is <strong>${quizScore}%</strong>.` : 'You haven\'t completed any quizzes yet.'}
              </p>
            </div>

            <h3 style="color: #0a0a0a; margin: 28px 0 12px 0; font-size: 18px;">How to complete your quizzes:</h3>
            <ol style="color: #4b5563; line-height: 2; font-size: 15px; padding-left: 20px;">
              <li>Log in to MarketStar Training</li>
              <li>Go to the <strong>Quizzes</strong> page</li>
              <li>Review and answer all pending questions</li>
              <li>Retake any incorrect answers to boost your score</li>
            </ol>

            <div style="text-align: center; margin-top: 32px;">
              <a href="${quizzesUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);">
                Complete My Quizzes Now
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 28px; line-height: 1.5;">
              The quizzes cover material from your training chapters. You can retake incorrect answers to improve your score.
            </p>
          </div>
          
          <div style="padding: 24px 30px; background: #0a0a0a; text-align: center;">
            <p style="color: #1A2B8C; font-size: 14px; margin: 0 0 4px 0; font-weight: 600;">Finish strong. You've got this! 💪</p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              MarketStar Sales Enablement
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Send quiz reminder email error:', error);
    return { success: false, error: error.message || 'Failed to send quiz reminder email' };
  }
}
