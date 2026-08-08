// pages/api/send-assessment-email.js
// Handles email sending for ALL assessments in the Sinclair portal

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, userName, reportTitle, htmlContent } = req.body;

    if (!userEmail || !htmlContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert HTML to base64 for attachment
    const base64Content = Buffer.from(htmlContent).toString('base64');
    const filename = (reportTitle || 'Sinclair-Report')
      .replace(/[^a-zA-Z0-9\-_]/g, '_') + '.html';

    const msg = {
      to: userEmail,
      from: 'yves@sinclairhq.com',
      subject: `Your Sinclair Report: ${reportTitle || 'Results'}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          
          <div style="background:#0B1E3F;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:#B8871E;margin:0;font-size:28px;font-family:Georgia,serif;">Sinclair</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;letter-spacing:0.05em;">
              HOMEOWNERSHIP FINANCIAL WELLNESS
            </p>
          </div>

          <div style="background:#ffffff;padding:32px;border:1px solid #E8E8ED;border-top:none;">
            <h2 style="color:#0B1E3F;margin:0 0 16px;font-size:20px;">
              Hi ${userName || 'there'},
            </h2>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 20px;">
              Your <strong>${reportTitle || 'Sinclair Report'}</strong> is attached to this email. 
              Open it in any browser to view your personalized results.
            </p>
            
            <div style="background:#F5F7FA;border-radius:8px;padding:20px;margin-bottom:24px;">
              <p style="color:#666;font-size:13px;margin:0 0 8px;font-weight:bold;">What to do next:</p>
              <ul style="color:#555;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
                <li>Open the attached report file</li>
                <li>Review your personalized results</li>
                <li>Follow the recommended next steps</li>
                <li>Schedule a consultation when ready</li>
              </ul>
            </div>

            <div style="background:#0B1E3F;border-radius:8px;padding:20px;">
              <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0 0 8px;">YOUR DEDICATED ADVISOR</p>
              <p style="color:#ffffff;font-size:15px;font-weight:bold;margin:0 0 4px;">Yves Ozoude</p>
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 2px;">
                Mortgage Loan Originator | NMLS #1857419
              </p>
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 2px;">
                713-931-0655
              </p>
              <p style="font-size:13px;margin:8px 0 0;">
                <a href="mailto:yves@sinclairhq.com" style="color:#B8871E;">yves@sinclairhq.com</a>
                &nbsp;·&nbsp;
                <a href="https://myuhm.uhm.com/homehub/signup/yozoude@uhm.com?from_mobile_share=true" 
                   style="color:#B8871E;">Start Application →</a>
              </p>
            </div>
          </div>

          <div style="padding:16px;text-align:center;">
            <p style="color:#999;font-size:11px;margin:0;">
              Sinclair | Everyone Deserves a Door of Their Own
            </p>
          </div>

        </div>
      `,
      attachments: [
        {
          content: base64Content,
          filename: filename,
          type: 'text/html',
          disposition: 'attachment'
        }
      ]
    };

    await sgMail.send(msg);
    console.log(`[Sinclair] Report emailed to ${userEmail} — ${reportTitle}`);

    return res.status(200).json({
      success: true,
      message: `Report sent to ${userEmail}`
    });

  } catch (error) {
    console.error('[Sinclair] SendGrid error:', error?.response?.body || error.message);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}
