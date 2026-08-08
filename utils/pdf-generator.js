// utils/pdf-generator.js
// Generate branded PDF for readiness assessment results

import jsPDF from 'jspdf';

export async function generateAssessmentPDF(assessmentData, userInfo) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Brand colors
  const navy = '#0B1E3F';
  const gold = '#B8871E';

  let yPos = margin;

  // Header with Sinclair branding
  doc.setFillColor(11, 30, 63); // Navy
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Sinclair', margin, 30);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Homeownership Readiness Assessment', margin, 40);

  yPos = 65;

  // Title
  doc.setTextColor(11, 30, 63);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Assessment Results', margin, yPos);
  yPos += 15;

  // User info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  if (userInfo?.name) {
    doc.text(`Name: ${userInfo.name}`, margin, yPos);
    yPos += 7;
  }
  if (userInfo?.email) {
    doc.text(`Email: ${userInfo.email}`, margin, yPos);
    yPos += 7;
  }
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
  yPos += 15;

  // Overall Score
  doc.setFillColor(184, 135, 30); // Gold
  doc.rect(margin, yPos - 5, contentWidth, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Readiness Score', margin + 10, yPos + 8);

  const score = assessmentData?.overallScore || 0;
  doc.setFontSize(20);
  doc.text(`${score}%`, pageWidth - margin - 20, yPos + 10);

  yPos += 35;

  // Key Findings
  doc.setTextColor(11, 30, 63);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Findings', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const findings = [
    { label: 'Credit Score', value: assessmentData?.creditScore || 'Not provided', status: 'neutral' },
    { label: 'Debt-to-Income Ratio', value: assessmentData?.dtiRatio || 'Not calculated', status: 'neutral' },
    { label: 'Down Payment Readiness', value: assessmentData?.downPaymentReadiness || 'In progress', status: 'neutral' },
    { label: 'Employment Stability', value: assessmentData?.employmentStatus || 'Not provided', status: 'neutral' },
    { label: 'Savings Position', value: assessmentData?.savingsStatus || 'Not assessed', status: 'neutral' }
  ];

  findings.forEach((finding) => {
    // Finding label
    doc.setFont('helvetica', 'bold');
    doc.text(finding.label, margin + 5, yPos);
    
    // Finding value
    doc.setFont('helvetica', 'normal');
    doc.text(String(finding.value), margin + 5, yPos + 6);
    
    yPos += 15;

    // Page break if needed
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
  });

  yPos += 10;

  // Recommendations
  doc.setTextColor(11, 30, 63);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Next Steps', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const recommendations = assessmentData?.recommendations || [
    '1. Review your credit report for any errors or discrepancies',
    '2. Work on building your emergency fund (target: 3-6 months expenses)',
    '3. Explore first-time homebuyer programs in your area',
    '4. Schedule a consultation with our team for personalized guidance'
  ];

  recommendations.forEach((rec, index) => {
    const lines = doc.splitTextToSize(rec, contentWidth - 10);
    lines.forEach((line, lineIndex) => {
      doc.text(line, margin + 5, yPos);
      yPos += 5;
    });
    yPos += 3;

    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
  });

  yPos += 10;

  // Contact section
  doc.setFillColor(245, 247, 250);
  doc.rect(margin, yPos, contentWidth, 40, 'F');

  doc.setTextColor(11, 30, 63);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Questions? Let\'s Connect', margin + 5, yPos + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Yves Ozoude', margin + 5, yPos + 16);
  doc.text('Mortgage Loan Originator | NMLS #1857419', margin + 5, yPos + 22);
  doc.text('yves@sinclairhq.com | 713-931-0655', margin + 5, yPos + 28);

  yPos += 50;

  // Footer
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(8);
  doc.text('Sinclair | Everyone Deserves a Door of Their Own', pageWidth / 2, pageHeight - 10, { align: 'center' });
  doc.text('Confidential - For individual use only', pageWidth / 2, pageHeight - 5, { align: 'center' });

  return doc;
}

// Export PDF as base64 string for email attachment
export async function getPDFAsBase64(assessmentData, userInfo) {
  const doc = await generateAssessmentPDF(assessmentData, userInfo);
  return doc.output('dataurlstring').split(',')[1]; // Returns base64 only
}

// Export PDF as blob for download
export async function getPDFAsBlob(assessmentData, userInfo) {
  const doc = await generateAssessmentPDF(assessmentData, userInfo);
  return doc.output('blob');
}

