const calInput = document.getElementById("cal");
const weightInput = document.getElementById("weight");
const modeSelect = document.getElementById("mode");
const brutalToggle = document.getElementById("brutal");
const out = document.getElementById("out");

WORKOUTS.forEach(w=>{
  const opt=document.createElement("option");
  opt.value=w.id;
  opt.textContent=w.label;
  modeSelect.appendChild(opt);
});

function caloriesPerMinute(met, weightLbs){
  const kg = weightLbs * 0.453592;
  return met * kg * 0.0175;
}

document.getElementById("go").addEventListener("click",()=>{
  const cal = Number(calInput.value);
  const weight = Number(weightInput.value);
  const workout = WORKOUTS.find(w=>w.id===modeSelect.value);

  if(!cal || !weight || !workout){
    out.textContent="Enter real numbers. Physics is watching.";
    return;
  }

  const burnRate = caloriesPerMinute(workout.met, weight);
  const minutes = cal / burnRate;

  const formatted = minutes<60
    ? Math.round(minutes)+" min"
    : Math.floor(minutes/60)+" hr "+Math.round(minutes%60)+" min";

  if(brutalToggle.checked){
    out.textContent = cal+" kcal ≈ "+formatted+" of "+workout.label+". No shortcuts. Lace up.";
  }else{
    out.textContent = cal+" kcal ≈ "+formatted+" of "+workout.label+".";
  }
});
