import { useState } from "react";

const C = {
  navy:"#1B2B5E",navyDark:"#12204A",gold:"#B8922A",goldLight:"#F5EDD6",
  white:"#FFFFFF",offWhite:"#FAFAF8",text:"#1B2B5E",textMid:"#4A5568",
  textLight:"#718096",border:"#E8E4DC",borderLight:"#F0EDE6",
  green:"#2D6A4F",greenSoft:"#D8F3DC",red:"#C0392B",redSoft:"#FDECEA",
};

const Eyebrow = ({ children }) => (
  <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",color:C.gold,textTransform:"uppercase",marginBottom:20}}>{children}</div>
);
const GoldRule = () => <div style={{width:48,height:2,background:C.gold,margin:"24px 0 32px"}}/>;
const DisplayHeading = ({ lines }) => (
  <div style={{marginBottom:8}}>
    {lines.map((line,i)=>(
      <div key={i} style={{fontSize:42,fontWeight:400,lineHeight:1.15,fontFamily:"'Georgia','Times New Roman',serif",color:i===lines.length-1?C.gold:C.navy,marginBottom:4}}>{line}</div>
    ))}
  </div>
);
const ArrowLink = ({ label, onClick, active }) => (
  <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:16,padding:"18px 0",border:"none",borderBottom:`1px solid ${C.border}`,background:"transparent",cursor:"pointer",width:"100%",fontFamily:"'Georgia',serif",fontSize:17,fontWeight:700,color:active?C.gold:C.navy,textAlign:"left",transition:"color 0.15s"}}
    onMouseEnter={e=>e.currentTarget.style.color=C.gold}
    onMouseLeave={e=>e.currentTarget.style.color=active?C.gold:C.navy}>
    <span style={{flex:1}}>{label}</span>
    <span style={{color:C.gold,fontSize:18}}>→</span>
  </button>
);
const PrimaryBtn = ({ children, onClick, disabled, small }) => (
  <button onClick={onClick} disabled={disabled} style={{padding:small?"9px 22px":"13px 32px",background:C.navy,color:C.white,border:"none",borderRadius:2,fontSize:small?12:13,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.45:1,fontFamily:"inherit",transition:"background 0.15s"}}
    onMouseEnter={e=>{if(!disabled)e.currentTarget.style.background=C.navyDark;}}
    onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
    {children}
  </button>
);
const GoldBtn = ({ children, onClick, small }) => (
  <button onClick={onClick} style={{padding:small?"8px 20px":"13px 32px",background:"transparent",color:C.navy,border:`1.5px solid ${C.gold}`,borderRadius:2,fontSize:small?12:13,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}
    onMouseEnter={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.white;}}
    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.navy;}}>
    {children}
  </button>
);
const Tag = ({ children, color="navy" }) => {
  const colors={navy:{bg:C.navy,text:C.white},gold:{bg:C.goldLight,text:C.gold},green:{bg:C.greenSoft,text:C.green},red:{bg:C.redSoft,text:C.red},light:{bg:C.borderLight,text:C.textMid}};
  return <span style={{padding:"3px 10px",borderRadius:2,fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",background:colors[color].bg,color:colors[color].text}}>{children}</span>;
};
const Field = ({ label, value, onChange, type="text", prefix, suffix, hint }) => (
  <div style={{marginBottom:20}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMid,marginBottom:8}}>{label}</label>}
    <div style={{position:"relative"}}>
      {prefix&&<span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.textLight,fontSize:15}}>{prefix}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",padding:prefix?"11px 12px 11px 28px":"11px 14px",border:`1px solid ${C.border}`,borderRadius:2,fontSize:15,fontFamily:"inherit",color:C.text,background:C.white,outline:"none",boxSizing:"border-box",transition:"border-color 0.15s"}}
        onFocus={e=>e.target.style.borderColor=C.gold}
        onBlur={e=>e.target.style.borderColor=C.border}/>
      {suffix&&<span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:C.textLight}}>{suffix}</span>}
    </div>
    {hint&&<p style={{fontSize:12,color:C.textLight,margin:"6px 0 0"}}>{hint}</p>}
  </div>
);
const Dropdown = ({ label, value, onChange, options }) => (
  <div style={{marginBottom:20}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMid,marginBottom:8}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"11px 14px",border:`1px solid ${C.border}`,borderRadius:2,fontSize:15,fontFamily:"inherit",color:C.text,background:C.white,outline:"none"}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
