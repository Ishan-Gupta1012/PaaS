"use client";

import React, { useState, useEffect } from "react";

const C = {
  bg: "#09090B",
  surface: "#111113",
  card: "#16161A",
  border: "rgba(255,255,255,0.06)",
  text: "#FFFFFF",
  secondary: "#A1A1AA",
  muted: "#71717A",
  accent: "#2DD4BF",
  accentBg: "rgba(45,212,191,0.08)",
  accentBorder: "rgba(45,212,191,0.2)",
};

const ROLES = ["Developer.", "Designer.", "Engineer.", "Creator."];

const PROJECTS = [
  {
    id: "01",
    title: "Neural Portfolio Generator",
    period: "January 2024 — Present",
    tech: ["Next.js", "Python", "OpenAI", "PostgreSQL"],
    bullets: [
      "Architected an AI-driven pipeline that auto-generates developer portfolios from GitHub activity — 10x faster setup than manual configuration for 2,000+ early adopters.",
      "Integrated GPT-4 to synthesise bespoke project descriptions, reducing cold-start friction and increasing conversion by 38%.",
    ],
  },
  {
    id: "02",
    title: "Distributed Task Orchestrator",
    period: "June 2023 — December 2023",
    tech: ["Go", "Kafka", "Redis", "K8s"],
    bullets: [
      "Designed a fault-tolerant task queue processing 500K jobs/day across 40 worker nodes with sub-100 ms median latency.",
      "Implemented circuit breaker patterns that reduced cascading failures by 94% in production across three AWS regions.",
    ],
  },
  {
    id: "03",
    title: "Real-Time Collaboration Engine",
    period: "January 2023 — May 2023",
    tech: ["WebSockets", "CRDT", "React", "Elixir"],
    bullets: [
      "Built a CRDT engine enabling 50+ simultaneous cursors with zero merge conflicts, comparable to Figma multiplayer.",
      "Achieved 99.98% uptime across six global regions using Elixir OTP supervision trees and blue-green deployments.",
    ],
  },
];

const EXPERIENCE = [
  { period: "2024 - Present", role: "Senior Software Engineer", company: "Vercel", location: "Remote, USA" },
  { period: "2022 - 2024",   role: "Software Engineer II",      company: "Stripe",  location: "San Francisco, CA" },
  { period: "2020 - 2022",   role: "Frontend Engineer",         company: "Microsoft", location: "Seattle, WA" },
];

const ACHIEVEMENTS = [
  { id: "01", title: "MACHINE LEARNING ENGINEERING", org: "DeepLearning.AI", year: "APR 2024" },
  { id: "02", title: "KUBERNETES ADMINISTRATOR (CKA)", org: "Cloud Native Foundation", year: "JAN 2024" },
  { id: "03", title: "AWS SOLUTIONS ARCHITECT PRO", org: "Amazon Web Services", year: "SEP 2023" },
];

const SKILLS = ["TypeScript","React","Next.js","Go","Rust","Python","PostgreSQL","Redis","Kubernetes","Docker","AWS","GraphQL"];
const NAV = [{id:"home",label:"Home"},{id:"projects",label:"Projects"},{id:"experience",label:"Experience"},{id:"achievements",label:"Achievements"},{id:"contact",label:"Contact"}];

