export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, userName, reportTitle, htmlContent, pdfBase64 } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let attachmentContent = pdfBase64;
    let filename = (reportTitle || 'Sinclair-Report').replace(/[^a-zA-Z0-9\-_]/g, '_');
    let attachmentType = 'application/pdf';

    // If no PDF sent, convert HTML to PDF via API2Convert
    if (!attachmentContent && htmlContent) {
      try {
        const convertRes = await fetch('https://v2.convertapi.com/convert/html/to/pdf?Secret=secret_live_free', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Parameters: [
              { Name: 'File', FileData: Buffer.from(htmlContent).toString('base64'), FileName: 'report.html' },
              { Name: 'PageSize', Value: 'Letter' },
              { Name: 'MarginTop', Value: '10' },
              { Name: 'MarginBottom', Value: '10' }
            ]
          })
        });

        if (convertRes.ok) {
          const convertData = await convertRes.json();
          attachmentContent = convertData.Files[0].FileData;
          filename = filename + '.pdf';
        } else {
          // Fallback to HTML
          attachmentContent = Buffer.from(htmlContent).toString('base64');
          filename = filename + '.html';
          attachmentType = 'text/html';
        }
      } catch (e) {
        // Fallback to HTML
        attachmentContent = Buffer.from(htmlContent).toString('base64');
        filename = filename + '.html';
        attachmentType = 'text/html';
      }
    } else {
      filename = filename + '.pdf';
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Yves Ozoude | Sinclair <hello@sinclairhq.com>',
        to: [userEmail],
        subject: 'Your Sinclair Report: ' + (reportTitle || 'Results'),
        html: '<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;"><div style="background:#0B1E3F;padding:24px;border-radius:12px 12px 0 0;text-align:center;"><h1 style="color:#B8871E;margin:0;font-size:24px;">Sinclair</h1><p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:12px;">HOMEOWNERSHIP FINANCIAL WELLNESS</p></div><div style="background:#fff;padding:28px;border:1px solid #eee;border-top:none;"><p style="color:#333;font-size:15px;">Hi ' + (userName || 'there') + ',</p><p style="color:#333;font-size:15px;">Your <strong>' + (reportTitle || 'Sinclair Report') + '</strong> is attached.</p><div style="background:#0B1E3F;border-radius:8px;padding:16px;margin-top:20px;"><p style="color:#B8871E;margin:0 0 6px;font-size:12px;font-weight:bold;">YOUR DEDICATED ADVISOR</p><p style="color:#fff;margin:0;font-size:14px;font-weight:bold;">Yves Ozoude</p><p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">NMLS #1857419 | 713-931-0655 | YOzoude@UHM.com</p></div></div><p style="color:#999;font-size:11px;text-align:center;margin-top:16px;">Sinclair | Everyone Deserves a Door of Their Own</p></div>',
        attachments: [{ filename: filename, content: attachmentContent }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Sinclair] Resend error:', error);
      return res.status(500).json({ error: 'Resend failed', details: error });
    }

    console.log('[Sinclair] Email sent to', userEmail);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[Sinclair] Handler error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
