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

const Sidebar = ({ active, setActive, isAdmin, user }) => (
  <aside style={{width:240,background:C.navy,color:C.white,height:"100vh",position:"fixed",top:0,left:0,display:"flex",flexDirection:"column",zIndex:100,overflowY:"auto"}}>
    <div style={{padding:"28px 24px 22px",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
      <div style={{fontFamily:"'Dancing Script','Brush Script MT',cursive",fontSize:36,fontWeight:700,color:"#C0392B",lineHeight:1,marginBottom:6,textShadow:"0 1px 2px rgba(0,0,0,0.3)"}}>Sinclair</div>
      <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:"rgba(255,255,255,0.45)",textTransform:"uppercase"}}>Employee Housing Financial<br/>Wellness Benefit™</div>
    </div>
    <div style={{padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:"50%",background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:C.white}}>{user.name.split(" ").map(n=>n[0]).join("")}</div>
        <div><div style={{fontSize:13,fontWeight:600,color:C.white}}>{user.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>{user.department}</div></div>
      </div>
    </div>
    <nav style={{flex:1,padding:"16px 0"}}>
      {NAV.filter(n=>!n.adminOnly||isAdmin).map(n=>(
        <button key={n.id} onClick={()=>setActive(n.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"11px 24px",border:"none",background:"transparent",cursor:"pointer",textAlign:"left",fontFamily:"inherit",fontSize:13,color:active===n.id?C.white:"rgba(255,255,255,0.55)",fontWeight:active===n.id?700:400,borderLeft:active===n.id?`3px solid ${C.gold}`:"3px solid transparent",transition:"all 0.12s"}}
          onMouseEnter={e=>{if(active!==n.id)e.currentTarget.style.color="rgba(255,255,255,0.85)";}}
          onMouseLeave={e=>{if(active!==n.id)e.currentTarget.style.color="rgba(255,255,255,0.55)";}}>
          <span>{n.label}</span>
          {active===n.id&&<span style={{color:C.gold,fontSize:14}}>→</span>}
        </button>
      ))}
    </nav>
    <div style={{padding:"18px 24px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",color:"rgba(255,255,255,0.4)",marginBottom:8,textTransform:"uppercase"}}>Readiness Score</div>
      <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:8}}>
        <span style={{fontSize:28,fontWeight:700,color:C.gold,fontFamily:"Georgia,serif"}}>{user.readinessScore}</span>
        <span style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>/ 100</span>
      </div>
      <Bar value={user.readinessScore} color={C.gold} height={3}/>
    </div>
  </aside>
);

const TopBar = ({ setActive }) => (
  <div style={{position:"fixed",top:0,left:240,right:0,height:56,background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 48px",zIndex:90}}>
    <PrimaryBtn small onClick={()=>setActive("consultation")}>Schedule a Consultation</PrimaryBtn>
  </div>
);

const Footer = () => (
  <div style={{borderTop:`1px solid ${C.border}`,padding:"24px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",background:C.white}}>
    <div style={{fontSize:12,color:C.textLight}}>© 2024 Sinclair, LLC. All rights reserved.</div>
    <div style={{display:"flex",gap:24}}>
      {["Privacy Policy","Terms of Use","Program Disclosures"].map(l=><span key={l} style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textLight,cursor:"pointer"}}>{l}</span>)}
    </div>
  </div>
);