const Bar = ({ value, max=100, color=C.navy, height=6 }) => (
  <div style={{background:C.borderLight,height,overflow:"hidden"}}>
    <div style={{width:`${Math.min((value/max)*100,100)}%`,background:color,height:"100%",transition:"width 0.6s ease"}}/>
  </div>
);
const Panel = ({ children, style={} }) => (
  <div style={{background:C.white,border:`1px solid ${C.border}`,padding:"36px 40px",...style}}>{children}</div>
);
const SectionTitle = ({ eyebrow, lines, sub }) => (
  <div style={{marginBottom:40}}>
    {eyebrow&&<Eyebrow>{eyebrow}</Eyebrow>}
    <DisplayHeading lines={lines}/>
    <GoldRule/>
    {sub&&<p style={{fontSize:16,color:C.textMid,lineHeight:1.7,maxWidth:520,margin:0}}>{sub}</p>}
  </div>
);
const fmt$ = v => `$${Number(v||0).toLocaleString()}`;
const ResultRow = ({ label, value, highlight }) => (
  <div style={{padding:"16px 24px",background:highlight?C.navy:C.white,border:`1px solid ${C.border}`,borderTop:"none"}}>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:highlight?"rgba(255,255,255,0.5)":C.textLight,marginBottom:6}}>{label}</div>
    <div style={{fontSize:28,fontWeight:700,fontFamily:"Georgia,serif",color:highlight?C.gold:C.navy}}>{value}</div>
  </div>
);

const useStore = () => {
  const [user,setUser]=useState({name:"Sarah Johnson",email:"sarah.johnson@sinclairinc.com",employer:"Sinclair",department:"Operations",readinessScore:62,progressSteps:{assessment:true,budget:false,credit:false,savings:false,consultation:false}});
  const [profile,setProfile]=useState({phone:"713-555-0142",city:"Houston",state:"TX",preferredContact:"email",notifications:true});
  const [savingsGoal,setSavingsGoal]=useState({target:25000,saved:8400,monthly:800});
  const [isAdmin,setIsAdmin]=useState(false);
  const [consent,setConsent]=useState({given:false,date:null});
  return {user,setUser,profile,setProfile,savingsGoal,setSavingsGoal,isAdmin,setIsAdmin,consent,setConsent};
};

const NAV=[
  {id:"dashboard",label:"Dashboard"},{id:"assessment",label:"Readiness Assessment"},
  {id:"budget",label:"Monthly Budget"},{id:"calculators",label:"Calculators"},
  {id:"credit",label:"Credit Planner"},{id:"savings",label:"Savings Tracker"},
  {id:"assistance",label:"Housing Assistance"},{id:"education",label:"Education Center"},
  {id:"resources",label:"Resource Library"},{id:"consultation",label:"Schedule Consultation"},
  {id:"employer",label:"Employer Benefits"},{id:"profile",label:"My Profile"},
  {id:"privacy",label:"Privacy & Consent"},{id:"admin",label:"Admin Dashboard",adminOnly:true},
];

