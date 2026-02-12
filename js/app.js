// App logic: presets, MET math, theming, hybrid plan, streaks.
const calInput = document.getElementById("cal");
const weightInput = document.getElementById("weight");
const modeSelect = document.getElementById("mode");
const snackSelect = document.getElementById("snackPreset");
const brutalToggle = document.getElementById("brutal");
const hybridToggle = document.getElementById("hybrid");
const out = document.getElementById("out");
const streakEl = document.getElementById("streak");
document.getElementById("version").textContent = "v2";

// ----- Populate selects -----
function populateWorkouts(){
  modeSelect.innerHTML = "";
  for(const w of WORKOUTS){
    const opt = document.createElement("option");
    opt.value = w.id;
    opt.textContent = w.label;
    opt.dataset.cat = w.cat || "default";
    modeSelect.appendChild(opt);
  }
}

function populateSnacks(){
  for(const s of SNACKS){
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = `${s.name} (${s.cal} kcal)`;
    opt.dataset.cal = String(s.cal);
    snackSelect.appendChild(opt);
  }
}

populateWorkouts();
populateSnacks();

// ----- Theme + intensity reactions -----
function currentWorkout(){
  return WORKOUTS.find(w => w.id === modeSelect.value) || null;
}

function applyWorkoutTheme(){
  const w = currentWorkout();
  const cat = w?.cat || "default";
  if(window.UIFX?.setTheme) window.UIFX.setTheme(cat);

  // crank reactor for HIIT/combat a bit
  const intensity = (cat==="hiit" || cat==="combat") ? "high" : (cat==="strength" || cat==="sport" || cat==="functional") ? "med" : "low";
  if(window.UIFX?.setReactorIntensity) window.UIFX.setReactorIntensity(intensity);
}

modeSelect.addEventListener("change", applyWorkoutTheme);
applyWorkoutTheme();

// Snack preset -> fills calories
snackSelect.addEventListener("change", () => {
  const opt = snackSelect.selectedOptions[0];
  const cal = Number(opt?.dataset?.cal || 0);
  if(cal > 0) calInput.value = String(cal);
});

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

// ----- Streaks / stats (localStorage) -----
const KEY = "stw_stats_v1";
function loadStats(){
  try{
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  }catch{ return {}; }
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
function updateStats(addCalories){
  const stats = loadStats();
  const today = todayStr();
  if(stats.lastDate === today){
    stats.todayCalories = (stats.todayCalories || 0) + addCalories;
  }else{
    // streak logic: if lastDate was yesterday, +1, else reset
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

function renderStats(){
  const s = loadStats();
  if(!s.lastDate){
    streakEl.textContent = "No streak yet. First rep starts today. 🧠";
    return;
  }
  streakEl.textContent = `Streak: ${s.streak || 1} day(s) • Today: ${Math.round(s.todayCalories||0)} kcal • Total: ${Math.round(s.totalCalories||0)} kcal`;
}
renderStats();

// ----- Convert -----
document.getElementById("go").addEventListener("click", () => {
  const cal = Number(calInput.value);
  const weight = Number(weightInput.value);
  const w = currentWorkout();

  if(!isFinite(cal) || cal <= 0){
    out.innerHTML = `<div class="muted">Give me a real number of calories and I’ll do the math. 🧮</div>`;
    return;
  }
  if(!isFinite(weight) || weight <= 0){
    out.innerHTML = `<div class="muted">Bodyweight needed. The laws of thermodynamics demand paperwork. 📋</div>`;
    return;
  }
  if(!w){
    out.innerHTML = `<div class="muted">Pick a workout type first.</div>`;
    return;
  }

  const rate = caloriesPerMinute(w.met, weight);
  const mins = cal / rate;

  // Output
  const brutal = brutalToggle.checked;
  const hybrid = hybridToggle.checked;

  let headline = `${Math.round(cal)} kcal ≈ ${fmtTime(mins)} of ${w.label}`;
  let sub = `MET estimate • Weight: ${Math.round(weight)} lbs • Burn rate ≈ ${rate.toFixed(1)} kcal/min`;
  if(brutal){
    sub = `No shortcuts. No wizardry. Just reps. 😈 • Burn ≈ ${rate.toFixed(1)} kcal/min`;
  }

  let extra = "";
  if(hybrid){
    const plan = hybridPlan(mins);
    extra = `
      <div class="small"><strong>Hybrid “Erase It” Plan</strong></div>
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