const Dashboard = ({ user, setActive }) => {
  const steps=[{key:"assessment",label:"Complete Readiness Assessment",done:user.progressSteps.assessment,section:"assessment"},{key:"budget",label:"Set Up Your Monthly Budget",done:user.progressSteps.budget,section:"budget"},{key:"credit",label:"Review Credit Improvement Plan",done:user.progressSteps.credit,section:"credit"},{key:"savings",label:"Create a Savings Goal",done:user.progressSteps.savings,section:"savings"},{key:"consultation",label:"Schedule a Consultation",done:user.progressSteps.consultation,section:"consultation"}];
  const doneCount=steps.filter(s=>s.done).length;const nextStep=steps.find(s=>!s.done);
  return(
    <div>
      <SectionTitle eyebrow="Your Dashboard" lines={[`Welcome back,`,`${user.name.split(" ")[0]}.`]} sub="Your path to homeownership starts here. Here's where you stand today."/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,marginBottom:40}}>
        {[{eyebrow:"Readiness Score",value:user.readinessScore,sub:user.readinessScore<50?"Just getting started — great time to plan.":user.readinessScore<75?"Making solid progress. Keep going.":"You're nearly ready to buy.",dark:true,bar:true},{eyebrow:"Steps Completed",value:`${doneCount} / ${steps.length}`,sub:`${steps.length-doneCount} steps remaining`,dark:false},{eyebrow:"Employer Benefit",value:"Active",sub:"Up to $5,000 employer match available",dark:false}].map((card,i)=>(
          <div key={i} style={{padding:"32px 36px",background:card.dark?C.navy:C.white,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:card.dark?"rgba(255,255,255,0.45)":C.textLight,marginBottom:12}}>{card.eyebrow}</div>
            <div style={{fontSize:48,fontWeight:700,lineHeight:1,fontFamily:"Georgia,serif",color:card.dark?C.gold:C.navy}}>{card.value}</div>
            <div style={{fontSize:13,color:card.dark?"rgba(255,255,255,0.55)":C.textLight,marginTop:8}}>{card.sub}</div>
            {card.bar&&<div style={{marginTop:16}}><Bar value={user.readinessScore} color={C.gold} height={3}/></div>}
          </div>
        ))}
      </div>
      {nextStep&&(
        <div style={{padding:"24px 36px",background:C.goldLight,borderLeft:`4px solid ${C.gold}`,marginBottom:40,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><Eyebrow>Next Recommended Action</Eyebrow><div style={{fontSize:19,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy}}>{nextStep.label}</div></div>
          <GoldBtn onClick={()=>setActive(nextStep.section)}>Start Now →</GoldBtn>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,marginBottom:40}}>
        <Panel>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:20}}>Your Progress</div>
          {steps.map((s,i)=>(
            <div key={s.key} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:i<steps.length-1?`1px solid ${C.borderLight}`:"none"}}>
              <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,background:s.done?C.navy:"transparent",border:`1.5px solid ${s.done?C.navy:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.white,fontWeight:700}}>{s.done?"✓":""}</div>
              <span style={{flex:1,fontSize:14,color:s.done?C.textMid:C.text,textDecoration:s.done?"line-through":"none"}}>{s.label}</span>
              {!s.done&&<button onClick={()=>setActive(s.section)} style={{background:"none",border:"none",color:C.gold,fontSize:13,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>Go →</button>}
            </div>
          ))}
        </Panel>
        <Panel>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:20}}>Benefit Overview</div>
          {[{label:"Employer Match",value:"Up to $5,000"},{label:"Rate Discount",value:"0.25% below market"},{label:"Closing Credit",value:"$500 at closing"},{label:"Dedicated Advisor",value:"Yves Ozoude, NMLS #1857419"}].map((b,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"13px 0",borderBottom:i<3?`1px solid ${C.borderLight}`:"none"}}>
              <span style={{fontSize:14,color:C.textMid}}>{b.label}</span>
              <span style={{fontSize:14,fontWeight:700,color:C.navy}}>{b.value}</span>
            </div>
          ))}
          <div style={{marginTop:24}}><GoldBtn small onClick={()=>setActive("employer")}>View Full Benefit Details →</GoldBtn></div>
        </Panel>
      </div>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:20}}>Quick Tools</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1}}>
        {[{label:"Affordability Calculator",section:"calculators",desc:"How much home can you afford?"},{label:"Credit Planner",section:"credit",desc:"Improve your score step by step."},{label:"Down Payment Help",section:"assistance",desc:"Grants & assistance programs."},{label:"Talk to an Advisor",section:"consultation",desc:"Free, no-obligation consult."}].map((t,i)=>(
          <button key={i} onClick={()=>setActive(t.section)} style={{padding:"28px 24px",background:C.white,border:`1px solid ${C.border}`,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.background=C.goldLight;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.white;}}>
            <div style={{fontSize:15,fontWeight:700,color:C.navy,fontFamily:"Georgia,serif",marginBottom:6}}>{t.label}</div>
            <div style={{fontSize:12,color:C.textLight}}>{t.desc}</div>
            <div style={{color:C.gold,marginTop:12,fontSize:16}}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const Assessment = ({ user, setUser }) => {
  const [step,setStep]=useState(0);const [answers,setAnswers]=useState({});const [complete,setComplete]=useState(false);const [score,setScore]=useState(null);
  const questions=[{id:"own_vs_rent",text:"Do you currently own or rent your home?",options:["Renting","Living with family/friends","Own my home","Other"]},{id:"timeline",text:"When do you hope to purchase a home?",options:["Within 6 months","6–12 months","1–2 years","Not sure yet"]},{id:"credit_score",text:"What is your estimated credit score range?",options:["Below 580","580–619","620–679","680–739","740 or above","I don't know"]},{id:"savings",text:"How much do you currently have saved for a down payment?",options:["Less than $1,000","$1,000–$5,000","$5,000–$15,000","$15,000–$30,000","$30,000+"]},{id:"income_stable",text:"Is your income stable and consistent?",options:["Yes, salaried/guaranteed","Mostly yes, with some variability","Variable (contract, commission)","Recently changed jobs"]},{id:"debt",text:"How would you describe your current debt situation?",options:["Minimal debt","Some debt, manageable","Significant debt, working on it","Struggling with debt"]},{id:"budget",text:"Do you have a monthly household budget?",options:["Yes, I track everything","Loose budget, not detailed","No formal budget","Just getting started"]},{id:"first_time",text:"Are you a first-time homebuyer?",options:["Yes, first time","No, I've owned before","Not sure what counts"]}];
  const scoreMap={own_vs_rent:{"Renting":5,"Living with family/friends":8,"Own my home":0,"Other":3},timeline:{"Within 6 months":15,"6–12 months":12,"1–2 years":8,"Not sure yet":3},credit_score:{"Below 580":0,"580–619":5,"620–679":10,"680–739":15,"740 or above":20,"I don't know":2},savings:{"Less than $1,000":0,"$1,000–$5,000":3,"$5,000–$15,000":8,"$15,000–$30,000":13,"$30,000+":18},income_stable:{"Yes, salaried/guaranteed":12,"Mostly yes, with some variability":9,"Variable (contract, commission)":5,"Recently changed jobs":2},debt:{"Minimal debt":12,"Some debt, manageable":9,"Significant debt, working on it":4,"Struggling with debt":1},budget:{"Yes, I track everything":8,"Loose budget, not detailed":5,"No formal budget":1,"Just getting started":3},first_time:{"Yes, first time":5,"No, I've owned before":10,"Not sure what counts":3}};
  const handleAnswer=(qid,answer)=>{const na={...answers,[qid]:answer};setAnswers(na);if(step<questions.length-1){setStep(step+1);}else{const total=Object.entries(na).reduce((acc,[k,v])=>acc+(scoreMap[k]?.[v]??0),0);const final=Math.min(total,100);setScore(final);setComplete(true);setUser(u=>({...u,readinessScore:final,progressSteps:{...u.progressSteps,assessment:true}}));}};
  if(complete&&score!==null){
    const tier=score>=75?{label:"Home-Ready",color:C.green,advice:"You're in excellent shape. Let's connect you with your advisor and get pre-qualified."}:score>=50?{label:"On Track",color:C.navy,advice:"Good progress. Focus on savings and credit to reach the next tier quickly."}:{label:"Building Foundation",color:C.gold,advice:"Everyone starts somewhere. Let's build your action plan step by step."};
    return(<div>
      <SectionTitle eyebrow="Results" lines={["Your Readiness","Assessment."]}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,marginBottom:32}}>
        <Panel style={{textAlign:"center",padding:"48px"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textLight,marginBottom:16}}>Your Score</div>
          <div style={{fontSize:88,fontWeight:700,fontFamily:"Georgia,serif",color:tier.color,lineHeight:1}}>{score}</div>
          <div style={{fontSize:16,color:C.textLight,margin:"4px 0 20px"}}>out of 100</div>
          <Tag color={score>=75?"green":score>=50?"navy":"gold"}>{tier.label}</Tag>
          <p style={{fontSize:14,color:C.textMid,marginTop:20,lineHeight:1.7}}>{tier.advice}</p>
        </Panel>
        <Panel>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:20}}>Your Action Plan</div>
          {[score<70&&"Build or improve your credit score to at least 680",answers.savings==="Less than $1,000"&&"Open a dedicated savings account and set a monthly goal",answers.budget==="No formal budget"&&"Complete the Monthly Budget Tool","Explore down payment assistance programs in your area","Schedule a free consultation with your dedicated advisor"].filter(Boolean).map((action,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"13px 0",borderBottom:`1px solid ${C.borderLight}`}}><span style={{color:C.gold,fontWeight:700,flexShrink:0}}>→</span><span style={{fontSize:14,color:C.text}}>{action}</span></div>
          ))}
        </Panel>
      </div>
      <button onClick={()=>{setComplete(false);setStep(0);setAnswers({});}} style={{background:"none",border:"none",color:C.gold,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",letterSpacing:"0.06em"}}>← Retake Assessment</button>
    </div>);
  }
  const q=questions[step];
  return(<div>
    <SectionTitle eyebrow="For Employees" lines={["Financial Readiness","Assessment."]} sub="Answer 8 questions to receive your personalized readiness score and action plan."/>
    <Panel style={{maxWidth:640}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,color:C.textLight}}>Question {step+1} of {questions.length}</span><span style={{fontSize:12,fontWeight:700,color:C.gold}}>{Math.round((step/questions.length)*100)}%</span></div>
      <Bar value={step} max={questions.length}/>
      <h2 style={{fontSize:22,fontWeight:400,fontFamily:"Georgia,serif",color:C.navy,margin:"36px 0 28px"}}>{q.text}</h2>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {q.options.map(opt=>(
          <button key={opt} onClick={()=>handleAnswer(q.id,opt)} style={{padding:"16px 20px",border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",textAlign:"left",fontSize:15,color:C.text,fontFamily:"inherit",transition:"all 0.12s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.background=C.goldLight;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.white;}}>{opt}</button>
        ))}
      </div>
      {step>0&&<button onClick={()=>setStep(step-1)} style={{marginTop:20,background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>← Back</button>}
    </Panel>
  </div>);
};

const BudgetTool = ({ user, setUser }) => {
  const [income,setIncome]=useState("6500");
  const [expenses,setExpenses]=useState({rent:"1800",car:"450",insurance:"200",utilities:"180",groceries:"400",dining:"250",subscriptions:"80",clothing:"100",entertainment:"150",other:"200"});
  const [saved,setSaved]=useState(false);
  const totalExp=Object.values(expenses).reduce((a,b)=>a+(parseFloat(b)||0),0);
  const inc=parseFloat(income)||0,remaining=inc-totalExp,savingsRate=inc>0?((remaining/inc)*100).toFixed(1):0;
  const cats=[{key:"rent",label:"Rent / Housing"},{key:"car",label:"Car Payment"},{key:"insurance",label:"Insurance"},{key:"utilities",label:"Utilities"},{key:"groceries",label:"Groceries"},{key:"dining",label:"Dining Out"},{key:"subscriptions",label:"Subscriptions"},{key:"clothing",label:"Clothing"},{key:"entertainment",label:"Entertainment"},{key:"other",label:"Other"}];
  const handleSave=()=>{setSaved(true);setUser(u=>({...u,progressSteps:{...u.progressSteps,budget:true}}));setTimeout(()=>setSaved(false),2500);};
  return(<div>
    <SectionTitle eyebrow="Tools" lines={["Monthly","Budget Tool."]} sub="Track your income and expenses to understand your savings potential."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:1}}>
      <Panel>
        <Field label="Monthly Take-Home Pay" value={income} onChange={setIncome} prefix="$" type="number"/>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,margin:"24px 0 16px"}}>Monthly Expenses</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 24px"}}>
          {cats.map(c=>(
            <div key={c.key}>
              <label style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMid,display:"block",marginBottom:6}}>{c.label}</label>
              <div style={{position:"relative",marginBottom:16}}>
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.textLight}}>$</span>
                <input type="number" value={expenses[c.key]} onChange={e=>setExpenses({...expenses,[c.key]:e.target.value})} style={{width:"100%",padding:"10px 10px 10px 24px",border:`1px solid ${C.border}`,fontSize:14,fontFamily:"inherit",color:C.text,boxSizing:"border-box",background:C.white}}/>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <div>
        <div style={{padding:"32px 28px",background:remaining>=0?C.navy:C.red,color:C.white,marginBottom:1}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",opacity:.6,marginBottom:12}}>Monthly Surplus</div>
          <div style={{fontSize:44,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1}}>{remaining<0?"-":""}{fmt$(Math.abs(remaining))}</div>
          <div style={{fontSize:12,opacity:.6,marginTop:6}}>Savings rate: {savingsRate}%</div>
        </div>
        {[{label:"Gross Income",value:inc},{label:"Total Expenses",value:totalExp},{label:"Net Remaining",value:remaining}].map((r,i)=>(
          <div key={i} style={{padding:"16px 28px",background:C.white,border:`1px solid ${C.border}`,borderTop:"none",display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:13,color:C.textMid}}>{r.label}</span>
            <span style={{fontSize:14,fontWeight:700,color:C.navy}}>{fmt$(r.value)}</span>
          </div>
        ))}
        <div style={{padding:"20px 28px"}}>
          {saved?<div style={{fontSize:13,color:C.green,fontWeight:700}}>✓ Budget saved</div>:<PrimaryBtn onClick={handleSave}>Save My Budget</PrimaryBtn>}
        </div>
      </div>
    </div>
  </div>);
};

const Calculators = () => {
  const [active,setActive]=useState("affordability");
  const tabs=[{id:"affordability",label:"Home Affordability"},{id:"downpayment",label:"Down Payment"},{id:"closing",label:"Closing Costs"},{id:"cashtocclose",label:"Cash to Close"}];
  const AffordCalc = () => {
    const [income,setIncome]=useState("95000");const [debt,setDebt]=useState("650");const [rate,setRate]=useState("6.75");const [down,setDown]=useState("10");const [term,setTerm]=useState("30");
    const inc=parseFloat(income)||0,monthlyInc=inc/12,monthlyDebt=parseFloat(debt)||0,r=(parseFloat(rate)||6.75)/100/12,n=parseInt(term)*12,downPct=parseFloat(down)/100;
    const maxPmt=Math.min(monthlyInc*0.28,Math.max(0,monthlyInc*0.43-monthlyDebt));
    const loanAmt=r>0?maxPmt*((1-Math.pow(1+r,-n))/r):maxPmt*n,homePrice=loanAmt/(1-downPct),downAmt=homePrice*downPct;
    return(<div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:1}}>
      <Panel><Field label="Annual Gross Income" value={income} onChange={setIncome} prefix="$" type="number"/><Field label="Monthly Debt Payments" value={debt} onChange={setDebt} prefix="$" type="number"/><Field label="Interest Rate" value={rate} onChange={setRate} suffix="%" type="number"/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Field label="Down Payment %" value={down} onChange={setDown} suffix="%" type="number"/><Dropdown label="Loan Term" value={term} onChange={setTerm} options={[{value:"30",label:"30 Years"},{value:"20",label:"20 Years"},{value:"15",label:"15 Years"}]}/></div></Panel>
      <div><div style={{padding:"20px 24px",background:C.navy,border:`1px solid ${C.border}`}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Estimated Home Price</div><div style={{fontSize:40,fontWeight:700,fontFamily:"Georgia,serif",color:C.gold}}>{fmt$(homePrice)}</div></div><ResultRow label="Loan Amount" value={fmt$(loanAmt)}/><ResultRow label="Down Payment Needed" value={fmt$(downAmt)}/><ResultRow label="Max Monthly Payment" value={fmt$(maxPmt)}/></div>
    </div>);
  };
  const DownPayCalc = () => {
    const [price,setPrice]=useState("350000");const [pct,setPct]=useState("10");const [saved,setSaved]=useState("8400");const [monthly,setMonthly]=useState("800");
    const p=parseFloat(price)||0,d=p*(parseFloat(pct)/100),s=parseFloat(saved)||0,m=parseFloat(monthly)||0,gap=Math.max(0,d-s),months=m>0?Math.ceil(gap/m):"—";
    return(<div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:1}}>
      <Panel><Field label="Target Home Price" value={price} onChange={setPrice} prefix="$" type="number"/><Field label="Down Payment %" value={pct} onChange={setPct} suffix="%" type="number" hint="3% FHA min · 5% · 10% · 20% (no PMI)"/><Field label="Currently Saved" value={saved} onChange={setSaved} prefix="$" type="number"/><Field label="Monthly Savings Goal" value={monthly} onChange={setMonthly} prefix="$" type="number"/></Panel>
      <div><div style={{padding:"20px 24px",background:C.navy,border:`1px solid ${C.border}`}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Down Payment Amount</div><div style={{fontSize:40,fontWeight:700,fontFamily:"Georgia,serif",color:C.gold}}>{fmt$(d)}</div></div><ResultRow label="Already Saved" value={fmt$(s)}/><ResultRow label="Remaining to Save" value={`${fmt$(gap)} · ~${months} mo`}/><ResultRow label="PMI Required" value={parseFloat(pct)<20?"Yes — until 20% equity":"No"}/></div>
    </div>);
  };
  const ClosingCalc = () => {
    const [price,setPrice]=useState("350000");
    const p=parseFloat(price)||0,items=[{label:"Origination Fee (1%)",value:p*0.01},{label:"Appraisal",value:650},{label:"Title Insurance",value:p*0.005},{label:"Title Search & Exam",value:300},{label:"Recording Fees",value:200},{label:"Homeowners Insurance (1yr)",value:p*0.006},{label:"Property Tax Escrow (2mo)",value:(p*0.02)/6},{label:"Attorney / Settlement Fee",value:650},{label:"Survey",value:500},{label:"Miscellaneous",value:400}],total=items.reduce((a,b)=>a+b.value,0);
    return(<div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:1}}>
      <Panel><Field label="Purchase Price" value={price} onChange={setPrice} prefix="$" type="number"/>{items.map((item,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.borderLight}`}}><span style={{fontSize:13,color:C.textMid}}>{item.label}</span><span style={{fontSize:13,fontWeight:600,color:C.text}}>{fmt$(item.value)}</span></div>)}<div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0"}}><span style={{fontSize:15,fontWeight:700,color:C.navy}}>Total Estimated</span><span style={{fontSize:15,fontWeight:700,color:C.gold}}>{fmt$(total)}</span></div></Panel>
      <div><div style={{padding:"20px 24px",background:C.navy,border:`1px solid ${C.border}`}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Total Closing Costs</div><div style={{fontSize:40,fontWeight:700,fontFamily:"Georgia,serif",color:C.gold}}>{fmt$(total)}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:4}}>~{((total/p)*100).toFixed(1)}% of home price</div></div><ResultRow label="Typical Range" value={`${fmt$(p*0.02)} – ${fmt$(p*0.05)}`}/><div style={{padding:"20px 24px",background:C.goldLight,border:`1px solid ${C.border}`,borderTop:"none"}}><div style={{fontSize:11,fontWeight:700,color:C.gold,marginBottom:4}}>Sinclair Employer Benefit</div><div style={{fontSize:13,color:C.text}}>You may qualify for a <strong>$500 closing cost credit</strong>. Ask your advisor.</div></div></div>
    </div>);
  };
  const CashCloseCalc = () => {
    const [price,setPrice]=useState("350000");const [downPct,setDownPct]=useState("10");const [sc,setSc]=useState("0");const [earnest,setEarnest]=useState("3500");const [ec,setEc]=useState("500");
    const p=parseFloat(price)||0,down=p*(parseFloat(downPct)/100),closing=p*0.03,scv=parseFloat(sc)||0,em=parseFloat(earnest)||0,ecv=parseFloat(ec)||0,total=Math.max(0,down+closing-scv-em-ecv);
    return(<div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:1}}>
      <Panel><Field label="Purchase Price" value={price} onChange={setPrice} prefix="$" type="number"/><Field label="Down Payment %" value={downPct} onChange={setDownPct} suffix="%" type="number"/><Field label="Seller Credits" value={sc} onChange={setSc} prefix="$" type="number"/><Field label="Earnest Money (already paid)" value={earnest} onChange={setEarnest} prefix="$" type="number"/><Field label="Employer Benefit Credit" value={ec} onChange={setEc} prefix="$" type="number" hint="Default $500 Sinclair closing credit"/></Panel>
      <div><div style={{padding:"20px 24px",background:C.navy,border:`1px solid ${C.border}`}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Cash to Close</div><div style={{fontSize:40,fontWeight:700,fontFamily:"Georgia,serif",color:C.gold}}>{fmt$(total)}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:4}}>Bring this to closing</div></div><ResultRow label="Down Payment" value={fmt$(down)}/><ResultRow label="Est. Closing Costs" value={fmt$(closing)}/><ResultRow label="Total Credits" value={fmt$(scv+em+ecv)}/></div>
    </div>);
  };
  return(<div>
    <SectionTitle eyebrow="Tools" lines={["Home","Calculators."]} sub="Understand what you can afford and what to expect at closing."/>
    <div style={{display:"flex",gap:0,marginBottom:32,borderBottom:`2px solid ${C.border}`}}>
      {tabs.map(t=><button key={t.id} onClick={()=>setActive(t.id)} style={{padding:"12px 24px",border:"none",borderBottom:active===t.id?`2px solid ${C.gold}`:"2px solid transparent",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,letterSpacing:"0.05em",color:active===t.id?C.navy:C.textLight,marginBottom:-2,transition:"all 0.12s"}}>{t.label}</button>)}
    </div>
    {active==="affordability"&&<AffordCalc/>}{active==="downpayment"&&<DownPayCalc/>}{active==="closing"&&<ClosingCalc/>}{active==="cashtocclose"&&<CashCloseCalc/>}
  </div>);
};

