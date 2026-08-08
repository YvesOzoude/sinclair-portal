// pages/api/send-assessment-email.js
// Auto-email readiness assessment PDF to user via SendGrid

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, userName, assessmentData, pdfBase64 } = req.body;

    // Validate inputs
    if (!userEmail || !assessmentData || !pdfBase64) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare email
    const msg = {
      to: userEmail,
      from: 'yves@sinclairhq.com',
      subject: 'Your Homeownership Readiness Assessment Results',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0B1E3F; margin-bottom: 20px;">Your Readiness Assessment Results</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Hi ${userName || 'there'},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Thank you for completing your homeownership readiness assessment! Your personalized report is attached.
          </p>
          
          <div style="background-color: #F5F7FA; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="font-size: 14px; color: #666; margin: 0;">
              <strong>What's Next?</strong><br />
              Review your assessment results and the personalized recommendations. Our team is here to help you on your path to homeownership.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Questions? Get in touch with our team:
          </p>
          
          <div style="background-color: #0B1E3F; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px;">
              <strong>Yves Ozoude</strong><br />
              Mortgage Loan Originator | NMLS #1857419<br />
              <a href="mailto:yves@sinclairhq.com" style="color: #B8871E; text-decoration: none;">yves@sinclairhq.com</a><br />
              713-931-0655
            </p>
          </div>
          
          <p style="font-size: 12px; color: #999; margin-top: 40px; text-align: center;">
            Sinclair | Everyone Deserves a Door of Their Own
          </p>
        </div>
      `,
      attachments: [
        {
          content: pdfBase64,
          filename: 'readiness-assessment.pdf',
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };

    // Send email
    await sgMail.send(msg);

    // Log send (optional — you can add database logging here)
    console.log(`Assessment email sent to ${userEmail}`);

    return res.status(200).json({
      success: true,
      message: 'Assessment email sent successfully',
      email: userEmail
    });

  } catch (error) {
    console.error('SendGrid error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}
