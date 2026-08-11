import { jsPDF } from 'jspdf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, userName, reportTitle, htmlContent } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ── GENERATE PDF ──────────────────────────────────────
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let y = 0;

    // Navy header
    doc.setFillColor(11, 30, 63);
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setTextColor(184, 135, 30);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Sinclair', margin, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Homeownership Financial Wellness', margin, 30);
    doc.text(new Date().toLocaleDateString(), margin, 38);

    y = 58;

    // Report title
    doc.setTextColor(11, 30, 63);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(reportTitle || 'Assessment Report', margin, y);
    y += 10;

    // User info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    if (userName) { doc.text('Prepared for: ' + userName, margin, y); y += 6; }
    doc.text('Email: ' + userEmail, margin, y);
    y += 12;

    // Gold divider
    doc.setDrawColor(184, 135, 30);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Parse HTML rows
    if (htmlContent) {
      const tableRegex = /<tr>[\s\S]*?<th>([\s\S]*?)<\/th>[\s\S]*?<td>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/g;
      let match;
      const rows = [];
      while ((match = tableRegex.exec(htmlContent)) !== null) {
        const label = match[1].replace(/<[^>]*>/g, '').trim();
        const value = match[2].replace(/<[^>]*>/g, '').trim();
        if (label && value) rows.push({ label, value });
      }

      if (rows.length > 0) {
        rows.forEach((row, i) => {
          if (i % 2 === 0) {
            doc.setFillColor(245, 247, 250);
            doc.rect(margin, y - 5, contentWidth, 10, 'F');
          }
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(11, 30, 63);
          const labelLines = doc.splitTextToSize(row.label, contentWidth * 0.6);
          doc.text(labelLines, margin + 3, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);
          const valueLines = doc.splitTextToSize(String(row.value), contentWidth * 0.35);
          doc.text(valueLines, margin + contentWidth * 0.62, y);
          y += Math.max(labelLines.length, valueLines.length) * 5 + 3;
          if (y > 260) { doc.addPage(); y = 20; }
        });
      }
    }

    y += 10;
    if (y > 240) { doc.addPage(); y = 20; }

    // Contact footer box
    doc.setFillColor(11, 30, 63);
    doc.rect(margin, y, contentWidth, 35, 'F');
    doc.setTextColor(184, 135, 30);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Dedicated Advisor', margin + 5, y + 8);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Yves Ozoude | Mortgage Loan Originator | NMLS #1857419', margin + 5, y + 16);
    doc.text('713-931-0655 | YOzoude@UHM.com', margin + 5, y + 22);
    doc.text('Apply: myuhm.uhm.com/homehub/signup/yozoude@uhm.com', margin + 5, y + 28);

    doc.setTextColor(180, 180, 180);
    doc.setFontSize(7);
    doc.text('Sinclair | Everyone Deserves a Door of Their Own', pageWidth / 2, 290, { align: 'center' });

    const pdfBase64 = doc.output('datauristring').split(',')[1];
    const filename = (reportTitle || 'Sinclair-Report').replace(/[^a-zA-Z0-9\-_]/g, '_') + '.pdf';

    // ── SEND VIA RESEND ───────────────────────────────────
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
        html: '<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;"><div style="background:#0B1E3F;padding:24px;border-radius:12px 12px 0 0;text-align:center;"><h1 style="color:#B8871E;margin:0;font-size:24px;">Sinclair</h1><p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:12px;">HOMEOWNERSHIP FINANCIAL WELLNESS</p></div><div style="background:#fff;padding:28px;border:1px solid #eee;border-top:none;"><p style="color:#333;font-size:15px;">Hi ' + (userName || 'there') + ',</p><p style="color:#333;font-size:15px;">Your <strong>' + (reportTitle || 'Sinclair Report') + '</strong> is attached as a PDF.</p><div style="background:#0B1E3F;border-radius:8px;padding:16px;margin-top:20px;"><p style="color:#B8871E;margin:0 0 6px;font-size:12px;font-weight:bold;">YOUR DEDICATED ADVISOR</p><p style="color:#fff;margin:0;font-size:14px;font-weight:bold;">Yves Ozoude</p><p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">NMLS #1857419 | 713-931-0655 | YOzoude@UHM.com</p></div></div><p style="color:#999;font-size:11px;text-align:center;margin-top:16px;">Sinclair | Everyone Deserves a Door of Their Own</p></div>',
        attachments: [{ filename: filename, content: pdfBase64 }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Sinclair] Resend error:', error);
      return res.status(500).json({ error: 'Resend failed', details: error });
    }

    console.log('[Sinclair] PDF email sent to', userEmail);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[Sinclair] Handler error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