const CreditPlanner = ({ user, setUser }) => {
  const [score,setScore]=useState("640");const [checks,setChecks]=useState({});
  const sc=parseInt(score)||0;
  const tier=sc>=740?{label:"Excellent",color:C.green}:sc>=680?{label:"Good",color:C.navy}:sc>=620?{label:"Fair",color:C.gold}:{label:"Needs Work",color:C.red};
  const tips=[{id:"pay",text:"Pay all bills on time — set up autopay for minimums",impact:"High Impact",pts:"+40 pts"},{id:"util",text:"Keep credit card utilization below 30% on each card",impact:"High Impact",pts:"+35 pts"},{id:"old",text:"Don't close old credit card accounts — keep them open",impact:"Medium Impact",pts:"+15 pts"},{id:"inq",text:"Avoid applying for new credit 6+ months before your mortgage application",impact:"Medium Impact",pts:"+10 pts"},{id:"err",text:"Dispute errors on your credit report at AnnualCreditReport.com",impact:"High Impact",pts:"+50 pts"},{id:"bal",text:"Pay down highest-balance cards first (avalanche method)",impact:"High Impact",pts:"+30 pts"},{id:"mix",text:"Consider a small installment loan to diversify your credit mix",impact:"Low Impact",pts:"+5 pts"}];
  const doneCount=Object.values(checks).filter(Boolean).length;
  const toggle=id=>{const nc={...checks,[id]:!checks[id]};setChecks(nc);if(Object.values(nc).filter(Boolean).length>=3)setUser(u=>({...u,progressSteps:{...u.progressSteps,credit:true}}));};
  return(<div>
    <SectionTitle eyebrow="Tools" lines={["Credit Improvement","Planner."]} sub="Understand how your credit score affects your mortgage and get a personalized improvement checklist."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,marginBottom:1}}>
      <Panel>
        <Field label="Estimated Credit Score" value={score} onChange={setScore} type="number" hint="Check Credit Karma, your bank, or AnnualCreditReport.com for free."/>
        <div style={{padding:"24px",background:C.offWhite,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:52,fontWeight:700,fontFamily:"Georgia,serif",color:tier.color,lineHeight:1}}>{score}</div>
          <div style={{marginTop:8}}><Tag color={sc>=740?"green":sc>=680?"navy":sc>=620?"gold":"red"}>{tier.label}</Tag></div>
          <div style={{marginTop:16,position:"relative",height:8,background:`linear-gradient(to right,#C0392B,${C.gold},${C.green})`}}>
            <div style={{position:"absolute",top:-4,left:`${Math.min(Math.max(((sc-300)/550)*100,0),100)}%`,width:16,height:16,borderRadius:"50%",background:C.white,border:`2.5px solid ${tier.color}`,transform:"translateX(-50%)"}}/>
          </div>
        </div>
      </Panel>
      <Panel>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:16}}>Score vs. Mortgage Rate</div>
        {[{range:"740+",rate:"~6.25%",mine:sc>=740},{range:"720–739",rate:"~6.50%",mine:sc>=720&&sc<740},{range:"700–719",rate:"~6.75%",mine:sc>=700&&sc<720},{range:"680–699",rate:"~7.00%",mine:sc>=680&&sc<700},{range:"660–679",rate:"~7.25%",mine:sc>=660&&sc<680},{range:"640–659",rate:"~7.75%",mine:sc>=640&&sc<660},{range:"620–639",rate:"~8.25%",mine:sc>=620&&sc<640}].map((r,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",marginBottom:4,background:r.mine?C.goldLight:"transparent",border:r.mine?`1px solid ${C.gold}`:`1px solid transparent`}}>
            <span style={{fontSize:13,color:r.mine?C.gold:C.textMid,fontWeight:r.mine?700:400}}>{r.range}</span>
            <span style={{fontSize:13,fontWeight:600,color:r.mine?C.gold:C.text}}>{r.rate}</span>
            {r.mine&&<Tag color="gold">You</Tag>}
          </div>
        ))}
      </Panel>
    </div>
    <Panel>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight}}>Improvement Checklist</div>
        <Tag color="navy">{doneCount}/{tips.length} completed</Tag>
      </div>
      {tips.map(tip=>(
        <div key={tip.id} onClick={()=>toggle(tip.id)} style={{display:"flex",gap:16,padding:"16px 0",borderBottom:`1px solid ${C.borderLight}`,cursor:"pointer"}}>
          <div style={{width:20,height:20,border:`1.5px solid ${checks[tip.id]?C.navy:C.border}`,background:checks[tip.id]?C.navy:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,color:C.white,fontSize:11,fontWeight:700}}>{checks[tip.id]?"✓":""}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,color:checks[tip.id]?C.textLight:C.text,textDecoration:checks[tip.id]?"line-through":"none"}}>{tip.text}</div>
            <div style={{display:"flex",gap:8,marginTop:6}}><Tag color={tip.impact.startsWith("High")?"navy":tip.impact.startsWith("Medium")?"gold":"light"}>{tip.impact}</Tag><span style={{fontSize:11,color:C.gold,fontWeight:700}}>{tip.pts}</span></div>
          </div>
        </div>
      ))}
    </Panel>
  </div>);
};

