"use client";

import React, { useState, useEffect } from "react";

export default function CreativeEdgeTemplate() {
  const [activeSection, setActiveSection] = useState("home");
  const [emailCopied, setEmailCopied] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "work", "process", "about", "contact"];
      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("morgan.vance.creates@gmail.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setMessageSubmitted(true);
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            message,
            formName: 'Creative Edge Template Contact Form',
          })
        });
      } catch (err) {
        console.error(err);
      }
      setTimeout(() => {
        setName(""); setEmail(""); setMessage(""); setMessageSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-200 font-sans selection:bg-purple-500 selection:text-white antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 6s ease infinite; }
        @keyframes float-ce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .animate-float-ce { animation: float-ce 5s ease-in-out infinite; }
        @keyframes blink-ping-ce {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(2.2); opacity: 0; }
        }
        .animate-blink-ping-ce { animation: blink-ping-ce 1.6s cubic-bezier(0.4,0,0.6,1) infinite; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060814; }
        ::-webkit-scrollbar-thumb { background: #2d1b69; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #5b21b6; }
      `}} />

      {/* Ambient Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-purple-700/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-pink-700/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-[44px] z-50 w-full border-b border-white/5 bg-[#060814]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <a href="#home" onClick={(e) => handleScrollTo(e, "home")} className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 font-black text-white text-base shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">M</span>
            <div className="flex flex-col">
              <span className="font-bold leading-tight text-white group-hover:text-purple-300 transition-colors">Morgan Vance</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Creative Technologist</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs font-semibold text-purple-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-blink-ping-ce absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            Booking Q3 Projects
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[{ label: "Work", id: "work" }, { label: "Process", id: "process" }, { label: "About", id: "about" }, { label: "Contact", id: "contact" }].map((link) => (
              <a key={link.id} href={`#${link.id}`} onClick={(e) => handleScrollTo(e, link.id)}
                className={`relative py-1 transition-colors hover:text-white ${activeSection === link.id ? "text-white" : "text-slate-400"}`}>
                {link.label}
                {activeSection === link.id && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />}
              </a>
            ))}
          </nav>

          <a href="#contact" onClick={(e) => handleScrollTo(e, "contact")}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:opacity-90 active:scale-95 transition-all">
            Hire Me
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16">
          <div className="flex-1 flex flex-col gap-6">
            <div className="inline-flex max-w-fit items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/5 px-3.5 py-1 text-xs font-bold tracking-wider text-pink-400 uppercase">
              ✦ Creative Technologist &amp; Digital Artist
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] max-w-2xl">
              Where{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">code</span>
              {" "}meets{" "}
              <span className="underline decoration-pink-500 decoration-wavy underline-offset-4">creativity</span>.
            </h1>
            <p className="text-lg leading-relaxed text-slate-400 max-w-xl">
              I&apos;m Morgan. I design and engineer interactive digital products — from 3D WebGL experiments to polished production apps. Bridging what&apos;s functional and what&apos;s extraordinary.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a href="#contact" onClick={(e) => handleScrollTo(e, "contact")}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-7 font-bold text-white shadow-lg shadow-purple-500/25 hover:opacity-90 active:scale-95 transition-all">
                Work Together
              </a>
              <a href="#work" onClick={(e) => handleScrollTo(e, "work")}
                className="group inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                Explore Demos
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
            <div className="flex items-center gap-5 mt-4 pt-6 border-t border-white/5 max-w-sm">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">CONNECT</span>
              <div className="flex items-center gap-4">
                {[
                  { name: "GitHub", url: "https://github.com", icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg> },
                  { name: "Twitter", url: "https://twitter.com", icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
                  { name: "Dribbble", url: "https://dribbble.com", icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.65 6.03c.51.66.9 1.41 1.15 2.23-1.03-.23-2.61-.31-4.32-.08-.18-.46-.38-.91-.6-1.34 1.83-.56 3.25-.79 3.77-.81zm-3.08-1.52c-.44-.06-.9-.09-1.37-.09-1.36 0-2.6.27-3.72.75.14.3.29.62.43.94 1.25-.43 2.76-.7 4.22-.64.16-.33.31-.65.44-.96zm-7.39 1.62c.79-.62 1.72-1.07 2.74-1.28-.15-.34-.33-.67-.52-.98-1.42.34-2.69.96-3.7 1.8.38.16.92.35 1.48.46zm-2.07 2.1c.36-.08.79-.13 1.28-.13.88 0 1.86.18 2.87.5-1.51 3.51-2.68 6.55-3.37 8.35-.45-.96-.77-2.01-.93-3.12 1-.22 2.17-.38 3.27-.41-.5-1.54-1.74-3.79-3.12-5.19zm1.32 10.15c.67-1.74 1.8-4.66 3.25-8.08 1.46.33 2.83.91 3.99 1.68-.9 2.5-1.78 5.4-2.38 8.16a8.03 8.03 0 01-4.86-1.76zm6.38.9c.56-2.58 1.42-5.32 2.29-7.7.98.54 1.79 1.27 2.37 2.15-.32.08-.68.13-1.08.13-1.58 0-2.8-.23-3.58-.58z" clipRule="evenodd" /></svg> },
                ].map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-purple-400 transition-colors duration-300" aria-label={s.name}>{s.icon}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Hero right card */}
          <div className="lg:w-[400px] flex-shrink-0 animate-float-ce">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-500/30">M</div>
                <div>
                  <div className="font-bold text-white">Morgan Vance</div>
                  <div className="text-xs text-slate-400">Creative Technologist</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-[10px] font-semibold text-purple-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Pro
                </div>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  { label: "Aether Spheres", sub: "Three.js · WebGL", bg: "bg-purple-500/10 border-purple-500/15", icon: "⬡", dot: "text-purple-400" },
                  { label: "Prism Synth", sub: "Web Audio · React", bg: "bg-pink-500/10 border-pink-500/15", icon: "◈", dot: "text-pink-400" },
                  { label: "LiquidMotion UI", sub: "GSAP · SVG · CSS", bg: "bg-orange-500/10 border-orange-500/15", icon: "⊛", dot: "text-orange-400" },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-3 p-3 rounded-xl border ${item.bg}`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[14px] text-white`}>{item.icon}</div>
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.sub}</div>
                    </div>
                    <div className={`ml-auto text-[10px] font-semibold ${item.dot}`}>Live ↗</div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-slate-500">12 experiments live</span>
                <div className="flex gap-1">
                  {["bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-yellow-400"].map((c, i) => (
                    <span key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="mx-auto max-w-7xl px-6 py-20 md:px-8 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">EXPERIMENTS &amp; PROJECTS</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Creative Work</h2>
          </div>
          <p className="text-slate-400 max-w-md text-sm">
            Interactive experiments, design systems, and production applications — each pushing the boundaries of what&apos;s possible in the browser.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Aether Spheres", category: "3D GRAPHICS", description: "Interactive Three.js environment with real-time physics particle fields and dynamic light scattering.", tags: ["Three.js", "React", "WebGL"], grad: "from-purple-600 to-indigo-500", hover: "hover:border-purple-500/40", tc: "text-purple-400", emoji: "⬡" },
            { title: "Prism Synth", category: "INTERACTIVE AUDIO", description: "Web Audio synthesizer generating customizable audio output responsive to keyboard and mouse input.", tags: ["Web Audio API", "Next.js", "Canvas"], grad: "from-pink-600 to-rose-500", hover: "hover:border-pink-500/40", tc: "text-pink-400", emoji: "◈" },
            { title: "LiquidMotion UI", category: "ANIMATION LIBRARY", description: "Open-source animation system built with GSAP and SVG morphing for physics-based transitions.", tags: ["GSAP", "SVG", "npm Package"], grad: "from-orange-500 to-yellow-400", hover: "hover:border-orange-500/40", tc: "text-orange-400", emoji: "⊛" },
            { title: "NeuralType", category: "AI + TYPOGRAPHY", description: "AI-powered variable font generator that creates unique typefaces from emotion prompts.", tags: ["OpenAI", "Next.js", "Canvas API"], grad: "from-indigo-600 to-violet-500", hover: "hover:border-indigo-500/40", tc: "text-indigo-400", emoji: "Ψ" },
            { title: "Chromaflow", category: "DESIGN TOOL", description: "Real-time color palette generator with perceptual harmony algorithms. Exports to Tailwind, CSS, and Figma.", tags: ["Figma Plugin", "TypeScript", "Color Science"], grad: "from-teal-500 to-cyan-400", hover: "hover:border-teal-500/40", tc: "text-teal-400", emoji: "◉" },
            { title: "Echoboard", category: "REALTIME COLLAB", description: "Multiplayer whiteboard with real-time cursor tracking, freehand drawing, and voice bubbles.", tags: ["Liveblocks", "WebRTC", "Canvas"], grad: "from-rose-500 to-pink-400", hover: "hover:border-rose-500/40", tc: "text-rose-400", emoji: "◎" },
          ].map((p, idx) => (
            <div key={idx} className={`group flex flex-col rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm overflow-hidden transition-all duration-300 ${p.hover} hover:-translate-y-1 hover:bg-white/5`}>
              <div className={`h-1.5 w-full bg-gradient-to-r ${p.grad}`} />
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-2xl font-black ${p.tc}`}>{p.emoji}</span>
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${p.tc}`}>{p.category}</span>
                </div>
                <h3 className="text-lg font-black text-white mb-3">{p.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400 mb-6 flex-grow">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tags.map((t, ti) => <span key={ti} className="rounded-md bg-white/5 border border-white/8 px-2 py-0.5 text-xs font-medium text-slate-400">{t}</span>)}
                </div>
                <a href="#" className={`inline-flex items-center gap-2 text-sm font-bold ${p.tc} transition-colors`}>
                  View experiment
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-7xl px-6 py-20 md:px-8 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit flex flex-col gap-4">
            <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">HOW I WORK</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">My Creative Process</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Every great digital experience begins with curiosity and ends with craft.
            </p>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-6">
            {[
              { step: "01", title: "Discover & Define", desc: "Deep dive into your goals, audience, and constraints. No assumptions — just smart questions and active listening to build the right foundation.", grad: "from-purple-600 to-indigo-500" },
              { step: "02", title: "Explore & Experiment", desc: "Rapid prototyping, motion explorations, and creative sprints. Pushing boundaries early to find the unexpected solution.", grad: "from-pink-600 to-rose-500" },
              { step: "03", title: "Design & Engineer", desc: "Pixel-perfect design meets production-grade code. I build designs, with performance, accessibility, and DX in mind.", grad: "from-orange-500 to-yellow-400" },
              { step: "04", title: "Refine & Launch", desc: "Polish, test, iterate. I stay involved through launch to make sure every interaction feels exactly right.", grad: "from-teal-500 to-cyan-400" },
            ].map((step, idx) => (
              <div key={idx} className="group flex gap-6 rounded-2xl border border-white/8 bg-white/3 p-6 hover:border-white/15 hover:bg-white/5 transition-all duration-300">
                <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${step.grad} font-black text-white text-sm shadow-lg`}>{step.step}</div>
                <div>
                  <h3 className="font-black text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8 border-t border-white/5">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-14 gap-3">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">SKILLS &amp; TOOLS</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">My Toolkit</h2>
          <p className="text-slate-400 text-sm leading-relaxed">Crafting immersive digital experiences requires engineering precision and artistic intuition.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { name: "Three.js", level: "Expert", color: "group-hover:text-purple-400" },
            { name: "React", level: "Expert", color: "group-hover:text-sky-400" },
            { name: "Next.js", level: "Expert", color: "group-hover:text-slate-200" },
            { name: "GSAP", level: "Expert", color: "group-hover:text-green-400" },
            { name: "WebGL / GLSL", level: "Advanced", color: "group-hover:text-orange-400" },
            { name: "Figma", level: "Expert", color: "group-hover:text-pink-400" },
            { name: "TypeScript", level: "Expert", color: "group-hover:text-blue-400" },
            { name: "Canvas API", level: "Advanced", color: "group-hover:text-yellow-400" },
            { name: "Web Audio API", level: "Advanced", color: "group-hover:text-rose-400" },
            { name: "Framer Motion", level: "Advanced", color: "group-hover:text-teal-400" },
          ].map((skill, idx) => (
            <div key={idx} className={`group flex flex-col p-5 rounded-xl border border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6 hover:-translate-y-0.5 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold text-white ${skill.color} transition-colors`}>{skill.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-600 uppercase">{skill.level}</span>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-20 md:px-8 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] aspect-square">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 p-0.5 shadow-2xl shadow-purple-500/20">
                <div className="h-full w-full rounded-3xl bg-[#060814] flex items-center justify-center">
                  <span className="text-[110px] font-black bg-gradient-to-tr from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent select-none">M</span>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 text-center shadow-xl">
                <div className="text-xs font-black text-white">8+ Years</div>
                <div className="text-[10px] text-slate-400">Building the Web</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">MY STORY</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">About Me</h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-slate-400">
              <p>I&apos;ve spent eight years at the intersection of art and engineering — building things that feel alive. My work spans interactive installations, commercial web apps, and everything in between.</p>
              <p>I believe the best digital experiences don&apos;t just function — they resonate. Every project is an opportunity to push what&apos;s possible in the browser and leave users genuinely surprised.</p>
              <p>When I&apos;m not experimenting with shaders and physics simulations, you&apos;ll find me at the climbing wall or DJing at local venues in Portland.</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-6 border-t border-white/5 max-w-md">
              {[{ value: "50+", label: "Experiments" }, { value: "20+", label: "Client Projects" }, { value: "12k+", label: "GitHub Stars" }].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 border-t border-white/5 overflow-hidden">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 -z-10 h-72 w-96 rounded-full bg-purple-600/8 blur-[120px] pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 flex flex-col justify-center gap-6">
            <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">GET IN TOUCH</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">Let&apos;s build something extraordinary.</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">Have a creative project in mind? Want to collaborate on an experiment? Or just want to say hi?</p>
            <button onClick={copyEmail} className="group flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 px-5 py-3 text-sm font-bold transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <span className="font-mono text-slate-300 group-hover:text-white transition-colors">morgan.vance.creates@gmail.com</span>
              <span className="text-xs text-slate-500 border-l border-white/10 pl-3 ml-1">{emailCopied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 md:p-8">
              <h3 className="text-lg font-black text-white mb-6">Send a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="ce-name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                  <input id="ce-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="ce-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <input id="ce-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="ce-message" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                  <textarea id="ce-message" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about your project..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none transition-colors resize-none" />
                </div>
                <button type="submit" disabled={messageSubmitted} className="w-full inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-bold text-white hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20">
                  {messageSubmitted ? "Message Sent! ✦" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 py-10 md:px-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-600">
        <div>&copy; {new Date().getFullYear()} Morgan Vance. Built on the edge.</div>
        <div className="flex items-center gap-6">
          {["work", "process", "about", "contact"].map((id) => (
            <a key={id} href={`#${id}`} onClick={(e) => handleScrollTo(e, id)} className="hover:text-white transition-colors capitalize">{id}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
