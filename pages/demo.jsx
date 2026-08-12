// pages/demo.jsx — Sinclair Homeownership Benefit Portal — Full Demo
// All 13 assessments. PDF generation and optional email handled server-side
// via /api/send-report — one request, no race conditions, real PDF output.

import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  navy: "#0B1E3F",
  gold: "#B8871E",
  bg: "#FAFBFC",
  card: "#FFFFFF",
  text: "#1D1D1F",
  muted: "#6E6E73",
  border: "#E5E5EA",
  success: "#34C759",
  error: "#FF3B30",
};

const S = {
  page: { minHeight: "100vh", background: C.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif", color: C.text },
  topbar: { background: C.navy, padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 },
  topbarTitle: { color: C.gold, fontWeight: 700, fontSize: 18, letterSpacing: 1 },
  topbarSub: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  sidebar: { width: 240, background: "rgba(10,20,40,0.97)", minHeight: "calc(100vh - 50px)", padding: "16px 0", flexShrink: 0 },
  sideItem: (active) => ({ padding: "10px 20px", cursor: "pointer", color: active ? C.gold : "rgba(255,255,255,0.75)", background: active ? "rgba(184,135,30,0.1)" : "transparent", borderLeft: active ? `3px solid ${C.gold}` : "3px solid transparent", fontSize: 13, fontWeight: active ? 600 : 400, transition: "all 0.15s" }),
  sideSection: { padding: "16px 20px 6px", fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5 },
  main: { flex: 1, padding: "28px 32px", maxWidth: 800 },
  card: { background: C.card, borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` },
  h2: { fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 4 },
  h3: { fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 4 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" },
  btn: { background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "11px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnGold: { background: C.gold, color: "#fff", border: "none", borderRadius: 8, padding: "11px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnSm: { background: C.navy, color: "#fff", border: "none", borderRadius: 6, padding: "7px 14px", fontWeight: 600, fontSize: 12, cursor: "pointer" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  row: { display: "flex", gap: 12, alignItems: "center", marginBottom: 8 },
  chip: (color) => ({ background: color, color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, display: "inline-block" }),
  resultBox: { background: `linear-gradient(135deg, ${C.navy} 0%, #1a3a6b 100%)`, color: "#fff", borderRadius: 12, padding: 24, marginTop: 16 },
  divider: { height: 1, background: C.border, margin: "16px 0" },
  sigBanner: { background: `linear-gradient(135deg, ${C.gold} 0%, #8a5f10 100%)`, color: "#fff", borderRadius: 10, padding: "14px 20px", marginTop: 16 },
};

// ─── Shared contact block + email opt-in ─────────────────────────────────────
function ContactBlock({ contact, setContact, sendEmail, setSendEmail }) {
  return (
    <div style={S.card}>
      <div style={S.h3}>Your Contact Info (for report)</div>
      <div style={S.grid2}>
        <div>
          <label style={S.label}>First Name</label>
          <input style={S.input} value={contact.firstName} onChange={e => setContact(p => ({ ...p, firstName: e.target.value }))} placeholder="Jane" />
        </div>
        <div>
          <label style={S.label}>Last Name</label>
          <input style={S.input} value={contact.lastName} onChange={e => setContact(p => ({ ...p, lastName: e.target.value }))} placeholder="Smith" />
        </div>
        <div>
          <label style={S.label}>Email</label>
          <input style={S.input} type="email" value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} placeholder="jane@example.com" />
        </div>
        <div>
          <label style={S.label}>Employer / School</label>
          <input style={S.input} value={contact.employer} onChange={e => setContact(p => ({ ...p, employer: e.target.value }))} placeholder="e.g. CFISD" />
        </div>
      </div>
      <div style={{ ...S.row, marginTop: 12, marginBottom: 0 }}>
        <input type="checkbox" id="emailOptIn" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer" }} />
        <label htmlFor="emailOptIn" style={{ fontSize: 13, cursor: "pointer", color: C.text }}>
          Email me a copy of this report
        </label>
      </div>
    </div>
  );
}

// ─── Core report dispatcher ───────────────────────────────────────────────────
async function downloadReport({ title, contact, rows, footerNote, sendEmail, setStatus }) {
  const { firstName, lastName, email, employer } = contact;
  if (!firstName || !lastName) { setStatus("Please enter your name before generating the report."); return; }
  if (sendEmail && !email) { setStatus("Please enter your email to receive the report, or uncheck the email option."); return; }

  setStatus("generating");
  try {
    const res = await fetch("/api/send-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        userName: `${firstName} ${lastName}`,
        userEmail: email,
        employer,
        rows,
        footerNote: footerNote || "Sinclair Signature Benefit: 1% of loan amount toward closing costs (up to $2,500). Ask your advisor for details.",
        sendEmail: sendEmail && !!email,
      }),
    });
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "-")}-Sinclair.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus(sendEmail && email ? "done-email" : "done");
  } catch (err) {
    console.error("[Sinclair] Report error:", err);
    setStatus("error");
  }
}

function StatusMsg({ status }) {
  if (!status || status === "idle") return null;
  if (status === "generating") return <p style={{ color: C.gold, fontWeight: 600, marginTop: 12 }}>⏳ Building your PDF report…</p>;
  if (status === "done") return <p style={{ color: C.success, fontWeight: 600, marginTop: 12 }}>✅ PDF downloaded successfully.</p>;
  if (status === "done-email") return <p style={{ color: C.success, fontWeight: 600, marginTop: 12 }}>✅ PDF downloaded and emailed to you.</p>;
  if (status === "error") return <p style={{ color: C.error, fontWeight: 600, marginTop: 12 }}>❌ Something went wrong. Please try again.</p>;
  return <p style={{ color: C.error, fontSize: 13, marginTop: 8 }}>{status}</p>;
}