const SavingsTracker = ({ savingsGoal, setSavingsGoal, user, setUser }) => {
  const [log,setLog]=useState([{date:"2026-07-01",amount:800,note:"July savings"},{date:"2026-06-01",amount:800,note:"June savings"},{date:"2026-05-01",amount:750,note:"May savings"}]);
  const [addAmt,setAddAmt]=useState("");const [addNote,setAddNote]=useState("");
  const pct=Math.min((savingsGoal.saved/savingsGoal.target)*100,100),gap=savingsGoal.target-savingsGoal.saved,months=savingsGoal.monthly>0?Math.ceil(gap/savingsGoal.monthly):"—";
  const addDeposit=()=>{const amt=parseFloat(addAmt);if(!amt)return;setSavingsGoal(g=>({...g,saved:g.saved+amt}));setLog(l=>[{date:new Date().toISOString().slice(0,10),amount:amt,note:addNote||"Deposit"},...l]);setAddAmt("");setAddNote("");if(!user.progressSteps.savings)setUser(u=>({...u,progressSteps:{...u.progressSteps,savings:true}}));};
  return(<div>
    <SectionTitle eyebrow="Tools" lines={["Savings Goal","Tracker."]} sub="Track your progress toward your down payment and closing costs."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:1}}>
      <div>
        <Panel style={{marginBottom:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20}}><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight}}>Down Payment Goal</div><span style={{fontSize:32,fontWeight:700,fontFamily:"Georgia,serif",color:C.gold}}>{pct.toFixed(0)}%</span></div>
          <Bar value={pct} color={C.navy} height={6}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}><span style={{fontSize:13,fontWeight:700,color:C.green}}>{fmt$(savingsGoal.saved)} saved</span><span style={{fontSize:13,color:C.textLight}}>{fmt$(gap)} to go</span></div>
        </Panel>
        <Panel style={{marginBottom:1}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:16}}>Update Goal</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[{key:"target",label:"Target"},{key:"monthly",label:"Monthly"}].map(f=>(
              <div key={f.key}><label style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMid,display:"block",marginBottom:6}}>{f.label}</label><div style={{position:"relative"}}><span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.textLight}}>$</span><input type="number" value={savingsGoal[f.key]} onChange={e=>setSavingsGoal(g=>({...g,[f.key]:parseFloat(e.target.value)||0}))} style={{width:"100%",padding:"10px 10px 10px 24px",border:`1px solid ${C.border}`,fontSize:14,fontFamily:"inherit",boxSizing:"border-box"}}/></div></div>
            ))}
          </div>
        </Panel>
        <Panel>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:16}}>Log a Deposit</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Field label="Amount" value={addAmt} onChange={setAddAmt} prefix="$" type="number"/><Field label="Note" value={addNote} onChange={setAddNote}/></div>
          <PrimaryBtn onClick={addDeposit} disabled={!addAmt}>Add Deposit</PrimaryBtn>
          <div style={{marginTop:24}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:12}}>Recent Activity</div>
            {log.map((entry,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.borderLight}`}}>
                <div><div style={{fontSize:14,fontWeight:700,color:C.navy}}>{fmt$(entry.amount)}</div><div style={{fontSize:12,color:C.textLight}}>{entry.note}</div></div>
                <span style={{fontSize:12,color:C.textLight}}>{entry.date}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:1}}>
        <div style={{padding:"28px",background:C.navy,color:C.white}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",opacity:.5,marginBottom:10}}>Projected Reach Date</div>
          <div style={{fontSize:22,fontWeight:700,fontFamily:"Georgia,serif"}}>{typeof months==="number"?new Date(Date.now()+months*30*24*3600*1000).toLocaleDateString("en-US",{month:"long",year:"numeric"}):"Set a goal"}</div>
          <div style={{fontSize:13,opacity:.55,marginTop:4}}>{typeof months==="number"?`${months} months at ${fmt$(savingsGoal.monthly)}/mo`:""}</div>
        </div>
        <Panel>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:16}}>Milestones</div>
          {[{label:"25% Saved",target:savingsGoal.target*.25},{label:"50% Saved",target:savingsGoal.target*.5},{label:"75% Saved",target:savingsGoal.target*.75},{label:"Goal Reached",target:savingsGoal.target}].map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${C.borderLight}`}}>
              <span style={{fontSize:13,color:savingsGoal.saved>=m.target?C.navy:C.textLight,fontWeight:savingsGoal.saved>=m.target?700:400}}>{m.label}</span>
              {savingsGoal.saved>=m.target?<Tag color="green">✓</Tag>:<span style={{fontSize:12,color:C.textLight}}>{fmt$(m.target)}</span>}
            </div>
          ))}
        </Panel>
        <div style={{padding:"20px 24px",background:C.goldLight,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Employer Match</div>
          <p style={{fontSize:13,color:C.text,margin:0}}>Sinclair offers up to <strong>$5,000</strong> in matching funds. Contact your advisor to unlock.</p>
        </div>
      </div>
    </div>
  </div>);
};

