// Example: Integration into your readiness assessment component
// Shows how to trigger PDF generation and auto-email on completion

import React, { useState } from 'react';
import { getPDFAsBase64, getPDFAsBlob } from '@/utils/pdf-generator';

export default function AssessmentCompletion({ assessmentData, userInfo }) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleCompleteAssessment() {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Generate PDF as base64
      const pdfBase64 = await getPDFAsBase64(assessmentData, userInfo);

      // Step 2: Send to backend API to email via SendGrid
      const response = await fetch('/api/send-assessment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: userInfo.email,
          userName: userInfo.name,
          assessmentData,
          pdfBase64
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      // Step 3: Show success and offer download
      setEmailSent(true);

      // Step 4: Also let user download locally
      const blob = await getPDFAsBlob(assessmentData, userInfo);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'readiness-assessment.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div style={{
        maxWidth: 500,
        margin: '40px auto',
        padding: 30,
        backgroundColor: '#F0F9F6',
        borderRadius: 12,
        textAlign: 'center',
        border: '2px solid #B8871E'
      }}>
        <h2 style={{ color: '#0B1E3F', marginBottom: 15 }}>✓ Assessment Complete!</h2>
        <p style={{ fontSize: 16, color: '#333', lineHeight: 1.6, marginBottom: 20 }}>
          Your personalized readiness report has been sent to <strong>{userInfo.email}</strong>
        </p>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
          Check your inbox for your detailed assessment results and personalized recommendations.
        </p>
        <div style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
          border: '1px solid #ddd'
        }}>
          <p style={{ fontSize: 12, color: '#999', margin: '0 0 10px 0' }}>Next Steps:</p>
          <ul style={{ fontSize: 14, color: '#333', lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li>Review your assessment results</li>
            <li>Follow the recommended next steps</li>
            <li>Schedule a consultation with Yves</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            padding: '12px 30px',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: '#0B1E3F',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 500,
      margin: '40px auto',
      padding: 30,
      backgroundColor: '#fff',
      borderRadius: 12,
      border: '1px solid #ddd'
    }}>
      <h2 style={{ color: '#0B1E3F', marginBottom: 20 }}>Complete Your Assessment</h2>

      <div style={{
        backgroundColor: '#F5F7FA',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20
      }}>
        <p style={{ fontSize: 14, color: '#333', margin: 0 }}>
          Your personalized readiness report will be generated and emailed to you immediately.
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FFE5E5',
          border: '1px solid #FF6B6B',
          color: '#C1121F',
          padding: 12,
          borderRadius: 6,
          marginBottom: 20,
          fontSize: 13
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handleCompleteAssessment}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '14px 20px',
          fontSize: 16,
          fontWeight: 'bold',
          backgroundColor: isLoading ? '#999' : '#B8871E',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s'
        }}
      >
        {isLoading ? 'Generating Report...' : 'Generate & Email Report'}
      </button>

      <p style={{
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
        margin: '20px 0 0 0'
      }}>
        Your report will be emailed to {userInfo.email}
      </p>
    </div>
  );
}

