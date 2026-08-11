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

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: userEmail, name: userName || '' }] }],
        from: { email: 'yves@sinclairhq.com', name: 'Yves Ozoude | Sinclair' },
        subject: `Your Sinclair Report: ${reportTitle || 'Results'}`,
        content: [{ type: 'text/html', value: `<p>Hi ${userName || 'there'},</p><p>Your <strong>${reportTitle}</strong> report is attached.</p><p>Yves Ozoude | NMLS #1857419 | 713-931-0655</p>` }],
        attachments: [{ content: base64Content, filename: filename, type: 'text/html', disposition: 'attachment' }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Sinclair] SendGrid error:', error);
      return res.status(500).json({ error: 'SendGrid failed', details: error });
    }

    console.log('[Sinclair] Email sent to', userEmail);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[Sinclair] Handler error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