const HousingAssistance = () => {
  const [filter,setFilter]=useState("all");
  const programs=[{id:1,name:"Texas TDHCA Down Payment Assistance",type:"state",tag:"DPA",amount:"Up to $20,000",credit:"620+",first:true,desc:"Down payment and closing cost assistance for Texas residents, offered as a 2nd lien forgivable after 3 years."},{id:2,name:"My First Texas Home",type:"state",tag:"Loan",amount:"5% of loan amount",credit:"620+",first:true,desc:"30-year fixed-rate mortgage with 5% down payment and closing cost assistance for first-time buyers."},{id:3,name:"SETH 5 Star Program",type:"local",tag:"Grant",amount:"Up to 5% of loan",credit:"640+",first:false,desc:"Southeast Texas Housing Finance Corporation grant — does not have to be repaid. Available in Harris and surrounding counties."},{id:4,name:"City of Houston Homebuyer Assistance",type:"local",tag:"Grant",amount:"Up to $30,000",credit:"580+",first:true,desc:"Forgivable grant for Houston residents. Must complete homebuyer education."},{id:5,name:"FHA Loan Program",type:"federal",tag:"Loan",amount:"3.5% minimum down",credit:"580+",first:false,desc:"Federal Housing Administration loan with low down payment and flexible credit requirements."},{id:6,name:"VA Home Loan Benefit",type:"federal",tag:"Benefit",amount:"$0 down payment",credit:"620+",first:false,desc:"For eligible veterans and active-duty service members. No PMI, no down payment required."},{id:7,name:"Sinclair Employer Benefit",type:"employer",tag:"Match",amount:"Up to $5,000",credit:"Any",first:false,desc:"Sinclair's exclusive homeownership benefit — matching funds, closing cost credit, rate discount, and dedicated advisor access."},{id:8,name:"USDA Rural Development Loan",type:"federal",tag:"Loan",amount:"$0 down payment",credit:"640+",first:false,desc:"For homes in eligible rural and suburban areas. No down payment and below-market interest rates."}];
  const filtered=filter==="all"?programs:programs.filter(p=>p.type===filter);
  return(<div>
    <SectionTitle eyebrow="Resources" lines={["Housing Assistance","Finder."]} sub="Down payment assistance programs, grants, and employer benefits available to you."/>
    <div style={{display:"flex",gap:0,marginBottom:32,borderBottom:`2px solid ${C.border}`}}>
      {["all","federal","state","local","employer"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"10px 20px",border:"none",borderBottom:filter===f?`2px solid ${C.gold}`:"2px solid transparent",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"capitalize",color:filter===f?C.navy:C.textLight,marginBottom:-2,transition:"all 0.12s"}}>{f==="all"?"All Programs":f}</button>)}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:1}}>
      {filtered.map(p=>(
        <div key={p.id} style={{padding:"28px 36px",background:C.white,border:`1px solid ${p.type==="employer"?C.gold:C.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:24}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
              <span style={{fontSize:16,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy}}>{p.name}</span>
              <Tag color={p.type==="employer"?"gold":"light"}>{p.tag}</Tag>
              {p.first&&<Tag color="light">First-Time Buyers</Tag>}
            </div>
            <p style={{margin:"0 0 14px",fontSize:13,color:C.textMid,lineHeight:1.7}}>{p.desc}</p>
            <div style={{display:"flex",gap:24}}><span style={{fontSize:12,color:C.textLight}}>Amount: <strong style={{color:C.green}}>{p.amount}</strong></span><span style={{fontSize:12,color:C.textLight}}>Min Credit: <strong style={{color:C.text}}>{p.credit}</strong></span></div>
          </div>
          <GoldBtn small>Learn More</GoldBtn>
        </div>
      ))}
    </div>
  </div>);
};

const EducationCenter = () => {
  const [cat,setCat]=useState("homeownership");const [selected,setSelected]=useState(null);
  const categories=[{id:"homeownership",label:"Homeownership"},{id:"financial",label:"Financial Readiness"},{id:"mortgage",label:"Mortgage Education"},{id:"buying",label:"Buying a Home"},{id:"resources",label:"Resources & Benefits"}];
  const articles={
    homeownership:[{title:"Why Homeownership Builds Wealth",time:"5 min",content:"Homeownership is one of the most powerful wealth-building tools available. Unlike renting, each mortgage payment builds equity — your ownership stake in the property.\n\nAccording to the Federal Reserve, the median homeowner's net worth is roughly 40x that of the average renter. This isn't because homeowners earn more — it's because owning a home forces disciplined saving through equity building.\n\nKey wealth-building mechanisms include property appreciation (historical average 3–5% annually), equity paydown through mortgage payments, tax deductions, and protection against rent increases.\n\nFor Sinclair employees, your employer benefit gives you a meaningful head start — reducing the cash needed upfront and connecting you with competitive financing."},{title:"Renting vs. Buying: The Real Math",time:"7 min",content:"The rent vs. buy decision is one of the most important financial choices you'll make.\n\nThe break-even horizon is how long you need to stay before buying beats renting. In most Texas markets, this is 3–5 years. If you plan to stay longer, buying almost always wins financially.\n\nRenting advantages: Flexibility, no maintenance costs, lower upfront cost.\n\nBuying advantages: Equity building, fixed payment vs. rising rent, tax benefits, appreciation, freedom to customize.\n\nIn Houston: Median rent is approximately $1,850/month. A $300,000 home at 7% with 10% down is roughly $2,100/month all-in. But $400+ of that payment builds equity each month, and you're protected from rent increases permanently."},{title:"The Emotional Side of Homeownership",time:"4 min",content:"Research consistently shows that homeowners report higher levels of life satisfaction, community involvement, and stability — not just financial security.\n\nHomeownership gives you the freedom to paint your walls, plant a garden, and truly make a space your own. These aren't small things — they contribute to a sense of belonging and identity.\n\nIt also creates intergenerational wealth. Homes can be passed down, used as collateral, or provide rental income in later years. Your first home purchase is more than a transaction — it's a foundation."}],
    financial:[{title:"Understanding Debt-to-Income Ratio",time:"5 min",content:"Your debt-to-income ratio (DTI) is one of the most important factors lenders use to qualify you for a mortgage. It compares your monthly debt payments to your gross monthly income.\n\nFront-end DTI: Your future housing payment divided by gross monthly income. Most lenders want this below 28–31%.\n\nBack-end DTI: All monthly debts divided by gross monthly income. Most conventional loans require below 43–45%.\n\nHow to improve your DTI: Pay off or pay down debts, avoid taking on new debt, increase your income, or purchase a less expensive home."},{title:"Building an Emergency Fund First",time:"4 min",content:"Before you buy a home, you need an emergency fund separate from your down payment savings. Homeownership comes with unexpected costs: HVAC system ($5,000–$15,000), roof repair ($3,000–$10,000), plumbing issues, appliance failures.\n\nAim for 3–6 months of expenses in a liquid savings account, plus a home maintenance fund of 1–2% of home value per year.\n\nThe rule: Never drain your emergency fund for a down payment. Lenders want to see reserves — typically 2 months of mortgage payments — even after closing."},{title:"How Savings Rate Impacts Your Timeline",time:"3 min",content:"The single biggest lever you control is how much you save each month.\n\nSaving $500/month reaches a $25,000 goal in 50 months. Saving $1,000/month reaches it in 25 months. Saving $1,500/month gets you there in under 17 months.\n\nStrategies to accelerate: apply your tax refund, pursue side income, pause discretionary spending for 6 months, and utilize the Sinclair employer match to close the gap faster."}],
    mortgage:[{title:"Fixed vs. Adjustable Rate Mortgages",time:"6 min",content:"Fixed-Rate Mortgage: Your interest rate stays the same for the entire loan term. Your payment never changes. Predictability is the main advantage.\n\nAdjustable-Rate Mortgage (ARM): Starts with a fixed rate for an initial period (5, 7, or 10 years), then adjusts annually. ARMs typically start lower — useful if you plan to sell or refinance before adjustment.\n\nFor most Sinclair employees with long-term stability, a 30-year fixed is the most common and safest choice."},{title:"What Is PMI and How Do You Avoid It?",time:"4 min",content:"Private Mortgage Insurance (PMI) is required when you put less than 20% down on a conventional loan. It protects the lender — not you.\n\nCost: Typically 0.5%–1.5% of loan amount per year. On a $320,000 loan, that's $133–$400/month.\n\nHow to avoid PMI: Put 20% down. Use a piggyback loan. Request cancellation when you reach 20% equity.\n\nPMI isn't always bad: Getting into a home now while values rise may build equity faster than saving the full 20%."},{title:"Pre-Qualification vs. Pre-Approval",time:"3 min",content:"Pre-Qualification: A quick estimate based on self-reported information. No credit pull. Holds little weight with sellers.\n\nPre-Approval: A full underwritten review of your income, assets, debts, and credit. Results in a letter stating the exact loan amount you're approved for.\n\nGet pre-approved before seriously shopping. It strengthens your offer, speeds closing, and helps you shop in the right price range. Your Sinclair advisor, Yves Ozoude, can start your pre-approval — often same-day."}],
    buying:[{title:"The Home Buying Process: Step by Step",time:"8 min",content:"1. Get pre-approved — Know your budget before you shop.\n2. Hire a buyer's agent — Represents your interests, typically free to you.\n3. Shop for homes — Tour homes in your price range and target neighborhoods.\n4. Make an offer — Your agent writes a purchase offer with price, contingencies, and timeline.\n5. Negotiate — Seller may counter. You accept, counter, or walk away.\n6. Under contract — Both parties agree.\n7. Home inspection — A licensed inspector reviews the property.\n8. Appraisal — Your lender orders an appraisal to confirm value.\n9. Final underwriting — Lender reviews everything.\n10. Clear to close — All conditions met.\n11. Closing day — You sign, pay, and receive the keys."},{title:"How to Make a Competitive Offer",time:"5 min",content:"In competitive markets, how you write an offer matters as much as the price.\n\nPrice strategy: Know comparable sales. In competitive areas, offer at or above asking. Escalation clauses can automatically outbid competing offers up to a ceiling.\n\nEarnest money: A larger deposit (2–3% vs. 1%) signals seriousness.\n\nContingencies: Fewer contingencies make your offer cleaner. But never waive the inspection — it is critical protection.\n\nAlways include a strong, lender-specific pre-approval letter."}],
    resources:[{title:"Understanding Your Sinclair Benefit",time:"5 min",content:"Sinclair has partnered with United Home Mortgage to offer employees an exclusive housing financial wellness benefit.\n\nEmployer Match: Up to $5,000 in matching funds toward your down payment or closing costs.\n\nRate Discount: A below-market interest rate through UHM, exclusive to Sinclair employees.\n\nClosing Cost Credit: A $500 credit applied at closing.\n\nDedicated Advisor: Direct access to Yves Ozoude (NMLS #1857419).\n\nHow to activate: Complete your readiness assessment and schedule a consultation. Your advisor will verify employment and activate your benefit package.\n\nEligibility: All full-time Sinclair employees after 90 days of employment."},{title:"Texas-Specific Homebuying Resources",time:"4 min",content:"Texas has some of the strongest state-level homebuyer assistance programs in the country.\n\nTDHCA: Administers the My First Texas Home program, offering down payment assistance as a 2nd lien loan.\n\nTexas Veterans Land Board: Zero down payment loans and below-market rates for Texas veterans.\n\nHarris County Downpayment Assistance: For homes in unincorporated Harris County.\n\nCity of Houston Housing Finance Corporation: Direct assistance for Houston city limits residents.\n\nYour Sinclair advisor can help identify which programs you qualify for and stack them with your employer benefit for maximum impact."}],
  };
  const currentArticles=articles[cat]||[];
  if(selected)return(<div>
    <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:C.gold,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",letterSpacing:"0.06em",marginBottom:28,padding:0}}>← Education Center</button>
    <Panel style={{maxWidth:720}}>
      <Eyebrow>{categories.find(c=>c.id===cat)?.label}</Eyebrow>
      <h1 style={{fontSize:30,fontWeight:400,fontFamily:"Georgia,serif",color:C.navy,margin:"0 0 6px"}}>{selected.title}</h1>
      <div style={{fontSize:12,color:C.textLight,marginBottom:24}}>{selected.time} read</div>
      <GoldRule/>
      {selected.content.split("\n\n").map((para,i)=><p key={i} style={{fontSize:15,color:C.textMid,lineHeight:1.8,marginBottom:16}}>{para}</p>)}
    </Panel>
  </div>);
  return(<div>
    <SectionTitle eyebrow="For Employees" lines={["Education","Center."]} sub="Everything you need to know about homebuying, mortgages, and financial readiness."/>
    <div style={{marginBottom:32}}>
      {categories.map(c=><ArrowLink key={c.id} label={c.label} onClick={()=>setCat(c.id)} active={cat===c.id}/>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1}}>
      {currentArticles.map((article,i)=>(
        <div key={i} onClick={()=>setSelected(article)} style={{padding:"32px 36px",background:C.white,border:`1px solid ${C.border}`,cursor:"pointer",transition:"all 0.12s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.background=C.goldLight;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.white;}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textLight,marginBottom:12}}>{categories.find(c=>c.id===cat)?.label} · {article.time} read</div>
          <h3 style={{margin:"0 0 12px",fontSize:18,fontWeight:400,fontFamily:"Georgia,serif",color:C.navy}}>{article.title}</h3>
          <p style={{margin:"0 0 20px",fontSize:13,color:C.textMid,lineHeight:1.7}}>{article.content.slice(0,130)}...</p>
          <span style={{fontSize:13,color:C.gold,fontWeight:700}}>Read article →</span>
        </div>
      ))}
    </div>
  </div>);
};

const ResourceLibrary = () => {
  const [tab,setTab]=useState("guides");
  const guides=[{title:"First-Time Homebuyer Complete Guide",desc:"Everything from credit to closing in one comprehensive guide.",pages:24},{title:"Down Payment Assistance in Texas",desc:"State, federal, and local programs available to Texas buyers.",pages:12},{title:"Understanding Your Credit Report",desc:"How to read, dispute, and improve your credit profile.",pages:8},{title:"Mortgage Comparison Worksheet",desc:"Compare loan offers side by side with this structured template.",pages:4}];
  const checklists=[{title:"Pre-Application Checklist",items:18,desc:"Documents you'll need before applying for a mortgage."},{title:"Home Inspection Checklist",items:42,desc:"What to look for during a professional home inspection."},{title:"Closing Day Checklist",items:12,desc:"Everything to bring and verify on closing day."},{title:"New Homeowner 90-Day Checklist",items:28,desc:"First 3 months in your new home."}];
  const faqs=[{q:"How much down payment do I really need?",a:"As little as 3–3.5% with FHA or conventional loans. The Sinclair employer benefit can cover a significant portion. The more you put down, the lower your monthly payment and the faster you build equity."},{q:"How long does the mortgage process take?",a:"Typically 30–45 days from application to closing. Your pre-approval can take 1–3 business days. Having all documents ready speeds the process significantly."},{q:"Can I buy with less than perfect credit?",a:"Yes. FHA loans accept scores as low as 580. Conventional loans typically require 620+. The Sinclair benefit works with most credit profiles — your advisor can review your specific situation."},{q:"What if I'm self-employed?",a:"Self-employed buyers can qualify using 2 years of tax returns, profit and loss statements, and bank statements. It is more documentation but very common."},{q:"Does my employer benefit expire?",a:"The Sinclair Housing Wellness Benefit is available to eligible employees year-round. Program availability and incentive amounts may change — speak to your advisor to confirm current terms."}];
  return(<div>
    <SectionTitle eyebrow="Resources" lines={["Resource","Library."]} sub="Guides, checklists, downloadable PDFs, and answers to common questions."/>
    <div style={{display:"flex",gap:0,marginBottom:32,borderBottom:`2px solid ${C.border}`}}>
      {["guides","checklists","faqs"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 24px",border:"none",borderBottom:tab===t?`2px solid ${C.gold}`:"2px solid transparent",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:tab===t?C.navy:C.textLight,marginBottom:-2,transition:"all 0.12s"}}>{t==="faqs"?"FAQs":t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
    </div>
    {tab==="guides"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1}}>{guides.map((g,i)=><div key={i} style={{padding:"32px 36px",background:C.white,border:`1px solid ${C.border}`}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:12}}>PDF Guide · {g.pages} pages</div><h3 style={{margin:"0 0 10px",fontSize:17,fontWeight:400,fontFamily:"Georgia,serif",color:C.navy}}>{g.title}</h3><p style={{margin:"0 0 20px",fontSize:13,color:C.textMid}}>{g.desc}</p><GoldBtn small>Download →</GoldBtn></div>)}</div>}
    {tab==="checklists"&&<div style={{display:"flex",flexDirection:"column",gap:1}}>{checklists.map((c,i)=><div key={i} style={{padding:"24px 36px",background:C.white,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h3 style={{margin:"0 0 4px",fontSize:16,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy}}>{c.title}</h3><p style={{margin:0,fontSize:13,color:C.textMid}}>{c.desc}</p></div><div style={{display:"flex",gap:16,alignItems:"center",flexShrink:0}}><Tag color="light">{c.items} items</Tag><GoldBtn small>View →</GoldBtn></div></div>)}</div>}
    {tab==="faqs"&&<div style={{display:"flex",flexDirection:"column",gap:1}}>{faqs.map((f,i)=><div key={i} style={{padding:"28px 36px",background:C.white,border:`1px solid ${C.border}`}}><div style={{fontSize:15,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy,marginBottom:10}}>Q: {f.q}</div><div style={{fontSize:14,color:C.textMid,lineHeight:1.7}}>{f.a}</div></div>)}</div>}
  </div>);
};

const Consultation = ({ user, setUser }) => {
  const [form,setForm]=useState({name:user.name,email:user.email,phone:"",topic:"getting-started",message:"",time:""});
  const [submitted,setSubmitted]=useState(false);
  const topics=[{value:"getting-started",label:"Getting Started"},{value:"pre-approval",label:"Get Pre-Approved"},{value:"down-payment",label:"Down Payment Assistance"},{value:"credit",label:"Credit Improvement"},{value:"construction",label:"Construction-to-Permanent Loan"},{value:"employer-benefit",label:"Understanding My Employer Benefit"},{value:"refinance",label:"Refinance My Mortgage"},{value:"other",label:"Other"}];
  if(submitted)return(<div>
    <SectionTitle eyebrow="Schedule a Consultation" lines={["Request","Received."]}/>
    <Panel style={{maxWidth:600,textAlign:"center",padding:"56px 48px"}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.green,marginBottom:16}}>✓ Confirmed</div>
      <p style={{fontSize:16,color:C.textMid,lineHeight:1.7,marginBottom:32}}>Yves Ozoude will contact you within 1 business day to confirm your consultation time.</p>
      <div style={{padding:"24px 32px",background:C.offWhite,border:`1px solid ${C.border}`,textAlign:"left",display:"inline-block"}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:8}}>Your Advisor</div>
        <div style={{fontSize:18,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy}}>Yves Ozoude</div>
        <div style={{fontSize:13,color:C.textMid}}>NMLS #1857419 · United Home Mortgage</div>
        <div style={{fontSize:13,color:C.gold,marginTop:4}}>YOzoude@UHM.com</div>
        <div style={{fontSize:13,color:C.textMid}}>713-931-0655</div>
      </div>
      <div style={{marginTop:32}}><GoldBtn onClick={()=>setSubmitted(false)}>Schedule Another →</GoldBtn></div>
    </Panel>
  </div>);
  return(<div>
    <SectionTitle eyebrow="Schedule a Consultation" lines={["Your home.","Your future.","Our support."]} sub="Connect directly with your dedicated Sinclair housing advisor — at no cost to you."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:1}}>
      <Panel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Field label="Full Name" value={form.name} onChange={v=>setForm({...form,name:v})}/><Field label="Email Address" value={form.email} onChange={v=>setForm({...form,email:v})} type="email"/></div>
        <Field label="Phone Number" value={form.phone} onChange={v=>setForm({...form,phone:v})} type="tel"/>
        <Dropdown label="What would you like to discuss?" value={form.topic} onChange={v=>setForm({...form,topic:v})} options={topics}/>
        <Dropdown label="Preferred Time" value={form.time} onChange={v=>setForm({...form,time:v})} options={[{value:"",label:"Select a preference"},{value:"morning",label:"Morning (8am–12pm)"},{value:"afternoon",label:"Afternoon (12pm–5pm)"},{value:"evening",label:"Evening (5pm–7pm)"}]}/>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMid,display:"block",marginBottom:8}}>Message (optional)</label>
          <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Any details that would help us prepare..." style={{width:"100%",padding:"11px 14px",border:`1px solid ${C.border}`,fontSize:14,fontFamily:"inherit",resize:"vertical",minHeight:100,boxSizing:"border-box",color:C.text}}/>
        </div>
        <PrimaryBtn onClick={()=>{setSubmitted(true);setUser(u=>({...u,progressSteps:{...u.progressSteps,consultation:true}}));}} disabled={!form.name||!form.email}>Request Consultation</PrimaryBtn>
      </Panel>
      <div style={{display:"flex",flexDirection:"column",gap:1}}>
        <div style={{padding:"32px 28px",background:C.navy,color:C.white}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18,marginBottom:16}}>YO</div>
          <div style={{fontSize:18,fontWeight:700,fontFamily:"Georgia,serif"}}>Yves Ozoude</div>
          <div style={{fontSize:12,opacity:.6,marginBottom:16}}>NMLS #1857419 · UHM</div>
          <div style={{fontSize:13,opacity:.8,marginBottom:4}}>YOzoude@UHM.com</div>
          <div style={{fontSize:13,opacity:.8}}>713-931-0655</div>
        </div>
        <Panel>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:14}}>What to Expect</div>
          {["Free 30-minute consultation","No pressure, no obligation","Review your readiness score together","Discuss employer benefit options","Get a personalized action plan","Pre-approval if you're ready"].map((item,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.borderLight}`,fontSize:13,color:C.textMid}}><span style={{color:C.gold}}>→</span>{item}</div>
          ))}
        </Panel>
      </div>
    </div>
  </div>);
};

