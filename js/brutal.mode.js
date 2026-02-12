// js/brutal.mode.js
// Brutal Mode brain: generates varied, context-aware feedback.
// No math required here unless you want it — it can just *react* to the math.

(function () {
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function intensityFromMinutes(mins) {
    if (mins >= 90) return "nuclear";
    if (mins >= 60) return "high";
    if (mins >= 30) return "med";
    return "low";
  }

  // context:
  // { cal, mins, minsAdjusted, workoutLabel, burnRate, weightLbs, category }
  function getBrutalLine(ctx) {
    const lvl = intensityFromMinutes(ctx.minsAdjusted ?? ctx.mins);

    const lines = {
      low: [
        "Light work. Don’t celebrate yet. 😈",
        "This one’s a warm-up… not a pardon. 🧾",
        "Easy-ish. Don’t get cocky. 🥴",
      ],
      med: [
        "Mid-tier regret. Lace up. 😈",
        "That snack just scheduled a session. No cancellations. 🗓️",
        "You ate it. Now you date the grind. 💍",
      ],
      high: [
        "That snack is loud. Time to quiet it with sweat. 🔥",
        "Congrats, you bought yourself a workout. Receipts attached. 🧾😈",
        "This isn’t cardio… it’s consequences with a soundtrack. 🎧",
      ],
      nuclear: [
        "This is not a snack. This is an event. Train accordingly. ☢️",
        "You didn’t eat calories. You adopted them. Now walk them. 😈",
        "We’ve crossed into ‘character development’ territory. 📈",
      ],
    };

    return pick(lines[lvl] || lines.med);
  }

  function getBrutalContextLine(ctx) {
    // Optional “smart” line to reduce vagueness for all users
    const options = [
      `Real-world factor applied (fatigue/rest).`,
      `Same formula, less optimism.`,
      `Estimate tuned for humans, not robots.`,
    ];
    return pick(options);
  }

  // Export
  window.BrutalMode = {
    getBrutalLine,
    getBrutalContextLine,
  };
})();