< truncated lines 112-738 >
    </div>
    {tab==="overview"&&(
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:1}}>
          {stats.map((s,i)=>(
            <div key={i} style={{padding:"28px 24px",background:i===0?C.navy:C.white,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:i===0?"rgba(255,255,255,0.5)":C.textLight,marginBottom:8}}>{s.label}</div>
              <div style={{fontSize:40,fontWeight:700,fontFamily:"Georgia,serif",color:i===0?C.gold:C.navy,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:12,color:i===0?"rgba(255,255,255,0.5)":C.textLight,marginTop:6}}>{s.change}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1}}>
          <Panel>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:20}}>Score Distribution</div>
            {[{label:"75–100 Home-Ready",count:89,pct:28},{label:"50–74 On Track",count:142,pct:45},{label:"0–49 Building",count:81,pct:26}].map((r,i)=>(
              <div key={i} style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:C.textMid}}>{r.label}</span><span style={{fontSize:13,fontWeight:700,color:C.navy}}>{r.count}</span></div><Bar value={r.pct} color={i===0?C.green:i===1?C.navy:C.gold}/></div>
            ))}
          </Panel>
          <Panel>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:20}}>Feature Engagement</div>
            {[{label:"Assessment Completed",pct:72},{label:"Calculators Used",pct:61},{label:"Education Articles Read",pct:48},{label:"Consultation Booked",pct:21},{label:"Benefit Activated",pct:15}].map((r,i)=>(
              <div key={i} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:C.textMid}}>{r.label}</span><span style={{fontSize:13,fontWeight:700,color:C.gold}}>{r.pct}%</span></div><Bar value={r.pct} color={C.navy}/></div>
            ))}
          </Panel>
        </div>
      </div>
    )}
    {tab==="employees"&&(
      <Panel>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight}}>Employee Overview</div>
          <GoldBtn small>Export CSV →</GoldBtn>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Name","Department","Score","Steps","Status"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,borderBottom:`2px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{employees.map((emp,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${C.borderLight}`}}>
              <td style={{padding:"14px 12px",fontSize:14,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy}}>{emp.name}</td>
              <td style={{padding:"14px 12px",fontSize:13,color:C.textMid}}>{emp.dept}</td>
              <td style={{padding:"14px 12px",fontSize:16,fontWeight:700,fontFamily:"Georgia,serif",color:emp.score>=75?C.green:emp.score>=50?C.navy:C.gold}}>{emp.score}</td>
              <td style={{padding:"14px 12px",fontSize:13,color:C.textMid}}>{emp.steps}/5</td>
              <td style={{padding:"14px 12px"}}><Tag color={emp.status==="Closing Soon"?"green":emp.status==="Pre-approved"?"navy":"light"}>{emp.status}</Tag></td>
            </tr>
          ))}</tbody>
        </table>
      </Panel>
    )}
    {tab==="content"&&(
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1}}>
        {[{section:"Education Center",detail:"10 articles across 5 categories",updated:"2026-07-28"},{section:"Resource Library",detail:"4 guides, 4 checklists",updated:"2026-07-15"},{section:"Assistance Programs",detail:"8 programs listed",updated:"2026-08-01"},{section:"Employer Benefits Info",detail:"6 FAQs",updated:"2026-07-20"}].map((s,i)=>(
          <div key={i} style={{padding:"28px 32px",background:C.white,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:15,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy,marginBottom:4}}>{s.section}</div><div style={{fontSize:12,color:C.textLight}}>{s.detail} · Updated {s.updated}</div></div>
            <GoldBtn small>Edit →</GoldBtn>
          </div>
        ))}
      </div>
    )}
    {tab==="settings"&&(
      <Panel>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:24}}>Portal Settings</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Field label="Employer Name" value="Sinclair" onChange={()=>{}}/><Field label="Employer Match ($)" value="5000" onChange={()=>{}} type="number"/>
          <Field label="Closing Cost Credit ($)" value="500" onChange={()=>{}} type="number"/><Field label="Rate Discount (%)" value="0.25" onChange={()=>{}} type="number"/>
          <Field label="Advisor Name" value="Yves Ozoude" onChange={()=>{}}/><Field label="Advisor NMLS #" value="1857419" onChange={()=>{}}/>
          <Field label="Advisor Email" value="YOzoude@UHM.com" onChange={()=>{}} type="email"/><Field label="Advisor Phone" value="713-931-0655" onChange={()=>{}}/>
        </div>
        <PrimaryBtn>Save Settings</PrimaryBtn>
      </Panel>
    )}
  </div>);
};

export default function App() {
  const {user,setUser,profile,setProfile,savingsGoal,setSavingsGoal,isAdmin,setIsAdmin,consent,setConsent}=useStore();
  const [active,setActive]=useState("dashboard");
  const renderSection=()=>{
    switch(active){
      case "dashboard":    return <Dashboard user={user} setActive={setActive}/>;
      case "assessment":   return <Assessment user={user} setUser={setUser}/>;
      case "budget":       return <BudgetTool user={user} setUser={setUser}/>;
      case "calculators":  return <Calculators/>;
      case "credit":       return <CreditPlanner user={user} setUser={setUser}/>;
      case "savings":      return <SavingsTracker savingsGoal={savingsGoal} setSavingsGoal={setSavingsGoal} user={user} setUser={setUser}/>;
      case "assistance":   return <HousingAssistance/>;
      case "education":    return <EducationCenter/>;
      case "resources":    return <ResourceLibrary/>;
      case "consultation": return <Consultation user={user} setUser={setUser}/>;
      case "employer":     return <EmployerBenefits/>;
      case "profile":      return <Profile user={user} profile={profile} setProfile={setProfile}/>;
      case "privacy":      return <Privacy consent={consent} setConsent={setConsent}/>;
      case "admin":        return isAdmin?<AdminDashboard/>:<Dashboard user={user} setActive={setActive}/>;
      default:             return <Dashboard user={user} setActive={setActive}/>;
    }
  };
  return(
    <div style={{fontFamily:"'Georgia','Times New Roman',serif",background:C.offWhite,minHeight:"100vh"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>
      <Sidebar active={active} setActive={setActive} isAdmin={isAdmin} user={user}/>
      <TopBar setActive={setActive}/>
      <div style={{position:"fixed",bottom:16,left:16,zIndex:200}}>
        <button onClick={()=>setIsAdmin(!isAdmin)} style={{padding:"6px 14px",fontSize:11,fontWeight:700,letterSpacing:"0.08em",background:isAdmin?C.gold:C.white,color:isAdmin?C.white:C.textLight,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>{isAdmin?"Admin: ON":"Admin: OFF"}</button>
      </div>
      <main style={{marginLeft:240,paddingTop:56}}>
        <div style={{padding:"56px 64px",maxWidth:1060,minHeight:"calc(100vh - 56px)"}}>{renderSection()}</div>
        <Footer/>
      </main>
    </div>
  );
}
