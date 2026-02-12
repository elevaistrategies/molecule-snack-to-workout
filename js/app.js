// App logic: presets, MET math, theming, hybrid plan, streaks.
// v3: guard rails so UI can't silently fail.

document.addEventListener("DOMContentLoaded", () => {
  const calInput = document.getElementById("cal");
  const weightInput = document.getElementById("weight");
  const modeSelect = document.getElementById("mode");
  const snackSelect = document.getElementById("snackPreset");
  const brutalToggle = document.getElementById("brutal");
  const hybridToggle = document.getElementById("hybrid");
  const out = document.getElementById("out");
  const streakEl = document.getElementById("streak");
  const hint = document.getElementById("hint");
  const versionEl = document.getElementById("version");
  const goBtn = document.getElementById("go");

  if(versionEl) versionEl.textContent = "v3";

  // If something critical is missing, fail loudly (friendly).
  function hardFail(msg){
    if(out) out.innerHTML = `<div class="kpi">⚠️ Something’s off</div><div class="small">${msg}</div>`;
    if(hint) hint.style.display = "block";
    console.error(msg);
  }

  if(!calInput || !weightInput || !modeSelect || !snackSelect || !goBtn || !out){
    hardFail("A required element is missing in index.html (inputs/select/button). Make sure you’re using the full v3 folder.");
    return;
  }

  if(!Array.isArray(window.WORKOUTS)){
    hardFail("WORKOUTS data did not load. Confirm ./js/data.workouts.js exists and the script tag path is correct.");
    return;
  }

  if(!Array.isArray(window.SNACKS)){
    hardFail("SNACKS data did not load. Confirm ./js/data.snacks.js exists and the script tag path is correct.");
    return;
  }

  // ----- Populate selects -----
  function populateWorkouts(){
    modeSelect.innerHTML = "";
    for(const w of window.WORKOUTS){
      const opt = document.createElement("option");
      opt.value = w.id;
      opt.textContent = w.label;
      opt.dataset.cat = w.cat || "default";
      modeSelect.appendChild(opt);
    }
  }

  function populateSnacks(){
    // keep the placeholder option
    const keepFirst = snackSelect.querySelector("option[value='']");
    snackSelect.innerHTML = "";
    if(keepFirst) snackSelect.appendChild(keepFirst);
    for(const s of window.SNACKS){
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.cal} kcal)`;
      opt.dataset.cal = String(s.cal);
      snackSelect.appendChild(opt);
    }
  }

  populateWorkouts();
  populateSnacks();

  // Snack preset -> fills calories
  snackSelect.addEventListener("change", () => {
    const opt = snackSelect.selectedOptions[0];
    const cal = Number(opt?.dataset?.cal || 0);
    if(cal > 0) calInput.value = String(cal);
  });

  function currentWorkout(){
    return window.WORKOUTS.find(w => w.id === modeSelect.value) || null;
  }

  function applyWorkoutTheme(){
    const w = currentWorkout();
    const cat = w?.cat || "default";
    try{
      window.UIFX?.setTheme?.(cat);
      const intensity = (cat==="hiit" || cat==="combat") ? "high"
        : (cat==="strength" || cat==="sport" || cat==="functional") ? "med"
        : "low";
      window.UIFX?.setReactorIntensity?.(intensity);
    }catch(e){
      console.warn("UIFX error (non-fatal):", e);
    }
  }
  modeSelect.addEventListener("change", applyWorkoutTheme);
  applyWorkoutTheme();

  // ----- MET math -----
  // Calories per minute = MET * weight(kg) * 0.0175
  function caloriesPerMinute(met, weightLbs){
    const kg = weightLbs * 0.45359237;
    return met * kg * 0.0175;
  }

  function fmtTime(min){
    if(!isFinite(min) || min <= 0) return "0 min";
    if(min < 60) return `${Math.round(min)} min`;
    const h = Math.floor(min/60);
    const m = Math.round(min % 60);
    return `${h} hr ${m} min`;
  }

  // ----- Hybrid plan -----
  function hybridPlan(totalMin){
    // split: 35% HIIT, 45% strength, 20% mobility
    const hiit = totalMin * 0.35;
    const strength = totalMin * 0.45;
    const mobility = totalMin * 0.20;

    return [
      { label:"HIIT burst", min: hiit },
      { label:"Strength work", min: strength },
      { label:"Mobility reset", min: mobility },
    ];
  }

  // ----- Streaks / stats -----
  const KEY = "stw_stats_v1";
  function loadStats(){
    try{ return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch{ return {}; }
  }
  function saveStats(stats){
    localStorage.setItem(KEY, JSON.stringify(stats));
  }
  function todayStr(){
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,"0");
    const da = String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${da}`;
  }
  function renderStats(){
    if(!streakEl) return;
    const s = loadStats();
    if(!s.lastDate){
      streakEl.textContent = "No streak yet. First rep starts today. 🧠";
      return;
    }
    streakEl.textContent = `Streak: ${s.streak || 1} day(s) • Today: ${Math.round(s.todayCalories||0)} kcal • Total: ${Math.round(s.totalCalories||0)} kcal`;
  }
  function updateStats(addCalories){
    const stats = loadStats();
    const today = todayStr();

    if(stats.lastDate === today){
      stats.todayCalories = (stats.todayCalories || 0) + addCalories;
    }else{
      const last = stats.lastDate ? new Date(stats.lastDate + "T00:00:00") : null;
      const now = new Date(today + "T00:00:00");
      const diffDays = last ? Math.round((now-last)/(1000*60*60*24)) : 999;
      stats.streak = (diffDays === 1) ? (stats.streak || 0) + 1 : 1;
      stats.todayCalories = addCalories;
      stats.lastDate = today;
    }
    stats.totalCalories = (stats.totalCalories || 0) + addCalories;
    saveStats(stats);
    renderStats();
  }
  renderStats();

  // ----- Convert -----
  goBtn.addEventListener("click", () => {
    const cal = Number(calInput.value);
    const weight = Number(weightInput.value);
    const w = currentWorkout();

    if(!isFinite(cal) || cal <= 0){
      out.innerHTML = `<div class="small">Enter calories (number > 0). Example: <strong>350</strong>.</div>`;
      return;
    }
    if(!isFinite(weight) || weight <= 0){
      out.innerHTML = `<div class="small">Enter your bodyweight in pounds. Example: <strong>180</strong>.</div>`;
      return;
    }
    if(!w){
      out.innerHTML = `<div class="small">Pick a workout type.</div>`;
      return;
    }

    const rate = caloriesPerMinute(w.met, weight);
    const mins = cal / rate;

    // After you calculate: const mins = cal / rate;

const brutal = brutalToggle.checked;

// Optional “real-world” adjustment (fatigue/rest) ONLY in Brutal Mode:
const minsAdjusted = brutal ? mins * 1.15 : mins;

let headline = `${Math.round(cal)} kcal ≈ ${fmtTime(minsAdjusted)} of ${w.label}`;
let sub = `MET estimate • Weight: ${Math.round(weight)} lbs • Burn rate ≈ ${rate.toFixed(1)} kcal/min`;

if (brutal) {
  const brutalLine = window.BrutalMode?.getBrutalLine?.({
    cal,
    mins,
    minsAdjusted,
    workoutLabel: w.label,
    burnRate: rate,
    weightLbs: weight,
    category: w.cat,
  }) || "No shortcuts. Lace up. 😈";

  const contextLine = window.BrutalMode?.getBrutalContextLine?.({
    cal,
    mins,
    minsAdjusted,
    burnRate: rate,
  }) || "Same math, spicier tone.";

  sub = `${brutalLine} • ${contextLine}`;
}

    const hybrid = !!hybridToggle?.checked;

    const headline = `${Math.round(cal)} kcal ≈ ${fmtTime(mins)} of ${w.label}`;
    const sub = brutal
      ? `Brutal Mode is just wording. Math is unchanged. Burn ≈ ${rate.toFixed(1)} kcal/min 😈`
      : `MET estimate • Weight: ${Math.round(weight)} lbs • Burn ≈ ${rate.toFixed(1)} kcal/min`;

    let extra = "";
    if(hybrid){
      const plan = hybridPlan(mins);
      extra = `
        <div class="small" style="margin-top:.55rem;"><strong>Hybrid “Erase It” Plan</strong> (a mini-session split)</div>
        <div class="small">• ${fmtTime(plan[0].min)} — ${plan[0].label}</div>
        <div class="small">• ${fmtTime(plan[1].min)} — ${plan[1].label}</div>
        <div class="small">• ${fmtTime(plan[2].min)} — ${plan[2].label}</div>
      `;
    }

    out.innerHTML = `
      <div class="kpi">${headline}</div>
      <div class="small">${sub}</div>
      ${extra}
    `;

    updateStats(cal);
  });
});
