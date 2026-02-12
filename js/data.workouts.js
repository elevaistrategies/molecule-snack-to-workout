// Workout library (MET values) + category for theming.
// MET values generally align with the Compendium of Physical Activities (approximate ranges).
const WORKOUTS = [
  // Endurance
  { id:"run6",  label:"Running (6 mph / 10-min mile)", met:9.8,  cat:"endurance" },
  { id:"run8",  label:"Running (8 mph / 7.5-min mile)", met:11.8, cat:"endurance" },
  { id:"walk",  label:"Brisk Walking (3.5 mph)", met:4.3,  cat:"endurance" },
  { id:"hike",  label:"Hiking (moderate)", met:6.0,  cat:"endurance" },
  { id:"stairs",label:"Stair Climbing", met:8.8,  cat:"endurance" },
  { id:"cycle", label:"Cycling (moderate)", met:7.5,  cat:"endurance" },
  { id:"swim",  label:"Swimming (moderate)", met:6.0,  cat:"endurance" },
  { id:"row",   label:"Rowing Machine (vigorous)", met:8.5, cat:"endurance" },

  // HIIT / Explosive
  { id:"hiit",  label:"HIIT Circuit", met:10.0, cat:"hiit" },
  { id:"sprint",label:"Sprint Intervals", met:12.5, cat:"hiit" },
  { id:"burpee",label:"Burpees (continuous)", met:10.0, cat:"hiit" },
  { id:"rope",  label:"Jump Rope (moderate)", met:11.0, cat:"hiit" },
  { id:"assault",label:"Assault Bike (hard)", met:12.0, cat:"hiit" },

  // Strength
  { id:"lift_mod", label:"Weight Training (moderate)", met:6.0, cat:"strength" },
  { id:"lift_vig", label:"Weight Training (vigorous)", met:8.0, cat:"strength" },
  { id:"calis",    label:"Calisthenics (moderate)", met:6.5, cat:"strength" },
  { id:"kbell",    label:"Kettlebell Swings", met:9.0, cat:"strength" },
  { id:"sled",     label:"Sled Push / Pull", met:10.0, cat:"strength" },

  // Combat
  { id:"bag",   label:"Boxing (heavy bag)", met:8.0, cat:"combat" },
  { id:"shadow",label:"Shadowboxing", met:6.0, cat:"combat" },
  { id:"spar",  label:"Sparring (boxing/kickboxing)", met:12.0, cat:"combat" },
  { id:"bjj",   label:"BJJ Rolling", met:10.0, cat:"combat" },

  // Sport
  { id:"basket",label:"Basketball (full court)", met:8.0, cat:"sport" },
  { id:"soccer",label:"Soccer (game)", met:10.0, cat:"sport" },
  { id:"tennis",label:"Tennis (singles)", met:8.0, cat:"sport" },

  // Recovery / Mobility
  { id:"yoga",  label:"Power Yoga / Vinyasa", met:4.0, cat:"recovery" },
  { id:"pilates",label:"Pilates", met:3.5, cat:"recovery" },
  { id:"mobility",label:"Mobility Flow", met:2.8, cat:"recovery" },

  // Unorthodox / Functional
  { id:"ruck",  label:"Rucking (weighted walk)", met:7.0, cat:"functional" },
  { id:"carry", label:"Farmer Carries (loaded)", met:8.0, cat:"functional" },
  { id:"sandbag",label:"Sandbag Training", met:9.0, cat:"functional" },
];