// ─── 1. Readiness Assessment ──────────────────────────────────────────────────
const READINESS_QS = [
  { q: "How long have you been employed at your current job?", opts: ["Less than 6 months", "6-12 months", "1-2 years", "More than 2 years"], pts: [0, 1, 2, 4] },
  { q: "What is your approximate credit score?", opts: ["Below 580", "580-619", "620-679", "680+"], pts: [0, 1, 2, 4] },
  { q: "Do you have 3-6 months of expenses saved?", opts: ["No savings", "1 month", "1-3 months", "3-6+ months"], pts: [0, 1, 2, 4] },
  { q: "What is your monthly debt-to-income ratio?", opts: ["Over 50%", "43-50%", "36-43%", "Under 36%"], pts: [0, 1, 2, 4] },
  { q: "Have you reviewed your credit report in the last year?", opts: ["Never", "More than a year ago", "Within the past year", "Yes and disputed errors"], pts: [0, 1, 2, 4] },
  { q: "How long have you been at your current address?", opts: ["Less than 6 months", "6-12 months", "1-2 years", "2+ years"], pts: [0, 1, 2, 4] },
  { q: "How much do you have saved for a down payment?", opts: ["Nothing yet", "Less than $5,000", "$5,000–$20,000", "$20,000+"], pts: [0, 1, 2, 4] },
  { q: "Have you been pre-approved for a mortgage?", opts: ["No", "Started the process", "Pre-qualified", "Pre-approved"], pts: [0, 1, 2, 4] },
];

