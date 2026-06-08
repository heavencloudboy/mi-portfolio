import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 1. DESIGN TOKENS & GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@400;600;700;800&display=swap');

  body { margin: 0; padding: 0; background: #020617; }

  :root {
    --font-body:   'Inter', sans-serif;
    --font-head:   'Syne', sans-serif;
    --c-bg:        #020617;
    --c-surface:   #060b24;
    --c-border:    rgba(255,255,255,0.05);
    --c-muted:     #475569;
    --c-subtle:    #64748b;
    --c-text:      #e2e8f0;
    --c-white:     #f8fafc;
    --c-sky:       #38bdf8;
    --c-blue:      #2563eb;
    --c-blue-mid:  #3b82f6;
    --c-blue-lt:   #60a5fa;
    --radius-card: 2rem;
    --section-max: 1400px;
    --section-px:  2.5rem;
    --gradient-m5: linear-gradient(135deg, #fff 0%, #93c5fd 40%, #2563eb 100%);
  }

  /* ── base ── */
.pr { font-family: var(--font-body); background: var(--c-bg); color: var(--c-white); overflow-x: hidden; min-height: 100vh; width: 100%; margin: 0; padding: 0; }
  .pr *, .pr *::before, .pr *::after { box-sizing: border-box; }
  .fh   { font-family: var(--font-head); }
  .mono { font-family: monospace; }

  /* ── cursor ── */
  .cursor-dot  { position:fixed; top:0; left:0; pointer-events:none; z-index:999; width:10px; height:10px; background:#bae6fd; border-radius:50%; transform:translate(-50%,-50%); transition:transform .08s ease-out; box-shadow:0 0 10px rgba(186,230,253,.8); will-change:left,top; }
  .cursor-ring { position:fixed; top:0; left:0; pointer-events:none; z-index:998; width:48px; height:48px; border:1px solid rgba(37,99,235,.5); border-radius:50%; transform:translate(-50%,-50%); transition:left .18s ease-out,top .18s ease-out,transform .3s ease-out,background .3s,border-color .3s; box-shadow:0 0 20px rgba(37,99,235,.3); will-change:left,top; }
  .cursor-ring.hovered { transform:translate(-50%,-50%) scale(1.5); background:rgba(37,99,235,.1); border-color:rgba(125,211,252,.8); }
  .cursor-dot.hovered  { transform:translate(-50%,-50%) scale(0); }

  /* ── fade-in on scroll ── */
  .fi { transition:opacity .9s ease,transform .9s ease; opacity:0; transform:translateY(48px); }
  .fi.in { opacity:1; transform:translateY(0); }

  /* ── orbs decorativos ── */
  .orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; filter:blur(130px); }
  .orb-tl { top:-10%; left:-10%; width:500px; height:500px; background:rgba(37,99,235,.1); }
  .orb-br { bottom:-10%; right:-10%; width:600px; height:600px; background:rgba(56,189,248,.08); filter:blur(150px); }

  /* ── section wrapper ── */
  .wrap { max-width:var(--section-max); margin:0 auto; padding:8rem var(--section-px); position:relative; z-index:10; }
  .wrap-sm { padding-top:5rem; padding-bottom:5rem; }
  .section-divider { border-top:1px solid var(--c-border); }
  .section-label { font-size:.75rem; text-transform:uppercase; letter-spacing:.2em; color:var(--c-subtle); display:flex; align-items:center; gap:1rem; margin-bottom:4rem; width:100%; }
  .section-label::after { content:''; flex:1; height:1px; background:var(--c-border); }

  /* ────────────────────────────────────────────────
     2. NAV
  ──────────────────────────────────────────────── */
  .nav { position:fixed; top:0; left:0; width:100%; z-index:100; padding:2rem var(--section-px); transition:padding .3s,background .3s,border-color .3s; }
  .nav.scrolled { padding:1rem var(--section-px); background:rgba(2,6,23,.8); backdrop-filter:blur(20px); border-bottom:1px solid var(--c-border); }
  .nav-inner { display:flex; justify-content:space-between; align-items:center; max-width:var(--section-max); margin:0 auto; }
  .nav-logo { font-family:var(--font-head); font-size:1.5rem; font-weight:700; letter-spacing:-.03em; color:var(--c-white); text-decoration:none; }
  .nav-logo span { font-size:1.75rem; background:var(--gradient-m5); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .nav-links { display:flex; gap:2rem; align-items:center; }
  .nav-link { font-size:.75rem; font-weight:500; text-transform:uppercase; letter-spacing:.15em; color:var(--c-subtle); text-decoration:none; transition:color .2s; }
  .nav-link:hover { color:var(--c-sky); }
  .nav-link.accent { background:var(--gradient-m5); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  /* ────────────────────────────────────────────────
     3. HERO
  ──────────────────────────────────────────────── */
  .hero { position:relative; width:100%; height:100vh; min-height:100vh; display:flex; flex-direction:column; justify-content:flex-end; overflow:hidden; }

  /* foto fullbleed */
  .hero-bg { position:absolute; inset:0; z-index:0; overflow:hidden; }
  .hero-bg img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 20%; filter:grayscale(15%); transition:transform .4s ease-out; }
  .hero-bg::after { content:''; position:absolute; inset:0; z-index:1; background:linear-gradient(to top,#020617 0%,rgba(2,6,23,.75) 38%,rgba(2,6,23,.2) 65%,transparent 100%),linear-gradient(to right,rgba(2,6,23,.55) 0%,transparent 55%); }

  /* spotlight cursor */
  .hero-spotlight { position:absolute; inset:0; z-index:2; pointer-events:none; opacity:0; transition:opacity .4s; mix-blend-mode: screen; }

  /* ubicación */
  .hero-location { position:absolute; z-index:3; top:7rem; left:var(--section-px); font-family:monospace; font-size:.7rem; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.4); display:flex; align-items:center; gap:.5rem; }
  .hero-location::before { content:'◎'; font-size:.65rem; color:var(--c-sky); }

  /* nombre — anclado al fondo, entra desde la derecha */
  /* AJUSTE APLICADO: transformamos hacia abajo y quitamos margen inferior para bajar todo el bloque */
  .hero-name-wrap { position:relative; z-index:4; padding:0 var(--section-px); margin-bottom:-0.5rem; overflow:hidden; text-align: center; transform: translateY(-2rem); }
  .hero-name { font-size:clamp(3rem,5vw,6rem); font-weight:800; letter-spacing:-.04em; text-transform:uppercase; line-height:1.1; display:flex; flex-wrap:wrap; justify-content:center; gap:0.5rem 1rem; animation:slideInRight 1s cubic-bezier(.16,1,.3,1) both; }
  .hero-name-accent { background:linear-gradient(135deg,#bae6fd,#2563eb); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  @keyframes slideInRight { from{transform:translateX(80px);opacity:0} to{transform:translateX(0);opacity:1} }

  /* estadísticas */
  /* AJUSTE APLICADO: Reducimos el margin-bottom de 2rem a 1.5rem para que baje junto con el nombre */
  .hero-stats { position:relative; z-index:3; padding:0 var(--section-px); display:flex; flex-wrap:wrap; justify-content:center; gap:3.5rem; margin-bottom:1.5rem; animation:fadeUp 1s .2s cubic-bezier(.16,1,.3,1) both; }
  .hero-stat-item { display:flex; flex-direction:column; gap:.25rem; }
  .hero-stat-num { font-family:var(--font-head); font-size:1.75rem; font-weight:700; background:var(--gradient-m5); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; }
  .hero-stat-label { font-size:.65rem; font-weight:500; letter-spacing:.15em; text-transform:uppercase; color:rgba(226,232,240,.6); line-height:1.4; }

  /* barra inferior: roles + hook */
  /* AJUSTE APLICADO: Reducimos el padding de 2rem a 1.5rem para ganar aún más espacio hacia abajo */
  .hero-bottom-bar { position:relative; z-index:3; padding:1.5rem var(--section-px); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:2rem; max-width:var(--section-max); margin:0 auto; width:100%; border-top:1px solid rgba(255,255,255,.06); }
  .hero-pill { display:flex; align-items:center; gap:1rem; border:1px solid rgba(255,255,255,.12); border-radius:9999px; padding:.85rem 1.75rem; background:rgba(255,255,255,.06); backdrop-filter:blur(12px); animation:fadeUp 1s .3s cubic-bezier(.16,1,.3,1) both; }
  .hero-hook-inline { max-width:520px; font-size:clamp(1rem,1.8vw,1.25rem); color:rgba(226,232,240,.75); font-weight:300; line-height:1.65; border-left:2px solid rgba(56,189,248,.5); padding-left:1.25rem; animation:fadeUp 1s .5s cubic-bezier(.16,1,.3,1) both; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* rotator de roles */
  .rotator { display:inline-block; height:28px; overflow:hidden; vertical-align:middle; }
  .rotator-inner { display:flex; flex-direction:column; animation:rotateText 9s cubic-bezier(.8,0,.2,1) infinite; }
  .rotator-inner span { display:flex; align-items:center; height:28px; line-height:28px; white-space:nowrap; flex-shrink:0; font-family:var(--font-head); font-weight:700; font-size:clamp(.9rem,1.5vw,1.1rem); color:white; letter-spacing:.05em; }
  @keyframes rotateText { 0%,25%{transform:translateY(0)} 33%,58%{transform:translateY(-25%)} 66%,91%{transform:translateY(-50%)} 100%{transform:translateY(-75%)} }

  /* ping */
  .ping-wrap { position:relative; width:14px; height:14px; flex-shrink:0; }
  .ping-ring { position:absolute; inset:0; border-radius:50%; background:var(--c-blue-mid); animation:ping 1.2s cubic-bezier(0,0,.2,1) infinite; opacity:.6; }
  .ping-dot  { position:relative; width:100%; height:100%; border-radius:50%; background:linear-gradient(135deg,#7dd3fc,#2563eb); box-shadow:0 0 12px rgba(59,130,246,.8); }
  @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }

  .scroll-hint { position:absolute; bottom:1.75rem; right:var(--section-px); z-index:3; color:rgba(56,189,248,.5); font-family:monospace; font-size:.7rem; letter-spacing:.2em; animation:bounce 1.5s infinite; }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }

  /* ────────────────────────────────────────────────
     4. MARQUEE SEPARADOR
  ──────────────────────────────────────────────── */
  .marquee-wrap { padding:2rem 0; background:linear-gradient(90deg,var(--c-bg),#1e3a8a,var(--c-bg)); transform:rotate(-2deg) scaleX(1.1); margin:7rem 0 8rem; z-index:20; position:relative; border-top:1px solid rgba(30,58,138,.5); border-bottom:1px solid rgba(30,58,138,.5); box-shadow:0 0 60px rgba(37,99,235,.25); overflow:hidden; }
  .marquee-track { display:flex; white-space:nowrap; }
  .marquee-item { animation:marquee 25s linear infinite; display:flex; flex-shrink:0; font-family:var(--font-head); font-size:clamp(2.5rem,6vw,5rem); font-weight:800; text-transform:uppercase; letter-spacing:-.03em; color:white; user-select:none; }
  @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

  /* ────────────────────────────────────────────────
     5. ABOUT
  ──────────────────────────────────────────────── */
  .about-grid { display:grid; grid-template-columns:1fr 2fr; gap:5rem; align-items:start; }
  .about-visual { position:relative; display:flex; align-items:center; justify-content:center; width:100%; min-height:250px; }
  .av-ring-1 { position:absolute; width:220px; height:220px; border-radius:50%; border:1px dashed rgba(56,189,248,.3); animation:spinRing 25s linear infinite; }
  .av-ring-2 { position:absolute; width:140px; height:140px; border-radius:50%; border:1px solid rgba(37,99,235,.3); animation:spinRing 15s linear infinite reverse; }
  .av-dot { position:absolute; top:-3px; left:50%; width:6px; height:6px; background:var(--c-sky); border-radius:50%; transform:translateX(-50%); box-shadow:0 0 10px var(--c-sky); }
  .av-ring-2 .av-dot { top:auto; bottom:-3px; background:var(--c-blue-mid); box-shadow:0 0 10px var(--c-blue-mid); }
  .av-icon { position:relative; z-index:2; display:flex; align-items:center; justify-content:center; width:80px; height:80px; border-radius:50%; background:radial-gradient(circle at center,rgba(37,99,235,.1) 0%,transparent 70%); }
  @keyframes spinRing { 100%{transform:rotate(360deg)} }
  .about-heading { font-size:clamp(1.3rem,2.5vw,2rem); font-weight:500; line-height:1.55; letter-spacing:-.02em; color:var(--c-text); margin-bottom:2rem; }
  .about-body { font-size:clamp(1rem,1.5vw,1.15rem); color:var(--c-subtle); line-height:1.85; margin-bottom:2.5rem; white-space: pre-wrap; }
  .btn-row { display:flex; gap:1rem; flex-wrap:wrap; }
  .btn-primary { display:inline-flex; align-items:center; gap:.75rem; padding:1rem 2rem; border-radius:9999px; background:white; color:black; font-weight:600; font-size:.9rem; border:none; cursor:pointer; text-decoration:none; transition:transform .2s,box-shadow .2s; }
  .btn-primary:hover { transform:scale(1.05); box-shadow:0 0 30px rgba(255,255,255,.15); }
  .btn-outline { display:inline-flex; align-items:center; gap:.75rem; padding:1rem 2rem; border-radius:9999px; background:transparent; color:white; font-weight:600; font-size:.9rem; border:1px solid #334155; cursor:pointer; text-decoration:none; transition:border-color .3s,background .3s; }
  .btn-outline:hover { border-color:var(--c-blue); background:rgba(59,130,246,.1); }

  /* ────────────────────────────────────────────────
     6. FILOSOFÍA / ENFOQUE
  ──────────────────────────────────────────────── */
  .phil-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1.5rem; }
  .phil-card { display:flex; flex-direction:column; justify-content:space-between; padding:2.5rem; border-radius:var(--radius-card); background:rgba(10,16,40,.7); border:1px solid rgba(37,99,235,.15); transition:border-color .4s,background .4s,transform .4s,box-shadow .4s; height:100%; box-shadow:0 4px 24px rgba(0,0,0,.3); }
  .phil-card:hover { border-color:rgba(56,189,248,.35); background:rgba(14,22,58,.85); transform:translateY(-5px); box-shadow:0 8px 40px rgba(37,99,235,.15); }
  .phil-step { font-family:monospace; font-size:.75rem; letter-spacing:.15em; color:var(--c-blue-mid); display:block; margin-bottom:2rem; }
  .phil-title { font-size:1.75rem; font-weight:700; margin-bottom:1rem; color:white; line-height:1.2; }
  .phil-text { color:var(--c-subtle); line-height:1.7; font-weight:300; }
  .phil-tag { display:inline-block; margin-top:2.5rem; padding:.5rem 1.25rem; border-radius:9999px; border:1px solid rgba(37,99,235,.25); font-size:.7rem; font-family:monospace; letter-spacing:.15em; text-transform:uppercase; color:var(--c-blue-lt); transition:background .3s; }
  .phil-card:hover .phil-tag { background:rgba(37,99,235,.12); }

  /* ────────────────────────────────────────────────
     7. HERRAMIENTAS
  ──────────────────────────────────────────────── */
  .tool-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.5rem; }
  .tool-card { padding:2.5rem; border-radius:var(--radius-card); background:rgba(2,6,23,.9); border:1px solid var(--c-border); transition:border-color .4s,box-shadow .4s; text-align: center; }
  .tool-card:hover { border-color:rgba(37,99,235,.2); box-shadow:0 4px 24px rgba(37,99,235,.08); }
  .tool-cat { font-family:monospace; font-size:.7rem; text-transform:uppercase; letter-spacing:.2em; color:var(--c-blue-mid); margin-bottom:1.5rem; display: block; }
  .tool-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; align-items:center; }
  .tool-item { color:var(--c-subtle); font-size:1.1rem; font-weight:300; display:flex; align-items:center; justify-content:center; gap:.75rem; padding:.5rem 0; transition:color .2s; cursor:default; }
  .tool-item:hover { color:white; }
  .tool-dot { width:6px; height:6px; border-radius:50%; background:rgba(37,99,235,.5); flex-shrink:0; }

  /* ────────────────────────────────────────────────
     8. SHOWREEL & VIDEOS EMBED
  ──────────────────────────────────────────────── */
  .video-container {
    position: relative;
    padding-bottom: 65.75%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
    border-radius: 1.5rem;
    box-shadow: 0 24px 60px rgba(0,0,0,.5);
    border: 1px solid rgba(255,255,255,.07);
    background: #000;
  }
  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .videos-secondary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-top: 5rem;
  }
  .video-meta {
    text-align: center;
    margin-top: 1.5rem;
  }
  .video-title {
    font-family: var(--font-head);
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }
  .video-cat {
    font-family: monospace;
    font-size: 0.7rem;
    color: var(--c-subtle);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .video-desc {
    font-size: 0.85rem;
    color: var(--c-subtle);
    margin-top: 0.75rem;
    line-height: 1.5;
    font-weight: 300;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  }

  /* ────────────────────────────────────────────────
     9. PROYECTOS
  ──────────────────────────────────────────────── */
  .projects-list { display:flex; flex-direction:column; gap:0; }
  .project-featured { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; padding:5rem 0; position:relative; }
  .project-featured + .project-featured { border-top:1px solid var(--c-border); }
  .project-featured.reverse { direction:rtl; }
  .project-featured.reverse > * { direction:ltr; }

  .project-counter { font-family:monospace; font-size:.75rem; letter-spacing:.2em; color:var(--c-blue-mid); display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; }
  .project-counter-line { flex:1; max-width:60px; height:1px; background:var(--c-blue-mid); }
  .project-title-big { font-size:clamp(2.5rem,5vw,4.5rem); font-family:var(--font-head); font-weight:800; letter-spacing:-.03em; text-transform:uppercase; color:white; line-height:.95; margin-bottom:1rem; }
  .project-category-label { font-family:monospace; font-size:.75rem; letter-spacing:.15em; color:var(--c-sky); margin-bottom:1.5rem; text-transform:uppercase; }
  .project-desc { font-size:1rem; color:var(--c-subtle); line-height:1.75; font-weight:300; margin-bottom:2rem; max-width:420px; }

  .project-tags { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:2.5rem; }
  .project-tag { font-family:monospace; font-size:.65rem; letter-spacing:.12em; text-transform:uppercase; color:var(--c-blue-lt); padding:.35rem .85rem; border-radius:9999px; border:1px solid rgba(37,99,235,.25); display:flex; align-items:center; gap:.4rem; }
  .project-tag::before { content:'●'; font-size:.4rem; color:var(--c-blue-mid); }

  .project-actions { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
  .project-btn-primary { display:inline-flex; align-items:center; gap:.6rem; padding:.75rem 1.5rem; border-radius:9999px; border:1px solid rgba(255,255,255,.15); color:white; font-size:.85rem; font-weight:500; text-decoration:none; background:rgba(255,255,255,.05); backdrop-filter:blur(8px); transition:border-color .3s,background .3s; }
  .project-btn-primary:hover { border-color:var(--c-sky); background:rgba(56,189,248,.08); }

  .project-img-wrap { border-radius:1.5rem; overflow:hidden; border:1px solid rgba(255,255,255,.07); aspect-ratio:4/3; position:relative; box-shadow:0 24px 60px rgba(0,0,0,.5); transition:transform .5s cubic-bezier(.16,1,.3,1),box-shadow .5s; display:block; text-decoration:none; cursor:pointer; }
  .project-featured:hover .project-img-wrap { transform:translateY(-6px) rotate(1deg); box-shadow:0 40px 80px rgba(0,0,0,.6); }
  .project-img-wrap img { width:100%; height:100%; object-fit:cover; filter:brightness(.9); transition:transform .6s ease,filter .5s; }
  .project-featured:hover .project-img-wrap img { transform:scale(1.04); filter:brightness(1); }
  .project-year-badge { position:absolute; top:1rem; right:1rem; font-family:monospace; font-size:.75rem; letter-spacing:.15em; color:rgba(255,255,255,.6); background:rgba(1,3,20,.6); backdrop-filter:blur(8px); padding:.35rem .75rem; border-radius:9999px; border:1px solid rgba(255,255,255,.08); }

  /* ────────────────────────────────────────────────
     10. MARCAS
  ──────────────────────────────────────────────── */
  .brands-wrap { border-top:1px solid var(--c-border); display:flex; flex-direction:column; justify-content:center; min-height:400px; padding: 4rem 0; }
  .brands-grid { display:flex; flex-direction:column; gap:4rem; align-items:center; width:100%; margin:auto; }
  .brands-row { display:flex; flex-wrap:wrap; justify-content:center; gap:4rem; align-items:center; width:100%; }
  .brand-item { display:flex; align-items:center; justify-content:center; opacity:.4; filter:grayscale(100%); transition:all .4s cubic-bezier(.16,1,.3,1); cursor:default; }
  .brand-item:hover { opacity:1; filter:grayscale(0%); transform:scale(1.05) translateY(-3px); }
  .brand-item img { width:auto; max-width:none; object-fit:contain; }
  .brand-audi img     { height:55px; }
  .brand-vw img       { height:60px; }
  .brand-terpel img   { height:65px; }
  .brand-bimbo img    { height:65px; }
  .brand-heinz img    { height:55px; }
  .brand-colmedica img { height:65px; }
  .brand-country img  { height:75px; }

  /* ────────────────────────────────────────────────
     11. CONTACTO & FOOTER
  ──────────────────────────────────────────────── */
  .contact-section { padding:8rem var(--section-px) 4rem; position:relative; overflow:hidden; border-top:1px solid var(--c-border); }
  .contact-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:800px; height:800px; background:rgba(37,99,235,.15); filter:blur(150px); border-radius:50%; pointer-events:none; }
  .contact-inner { max-width:var(--section-max); margin:0 auto; position:relative; z-index:10; text-align:center; }
  .contact-pre { font-family:monospace; font-size:.75rem; text-transform:uppercase; letter-spacing:.2em; color:var(--c-sky); margin-bottom:2rem; }
  .contact-cta { font-size:clamp(2rem,8vw,8rem); font-family:var(--font-head); font-weight:900; letter-spacing:-.04em; line-height:.9; color:#ffffff; text-decoration:none; display:block; transition:all .6s; width:100%; overflow:hidden; }
  .contact-cta:hover { background:linear-gradient(135deg,var(--c-sky),var(--c-blue),#1d4ed8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .footer-bar { display:flex; justify-content:space-between; align-items:flex-end; margin-top:6rem; padding-top:2rem; border-top:1px solid rgba(255,255,255,.08); flex-wrap:wrap; gap:1rem; }
  .footer-links { display:flex; gap:2rem; }
  .footer-link { color:var(--c-subtle); text-decoration:none; font-weight:600; text-transform:uppercase; letter-spacing:.15em; font-size:.75rem; transition:color .2s; }
  .footer-link.behance:hover  { color:var(--c-sky); }
  .footer-link.linkedin:hover { color:var(--c-blue-lt); }
  .footer-copy { color:#1e293b; font-size:.7rem; font-family:monospace; text-transform:uppercase; letter-spacing:.15em; }

  /* ────────────────────────────────────────────────
     12. RESPONSIVE
  ──────────────────────────────────────────────── */
  @media (max-width: 768px) {
    :root { --section-px: 1.5rem; }
    .wrap { padding: 5rem var(--section-px); }
    .wrap-sm { padding-top: 4rem; padding-bottom: 4rem; }
    .nav-links { gap: 1rem; }
    .nav-link { font-size: .65rem; }
    .hero-location { top: 6rem; }
    .hero-stats { gap: 2rem; }
    .hero-stat-num { font-size: 1.4rem; }
    .hero-bottom-bar { flex-direction: column; align-items: center; gap: 1.5rem; text-align: center; }
    .hero-hook-inline { text-align: center; }
    .hero-name { font-size: clamp(2rem, 9vw, 3rem); line-height: 1.05; }
    .marquee-wrap { margin: 5rem 0; padding: 1.5rem 0; }
    .about-grid { grid-template-columns: 1fr; gap: 2rem; }
    .about-visual { display: none; }
    .project-featured { grid-template-columns: 1fr; gap: 2rem; padding: 4rem 0; }
    .project-featured.reverse { direction: ltr; }
    .project-title-big { font-size: clamp(2rem,8vw,3rem); }
    .project-img-wrap { order: -1; }
    .brands-wrap { padding: 3rem 0; min-height: auto; }
    .brands-row { gap: 2rem; }
    .brand-audi img, .brand-vw img, .brand-heinz img { height: 40px; }
    .brand-terpel img, .brand-bimbo img, .brand-colmedica img { height: 45px; }
    .brand-country img { height: 50px; }
    .contact-section { padding-top: 5rem; }
    .contact-cta { font-size: clamp(2rem,8vw,3.5rem); }
    .footer-bar { flex-direction: column; align-items: center; text-align: center; gap: 1.5rem; }
    .videos-secondary-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  }
  @media (pointer: coarse) {
    .cursor-dot, .cursor-ring { display: none !important; }
    * { cursor: auto !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// 2. COMPONENTES AUXILIARES
// ─────────────────────────────────────────────────────────────────────────────

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current,
      ring = ringRef.current;
    if (!dot || !ring) return;
    const onMove = ({ clientX: x, clientY: y }) => {
      dot.style.left = ring.style.left = `${x}px`;
      dot.style.top = ring.style.top = `${y}px`;
    };
    const onOver = ({ target }) => {
      const hit = !!target.closest("a,button,[data-cursor]");
      dot.classList.toggle("hovered", hit);
      ring.classList.toggle("hovered", hit);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);
  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

const Magnetic = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const onMove = ({ clientX, clientY }) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      el.style.transform = `translate(${
        (clientX - (left + width / 2)) * 0.2
      }px,${(clientY - (top + height / 2)) * 0.2}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0)";
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return (
    <div
      ref={ref}
      style={{
        display: "inline-block",
        transition: "transform .3s ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`fi ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Counter = ({ end, prefix = "", suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        let startTime = null;
        const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
        const animate = (ts) => {
          if (!startTime) startTime = ts;
          const p = Math.min((ts - startTime) / duration, 1);
          setCount(Math.floor(ease(p) * end));
          if (p < 1) requestAnimationFrame(animate);
          else setCount(end);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. BASE DE DATOS / INFORMACIÓN
// ─────────────────────────────────────────────────────────────────────────────
const INFO = {
  name: "JULIO CÉSAR",
  lastName: "HOSTIA",
  roles: ["DISEÑADOR GRÁFICO", "MOTION DESIGNER", "AI CREATIVE"],
  hook: "Motion, diseño y tecnología para construir experiencias visuales que conectan con las personas.",
  about:
    "Siempre me ha fascinado cómo el movimiento cambia la percepción de las cosas. Soy Diseñador Gráfico y Motion Designer, y mi enfoque es simple: crear piezas que se vean increíbles y comuniquen el mensaje correcto. Entiendo que el ritmo y la fluidez de una animación son tan importantes como los colores o la tipografía.",
  experience:
    "Mi experiencia en Buentipo Anchor me enseñó el valor de la precisión bajo presión. Ahí aprendí a no enamorarme de una sola idea, sino a adaptarme rápido a lo que necesita cada proyecto. En los últimos años también he incorporado herramientas de IA a mi proceso creativo, principalmente para investigar, contrastar referencias y explorar distintas direcciones visuales en etapas tempranas. Para mí, no reemplazan el criterio ni la ejecución; simplemente me permiten dedicar más tiempo a refinar los detalles, fortalecer los conceptos y elevar la calidad final de cada pieza.",
  email: "juliocesarbooking@gmail.com",
  linkedin: "https://www.linkedin.com/in/juliocesarbooking/",
  behance: "https://www.behance.net/jeezyceezy",
  cv: "https://drive.google.com/file/d/1_adxJUkwcAcGCbNnePjyoQwLsz-wRjbm/view?usp=sharing", 
  photo:
    "https://res.cloudinary.com/dg3g21ff8/image/upload/q_auto/f_auto/v1780281988/PORTFOLIO_FOTO_FINAL_mnpkel.png",
};

const PHILOSOPHY = [
  {
    step: "01 / 03",
    title: "Storytelling Visual",
    text: "Creo en el poder de la narrativa. Me enfoco en que cada corte de video o decisión de diseño tenga un propósito claro para conectar con la audiencia correcta.",
    tag: "EDICIÓN · NARRATIVA",
  },
  {
    step: "02 / 03",
    title: "Motion & Diseño",
    text: "De lo estático al movimiento. Disfruto participando en la construcción de piezas dinámicas, desde adaptaciones de marca hasta motion graphics que atrapen visualmente.",
    tag: "BRANDING · ANIMACIÓN",
  },
  {
    step: "03 / 03",
    title: "IA como aliada",
    text: "Utilizo herramientas generativas en mi día a día para agilizar procesos, explorar referencias visuales complejas rápidamente y potenciar mi flujo de trabajo creativo.",
    tag: "MIDJOURNEY · HIGGSFIELD",
  },
];

const TOOLS = [
  { cat: "CREATIVAS", items: ["Illustrator", "Photoshop", "Canva"] },
  {
    cat: "IA GENERATIVA",
    items: [
      "Midjourney",
      "Higgsfield",
      "ChatGPT",
      "Claude",
      "Gemini",
      "Perplexity",
    ],
  },
  { cat: "PRODUCCIÓN", items: ["After Effects", "Premiere Pro", "CapCut"] },
];

const VIDEOS_SEC = [
  {
    title: "Volkswagen",
    cat: "Motion / Digital",
    id: "1199106201", 
    padding: "177.78%", // Proporción 9:16 (Vertical)
    desc: "Campaña 'Arranque en pendiente' para la línea de Camiones y Buses."
  },
  {
    title: "Colmédica",
    cat: "Diseño / Animación",
    id: "1199108847", 
    padding: "177.78%", // Proporción 9:16 (Vertical)
    desc: "Manifiesto audiovisual sobre la importancia de la salud mental."
  },
  {
    title: "Salud",
    cat: "Motion / Video",
    id: "1199110243", 
    padding: "177.78%", // Proporción 9:16 (Vertical)
    desc: "Pieza destacando la especialidad médica perfecta para ti en Colmédica."
  },
  {
    title: "VW Jetta",
    cat: "Motion / Digital",
    id: "1199110729", 
    padding: "177.78%", // Proporción 9:16 (Vertical)
    desc: "Video para la campaña de performance enfocado en el VW Jetta."
  }
];

const PROJECTS = [
  {
    num: "01",
    total: "03",
    title: "Campaña Mundial",
    cat: "Campaña / Dirección de Arte",
    year: "2026",
    reverse: false,
    desc: "Concepto de campaña inspirado en la intensidad emocional del fútbol colombiano. Un sistema visual construido alrededor de la pasión, la identidad, la energía de la calle y la emoción colectiva del Mundial.",
    tags: ["Dirección de Arte", "Campaign Design", "Motion Design"],
    link: "https://www.behance.net/gallery/249951599/NO-JUEGAN-11-JUEGA-TODO-UN-PAIS",
    image:
      "https://res.cloudinary.com/dg3g21ff8/image/upload/q_auto/f_auto/v1780282701/ChatGPT_Image_May_19_2026_10_10_25_PM_lypm5g.png",
  },
  {
    num: "02",
    total: "03",
    title: "Audi Q5",
    cat: "Motion / Editorial Design",
    year: "2026",
    reverse: true,
    desc: "Campaña conceptual para el Audi Q5 con un sistema visual basado en arquitectura, movimiento y precisión. Key visuals, piezas editoriales y motion para construir una narrativa premium.",
    tags: ["Motion Design", "Key Visuals", "Editorial Design"],
    link: "https://www.behance.net/gallery/249546605/Audi-Q5-Campaign-Concept-2026",
    image:
      "https://res.cloudinary.com/dg3g21ff8/image/upload/f_auto,q_auto/ChatGPT_Image_May_3_2026_04_15_45_AM_qhxulj",
  },
  {
    num: "03",
    total: "03",
    title: "VW Tiguan",
    cat: "Campaña / Diseño Digital",
    year: "2026",
    reverse: false,
    desc: "Sistema de campaña visual que explora la versatilidad y el estilo de vida a través de una narrativa automotriz contemporánea. Diseño, adaptaciones digitales y dirección de arte para una marca que se mueve con su gente.",
    tags: ["Campaign Design", "Dirección de Arte", "Adaptaciones Digitales"],
    link: "https://www.behance.net/gallery/248658123/Volkswagen-Tiguan-Campaign-Concept",
    image:
      "https://res.cloudinary.com/dg3g21ff8/image/upload/q_auto/f_auto/v1780389186/TIGUAN_taerdx.png",
  },
];

const BRANDS = [
  {
    cls: "brand-audi",
    src: "https://res.cloudinary.com/dg3g21ff8/image/upload/v1780393407/LOGOS_AUDI_t3sjpi.png",
    alt: "Audi",
  },
  {
    cls: "brand-vw",
    src: "https://res.cloudinary.com/dg3g21ff8/image/upload/v1780393406/LOGOS_VW_jshcs1.png",
    alt: "Volkswagen",
  },
  {
    cls: "brand-terpel",
    src: "https://res.cloudinary.com/dg3g21ff8/image/upload/v1780393406/LOGOS_TERPEL_qgjrod.png",
    alt: "Terpel",
  },
  {
    cls: "brand-bimbo",
    src: "https://res.cloudinary.com/dg3g21ff8/image/upload/v1780393406/LOGOS_BIMBO_jnc3gl.png",
    alt: "Bimbo",
  },
  {
    cls: "brand-heinz",
    src: "https://res.cloudinary.com/dg3g21ff8/image/upload/v1780393407/LOGOS_HEINZ_ajosam.png",
    alt: "Heinz",
  },
  {
    cls: "brand-colmedica",
    src: "https://res.cloudinary.com/dg3g21ff8/image/upload/v1780393405/LOGOS_COLMEDICA_fwrsey.png",
    alt: "Colmédica",
  },
  {
    cls: "brand-country",
    src: "https://res.cloudinary.com/dg3g21ff8/image/upload/v1780393406/LOGOS_CLINICA_DEL_COUNTRY_jmzjot.png",
    alt: "Clínica del Country",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. APLICACIÓN PRINCIPAL (UI)
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const spotlightRef = useRef(null);
  const heroBgRef = useRef(null);

  // Manejador del menú on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Spotlight + Parallax en Hero
  useEffect(() => {
    const spotlight = spotlightRef.current;
    const heroBg = heroBgRef.current;
    if (!spotlight || !heroBg) return;
    const heroEl = heroBg.closest(".hero");
    const onMove = ({ clientX, clientY }) => {
      const rect = heroEl.getBoundingClientRect();
      if (clientY < rect.top || clientY > rect.bottom) {
        spotlight.style.opacity = "0";
        return;
      }
      const x = ((clientX / window.innerWidth) * 100).toFixed(1);
      const y = (((clientY - rect.top) / rect.height) * 100).toFixed(1);
      spotlight.style.background = `radial-gradient(circle 600px at ${x}% ${y}%, rgba(125,211,252,.15) 0%, rgba(37,99,235,.08) 40%, transparent 70%)`;
      spotlight.style.opacity = "1";
      heroBg.querySelector("img").style.transform = `translate(${
        (clientX / window.innerWidth - 0.5) * 12
      }px,${(clientY / window.innerHeight - 0.5) * 8}px) scale(1.06)`;
    };
    const onLeave = () => {
      spotlight.style.opacity = "0";
      heroBg.querySelector("img").style.transform =
        "translate(0,0) scale(1.04)";
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    heroEl.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      heroEl.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="pr">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <CustomCursor />
      <div className="orb orb-tl" />
      <div className="orb orb-br" />

      {/* ── NAV ── */}
      <nav className={`nav ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <Magnetic>
            <a href="#home" className="nav-logo">
              JC<span>.</span>
            </a>
          </Magnetic>
          <div className="nav-links">
            <Magnetic>
              <a href="#work" className="nav-link">
                Trabajo
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#about" className="nav-link">
                Info
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="nav-link accent">
                Contacto
              </a>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <div className="hero-bg" ref={heroBgRef}>
          <img
            src={INFO.photo}
            alt="Julio César"
            style={{
              transform: "scale(1.04)",
              transition: "transform .4s ease-out",
            }}
          />
        </div>
        <div className="hero-spotlight" ref={spotlightRef} />
        <div className="hero-location">Bogotá, Colombia</div>

        {/* nombre — anclado al fondo, entra desde la derecha */}
        <div className="hero-name-wrap">
          <h1 className="hero-name fh">
            <span>{INFO.name}</span>
            <span className="hero-name-accent">{INFO.lastName}</span>
          </h1>
        </div>

        {/* estadísticas */}
        <div className="hero-stats">
          {[
            { end: 4, prefix: "+", label: "Años de\nExperiencia" },
            { end: 50, prefix: "+", label: "Proyectos\nCompletados" },
            { end: 12, prefix: "+", label: "Marcas\nTrabajadas" },
          ].map((s, i) => (
            <div key={i} className="hero-stat-item">
              <span className="hero-stat-num">
                <Counter
                  end={s.end}
                  prefix={s.prefix}
                  duration={1500 + i * 250}
                />
              </span>
              <span
                className="hero-stat-label"
                style={{ whiteSpace: "pre-line" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* barra inferior: roles + hook */}
        <div className="hero-bottom-bar">
          <div className="hero-pill">
            <div className="ping-wrap">
              <div className="ping-ring" />
              <div className="ping-dot" />
            </div>
            <div className="rotator">
              <div className="rotator-inner">
                {[...INFO.roles, INFO.roles[0]].map((r, i) => (
                  <span key={i}>{r}</span>
                ))}
              </div>
            </div>
          </div>
          <p className="hero-hook-inline">{INFO.hook}</p>
        </div>

        <div className="scroll-hint">SCROLL ↓</div>
      </section>

      {/* ── MARQUEE SEPARADOR ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="marquee-item">
              &nbsp;DISEÑO VISUAL — MOTION GRAPHICS — INTELIGENCIA ARTIFICIAL —
              EDICIÓN DE VIDEO — DISEÑO VISUAL — MOTION GRAPHICS — INTELIGENCIA
              ARTIFICIAL — EDICIÓN DE VIDEO&nbsp;
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="wrap">
        <FadeIn>
          <div className="section-label mono">Sobre Mí</div>
        </FadeIn>
        <div className="about-grid">
          <FadeIn delay={50}>
            <div className="about-visual">
              <div className="av-ring-1">
                <div className="av-dot" />
              </div>
              <div className="av-ring-2">
                <div className="av-dot" />
              </div>
              <div className="av-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: "drop-shadow(0 0 8px rgba(56,189,248,.6))" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="8" />
                  <line x1="12" y1="16" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="8" y2="12" />
                  <line x1="16" y1="12" x2="22" y2="12" />
                </svg>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <h3 className="about-heading fh">{INFO.about}</h3>
            <p className="about-body">{INFO.experience}</p>
            <div className="btn-row">
              <a href={INFO.cv} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Download size={16} /> Descargar CV
              </a>
              <a
                href={INFO.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Behance <ArrowUpRight size={16} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ENFOQUE ── */}
      <section className="wrap wrap-sm section-divider">
        <FadeIn>
          <div className="section-label mono">Enfoque</div>
        </FadeIn>
        <div className="phil-grid">
          {PHILOSOPHY.map((item, i) => (
            <FadeIn key={i} delay={i * 150}>
              <div className="phil-card">
                <div>
                  <span className="phil-step mono">{item.step}</span>
                  <h4 className="phil-title fh">{item.title}</h4>
                  <p className="phil-text">{item.text}</p>
                </div>
                <span className="phil-tag mono">{item.tag}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── HERRAMIENTAS ── */}
      <section className="wrap section-divider">
        <FadeIn>
          <div className="section-label mono">Herramientas</div>
        </FadeIn>
        <div className="tool-grid">
          {TOOLS.map((block, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="tool-card">
                <span className="tool-cat mono">{block.cat}</span>
                <ul className="tool-list">
                  {block.items.map((t, j) => (
                    <li key={j} className="tool-item">
                      <span className="tool-dot" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── VIDEOS / SHOWREEL ── */}
      <section className="wrap wrap-sm section-divider" style={{ paddingBottom: "8rem" }}>
        <FadeIn>
          <div className="section-label mono" style={{ color: "var(--c-blue-lt)", marginBottom: "4rem" }}>
            <span style={{ width: 32, height: 1, background: "var(--c-blue-lt)", display: "inline-block", marginRight: ".5rem" }} />
            Piezas Audiovisuales
          </div>
        </FadeIn>
        
        {/* Showreel Principal (Full Width) */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h3 className="project-title-big fh" style={{ marginBottom: "0.5rem" }}>SHOWREEL 2026</h3>
            <span className="project-category-label mono" style={{ display: "inline-block" }}>MOTION / VIDEO</span>
          </div>
          
          <div className="video-container">
            <iframe 
              src="https://player.vimeo.com/video/1199102457?badge=0&autopause=0&player_id=0&app_id=58479&loop=1" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
              title="SHOWREEL 2026">
            </iframe>
          </div>
        </FadeIn>

        {/* Cuadrícula de Videos Secundarios (Volkswagen y Colmédica) */}
        <div className="videos-secondary-grid">
          {VIDEOS_SEC.map((vid, idx) => (
            <FadeIn key={idx} delay={idx * 150}>
              <div className="video-container" style={{ paddingBottom: vid.padding }}>
                <iframe 
                  src={`https://player.vimeo.com/video/${vid.id}?badge=0&autopause=0&player_id=0&app_id=58479&loop=1`} 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                  title={vid.title}>
                </iframe>
              </div>
              <div className="video-meta">
                <h4 className="video-title">{vid.title}</h4>
                <span className="video-cat">{vid.cat}</span>
                {vid.desc && <p className="video-desc">{vid.desc}</p>}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── PROYECTOS ── */}
      <section id="work" className="wrap section-divider">
        <FadeIn>
          <div
            className="section-label mono"
            style={{ color: "var(--c-blue-lt)" }}
          >
            <span
              style={{
                width: 32,
                height: 1,
                background: "var(--c-blue-lt)",
                display: "inline-block",
                marginRight: ".5rem",
              }}
            />
            Trabajo Destacado
          </div>
        </FadeIn>
        <div className="projects-list">
          {PROJECTS.map((p, i) => (
            <FadeIn key={i} delay={i * 120}>
              <div className={`project-featured ${p.reverse ? "reverse" : ""}`}>
                <div>
                  <div className="project-counter">
                    <span>{p.num}</span>
                    <div className="project-counter-line" />
                    <span style={{ color: "var(--c-muted)" }}>{p.total}</span>
                  </div>
                  <h3 className="project-title-big fh">{p.title}</h3>
                  <p className="project-category-label mono">{p.cat}</p>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tags">
                    {p.tags.map((tag, j) => (
                      <span key={j} className="project-tag mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="project-actions">
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-btn-primary"
                    >
                      Ver proyecto <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-img-wrap"
                >
                  <img src={p.image} alt={p.title} />
                  <div className="project-year-badge mono">{p.year}</div>
                </a>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ── MARCAS ── */}
        <FadeIn>
          <div className="brands-wrap">
            <div
              className="section-label mono"
              style={{ marginBottom: "4rem", color: "var(--c-blue-mid)" }}
            >
              Marcas con las que he colaborado
            </div>
            <div className="brands-grid">
              <div className="brands-row">
                {BRANDS.slice(0, 5).map((b, i) => (
                  <div key={i} className={`brand-item ${b.cls}`} title={b.alt}>
                    <img src={b.src} alt={b.alt} />
                  </div>
                ))}
              </div>
              <div className="brands-row">
                {BRANDS.slice(5).map((b, i) => (
                  <div key={i} className={`brand-item ${b.cls}`} title={b.alt}>
                    <img src={b.src} alt={b.alt} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contact" className="contact-section">
        <div className="contact-glow" />
        <div className="contact-inner">
          <FadeIn>
            <p className="contact-pre mono">¿Algo en mente? Cuéntame.</p>
            <Magnetic>
              <a href={`mailto:${INFO.email}`} className="contact-cta fh">
                HABLEMOS
              </a>
            </Magnetic>
            <div className="footer-bar">
              <div className="footer-links">
                <a
                  href={INFO.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link behance"
                >
                  Behance
                </a>
                <a
                  href={INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link linkedin"
                >
                  LinkedIn
                </a>
              </div>
              <p className="footer-copy mono">
                © {new Date().getFullYear()} JULIO CÉSAR HOSTIA
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}