const EmployerBenefits = () => {
  const [faqOpen,setFaqOpen]=useState(null);
  const faqs=[{q:"Who is eligible for this benefit?",a:"All full-time Sinclair employees after 90 days of employment. Part-time employees working 30+ hours per week may also qualify."},{q:"How does the $5,000 employer match work?",a:"Sinclair will match qualifying employees' down payment savings dollar-for-dollar up to $5,000, applied at closing and funded directly to the title company."},{q:"Can I use this benefit if I already own a home?",a:"The down payment match is for home purchases only. However, you can still access the dedicated advisor, the rate discount, and all educational resources."},{q:"Is there a limit on home price?",a:"The benefit applies to any home within conforming loan limits (currently $766,550 in most Texas counties). Jumbo loans may still qualify for the rate discount."},{q:"Does this benefit affect my other employee benefits?",a:"No. The housing wellness benefit is completely separate from health, retirement, and other HR benefits."},{q:"What happens if I leave Sinclair before closing?",a:"If you leave before your home purchase closes, the employer match may be forfeited depending on timing. Consultation services remain active for 60 days after employment ends."}];
  return(<div>
    <SectionTitle eyebrow="For Employees" lines={["Stronger employees.","Stronger communities.","Stronger futures."]} sub="Your complete guide to the Sinclair Employee Housing Financial Wellness Benefit™"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,marginBottom:1}}>
      {[{label:"Employer Match",value:"Up to $5,000",desc:"Dollar-for-dollar match at closing",dark:true},{label:"Rate Discount",value:"0.25% below market",desc:"Exclusive UHM pricing",dark:true},{label:"Closing Credit",value:"$500",desc:"Applied directly at closing",dark:true},{label:"Dedicated Advisor",value:"Free",desc:"Yves Ozoude, NMLS #1857419",dark:false},{label:"Education Access",value:"Unlimited",desc:"Full portal and resource library",dark:false},{label:"Priority Processing",value:"Fast-Track",desc:"Expedited underwriting for employees",dark:false}].map((b,i)=>(
        <div key={i} style={{padding:"32px 28px",background:b.dark?C.navy:C.white,color:b.dark?C.white:C.navy,border:`1px solid ${C.border}`,textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:b.dark?"rgba(255,255,255,0.5)":C.textLight,marginBottom:10}}>{b.label}</div>
          <div style={{fontSize:22,fontWeight:700,fontFamily:"Georgia,serif",color:b.dark?C.gold:C.navy,marginBottom:6}}>{b.value}</div>
          <div style={{fontSize:12,color:b.dark?"rgba(255,255,255,0.65)":C.textLight}}>{b.desc}</div>
        </div>
      ))}
    </div>
    <Panel>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:24}}>Benefit FAQs</div>
      {faqs.map((f,i)=>(
        <div key={i} style={{border:`1px solid ${C.border}`,marginBottom:4}}>
          <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"18px 24px",border:"none",background:faqOpen===i?C.goldLight:C.white,textAlign:"left",cursor:"pointer",fontFamily:"inherit",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:15,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy}}>{f.q}</span>
            <span style={{color:C.gold,fontSize:20,flexShrink:0,marginLeft:16}}>{faqOpen===i?"−":"+"}</span>
          </button>
          {faqOpen===i&&<div style={{padding:"0 24px 20px",background:C.goldLight}}><p style={{margin:0,fontSize:13,color:C.textMid,lineHeight:1.7}}>{f.a}</p></div>}
        </div>
      ))}
    </Panel>
  </div>);
};