function ReadinessAssessment({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [answers, setAnswers] = useState(Array(READINESS_QS.length).fill(null));
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState("idle");

  const allAnswered = answers.every(a => a !== null);

  function getLabel(s) {
    if (s >= 80) return ["Excellent – Ready to Buy", C.success];
    if (s >= 60) return ["Good – Nearly Ready", C.gold];
    if (s >= 40) return ["Fair – Some Preparation Needed", "#FF9500"];
    return ["Needs Work – Focus on Fundamentals", C.error];
  }

  async function handleGenerate() {
    if (!allAnswered) { setStatus("Please answer all questions before generating your report."); return; }
    const total = answers.reduce((sum, a, i) => sum + READINESS_QS[i].pts[a], 0);
    const s = Math.round((total / 32) * 100);
    setScore(s);
    onProgress("Readiness Assessment");
    const rows = READINESS_QS.map((q, i) => [q.q, q.opts[answers[i]]]);
    rows.push(["Overall Readiness Score", `${s} / 100 — ${getLabel(s)[0]}`]);
    await downloadReport({ title: "Financial Readiness Assessment", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}>
        <div style={S.h2}>Financial Readiness Assessment</div>
        <p style={{ color: C.muted, fontSize: 14 }}>8 questions to gauge your homebuying readiness.</p>
      </div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        {READINESS_QS.map((q, qi) => (
          <div key={qi} style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>{qi + 1}. {q.q}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {q.opts.map((opt, oi) => (
                <div key={oi} onClick={() => setAnswers(p => { const n = [...p]; n[qi] = oi; return n; })}
                  style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${answers[qi] === oi ? C.navy : C.border}`, background: answers[qi] === oi ? "#EBF0F8" : "#fff", cursor: "pointer", fontSize: 13 }}>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        ))}
        {score !== null && (
          <div style={S.resultBox}>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{score}<span style={{ fontSize: 18 }}>/100</span></div>
            <div style={{ color: C.gold, fontWeight: 600, marginTop: 4 }}>{getLabel(score)[0]}</div>
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <button style={S.btnGold} onClick={handleGenerate} disabled={!allAnswered}>
            Generate PDF Report
          </button>
          <StatusMsg status={status} />
        </div>
      </div>
    </div>
  );
}

// ─── 2. Monthly Budget Tool ───────────────────────────────────────────────────
function BudgetTool({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [inc, setInc] = useState({ gross: "", net: "" });
  const [exp, setExp] = useState({ rent: "", car: "", food: "", utilities: "", phone: "", insurance: "", subscriptions: "", other: "" });
  const [savings, setSavings] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  async function calculate() {
    const net = parseFloat(inc.net) || 0;
    const totalExp = Object.values(exp).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    const sav = parseFloat(savings) || 0;
    const left = net - totalExp - sav;
    setResult({ net, totalExp, sav, left });
    onProgress("Budget Tool");

    const rows = [
      ["Gross Monthly Income", `$${(parseFloat(inc.gross)||0).toLocaleString()}`],
      ["Net Monthly Income", `$${net.toLocaleString()}`],
      ...Object.entries(exp).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), `$${(parseFloat(v)||0).toLocaleString()}`]),
      ["Monthly Savings Goal", `$${sav.toLocaleString()}`],
      ["Total Expenses", `$${totalExp.toLocaleString()}`],
      ["Remaining After Expenses & Savings", `$${left.toLocaleString()}`],
    ];
    await downloadReport({ title: "Monthly Budget Analysis", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Monthly Budget Analyzer</div></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={S.h3}>Income</div>
        <div style={S.grid2}>
          <div><label style={S.label}>Gross Monthly Income</label><input style={S.input} type="number" value={inc.gross} onChange={e => setInc(p => ({ ...p, gross: e.target.value }))} placeholder="0" /></div>
          <div><label style={S.label}>Net (Take-Home) Income</label><input style={S.input} type="number" value={inc.net} onChange={e => setInc(p => ({ ...p, net: e.target.value }))} placeholder="0" /></div>
        </div>
        <div style={S.divider} />
        <div style={S.h3}>Monthly Expenses</div>
        <div style={S.grid2}>
          {Object.keys(exp).map(k => (
            <div key={k}><label style={S.label}>{k.charAt(0).toUpperCase() + k.slice(1)}</label><input style={S.input} type="number" value={exp[k]} onChange={e => setExp(p => ({ ...p, [k]: e.target.value }))} placeholder="0" /></div>
          ))}
        </div>
        <div style={S.divider} />
        <div><label style={S.label}>Monthly Savings Goal</label><input style={{ ...S.input, maxWidth: 200 }} type="number" value={savings} onChange={e => setSavings(e.target.value)} placeholder="0" /></div>
        {result && (
          <div style={{ ...S.resultBox, marginTop: 16 }}>
            <div style={S.grid2}>
              <div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Net Income</div><div style={{ fontSize: 22, fontWeight: 700 }}>${result.net.toLocaleString()}</div></div>
              <div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Total Expenses</div><div style={{ fontSize: 22, fontWeight: 700 }}>${result.totalExp.toLocaleString()}</div></div>
              <div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Savings</div><div style={{ fontSize: 22, fontWeight: 700 }}>${result.sav.toLocaleString()}</div></div>
              <div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Remaining</div><div style={{ fontSize: 22, fontWeight: 700, color: result.left >= 0 ? C.gold : C.error }}>${result.left.toLocaleString()}</div></div>
            </div>
          </div>
        )}
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={calculate}>Analyze & Download PDF</button></div>
        <StatusMsg status={status} />
      </div>
    </div>
  );
}

// ─── 3. Home Affordability Calculator ────────────────────────────────────────
function AffordabilityCalc({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [f, setF] = useState({ income: "", debt: "", rate: "7.0", term: "30", down: "20", tax: "1.2", ins: "0.5" });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  async function calc() {
    const income = parseFloat(f.income) || 0;
    const debt = parseFloat(f.debt) || 0;
    const rate = parseFloat(f.rate) / 100 / 12;
    const n = parseFloat(f.term) * 12;
    const downPct = parseFloat(f.down) / 100;
    const maxPI = income * 0.28;
    const maxDTI = income * 0.36 - debt;
    const maxPayment = Math.min(maxPI, maxDTI);
    const principal = maxPayment / (rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1));
    const homePrice = principal / (1 - downPct);
    const downAmt = homePrice * downPct;
    const monthly = maxPayment;
    setResult({ homePrice, downAmt, monthly, maxDTI, maxPI });
    onProgress("Affordability Calculator");
    const rows = [
      ["Annual Income", `$${(income * 12).toLocaleString()}`],
      ["Monthly Income", `$${income.toLocaleString()}`],
      ["Existing Monthly Debt", `$${debt.toLocaleString()}`],
      ["Interest Rate", `${f.rate}%`],
      ["Loan Term", `${f.term} years`],
      ["Down Payment", `${f.down}%`],
      ["Estimated Home Price", `$${Math.round(homePrice).toLocaleString()}`],
      ["Down Payment Amount", `$${Math.round(downAmt).toLocaleString()}`],
      ["Est. Monthly Payment (P&I)", `$${Math.round(monthly).toLocaleString()}`],
    ];
    await downloadReport({ title: "Home Affordability Analysis", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Home Affordability Calculator</div></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={S.grid2}>
          <div><label style={S.label}>Monthly Gross Income</label><input style={S.input} type="number" value={f.income} onChange={e => setF(p => ({ ...p, income: e.target.value }))} placeholder="5000" /></div>
          <div><label style={S.label}>Monthly Debt Payments</label><input style={S.input} type="number" value={f.debt} onChange={e => setF(p => ({ ...p, debt: e.target.value }))} placeholder="400" /></div>
          <div><label style={S.label}>Interest Rate (%)</label><input style={S.input} type="number" value={f.rate} onChange={e => setF(p => ({ ...p, rate: e.target.value }))} /></div>
          <div><label style={S.label}>Loan Term (years)</label><input style={S.input} type="number" value={f.term} onChange={e => setF(p => ({ ...p, term: e.target.value }))} /></div>
          <div><label style={S.label}>Down Payment (%)</label><input style={S.input} type="number" value={f.down} onChange={e => setF(p => ({ ...p, down: e.target.value }))} /></div>
        </div>
        {result && (
          <div style={{ ...S.resultBox, marginTop: 16 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Estimated Max Home Price</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: C.gold }}>${Math.round(result.homePrice).toLocaleString()}</div>
            <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
              <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Down Payment</div><div style={{ fontWeight: 600 }}>${Math.round(result.downAmt).toLocaleString()}</div></div>
              <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Monthly P&I</div><div style={{ fontWeight: 600 }}>${Math.round(result.monthly).toLocaleString()}</div></div>
            </div>
          </div>
        )}
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={calc}>Calculate & Download PDF</button></div>
        <StatusMsg status={status} />
      </div>
    </div>
  );
}

// ─── 4. Down Payment Calculator ──────────────────────────────────────────────
function DownPaymentCalc({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [f, setF] = useState({ price: "", down: "10", saved: "", monthly: "" });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  async function calc() {
    const price = parseFloat(f.price) || 0;
    const downPct = parseFloat(f.down) / 100;
    const downAmt = price * downPct;
    const saved = parseFloat(f.saved) || 0;
    const needed = Math.max(0, downAmt - saved);
    const monthly = parseFloat(f.monthly) || 0;
    const months = monthly > 0 ? Math.ceil(needed / monthly) : null;
    setResult({ downAmt, saved, needed, months });
    onProgress("Down Payment Calculator");
    const rows = [
      ["Target Home Price", `$${price.toLocaleString()}`],
      ["Down Payment %", `${f.down}%`],
      ["Down Payment Amount", `$${Math.round(downAmt).toLocaleString()}`],
      ["Already Saved", `$${saved.toLocaleString()}`],
      ["Still Needed", `$${Math.round(needed).toLocaleString()}`],
      ["Monthly Savings Contribution", monthly > 0 ? `$${monthly.toLocaleString()}` : "Not provided"],
      ["Estimated Months to Goal", months !== null ? `${months} months (~${(months/12).toFixed(1)} years)` : "N/A"],
    ];
    await downloadReport({ title: "Down Payment Savings Plan", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Down Payment Calculator</div></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={S.grid2}>
          <div><label style={S.label}>Target Home Price</label><input style={S.input} type="number" value={f.price} onChange={e => setF(p => ({ ...p, price: e.target.value }))} placeholder="300000" /></div>
          <div><label style={S.label}>Down Payment %</label><input style={S.input} type="number" value={f.down} onChange={e => setF(p => ({ ...p, down: e.target.value }))} /></div>
          <div><label style={S.label}>Currently Saved</label><input style={S.input} type="number" value={f.saved} onChange={e => setF(p => ({ ...p, saved: e.target.value }))} placeholder="0" /></div>
          <div><label style={S.label}>Monthly Savings Contribution</label><input style={S.input} type="number" value={f.monthly} onChange={e => setF(p => ({ ...p, monthly: e.target.value }))} placeholder="500" /></div>
        </div>
        {result && (
          <div style={{ ...S.resultBox, marginTop: 16 }}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Down Payment Needed</div><div style={{ fontSize: 24, fontWeight: 700, color: C.gold }}>${Math.round(result.downAmt).toLocaleString()}</div></div>
              <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Still Needed</div><div style={{ fontSize: 24, fontWeight: 700 }}>${Math.round(result.needed).toLocaleString()}</div></div>
              {result.months && <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Time to Goal</div><div style={{ fontSize: 24, fontWeight: 700 }}>{result.months} mo</div></div>}
            </div>
          </div>
        )}
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={calc}>Calculate & Download PDF</button></div>
        <StatusMsg status={status} />
      </div>
    </div>
  );
}

// ─── 5. Closing Cost Estimator ────────────────────────────────────────────────
function ClosingCostCalc({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [f, setF] = useState({ price: "", loan: "", state: "TX", firstTime: false });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  async function calc() {
    const price = parseFloat(f.price) || 0;
    const loan = parseFloat(f.loan) || price * 0.9;
    const origination = loan * 0.01;
    const appraisal = 600;
    const title = loan * 0.005;
    const escrow = price * 0.015;
    const prepaids = loan * 0.015;
    const govFees = loan * 0.001;
    const sinclairBenefit = Math.min(loan * 0.01, 2500);
    const total = origination + appraisal + title + escrow + prepaids + govFees;
    const afterBenefit = total - sinclairBenefit;
    setResult({ total, sinclairBenefit, afterBenefit });
    onProgress("Closing Cost Estimator");
    const rows = [
      ["Purchase Price", `$${price.toLocaleString()}`],
      ["Loan Amount", `$${Math.round(loan).toLocaleString()}`],
      ["Origination Fee (~1%)", `$${Math.round(origination).toLocaleString()}`],
      ["Appraisal", `$${appraisal.toLocaleString()}`],
      ["Title & Settlement", `$${Math.round(title).toLocaleString()}`],
      ["Escrow / Prepaids", `$${Math.round(escrow + prepaids).toLocaleString()}`],
      ["Government Recording Fees", `$${Math.round(govFees).toLocaleString()}`],
      ["Total Estimated Closing Costs", `$${Math.round(total).toLocaleString()}`],
      ["Sinclair Signature Benefit (up to $2,500)", `-$${Math.round(sinclairBenefit).toLocaleString()}`],
      ["Your Estimated Out-of-Pocket", `$${Math.round(afterBenefit).toLocaleString()}`],
    ];
    await downloadReport({ title: "Estimated Closing Costs", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Closing Cost Estimator</div></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={S.grid2}>
          <div><label style={S.label}>Purchase Price</label><input style={S.input} type="number" value={f.price} onChange={e => setF(p => ({ ...p, price: e.target.value }))} placeholder="300000" /></div>
          <div><label style={S.label}>Loan Amount (if different)</label><input style={S.input} type="number" value={f.loan} onChange={e => setF(p => ({ ...p, loan: e.target.value }))} placeholder="Auto" /></div>
        </div>
        {result && (
          <div style={S.sigBanner}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Sinclair Signature Benefit saves you ${Math.round(result.sinclairBenefit).toLocaleString()}</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Estimated out-of-pocket: <strong>${Math.round(result.afterBenefit).toLocaleString()}</strong> (vs ${Math.round(result.total).toLocaleString()} without the benefit)</div>
          </div>
        )}
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={calc}>Estimate & Download PDF</button></div>
        <StatusMsg status={status} />
      </div>
    </div>
  );
}

// ─── 6. Cash-to-Close Calculator ─────────────────────────────────────────────
function CashToCloseCalc({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [f, setF] = useState({ price: "", down: "10", earnest: "", closing: "" });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  async function calc() {
    const price = parseFloat(f.price) || 0;
    const downAmt = price * (parseFloat(f.down) / 100);
    const earnest = parseFloat(f.earnest) || 0;
    const closing = parseFloat(f.closing) || price * 0.03;
    const sinclairBenefit = Math.min(price * 0.9 * 0.01, 2500);
    const cashToClose = downAmt + closing - earnest - sinclairBenefit;
    setResult({ downAmt, closing, earnest, sinclairBenefit, cashToClose });
    onProgress("Cash-to-Close Calculator");
    const rows = [
      ["Purchase Price", `$${price.toLocaleString()}`],
      ["Down Payment", `$${Math.round(downAmt).toLocaleString()}`],
      ["Estimated Closing Costs", `$${Math.round(closing).toLocaleString()}`],
      ["Earnest Money (credit)", `-$${earnest.toLocaleString()}`],
      ["Sinclair Signature Benefit (credit)", `-$${Math.round(sinclairBenefit).toLocaleString()}`],
      ["Estimated Cash to Close", `$${Math.round(cashToClose).toLocaleString()}`],
    ];
    await downloadReport({ title: "Cash-to-Close Estimate", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Cash-to-Close Calculator</div></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={S.grid2}>
          <div><label style={S.label}>Purchase Price</label><input style={S.input} type="number" value={f.price} onChange={e => setF(p => ({ ...p, price: e.target.value }))} placeholder="300000" /></div>
          <div><label style={S.label}>Down Payment %</label><input style={S.input} type="number" value={f.down} onChange={e => setF(p => ({ ...p, down: e.target.value }))} /></div>
          <div><label style={S.label}>Earnest Money Paid</label><input style={S.input} type="number" value={f.earnest} onChange={e => setF(p => ({ ...p, earnest: e.target.value }))} placeholder="1000" /></div>
          <div><label style={S.label}>Closing Costs (leave blank to estimate)</label><input style={S.input} type="number" value={f.closing} onChange={e => setF(p => ({ ...p, closing: e.target.value }))} placeholder="Auto" /></div>
        </div>
        {result && (
          <div style={{ ...S.resultBox, marginTop: 16 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Estimated Cash to Close</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: C.gold }}>${Math.round(result.cashToClose).toLocaleString()}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>Includes ${Math.round(result.sinclairBenefit).toLocaleString()} Sinclair Signature Benefit credit</div>
          </div>
        )}
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={calc}>Calculate & Download PDF</button></div>
        <StatusMsg status={status} />
      </div>
    </div>
  );
}

// ─── 7. Credit Improvement Planner ───────────────────────────────────────────
function CreditPlanner({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [f, setF] = useState({ score: "", util: "", lates: "0", accounts: "", oldest: "" });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  async function calc() {
    const score = parseInt(f.score) || 0;
    const util = parseFloat(f.util) || 0;
    const lates = parseInt(f.lates) || 0;
    const steps = [];
    if (util > 30) steps.push(`Reduce credit utilization from ${util}% to below 30% — potential score increase: +25-40 pts`);
    if (lates > 0) steps.push(`Address ${lates} late payment(s) — contact creditors for goodwill removal — potential: +15-30 pts`);
    if (score < 620) steps.push("Consider a secured credit card to build positive payment history");
    if (score < 680) steps.push("Dispute any errors on your credit report (request free copy at AnnualCreditReport.com)");
    steps.push("Keep all existing accounts open to maintain credit age");
    steps.push("Avoid opening new credit 6+ months before applying for a mortgage");
    const target = Math.min(850, score + (util > 30 ? 30 : 0) + (lates > 0 ? -10 : 10) + 20);
    setResult({ steps, score, target });
    onProgress("Credit Improvement Planner");
    const rows = [
      ["Current Credit Score", score.toString()],
      ["Credit Utilization", `${util}%`],
      ["Late Payments on File", lates.toString()],
      ["Estimated Target Score (6-12 mo)", target.toString()],
      ...steps.map((s, i) => [`Action Item ${i + 1}`, s]),
    ];
    await downloadReport({ title: "Credit Improvement Plan", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Credit Improvement Planner</div></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={S.grid2}>
          <div><label style={S.label}>Current Credit Score</label><input style={S.input} type="number" value={f.score} onChange={e => setF(p => ({ ...p, score: e.target.value }))} placeholder="620" /></div>
          <div><label style={S.label}>Credit Utilization %</label><input style={S.input} type="number" value={f.util} onChange={e => setF(p => ({ ...p, util: e.target.value }))} placeholder="45" /></div>
          <div><label style={S.label}>Late Payments (last 24 mo)</label><input style={S.input} type="number" value={f.lates} onChange={e => setF(p => ({ ...p, lates: e.target.value }))} placeholder="0" /></div>
        </div>
        {result && (
          <div style={{ ...S.resultBox, marginTop: 16 }}>
            <div style={{ display: "flex", gap: 32 }}>
              <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Current Score</div><div style={{ fontSize: 28, fontWeight: 700 }}>{result.score}</div></div>
              <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Target Score</div><div style={{ fontSize: 28, fontWeight: 700, color: C.gold }}>{result.target}</div></div>
            </div>
            <div style={{ marginTop: 12 }}>
              {result.steps.map((s, i) => <div key={i} style={{ fontSize: 13, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${C.gold}` }}>{s}</div>)}
            </div>
          </div>
        )}
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={calc}>Generate Plan & Download PDF</button></div>
        <StatusMsg status={status} />
      </div>
    </div>
  );
}

// ─── 8. Savings Goal Tracker ──────────────────────────────────────────────────
function SavingsTracker({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [f, setF] = useState({ goal: "", saved: "", monthly: "", rate: "4.5" });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  async function calc() {
    const goal = parseFloat(f.goal) || 0;
    const saved = parseFloat(f.saved) || 0;
    const monthly = parseFloat(f.monthly) || 0;
    const rate = parseFloat(f.rate) / 100 / 12;
    const needed = Math.max(0, goal - saved);
    let months = 0;
    if (monthly > 0) {
      let bal = saved;
      while (bal < goal && months < 600) { bal = bal * (1 + rate) + monthly; months++; }
    }
    setResult({ needed, months, goal, saved });
    onProgress("Savings Goal Tracker");
    const rows = [
      ["Savings Goal", `$${goal.toLocaleString()}`],
      ["Currently Saved", `$${saved.toLocaleString()}`],
      ["Remaining", `$${needed.toLocaleString()}`],
      ["Monthly Contribution", `$${monthly.toLocaleString()}`],
      ["Expected Rate of Return", `${f.rate}% APY`],
      ["Estimated Months to Goal", months > 0 ? `${months} months (~${(months / 12).toFixed(1)} yrs)` : "N/A"],
    ];
    await downloadReport({ title: "Savings Goal Tracker", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Savings Goal Tracker</div></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={S.grid2}>
          <div><label style={S.label}>Savings Goal ($)</label><input style={S.input} type="number" value={f.goal} onChange={e => setF(p => ({ ...p, goal: e.target.value }))} placeholder="20000" /></div>
          <div><label style={S.label}>Currently Saved ($)</label><input style={S.input} type="number" value={f.saved} onChange={e => setF(p => ({ ...p, saved: e.target.value }))} placeholder="0" /></div>
          <div><label style={S.label}>Monthly Contribution ($)</label><input style={S.input} type="number" value={f.monthly} onChange={e => setF(p => ({ ...p, monthly: e.target.value }))} placeholder="500" /></div>
          <div><label style={S.label}>Expected APY (%)</label><input style={S.input} type="number" value={f.rate} onChange={e => setF(p => ({ ...p, rate: e.target.value }))} /></div>
        </div>
        {result && (
          <div style={{ ...S.resultBox, marginTop: 16 }}>
            <div style={{ display: "flex", gap: 32 }}>
              <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Remaining</div><div style={{ fontSize: 28, fontWeight: 700, color: C.gold }}>${result.needed.toLocaleString()}</div></div>
              {result.months > 0 && <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Time to Goal</div><div style={{ fontSize: 28, fontWeight: 700 }}>{result.months} mo</div></div>}
            </div>
          </div>
        )}
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={calc}>Track & Download PDF</button></div>
        <StatusMsg status={status} />
      </div>
    </div>
  );
}

// ─── 9. Housing Assistance Finder ────────────────────────────────────────────
function HousingAssistanceFinder({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [f, setF] = useState({ income: "", firstTime: true, veteran: false, teacher: false, city: "Houston" });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  async function calc() {
    const programs = [];
    if (f.firstTime) programs.push({ name: "Harris County DPA Program", desc: "Up to $23,800 in forgivable down payment assistance for first-time buyers in Harris County. Income limits apply." });
    if (f.firstTime) programs.push({ name: "TSAHC Home Sweet Texas", desc: "30-year fixed mortgage + up to 5% DPA grant for first-time buyers statewide. No repayment required." });
    if (f.teacher) programs.push({ name: "Homes for Texas Heroes", desc: "Exclusive grants for teachers, nurses, firefighters and other heroes. Combined with TSAHC programs." });
    if (f.veteran) programs.push({ name: "VA Home Loan Benefit", desc: "Zero down payment, no PMI, competitive rates for eligible veterans and active duty service members." });
    programs.push({ name: "Sinclair Signature Benefit", desc: "1% of loan amount toward closing costs (up to $2,500), provided through your employer's Sinclair benefit." });
    setResult(programs);
    onProgress("Housing Assistance Finder");
    const rows = programs.map(p => [p.name, p.desc]);
    await downloadReport({ title: "Housing Assistance Programs", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Housing Assistance Finder</div><p style={{ color: C.muted, fontSize: 14 }}>Discover programs you may qualify for.</p></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={S.grid2}>
          <div><label style={S.label}>Monthly Household Income</label><input style={S.input} type="number" value={f.income} onChange={e => setF(p => ({ ...p, income: e.target.value }))} placeholder="5000" /></div>
          <div><label style={S.label}>City / Area</label><input style={S.input} value={f.city} onChange={e => setF(p => ({ ...p, city: e.target.value }))} /></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {[["firstTime", "First-time homebuyer"], ["veteran", "Veteran / Active Duty"], ["teacher", "Teacher, Nurse, or First Responder"]].map(([key, label]) => (
            <div key={key} style={S.row}>
              <input type="checkbox" id={key} checked={f[key]} onChange={e => setF(p => ({ ...p, [key]: e.target.checked }))} style={{ width: 16, height: 16 }} />
              <label htmlFor={key} style={{ fontSize: 14, cursor: "pointer" }}>{label}</label>
            </div>
          ))}
        </div>
        {result && (
          <div style={{ marginTop: 16 }}>
            {result.map((p, i) => (
              <div key={i} style={{ ...S.card, marginBottom: 10, borderLeft: `3px solid ${C.gold}` }}>
                <div style={{ fontWeight: 700, color: C.navy, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{p.desc}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={calc}>Find Programs & Download PDF</button></div>
        <StatusMsg status={status} />
      </div>
    </div>
  );
}

// ─── 10. Refinance Calculator ─────────────────────────────────────────────────
function RefinanceCalc({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [f, setF] = useState({ balance: "", currentRate: "", newRate: "6.5", term: "30", closingCosts: "" });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  function payment(balance, rate, months) {
    const r = rate / 100 / 12;
    return balance * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  }

  async function calc() {
    const balance = parseFloat(f.balance) || 0;
    const currentPmt = payment(balance, parseFloat(f.currentRate) || 7, 360);
    const newPmt = payment(balance, parseFloat(f.newRate), parseFloat(f.term) * 12);
    const monthlySavings = currentPmt - newPmt;
    const closingCosts = parseFloat(f.closingCosts) || balance * 0.02;
    const breakEven = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : null;
    setResult({ currentPmt, newPmt, monthlySavings, breakEven, closingCosts });
    onProgress("Refinance Calculator");
    const rows = [
      ["Current Loan Balance", `$${balance.toLocaleString()}`],
      ["Current Rate", `${f.currentRate}%`],
      ["Current Monthly Payment", `$${Math.round(currentPmt).toLocaleString()}`],
      ["New Rate", `${f.newRate}%`],
      ["New Monthly Payment", `$${Math.round(newPmt).toLocaleString()}`],
      ["Monthly Savings", `$${Math.round(monthlySavings).toLocaleString()}`],
      ["Estimated Closing Costs", `$${Math.round(closingCosts).toLocaleString()}`],
      ["Break-Even Point", breakEven ? `${breakEven} months` : "N/A"],
    ];
    await downloadReport({ title: "Refinance Analysis", contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Refinance Calculator</div></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={S.grid2}>
          <div><label style={S.label}>Current Loan Balance</label><input style={S.input} type="number" value={f.balance} onChange={e => setF(p => ({ ...p, balance: e.target.value }))} placeholder="250000" /></div>
          <div><label style={S.label}>Current Interest Rate %</label><input style={S.input} type="number" value={f.currentRate} onChange={e => setF(p => ({ ...p, currentRate: e.target.value }))} placeholder="7.5" /></div>
          <div><label style={S.label}>New Rate %</label><input style={S.input} type="number" value={f.newRate} onChange={e => setF(p => ({ ...p, newRate: e.target.value }))} /></div>
          <div><label style={S.label}>New Loan Term (years)</label><input style={S.input} type="number" value={f.term} onChange={e => setF(p => ({ ...p, term: e.target.value }))} /></div>
          <div><label style={S.label}>Closing Costs (leave blank to estimate)</label><input style={S.input} type="number" value={f.closingCosts} onChange={e => setF(p => ({ ...p, closingCosts: e.target.value }))} /></div>
        </div>
        {result && (
          <div style={{ ...S.resultBox, marginTop: 16 }}>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Monthly Savings</div><div style={{ fontSize: 28, fontWeight: 700, color: C.gold }}>${Math.round(result.monthlySavings).toLocaleString()}</div></div>
              {result.breakEven && <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Break-Even</div><div style={{ fontSize: 28, fontWeight: 700 }}>{result.breakEven} mo</div></div>}
            </div>
          </div>
        )}
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={calc}>Analyze & Download PDF</button></div>
        <StatusMsg status={status} />
      </div>
    </div>
  );
}

// ─── 11. Education Center ─────────────────────────────────────────────────────
function EducationCenter({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [topic, setTopic] = useState(null);
  const [status, setStatus] = useState("idle");

  const topics = [
    { id: "mortgage-basics", title: "Mortgage Basics", content: "A mortgage is a loan secured by real property. You borrow from a lender, who holds a lien on the property until the loan is repaid. Key terms: Principal (amount borrowed), Interest (cost of borrowing), Escrow (account for taxes and insurance), Amortization (how payments are structured over time)." },
    { id: "loan-types", title: "Loan Types", content: "Conventional: standard loans not backed by the government, typically requiring 620+ credit score and 3-20% down. FHA: government-backed, 3.5% down with 580+ score. VA: zero down for eligible veterans. USDA: rural areas, zero down for income-qualified buyers." },
    { id: "process", title: "The Homebuying Process", content: "Step 1: Check credit and finances. Step 2: Get pre-approved. Step 3: Find a real estate agent. Step 4: Search and make offers. Step 5: Inspection and appraisal. Step 6: Underwriting. Step 7: Closing day." },
    { id: "dti", title: "Debt-to-Income Ratio", content: "DTI = total monthly debt payments / gross monthly income. Front-end DTI (housing only) should be under 28%. Back-end DTI (all debts) should be under 43% for most loans. Lower DTI = better approval odds and rates." },
    { id: "escrow", title: "Escrow Explained", content: "Escrow accounts hold your property tax and homeowner's insurance payments. Your lender collects 1/12 of the annual amounts each month with your mortgage payment, then pays the bills when due. This prevents large lump-sum payments." },
  ];

  async function downloadTopic(t) {
    setTopic(t.id);
    onProgress("Education Center");
    const rows = [["Topic", t.title], ["Summary", t.content]];
    await downloadReport({ title: `Education: ${t.title}`, contact, rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Education Center</div><p style={{ color: C.muted, fontSize: 14 }}>Learn the key concepts before you buy.</p></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topics.map(t => (
          <div key={t.id} style={{ ...S.card, borderLeft: topic === t.id ? `3px solid ${C.gold}` : `3px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, color: C.navy, marginBottom: 6 }}>{t.title}</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>{t.content}</div>
            <button style={S.btnSm} onClick={() => downloadTopic(t)}>Download PDF</button>
          </div>
        ))}
      </div>
      <StatusMsg status={status} />
    </div>
  );
}

// ─── 12. Resource Library ─────────────────────────────────────────────────────
function ResourceLibrary({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [status, setStatus] = useState("idle");

  const resources = [
    { title: "First-Time Buyer Checklist", rows: [["Step 1", "Check and improve your credit score"], ["Step 2", "Save for down payment and closing costs"], ["Step 3", "Get pre-approved with a licensed MLO"], ["Step 4", "Find a buyer's agent"], ["Step 5", "Set your home search criteria"], ["Step 6", "Make offers and negotiate"], ["Step 7", "Schedule inspection and appraisal"], ["Step 8", "Final walkthrough and closing"]] },
    { title: "Document Checklist for Pre-Approval", rows: [["Income", "Last 2 years W-2s and tax returns"], ["Employment", "30 days of recent pay stubs"], ["Assets", "Last 2 months bank/investment statements"], ["ID", "Government-issued photo ID"], ["Debts", "List of monthly debt obligations"], ["Other", "Rental history or landlord contact if applicable"]] },
    { title: "Glossary of Key Terms", rows: [["APR", "Annual Percentage Rate — total cost of borrowing including fees"], ["PMI", "Private Mortgage Insurance — required under 20% down on conventional loans"], ["LTV", "Loan-to-Value ratio — loan amount divided by home value"], ["PITI", "Principal, Interest, Taxes, Insurance — full monthly payment breakdown"], ["Underwriting", "Lender review process to approve your loan application"]] },
  ];

  async function downloadResource(r) {
    onProgress("Resource Library");
    await downloadReport({ title: r.title, contact, rows: r.rows, sendEmail, setStatus });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Resource Library</div></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {resources.map((r, i) => (
          <div key={i} style={S.card}>
            <div style={{ fontWeight: 700, color: C.navy, marginBottom: 8 }}>{r.title}</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>{r.rows.length} items</div>
            <button style={S.btnSm} onClick={() => downloadResource(r)}>Download PDF</button>
          </div>
        ))}
      </div>
      <StatusMsg status={status} />
    </div>
  );
}

// ─── 13. Schedule a Consultation ─────────────────────────────────────────────
function ScheduleConsultation({ contact, setContact, sendEmail, setSendEmail, onProgress }) {
  const [f, setF] = useState({ goal: "purchase", timeline: "3-6 months", questions: "" });
  const [status, setStatus] = useState("idle");

  async function submit() {
    onProgress("Schedule Consultation");
    const rows = [
      ["Goal", f.goal === "purchase" ? "Purchase a Home" : f.goal === "refinance" ? "Refinance Existing Mortgage" : "General Homeownership Guidance"],
      ["Timeline", f.timeline],
      ["Questions / Notes", f.questions || "None provided"],
      ["Next Step", "Yves Ozoude will contact you within 1 business day"],
      ["Contact", "YOzoude@UHM.com | 713-931-0655"],
    ];
    await downloadReport({
      title: "Consultation Request Summary",
      contact,
      rows,
      sendEmail,
      setStatus,
      footerNote: "This is a consultation request summary. Your advisor will reach out to confirm a time.",
    });
  }

  return (
    <div>
      <div style={S.card}><div style={S.h2}>Schedule a Consultation</div><p style={{ color: C.muted, fontSize: 14 }}>Tell us about your goals and we'll follow up promptly.</p></div>
      <ContactBlock contact={contact} setContact={setContact} sendEmail={sendEmail} setSendEmail={setSendEmail} />
      <div style={S.card}>
        <div style={{ marginBottom: 16 }}>
          <label style={S.label}>What's your primary goal?</label>
          {[["purchase", "Purchase a Home"], ["refinance", "Refinance Existing Mortgage"], ["guidance", "General Homeownership Guidance"]].map(([val, label]) => (
            <div key={val} onClick={() => setF(p => ({ ...p, goal: val }))}
              style={{ padding: "10px 14px", marginBottom: 8, borderRadius: 8, border: `1.5px solid ${f.goal === val ? C.navy : C.border}`, background: f.goal === val ? "#EBF0F8" : "#fff", cursor: "pointer", fontSize: 13 }}>
              {label}
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={S.label}>When are you looking to act?</label>
          <select style={{ ...S.input }} value={f.timeline} onChange={e => setF(p => ({ ...p, timeline: e.target.value }))}>
            {["ASAP", "1-3 months", "3-6 months", "6-12 months", "Just exploring"].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Questions or notes for your advisor</label>
          <textarea style={{ ...S.input, minHeight: 80, resize: "vertical" }} value={f.questions} onChange={e => setF(p => ({ ...p, questions: e.target.value }))} placeholder="Optional..." />
        </div>
        <div style={{ marginTop: 16 }}><button style={S.btnGold} onClick={submit}>Submit & Download Summary PDF</button></div>
        <StatusMsg status={status} />
      </div>
      <div style={S.sigBanner}>
        <div style={{ fontWeight: 700 }}>Ready to talk now?</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Yves Ozoude · NMLS #1857419 · YOzoude@UHM.com · 713-931-0655</div>
      </div>
    </div>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "readiness", label: "Readiness Assessment", group: "Assessments" },
  { id: "budget", label: "Monthly Budget Tool", group: "Assessments" },
  { id: "affordability", label: "Affordability Calculator", group: "Assessments" },
  { id: "downpayment", label: "Down Payment Calculator", group: "Assessments" },
  { id: "closing", label: "Closing Cost Estimator", group: "Assessments" },
  { id: "cashtoclo", label: "Cash-to-Close Calculator", group: "Assessments" },
  { id: "credit", label: "Credit Improvement Planner", group: "Assessments" },
  { id: "savings", label: "Savings Goal Tracker", group: "Tools" },
  { id: "assistance", label: "Housing Assistance Finder", group: "Tools" },
  { id: "refinance", label: "Refinance Calculator", group: "Tools" },
  { id: "education", label: "Education Center", group: "Resources" },
  { id: "library", label: "Resource Library", group: "Resources" },
  { id: "schedule", label: "Schedule Consultation", group: "Resources" },
];

// ─── Main app ─────────────────────────────────────────────────────────────────
export default function Demo() {
  const [active, setActive] = useState("readiness");
  const [progress, setProgress] = useState([]);
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", employer: "" });
  const [sendEmail, setSendEmail] = useState(true);

  const sharedProps = { contact, setContact, sendEmail, setSendEmail, onProgress: (id) => setProgress(p => [...new Set([...p, id])]) };

  const groups = [...new Set(SECTIONS.map(s => s.group))];

  function renderActive() {
    switch (active) {
      case "readiness": return <ReadinessAssessment {...sharedProps} />;
      case "budget": return <BudgetTool {...sharedProps} />;
      case "affordability": return <AffordabilityCalc {...sharedProps} />;
      case "downpayment": return <DownPaymentCalc {...sharedProps} />;
      case "closing": return <ClosingCostCalc {...sharedProps} />;
      case "cashtoclo": return <CashToCloseCalc {...sharedProps} />;
      case "credit": return <CreditPlanner {...sharedProps} />;
      case "savings": return <SavingsTracker {...sharedProps} />;
      case "assistance": return <HousingAssistanceFinder {...sharedProps} />;
      case "refinance": return <RefinanceCalc {...sharedProps} />;
      case "education": return <EducationCenter {...sharedProps} />;
      case "library": return <ResourceLibrary {...sharedProps} />;
      case "schedule": return <ScheduleConsultation {...sharedProps} />;
      default: return null;
    }
  }

  return (
    <div style={S.page}>
      <div style={S.topbar}>
        <div>
          <div style={S.topbarTitle}>SINCLAIR</div>
          <div style={S.topbarSub}>Homeownership Benefit Program · Demo</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          {progress.length} of {SECTIONS.length} tools completed
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={S.sidebar}>
          {groups.map(group => (
            <div key={group}>
              <div style={S.sideSection}>{group}</div>
              {SECTIONS.filter(s => s.group === group).map(s => (
                <div key={s.id} style={S.sideItem(active === s.id)} onClick={() => setActive(s.id)}>
                  {progress.includes(s.label) ? "✓ " : ""}{s.label}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={S.main}>
          {renderActive()}
        </div>
      </div>
    </div>
  );
}
