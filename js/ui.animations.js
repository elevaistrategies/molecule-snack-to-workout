// UI animations + theme shifting.
// No libraries. Pure vibes.

(function(){
  const canvas = document.getElementById("fxCanvas");
  if(!canvas){
    // If FX layer is removed, don't break the app.
    window.UIFX = {
      setTheme: () => {},
      setReactorIntensity: () => {}
    };
    return;
  }
  const ctx = canvas.getContext("2d", { alpha:true });
  let w=0,h=0, dpr=1;
  const orbs = [];
  const ORB_COUNT = 18;

  // Theme map (accent colors are set via CSS variables)
  const THEMES = {
    endurance: { accent:"#7dd3fc", accent2:"#22c55e" },  // blue/green
    hiit:      { accent:"#fb7185", accent2:"#f59e0b" },  // hot pink/orange
    strength:  { accent:"#a78bfa", accent2:"#60a5fa" },  // purple/blue
    combat:    { accent:"#f59e0b", accent2:"#fb7185" },  // amber/pink
    sport:     { accent:"#22c55e", accent2:"#60a5fa" },  // green/blue
    recovery:  { accent:"#c4b5fd", accent2:"#7dd3fc" },  // soft lavender/blue
    functional:{ accent:"#f97316", accent2:"#a78bfa" },  // orange/purple
    default:   { accent:"#7dd3fc", accent2:"#a78bfa" }
  };

  function setTheme(cat){
    const t = THEMES[cat] || THEMES.default;
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent2", t.accent2);
  }

  function resize(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w+"px";
    canvas.style.height = h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function rand(a,b){ return a + Math.random()*(b-a); }

  function initOrbs(){
    orbs.length = 0;
    for(let i=0;i<ORB_COUNT;i++){
      orbs.push({
        x: rand(0,w), y: rand(0,h),
        r: rand(26, 90),
        vx: rand(-0.22, 0.22),
        vy: rand(-0.18, 0.18),
        p: rand(0, Math.PI*2),
        s: rand(0.6, 1.4),
      });
    }
  }

  function draw(tms){
    const t = tms * 0.001;
    ctx.clearRect(0,0,w,h);

    // faint haze
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0,0,w,h);

    // read current CSS variables (accents)
    const style = getComputedStyle(document.documentElement);
    const a1 = style.getPropertyValue("--accent").trim() || "#7dd3fc";
    const a2 = style.getPropertyValue("--accent2").trim() || "#a78bfa";

    // orbs
    for(const o of orbs){
      o.p += 0.004 * o.s;
      o.x += o.vx * 60 * (0.6 + 0.4*Math.sin(o.p));
      o.y += o.vy * 60 * (0.6 + 0.4*Math.cos(o.p*0.9));

      if(o.x < -120) o.x = w+120;
      if(o.x > w+120) o.x = -120;
      if(o.y < -120) o.y = h+120;
      if(o.y > h+120) o.y = -120;

      const pulse = 0.85 + 0.15*Math.sin(t*1.2 + o.p);
      const r = o.r * pulse;

      const g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
      g.addColorStop(0, hexToRgba((Math.random()<0.5?a1:a2), 0.18));
      g.addColorStop(0.6, "rgba(255,255,255,0.02)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x,o.y,r,0,Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    requestAnimationFrame(draw);
  }

  function hexToRgba(hex, a){
    const h = hex.replace("#","").trim();
    const full = h.length===3 ? h.split("").map(c=>c+c).join("") : h;
    const n = parseInt(full,16);
    const r = (n>>16)&255, g=(n>>8)&255, b=n&255;
    return `rgba(${r},${g},${b},${a})`;
  }

  // reactor motion (CSS-driven via class toggles)
  function setReactorIntensity(level){
    const el = document.getElementById("reactor");
    if(!el) return;
    el.dataset.intensity = level;
    // intensity affects animation speed via CSS custom property
    const speed = level==="high" ? 6 : level==="med" ? 10 : 14;
    document.documentElement.style.setProperty("--reactorSpeed", speed+"s");
  }

  // Export small API for app.js
  window.UIFX = { setTheme, setReactorIntensity };

  // boot
  resize();
  initOrbs();
  window.addEventListener("resize", ()=>{ resize(); initOrbs(); });

  // default
  setTheme("default");
  setReactorIntensity("low");
  requestAnimationFrame(draw);
})();