const Profile = ({ user, profile, setProfile }) => {
  const [editing,setEditing]=useState(false);const [form,setForm]=useState(profile);const [saved,setSaved]=useState(false);
  const doneCount=Object.values(user.progressSteps).filter(Boolean).length;
  const handleSave=()=>{setProfile(form);setEditing(false);setSaved(true);setTimeout(()=>setSaved(false),2500);};
  return(<div>
    <SectionTitle eyebrow="Account" lines={["My","Profile."]}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:1}}>
      <div>
        <Panel style={{marginBottom:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight}}>Personal Information</div>
            {!editing?<GoldBtn small onClick={()=>setEditing(true)}>Edit</GoldBtn>:<div style={{display:"flex",gap:8}}><GoldBtn small onClick={()=>{setForm(profile);setEditing(false);}}>Cancel</GoldBtn><PrimaryBtn small onClick={handleSave}>Save</PrimaryBtn></div>}
          </div>
          {saved&&<div style={{padding:"10px 14px",background:C.greenSoft,fontSize:13,color:C.green,fontWeight:700,marginBottom:16}}>✓ Profile saved</div>}
          {editing?(
            <div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Field label="Phone" value={form.phone} onChange={v=>setForm({...form,phone:v})}/><Field label="City" value={form.city} onChange={v=>setForm({...form,city:v})}/><Field label="State" value={form.state} onChange={v=>setForm({...form,state:v})}/></div><Dropdown label="Preferred Contact" value={form.preferredContact} onChange={v=>setForm({...form,preferredContact:v})} options={[{value:"email",label:"Email"},{value:"phone",label:"Phone"},{value:"text",label:"Text Message"}]}/></div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px 32px"}}>
              {[{label:"Full Name",value:user.name},{label:"Email",value:user.email},{label:"Employer",value:user.employer},{label:"Department",value:user.department},{label:"Phone",value:profile.phone},{label:"Location",value:`${profile.city}, ${profile.state}`},{label:"Preferred Contact",value:profile.preferredContact}].map((item,i)=>(
                <div key={i}><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:4}}>{item.label}</div><div style={{fontSize:14,color:C.text}}>{item.value}</div></div>
              ))}
            </div>
          )}
        </Panel>
        <Panel>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:20}}>Communication Preferences</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:14,fontWeight:600,color:C.text}}>Email Notifications</div><div style={{fontSize:12,color:C.textLight}}>Receive updates about your readiness score, new programs, and benefit changes</div></div>
            <div onClick={()=>setForm(f=>({...f,notifications:!f.notifications}))} style={{width:44,height:24,borderRadius:99,cursor:"pointer",background:form.notifications?C.navy:C.border,position:"relative",transition:"background 0.2s",flexShrink:0,marginLeft:16}}>
              <div style={{position:"absolute",top:3,left:form.notifications?22:2,width:18,height:18,borderRadius:"50%",background:C.white,transition:"left 0.2s"}}/>
            </div>
          </div>
        </Panel>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:1}}>
        <div style={{padding:"32px 28px",background:C.navy,color:C.white,textAlign:"center"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:22,margin:"0 auto 16px"}}>{user.name.split(" ").map(n=>n[0]).join("")}</div>
          <div style={{fontSize:18,fontWeight:700,fontFamily:"Georgia,serif"}}>{user.name}</div>
          <div style={{fontSize:12,opacity:.6,marginTop:4}}>{user.employer}</div>
        </div>
        <Panel>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:16}}>Progress History</div>
          {Object.entries(user.progressSteps).map(([key,done])=>(
            <div key={key} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.borderLight}`}}>
              <div style={{width:18,height:18,border:`1.5px solid ${done?C.navy:C.border}`,background:done?C.navy:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:10,flexShrink:0}}>{done?"✓":""}</div>
              <span style={{fontSize:13,color:done?C.text:C.textLight,textTransform:"capitalize"}}>{key.replace(/([A-Z])/g," $1")}</span>
            </div>
          ))}
          <div style={{marginTop:16,fontSize:13,color:C.textLight}}><strong style={{color:C.navy}}>{doneCount}</strong> of {Object.keys(user.progressSteps).length} steps completed</div>
        </Panel>
        <Panel><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:8}}>Readiness Score</div><div style={{fontSize:48,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy,lineHeight:1}}>{user.readinessScore}</div><div style={{fontSize:12,color:C.textLight,marginBottom:12}}>out of 100</div><Bar value={user.readinessScore} color={C.gold} height={4}/></Panel>
      </div>
    </div>
  </div>);
};

const Privacy = ({ consent, setConsent }) => {
  const [checked,setChecked]=useState({voluntary:false,data:false,privacy:false});
  const allChecked=Object.values(checked).every(Boolean);
  return(<div>
    <SectionTitle eyebrow="Privacy & Consent" lines={["Your data.","Your rights.","Your choice."]} sub="Your participation is voluntary and your information is protected."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:1}}>
      <div>
        {consent.given?(
          <div style={{padding:"28px 36px",background:C.greenSoft,border:`1px solid ${C.green}`,marginBottom:1}}><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.green,marginBottom:4}}>✓ Consent on File</div><div style={{fontSize:14,color:C.textMid}}>Provided on {new Date(consent.date).toLocaleDateString()}</div></div>
        ):(
          <Panel style={{marginBottom:1}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:20}}>Your Consent</div>
            {[{key:"voluntary",text:"I understand that participation in the Sinclair Employee Housing Financial Wellness Benefit™ is completely voluntary and is not a condition of my employment."},{key:"data",text:"I consent to sharing my assessment responses and benefit usage data with Sinclair HR in aggregate, anonymized form only. My individual financial information will not be shared with my employer."},{key:"privacy",text:"I have read and agree to the Privacy Policy and Terms of Use governing this portal and the associated benefit services provided by United Home Mortgage."}].map(item=>(
              <div key={item.key} onClick={()=>setChecked(c=>({...c,[item.key]:!c[item.key]}))} style={{display:"flex",gap:14,padding:"16px 0",borderBottom:`1px solid ${C.borderLight}`,cursor:"pointer"}}>
                <div style={{width:18,height:18,border:`1.5px solid ${checked[item.key]?C.navy:C.border}`,background:checked[item.key]?C.navy:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,color:C.white,fontSize:10,fontWeight:700}}>{checked[item.key]?"✓":""}</div>
                <p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.7}}>{item.text}</p>
              </div>
            ))}
            <div style={{marginTop:24}}><PrimaryBtn onClick={()=>setConsent({given:true,date:new Date().toISOString()})} disabled={!allChecked}>Provide Consent & Activate Benefit</PrimaryBtn>{!allChecked&&<p style={{fontSize:12,color:C.textLight,marginTop:8}}>Please check all three boxes to continue.</p>}</div>
          </Panel>
        )}
        <Panel>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:20}}>Privacy Policy Summary</div>
          {[{title:"What We Collect",text:"Assessment responses, calculator inputs, education engagement, and consultation requests. We do not collect Social Security numbers, bank account numbers, or credit card details through this portal."},{title:"How We Use It",text:"To personalize your homebuying action plan, improve the portal experience, and connect you with your dedicated mortgage advisor when you request a consultation."},{title:"Who Sees Your Data",text:"Your individual financial details are never shared with Sinclair HR. Aggregate, anonymous usage data may be shared for benefit reporting."},{title:"Your Rights",text:"You can request to view, correct, or delete your data at any time by contacting YOzoude@UHM.com. You can withdraw consent at any time with no consequence to your employment."}].map((s,i)=>(
            <div key={i} style={{marginBottom:20,paddingBottom:20,borderBottom:i<3?`1px solid ${C.borderLight}`:"none"}}><div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:6}}>{s.title}</div><p style={{margin:0,fontSize:13,color:C.textMid,lineHeight:1.7}}>{s.text}</p></div>
          ))}
        </Panel>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:1}}>
        <div style={{padding:"32px 28px",background:C.navy,color:C.white}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",opacity:.5,marginBottom:14}}>Your Rights</div>
          {["Participation is 100% voluntary","Your employer cannot see your individual data","No credit pull without your authorization","Cancel at any time, no consequences","All data encrypted in transit and at rest"].map((r,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid rgba(255,255,255,0.08)`,fontSize:13,opacity:.8}}><span style={{color:C.gold,flexShrink:0}}>→</span>{r}</div>
          ))}
        </div>
        <Panel><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textLight,marginBottom:10}}>Questions?</div><div style={{fontSize:14,fontWeight:700,fontFamily:"Georgia,serif",color:C.navy}}>Yves Ozoude</div><div style={{fontSize:13,color:C.gold}}>YOzoude@UHM.com</div><div style={{fontSize:13,color:C.textMid}}>713-931-0655</div></Panel>
      </div>
    </div>
  </div>);
};