function EchoHeading({ text }: { text: string }) {
  return (
    <div style={{ position: "relative", marginBottom: "56px", paddingTop: "16px", userSelect: "none" }}>
      <span aria-hidden="true" style={{ position: "absolute", top: "-10px", left: "-2px", fontSize: "78px", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1px rgba(45,212,191,0.07)", pointerEvents: "none", whiteSpace: "nowrap" }}>{text}</span>
      <h2 style={{ position: "relative", fontSize: "40px", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#2DD4BF", margin: 0 }}>{text}</h2>
    </div>
  );
}

export default function SoftwareEngineerTemplate() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    if (isPaused) { const t = setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, 2200); return () => clearTimeout(t); }
    if (isDeleting && displayText === "") { setIsDeleting(false); setRoleIndex(i => (i + 1) % ROLES.length); return; }
    if (!isDeleting && displayText === current) { setIsPaused(true); return; }
    const t = setTimeout(() => setDisplayText(p => isDeleting ? p.slice(0, -1) : current.slice(0, p.length + 1)), isDeleting ? 55 : 105);
    return () => clearTimeout(t);
  }, [displayText, isDeleting, isPaused, roleIndex]);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 50);
      const offset = window.scrollY + 140;
      for (const { id } of NAV) {
        const el = document.getElementById(id);
        if (el && offset >= el.offsetTop && offset < el.offsetTop + el.offsetHeight) setActiveSection(id);
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSent(true);
      setTimeout(() => { setFormData({ name: "", email: "", message: "" }); setFormSent(false); }, 3500);
    }
  };

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes se-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .se-cur { display:inline-block; width:3px; height:.85em; background:#2DD4BF; margin-left:4px; vertical-align:middle; border-radius:1px; animation:se-blink 1s step-end infinite; }
        @keyframes se-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .se-f1{opacity:0;animation:se-up .65s ease .1s forwards}
        .se-f2{opacity:0;animation:se-up .65s ease .25s forwards}
        .se-f3{opacity:0;animation:se-up .65s ease .4s forwards}
        .se-f4{opacity:0;animation:se-up .65s ease .55s forwards}
        .se-f5{opacity:0;animation:se-up .65s ease .7s forwards}
        @keyframes se-ring-a { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes se-ring-b { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        .r1{animation:se-ring-a 10s linear infinite}
        .r2{animation:se-ring-b 16s linear infinite}
        .r3{animation:se-ring-a 24s linear infinite}
        @keyframes se-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .se-fl{animation:se-float 4s ease-in-out infinite}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#09090B}
        ::-webkit-scrollbar-thumb{background:rgba(45,212,191,.25);border-radius:2px}
        input:-webkit-autofill,textarea:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px #0D0D10 inset!important;-webkit-text-fill-color:#fff!important}
        .se-input{width:100%;padding:12px 16px;border-radius:12px;font-size:14px;font-family:inherit;background:#0D0D10;border:1px solid rgba(255,255,255,.08);color:#fff;outline:none;transition:border-color .2s,box-shadow .2s}
        .se-input::placeholder{color:#3F3F46}
        .se-input:focus{border-color:rgba(45,212,191,.4);box-shadow:0 0 0 3px rgba(45,212,191,.08)}
        .se-ach{display:flex;gap:20px;padding:20px;border-radius:16px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);transition:border-color .25s,transform .25s}
        .se-ach:hover{border-color:rgba(45,212,191,.2);transform:translateY(-2px)}
        .se-nav-a{font-size:14px;font-weight:500;text-decoration:none;transition:color .2s}
        .se-pr{position:relative;padding:28px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer}
        .se-pr::before{content:'';position:absolute;inset:0;border-radius:16px;background:rgba(45,212,191,.03);opacity:0;transition:opacity .25s;margin:0 -20px}
        .se-pr:hover::before{opacity:1}
        @media(max-width:768px){.se-r{display:none!important}.se-g2{grid-template-columns:1fr!important}.se-dn{display:none!important}}
      `}</style>

      {/* NAV */}
      <header style={{ position:"fixed", top:"44px", left:0, right:0, zIndex:100, height:"72px", display:"flex", alignItems:"center", transition:"background .3s,border .3s,backdrop-filter .3s", backgroundColor:scrolled?"rgba(9,9,11,.88)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", WebkitBackdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?"1px solid rgba(255,255,255,.06)":"1px solid transparent" }}>
        <div style={{ maxWidth:"1140px", width:"100%", margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"34px", height:"34px", borderRadius:"10px", backgroundColor:"#2DD4BF", color:"#09090B", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:800, letterSpacing:"-0.02em" }}>JD</div>
            <span style={{ fontWeight:600, fontSize:"14px", color:C.text }}>John Doe</span>
          </div>
          <nav className="se-dn" style={{ display:"flex", alignItems:"center", gap:"36px" }}>
            {NAV.map(l => (
              <a key={l.id} href={`#${l.id}`} className="se-nav-a" onClick={e=>goTo(e,l.id)} style={{ color:activeSection===l.id?"#2DD4BF":C.secondary }}>{l.label}</a>
            ))}
          </nav>
          <a href="#contact" onClick={e=>goTo(e,"contact")} style={{ padding:"8px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:600, backgroundColor:"#2DD4BF", color:"#09090B", textDecoration:"none", transition:"transform .15s,box-shadow .15s", display:"inline-flex", alignItems:"center" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.03)";e.currentTarget.style.boxShadow="0 0 28px rgba(45,212,191,.4)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none"}}>
            Hire Me
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="home" style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", paddingTop:"72px", overflow:"hidden" }}>
        <div aria-hidden="true" style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(45,212,191,0.11) 1px, transparent 1px)", backgroundSize:"30px 30px", pointerEvents:"none" }} />
        <div aria-hidden="true" style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 85% 75% at 50% 40%, transparent 25%, #09090B 80%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"1140px", width:"100%", margin:"0 auto", padding:"80px 32px", position:"relative" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }} className="se-g2">
            <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
              <div className="se-f1"><span style={{ fontSize:"11px", fontWeight:500, letterSpacing:".18em", textTransform:"uppercase", color:C.secondary }}>I&apos;m John Doe</span></div>
              <div className="se-f2">
                <h1 style={{ fontSize:"clamp(50px,7vw,82px)", fontWeight:900, lineHeight:1.04, letterSpacing:"-0.04em", margin:0 }}>
                  <span style={{ color:C.text }}>Software</span><br />
                  <span style={{ color:"#2DD4BF" }}>{displayText}<span className="se-cur" aria-hidden="true" /></span>
                </h1>
              </div>
              <p className="se-f3" style={{ fontSize:"16px", lineHeight:1.75, color:C.secondary, maxWidth:"440px", margin:0 }}>
                I build scalable systems and pixel-perfect interfaces. Passionate about developer experience, performance engineering, and open-source software.
              </p>
              <div className="se-f4" style={{ display:"flex", flexWrap:"wrap", gap:"12px", paddingTop:"4px" }}>
                <a href="#projects" onClick={e=>goTo(e,"projects")} style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"12px 24px", borderRadius:"12px", fontSize:"14px", fontWeight:600, backgroundColor:"#2DD4BF", color:"#09090B", textDecoration:"none", transition:"transform .15s,box-shadow .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow="0 0 32px rgba(45,212,191,.4)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none"}}>
                  View Projects
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/></svg>
                </a>
                <a href="#contact" onClick={e=>goTo(e,"contact")} style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"12px 24px", borderRadius:"12px", fontSize:"14px", fontWeight:600, backgroundColor:"rgba(255,255,255,.04)", color:C.secondary, textDecoration:"none", border:"1px solid rgba(255,255,255,.08)", transition:"transform .15s,border-color .2s,color .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.18)";e.currentTarget.style.color="#fff"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.color=C.secondary}}>
                  Get in Touch
                </a>
              </div>
              <div className="se-f5" style={{ display:"flex", gap:"40px", paddingTop:"20px", borderTop:"1px solid rgba(255,255,255,.06)", marginTop:"4px" }}>
                {[{v:"6+",l:"Years Exp."},{v:"40+",l:"Projects"},{v:"99.9%",l:"Uptime SLA"}].map(s=>(
                  <div key={s.l}>
                    <div style={{ fontSize:"22px", fontWeight:800, color:C.text, letterSpacing:"-0.03em" }}>{s.v}</div>
                    <div style={{ fontSize:"12px", color:C.muted, marginTop:"2px", fontWeight:500 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="se-r" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div className="se-fl" style={{ position:"relative", width:"300px", height:"300px" }}>
                {[0,1,2].map(i=>(
                  <div key={i} className={`r${i+1}`} style={{ position:"absolute", inset:`${i*30}px`, borderRadius:"50%", border:`1px solid rgba(45,212,191,${0.18-i*0.05})` }} />
                ))}
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ width:"72px", height:"72px", borderRadius:"18px", backgroundColor:"rgba(45,212,191,.08)", border:"1.5px solid rgba(45,212,191,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", fontWeight:900, color:"#2DD4BF", letterSpacing:"-0.03em" }}>JD</div>
                </div>
                {[{l:"React",a:-60},{l:"Go",a:30},{l:"K8s",a:120},{l:"SQL",a:210}].map(({l,a})=>{
                  const r=128, rad=(a*Math.PI)/180, x=Math.cos(rad)*r, y=Math.sin(rad)*r;
                  return <div key={l} style={{ position:"absolute", left:`calc(50% + ${x}px)`, top:`calc(50% + ${y}px)`, transform:"translate(-50%,-50%)", padding:"5px 10px", borderRadius:"7px", fontSize:"11px", fontWeight:700, backgroundColor:"rgba(45,212,191,.08)", color:"#2DD4BF", border:"1px solid rgba(45,212,191,.18)", whiteSpace:"nowrap" }}>{l}</div>;
                })}
              </div>
            </div>
          </div>
          <div style={{ position:"absolute", bottom:"-16px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", color:C.muted }}>
            <span style={{ fontSize:"10px", letterSpacing:".2em", textTransform:"uppercase", fontWeight:500 }}>Scroll</span>
            <div style={{ width:"1px", height:"44px", background:"linear-gradient(to bottom, rgba(45,212,191,.5), transparent)" }} />
          </div>
        </div>
      </section>

      {/* SKILLS STRIP */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", borderBottom:"1px solid rgba(255,255,255,.06)", padding:"18px 0" }}>
        <div style={{ maxWidth:"1140px", margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", gap:"28px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"11px", fontWeight:600, letterSpacing:".14em", textTransform:"uppercase", color:C.muted, whiteSpace:"nowrap", flexShrink:0 }}>Stack</span>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {SKILLS.map(s=>(
              <span key={s} style={{ padding:"4px 10px", borderRadius:"6px", fontSize:"12px", fontWeight:500, backgroundColor:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", color:C.secondary, whiteSpace:"nowrap" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* PROJECTS */}
      <section id="projects" style={{ padding:"120px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
        <div style={{ maxWidth:"1140px", margin:"0 auto", padding:"0 32px" }}>
          <EchoHeading text="Projects" />
          {PROJECTS.map(p=>(
            <div key={p.id} className="se-pr" onMouseEnter={()=>setHoveredProject(p.id)} onMouseLeave={()=>setHoveredProject(null)}>
              <div style={{ display:"grid", gridTemplateColumns:"44px 1fr 44px", gap:"24px", alignItems:"start", position:"relative" }}>
                <span style={{ fontSize:"38px", fontWeight:900, lineHeight:1, letterSpacing:"-0.04em", color:hoveredProject===p.id?"#2DD4BF":"rgba(255,255,255,.07)", transition:"color .3s", paddingTop:"4px" }}>{p.id}</span>
                <div>
                  <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                    <h3 style={{ fontSize:"19px", fontWeight:700, color:C.text, letterSpacing:"-0.02em", margin:0 }}>{p.title}</h3>
                    {p.tech.map(t=><span key={t} style={{ padding:"3px 8px", borderRadius:"5px", fontSize:"11px", fontWeight:500, backgroundColor:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", color:C.muted }}>{t}</span>)}
                  </div>
                  <p style={{ fontSize:"12px", color:C.muted, marginBottom:"12px", fontWeight:500 }}>{p.period}</p>
                  <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"10px" }}>
                    {p.bullets.map((b,i)=>(
                      <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", fontSize:"14px", lineHeight:1.7, color:C.secondary }}>
                        <span style={{ marginTop:"8px", width:"5px", height:"5px", borderRadius:"50%", backgroundColor:"#2DD4BF", flexShrink:0, opacity:.7 }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ width:"40px", height:"40px", borderRadius:"50%", border:`1px solid ${hoveredProject===p.id?"#2DD4BF":"rgba(255,255,255,.1)"}`, color:hoveredProject===p.id?"#2DD4BF":C.muted, display:"flex", alignItems:"center", justifyContent:"center", transition:"border-color .25s,color .25s,transform .25s", transform:hoveredProject===p.id?"translateX(4px) rotate(-40deg)":"none", flexShrink:0, marginTop:"4px" }}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE + ACHIEVEMENTS */}
      <section id="experience" style={{ padding:"120px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
        <div style={{ maxWidth:"1140px", margin:"0 auto", padding:"0 32px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px" }} className="se-g2">
            <div>
              <EchoHeading text="Experience" />
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:0, top:"8px", bottom:"24px", width:"1px", backgroundColor:"rgba(255,255,255,.06)" }} />
                {EXPERIENCE.map((exp,i)=>(
                  <div key={i} style={{ paddingLeft:"32px", paddingBottom: i<EXPERIENCE.length-1?"40px":0, position:"relative" }}>
                    <div style={{ position:"absolute", left:"-5px", top:"6px", width:"11px", height:"11px", borderRadius:"50%", backgroundColor:C.bg, border:"2px solid #2DD4BF" }} />
                    <span style={{ display:"block", fontSize:"11px", fontWeight:600, color:C.muted, marginBottom:"6px", letterSpacing:".06em" }}>{exp.period}</span>
                    <h3 style={{ fontSize:"17px", fontWeight:700, color:C.text, marginBottom:"4px", letterSpacing:"-0.01em" }}>{exp.role}</h3>
                    <p style={{ fontSize:"14px", fontWeight:600, color:"#2DD4BF", marginBottom:"4px" }}>{exp.company}</p>
                    <p style={{ fontSize:"12px", color:C.muted }}>{exp.location}</p>
                  </div>
                ))}
              </div>
            </div>
            <div id="achievements">
              <EchoHeading text="Achievements" />
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {ACHIEVEMENTS.map(a=>(
                  <div key={a.id} className="se-ach">
                    <span style={{ fontSize:"30px", fontWeight:900, color:"rgba(45,212,191,.18)", lineHeight:1, letterSpacing:"-0.04em", flexShrink:0, paddingTop:"2px" }}>{a.id}</span>
                    <div>
                      <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:C.text, marginBottom:"4px" }}>{a.title}</p>
                      <p style={{ fontSize:"12px", color:C.muted, marginBottom:"4px" }}>{a.org}</p>
                      <p style={{ fontSize:"12px", fontWeight:600, color:"#2DD4BF" }}>{a.year}</p>
                    </div>
                  </div>
                ))}
                <button style={{ marginTop:"8px", padding:"10px 0", background:"none", border:"1px solid rgba(255,255,255,.06)", borderRadius:"10px", fontSize:"13px", fontWeight:600, color:C.secondary, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", width:"100%", transition:"border-color .2s,color .2s", fontFamily:"inherit" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.2)";e.currentTarget.style.color="#fff"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.06)";e.currentTarget.style.color=C.secondary}}>
                  View All Certifications
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:"120px 0" }}>
        <div style={{ maxWidth:"1140px", margin:"0 auto", padding:"0 32px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"start" }} className="se-g2">
            <div>
              <EchoHeading text="Contact" />
              <p style={{ fontSize:"15px", lineHeight:1.8, color:C.secondary, maxWidth:"360px", marginBottom:"36px" }}>
                Want me on your project? I am looking for work in software engineering in tech, media, or fintech, and would love to be an active team member in creative projects.
              </p>
              <div style={{ display:"flex", gap:"12px", marginBottom:"40px" }}>
                {[{l:"in",n:"LinkedIn",h:"https://linkedin.com"},{l:"gh",n:"GitHub",h:"https://github.com"},{l:"tw",n:"Twitter",h:"https://twitter.com"}].map(s=>(
                  <a key={s.n} href={s.h} target="_blank" rel="noopener noreferrer" aria-label={s.n} style={{ width:"42px", height:"42px", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:800, color:"#2DD4BF", backgroundColor:"rgba(45,212,191,.08)", border:"1px solid rgba(45,212,191,.2)", textDecoration:"none", transition:"transform .2s,box-shadow .2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.08)";e.currentTarget.style.boxShadow="0 4px 20px rgba(45,212,191,.25)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none"}}>
                    {s.l}
                  </a>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {[{k:"Email",v:"john@johndoe.dev"},{k:"Location",v:"San Francisco, CA"},{k:"Status",v:"Open to opportunities"}].map(item=>(
                  <div key={item.k} style={{ display:"flex", alignItems:"center", gap:"16px" }}>
                    <span style={{ fontSize:"11px", fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".1em", width:"72px", flexShrink:0 }}>{item.k}</span>
                    <span style={{ fontSize:"13px", color:C.secondary }}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              {[
                {key:"name", label:"Name", type:"text", ph:"John Doe"},
                {key:"email", label:"Email", type:"email", ph:"johndoe@email.com"},
              ].map(field=>(
                <div key={field.key}>
                  <label style={{ display:"block", fontSize:"11px", fontWeight:600, textTransform:"uppercase", letterSpacing:".12em", color:C.muted, marginBottom:"8px" }}>{field.label}</label>
                  <input type={field.type} required placeholder={field.ph} value={(formData as Record<string,string>)[field.key]} onChange={e=>setFormData(p=>({...p,[field.key]:e.target.value}))} className="se-input" />
                </div>
              ))}
              <div>
                <label style={{ display:"block", fontSize:"11px", fontWeight:600, textTransform:"uppercase", letterSpacing:".12em", color:C.muted, marginBottom:"8px" }}>Message</label>
                <textarea required rows={6} placeholder="Tell me about your project..." value={formData.message} onChange={e=>setFormData(p=>({...p,message:e.target.value}))} className="se-input" style={{ resize:"none" }} />
              </div>
              <button type="submit" style={{ padding:"14px", borderRadius:"12px", fontSize:"14px", fontWeight:700, fontFamily:"inherit", border:"none", cursor:formSent?"default":"pointer", backgroundColor:formSent?"#111113":"#2DD4BF", color:formSent?C.muted:"#09090B", transition:"background .3s,color .3s,transform .15s", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}
                onMouseEnter={e=>{ if(!formSent) (e.currentTarget as HTMLButtonElement).style.transform="scale(1.01)" }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.transform="scale(1)" }}>
                {formSent?"Message Sent!":"Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,.06)", padding:"28px 0" }}>
        <div style={{ maxWidth:"1140px", margin:"0 auto", padding:"0 32px", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:"16px" }}>
          <span style={{ fontSize:"13px", color:C.muted }}>&copy; {new Date().getFullYear()} John Doe &mdash; Built with Next.js</span>
          <div style={{ display:"flex", gap:"28px" }}>
            {NAV.map(l=>(
              <a key={l.id} href={`#${l.id}`} className="se-nav-a" onClick={e=>goTo(e,l.id)} style={{ color:C.muted, fontSize:"13px" }}
                onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}