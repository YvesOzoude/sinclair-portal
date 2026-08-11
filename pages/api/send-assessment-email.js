export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { userEmail, userName, reportTitle, htmlContent } = req.body;
    if (!userEmail || !htmlContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const base64Content = Buffer.from(htmlContent).toString('base64');
    const filename = (reportTitle || 'Sinclair-Report').replace(/[^a-zA-Z0-9\-_]/g, '_') + '.html';
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
        html: '<p>Hi ' + (userName || 'there') + ',</p><p>Your <strong>' + (reportTitle || 'Sinclair Report') + '</strong> is attached.</p><p>Yves Ozoude | NMLS #1857419 | 713-931-0655</p>',
        attachments: [{ filename: filename, content: base64Content }]
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