const AdminDashboard = () => {
  const [tab,setTab]=useState("overview");
  const stats=[{label:"Total Employees",value:"847",change:"+12 this month"},{label:"Active Users",value:"312",change:"37% adoption rate"},{label:"Consultations",value:"64",change:"+8 this week"},{label:"Avg Score",value:"58",change:"+4 pts from last month"}];
  const employees=[{name:"Sarah Johnson",dept:"Operations",score:62,steps:1,status:"Active"},{name:"Marcus Williams",dept:"Finance",score:81,steps:4,status:"Pre-approved"},{name:"Linda Chen",dept:"HR",score:44,steps:1,status:"Getting Started"},{name:"David Torres",dept:"Engineering",score:73,steps:3,status:"Active"},{name:"Aisha Patel",dept:"Operations",score:90,steps:5,status:"Closing Soon"}];
  return(<div>
    <SectionTitle eyebrow="Admin" lines={["Admin","Dashboard."]}/>
    <div style={{display:"flex",gap:0,marginBottom:32,borderBottom:`2px solid ${C.border}`}}>
      {["overview","employees","content","settings"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 24px",border:"none",borderBottom:tab===t?`2px solid ${C.gold}`:"2px solid transparent",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"capitalize",color:tab===t?C.navy:C.textLight,marginBottom:-2,transition:"all 0.12s"}}>{t}</button>)}
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
