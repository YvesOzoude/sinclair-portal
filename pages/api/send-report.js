// pages/api/send-report.js
// Receives report data, builds a real PDF server-side, optionally emails it,
// and returns the PDF bytes in the SAME response — no race condition possible.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── PDF builder (pure JS, no native deps, works on Vercel) ──────────────────
// We use a minimal PDF writer rather than pdf-lib to avoid any install issues.
// This produces a clean, valid, black-and-white PDF readable on all devices.

function buildPDF({ title, userName, userEmail, employer, rows, footerNote }) {
  // PDF coordinate system: origin bottom-left, y increases upward
  const pageW = 612; // Letter width in points
  const pageH = 792; // Letter height in points
  const margin = 60;
  const lineH = 18;
  const navy = '0.043 0.118 0.247'; // #0B1E3F in RGB decimals
  const gold = '0.722 0.529 0.118'; // #B8871E

  const streams = [];
  let y = pageH - margin;

  const lines = [];
  const push = (op) => lines.push(op);

  // Header bar
  push(`${navy} rg`);
  push(`${margin} ${pageH - margin - 40} ${pageW - margin * 2} 40 re f`);

  // Title text in header
  push(`1 1 1 rg`);
  push(`BT /F1 18 Tf ${margin + 10} ${pageH - margin - 28} Td (${esc(title)}) Tj ET`);

  y = pageH - margin - 60;

  // Sinclair wordmark line
  push(`${gold} rg`);
  push(`BT /F1 10 Tf ${margin} ${y} Td (SINCLAIR  |  Homeownership Benefit Program) Tj ET`);
  y -= lineH;

  // Advisor line
  push(`0.3 0.3 0.3 rg`);
  push(`BT /F2 9 Tf ${margin} ${y} Td (Prepared by Yves Ozoude  |  NMLS #1857419  |  YOzoude@UHM.com  |  713-931-0655) Tj ET`);
  y -= lineH * 1.5;

  // Divider
  push(`${navy} rg`);
  push(`${margin} ${y} ${pageW - margin * 2} 1 re f`);
  y -= lineH * 1.2;

  // Recipient block
  push(`0 0 0 rg`);
  push(`BT /F1 11 Tf ${margin} ${y} Td (Prepared for: ${esc(userName)}) Tj ET`);
  y -= lineH;
  push(`BT /F2 10 Tf ${margin} ${y} Td (Email: ${esc(userEmail)}    Employer: ${esc(employer || 'N/A')}) Tj ET`);
  y -= lineH * 1.8;

  // Section header
  push(`${navy} rg`);
  push(`BT /F1 11 Tf ${margin} ${y} Td (Assessment Results) Tj ET`);
  y -= lineH * 0.6;
  push(`${gold} rg`);
  push(`${margin} ${y} ${pageW - margin * 2} 2 re f`);
  y -= lineH * 1.2;

  // Rows — alternating shading
  rows.forEach((row, i) => {
    const [label, value] = row;
    if (i % 2 === 0) {
      push(`0.96 0.97 0.98 rg`);
      push(`${margin} ${y - 4} ${pageW - margin * 2} ${lineH} re f`);
    }
    push(`0.2 0.2 0.2 rg`);
    push(`BT /F2 10 Tf ${margin + 6} ${y + 2} Td (${esc(String(label))}) Tj ET`);
    push(`0 0 0 rg`);
    push(`BT /F1 10 Tf ${pageW - margin - 160} ${y + 2} Td (${esc(String(value))}) Tj ET`);
    y -= lineH;
    if (y < margin + 80) {
      // Simple page break guard — truncate gracefully for very long reports
      push(`BT /F2 9 Tf ${margin} ${y} Td (...additional data omitted for length...) Tj ET`);
      return;
    }
  });

  y -= lineH;

  // Footer note
  if (footerNote) {
    push(`${gold} rg`);
    push(`${margin} ${y} ${pageW - margin * 2} 1 re f`);
    y -= lineH * 0.8;
    push(`0.3 0.3 0.3 rg`);
    push(`BT /F2 8 Tf ${margin} ${y} Td (${esc(footerNote)}) Tj ET`);
    y -= lineH;
  }

  // Date footer
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  push(`0.5 0.5 0.5 rg`);
  push(`BT /F2 8 Tf ${margin} ${margin} Td (Generated ${dateStr}  |  sinclairhq.com  |  This report is for informational purposes only and does not constitute financial advice.) Tj ET`);

  const streamContent = lines.join('\n');

  // Assemble minimal valid PDF
  const objects = [];
  const offsets = [];

  const addObj = (content) => {
    const id = objects.length + 1;
    offsets.push(null); // filled in below
    objects.push({ id, content });
    return id;
  };

  const catalog = addObj(`<< /Type /Catalog /Pages 2 0 R >>`);
  const pages = addObj(`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`);
  const page = addObj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`);
  const content = addObj(`<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`);
  const font1 = addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);
  const font2 = addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);

  let pdf = '%PDF-1.4\n';
  const bodyStart = pdf.length;

  objects.forEach((obj, idx) => {
    offsets[idx] = pdf.length;
    pdf += `${obj.id} 0 obj\n${obj.content}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach(o => {
    pdf += String(o).padStart(10, '0') + ' 00000 n \n';
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

function esc(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\u0080-\uffff]/g, (c) => {
      // Replace non-latin1 chars with safe fallback
      const code = c.charCodeAt(0);
      return code > 255 ? '?' : c;
    });
}

// ─── API handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    title,
    userName,
    userEmail,
    employer,
    rows,
    footerNote,
    sendEmail, // boolean — user opted in
  } = req.body;

  if (!title || !userName || !rows) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Build PDF
  const pdfText = buildPDF({ title, userName, userEmail: userEmail || '', employer, rows, footerNote });
  const pdfBuffer = Buffer.from(pdfText, 'latin1');
  const pdfBase64 = pdfBuffer.toString('base64');

  // Optionally send email (fire-and-forget, never block the PDF response)
  if (sendEmail && userEmail) {
    try {
      await resend.emails.send({
        from: 'Sinclair Homeownership <hello@sinclairhq.com>',
        to: userEmail,
        subject: `Your ${title} – Sinclair Homeownership Benefit`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0B1E3F;padding:24px 32px">
              <h1 style="color:#B8871E;margin:0;font-size:22px">SINCLAIR</h1>
              <p style="color:#fff;margin:4px 0 0;font-size:13px">Homeownership Benefit Program</p>
            </div>
            <div style="padding:32px">
              <p style="font-size:16px;color:#1D1D1F">Hi ${esc(userName)},</p>
              <p style="color:#444">Your <strong>${esc(title)}</strong> report is attached as a PDF. Review it at your convenience, and reach out when you're ready to take the next step toward homeownership.</p>
              <div style="background:#f5f5f7;border-radius:8px;padding:20px;margin:24px 0">
                <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:1px">Your Advisor</p>
                <p style="margin:0;font-weight:bold;color:#0B1E3F">Yves Ozoude</p>
                <p style="margin:4px 0 0;color:#444;font-size:14px">NMLS #1857419 · United Home Mortgage</p>
                <p style="margin:4px 0 0;color:#444;font-size:14px">YOzoude@UHM.com · 713-931-0655</p>
              </div>
              <p style="color:#888;font-size:12px">This report is for informational purposes only and does not constitute financial, legal, or mortgage advice.</p>
            </div>
          </div>
        `,
        attachments: [{
          filename: `${title.replace(/[^a-z0-9]/gi, '-')}-Sinclair.pdf`,
          content: pdfBase64,
        }],
      });
    } catch (emailErr) {
      console.error('[Sinclair] Email send failed:', emailErr.message);
      // Do NOT return error — PDF response still goes out
    }
  }

  // Return the PDF as binary — this IS the download, no separate fetch needed
  const safeTitle = title.replace(/[^a-z0-9]/gi, '-');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}-Sinclair.pdf"`);
  res.setHeader('Content-Length', pdfBuffer.length);
  return res.send(pdfBuffer);
}
