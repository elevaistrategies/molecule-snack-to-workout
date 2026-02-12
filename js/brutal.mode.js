// brutal.mode.js — Full Chaos Expansion Pack
// Drop-in replacement for your existing Brutal Mode brain.
// Keeps the original API:
//   BrutalMode.getBrutalLine(ctx)
//   BrutalMode.getBrutalContextLine(ctx)
// Adds (optional):
//   BrutalMode.getBrutalBundle(ctx) -> { primary, secondary, context, tier }

(function () {
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function intensityFromMinutes(mins) {
    if (mins >= 90) return "nuclear";
    if (mins >= 60) return "high";
    if (mins >= 30) return "med";
    return "low";
  }

  // A little chaos seasoning:
  // - Sometimes add a second line
  // - Sometimes add a context line
  // - Weight probability by intensity
  function chaosProfile(tier) {
    const map = {
      low:     { second: 0.12, context: 0.10 },
      med:     { second: 0.22, context: 0.14 },
      high:    { second: 0.34, context: 0.18 },
      nuclear: { second: 0.48, context: 0.22 },
    };
    return map[tier] || map.med;
  }

  function safeNumber(x, fallback) {
    const n = Number(x);
    return Number.isFinite(n) ? n : fallback;
  }

  // context:
  // { cal, mins, minsAdjusted, workoutLabel, burnRate, weightLbs, category }
  function buildMeta(ctx) {
    const mins = safeNumber(ctx.minsAdjusted ?? ctx.mins, 0);
    const cal = safeNumber(ctx.cal, 0);
    const w = safeNumber(ctx.weightLbs, 0);
    const label = (ctx.workoutLabel || "").trim();
    const cat = (ctx.category || "").trim();
    const tier = intensityFromMinutes(mins);

    return {
      mins,
      cal,
      weightLbs: w,
      workoutLabel: label,
      category: cat,
      tier,
    };
  }

    const LOW_LINES = [
      "Light work. Don’t retire yet. 😈",
      "Warm-up energy. Main character still asleep. 🥱",
      "You tickled the calories. They barely noticed. 👀",
      "Soft consequences. For now. 🧾",
      "That was effort. Not execution. 🥊",
      "Calories shrugged. Cute. 🤷",
      "Your sweat glands just clocked in. ⏱️",
      "Beginner villain arc. 🦹‍♂️",
      "Polite cardio. Dangerous habit. 🚶",
      "Barely a warning shot. 🔫",
      "That extra serving basically activated hard mode. 🏀",
      "That swipe of sauce proudly moved the finish line. 🧾",
      "That plate proudly scheduled overtime. 🧾",
      "That snack openly activated hard mode. 🥊",
      "That donut literally turned your goals into a suggestion. ⚠️",
      "That swipe of sauce just challenged your conditioning. 🔥",
      "Low reminder: the mirror is an honest snitch. 🪞",
      "That bite just filed paperwork. 🗓️",
      "That extra serving literally called gravity for backup. ⚠️",
      "That latte accidentally wrote a love letter to fatigue. 🔥",
      "That bite accidentally scheduled overtime. 🏀",
      "That latte literally activated hard mode. ☢️",
      "That bite literally challenged your conditioning. 🥊",
      "That snack openly turned your goals into a suggestion. ⏱️",
      "That swipe of sauce just added a chapter to your villain arc. 🥊",
      "That plate just activated hard mode. 📉",
      "That swipe of sauce accidentally wrote a love letter to fatigue. 😈",
      "That snack accidentally called gravity for backup. 🗓️",
      "That plate accidentally moved the finish line. ⏱️",
      "That bite accidentally invited consequences over. ☢️",
      "That extra serving quietly raised your training tax. ⏱️",
      "That late-night munch proudly challenged your conditioning. 🏀",
      "That donut proudly reset your discipline clock. 🗓️",
      "Low reminder: you can’t PR (personal record) your way out of inconsistency. 🏋️",
      "That latte quietly raised your training tax. 🗓️",
      "That bite quietly moved the finish line. ☢️",
      "Low reminder: train like you mean it, eat like you mean it. 🎯",
      "That late-night munch openly moved the finish line. 🗓️",
      "That extra serving proudly turned your goals into a suggestion. 📈",
      "That extra serving quietly challenged your conditioning. 🧾",
      "That snack openly hit your consistency with a chair. 🔥",
      "Low reminder: motivation is a spark. Discipline is the grid. ⚡",
      "That latte proudly reset your discipline clock. 😈",
      "That donut openly scheduled overtime. 😈",
      "That bite proudly wrote a love letter to fatigue. 📈",
      "That donut just moved the finish line. 🥊",
      "That snack literally moved the finish line. ⏱️",
      "That swipe of sauce accidentally filed paperwork. 🥊",
      "That latte accidentally invited consequences over. ☢️",
      "That snack basically wrote a love letter to fatigue. 😈",
      "That plate proudly filed paperwork. 🏀",
      "That snack openly raised your training tax. ⚠️",
      "That plate accidentally raised your training tax. 📉",
      "That swipe of sauce quietly turned your goals into a suggestion. 🔥",
      "That swipe of sauce basically hit your consistency with a chair. 🗓️",
      "That donut basically activated hard mode. 😈",
      "That latte accidentally turned your goals into a suggestion. 🗓️",
      "That late-night munch quietly called gravity for backup. 🥊",
      "That plate openly wrote a love letter to fatigue. ⚠️",
      "That “quick” treat just activated hard mode. 🏀",
      "That plate proudly challenged your conditioning. 🗓️",
      "That plate basically turned your goals into a suggestion. 🔥",
      "That late-night munch openly raised your training tax. 😈",
      "That swipe of sauce accidentally raised your training tax. 🗓️",
      "That donut basically challenged your conditioning. 🥊",
      "That “quick” treat literally reset your discipline clock. ⏱️",
      "That extra serving just scheduled overtime. 🏀",
      "That “quick” treat basically wrote a love letter to fatigue. 🥊",
      "That “quick” treat literally raised your training tax. 📈",
      "That snack just reset your discipline clock. 😈",
      "That “quick” treat accidentally added a chapter to your villain arc. 🧾",
      "That extra serving literally reset your discipline clock. 📉",
      "That late-night munch basically wrote a love letter to fatigue. 🧾",
      "That late-night munch proudly scheduled overtime. 🥊",
      "That donut basically wrote a love letter to fatigue. 🔥",
      "That snack quietly added a chapter to your villain arc. 😈",
      "That extra serving accidentally invited consequences over. 🥊",
      "That donut accidentally called gravity for backup. 📈",
      "That latte accidentally challenged your conditioning. ⏱️",
      "That plate openly reset your discipline clock. ⚠️",
      "Low reminder: comfort now is interest later. 💳",
      "Low reminder: calories are numbers, not negotiators. 🔢",
      "That swipe of sauce just scheduled overtime. 📈",
      "That bite just activated hard mode. 🗓️",
      "That snack accidentally filed paperwork. 📈",
      "That swipe of sauce just reset your discipline clock. 📉",
      "That latte just scheduled overtime. 🥊",
      "That swipe of sauce openly invited consequences over. 📈",
      "That extra serving just filed paperwork. 🔥",
      "That bite openly raised your training tax. 🗓️",
    ];

    const MED_LINES = [
      "You ate it. Now earn it. 🧾",
      "Mid-tier regret activated. Lace up. 😈",
      "That snack booked another session. No refunds. 🗓️",
      "Every bite negotiates your future. You negotiated poorly. 📉",
      "Sweat is the apology. Start writing. 💦",
      "This is restitution with sneakers. 👟",
      "You can’t outtalk a calorie. 🗣️🚫",
      "Comfort is expensive. Interest is due. 💸",
      "You fed the wrong version of you. Fix it. 🪞",
      "Your future self just sent a warning email. 📧",
      "That swipe of sauce accidentally scheduled overtime. 📈",
      "That snack literally challenged your conditioning. 📉",
      "That bite literally added a chapter to your villain arc. 📉",
      "That plate just called gravity for backup. 🗓️",
      "That late-night munch quietly moved the finish line. 📈",
      "Mid reminder: calories are numbers, not negotiators. 🔢",
      "That plate just scheduled overtime. ⚠️",
      "That extra serving accidentally wrote a love letter to fatigue. 📈",
      "That snack quietly activated hard mode. 📉",
      "That bite quietly scheduled overtime. 🥊",
      "That swipe of sauce openly reset your discipline clock. 😈",
      "That extra serving accidentally activated hard mode. ⚠️",
      "That plate literally moved the finish line. 📈",
      "That swipe of sauce just hit your consistency with a chair. 🔥",
      "That snack literally scheduled overtime. 🧾",
      "That snack proudly called gravity for backup. 🏀",
      "That plate quietly activated hard mode. 📉",
      "That late-night munch quietly reset your discipline clock. 📈",
      "That extra serving accidentally challenged your conditioning. ☢️",
      "That plate basically filed paperwork. 😈",
      "That plate proudly challenged your conditioning. 🗓️",
      "That late-night munch just activated hard mode. 🥊",
      "Mid reminder: train like you mean it, eat like you mean it. 🎯",
      "That donut quietly turned your goals into a suggestion. 🏀",
      "That donut just activated hard mode. 📈",
      "That latte quietly reset your discipline clock. ⚠️",
      "That late-night munch proudly added a chapter to your villain arc. 🧾",
      "That extra serving openly invited consequences over. 📈",
      "That swipe of sauce accidentally wrote a love letter to fatigue. 🏀",
      "That donut just moved the finish line. 🗓️",
      "That bite literally reset your discipline clock. 🧾",
      "Mid reminder: comfort now is interest later. 💳",
      "That latte accidentally raised your training tax. 🥊",
      "That late-night munch accidentally challenged your conditioning. 🔥",
      "That bite literally called gravity for backup. ⏱️",
      "That latte basically challenged your conditioning. 📈",
      "That “quick” treat accidentally invited consequences over. 📉",
      "That extra serving accidentally moved the finish line. 🔥",
      "That plate proudly reset your discipline clock. 🔥",
      "That bite quietly wrote a love letter to fatigue. ☢️",
      "That late-night munch openly hit your consistency with a chair. ⏱️",
      "That late-night munch literally called gravity for backup. ☢️",
      "That extra serving quietly filed paperwork. 📉",
      "That “quick” treat quietly raised your training tax. 🏀",
      "That donut just wrote a love letter to fatigue. 🗓️",
      "That donut accidentally called gravity for backup. 🗓️",
      "That late-night munch accidentally filed paperwork. 🏀",
      "That extra serving openly reset your discipline clock. ☢️",
      "That “quick” treat literally called gravity for backup. 📉",
      "That “quick” treat just activated hard mode. ☢️",
      "That swipe of sauce openly challenged your conditioning. 🧾",
      "That donut proudly added a chapter to your villain arc. 🏀",
      "That extra serving openly scheduled overtime. 📈",
      "That late-night munch literally raised your training tax. 🔥",
      "That bite just moved the finish line. 🧾",
      "That donut just scheduled overtime. ⚠️",
      "That “quick” treat proudly scheduled overtime. 🏀",
      "Mid reminder: your body tracks patterns, not promises. 📊",
      "That late-night munch basically scheduled overtime. 🗓️",
      "That donut just filed paperwork. ⚠️",
      "That snack basically raised your training tax. 🏀",
      "That latte proudly added a chapter to your villain arc. 🏀",
      "That swipe of sauce openly filed paperwork. ⏱️",
      "That “quick” treat basically moved the finish line. 🧾",
      "That “quick” treat openly turned your goals into a suggestion. 🥊",
      "That bite literally activated hard mode. 📉",
      "That donut basically challenged your conditioning. ⏱️",
      "That bite basically filed paperwork. 🔥",
      "That donut quietly reset your discipline clock. 🧾",
      "That swipe of sauce just added a chapter to your villain arc. 🗓️",
      "That “quick” treat quietly reset your discipline clock. ☢️",
      "Mid reminder: motivation is a spark. Discipline is the grid. ⚡",
      "That “quick” treat quietly challenged your conditioning. 🏀",
      "That latte openly moved the finish line. ⏱️",
      "That snack accidentally wrote a love letter to fatigue. ☢️",
      "That snack openly hit your consistency with a chair. 🧾",
      "That latte just hit your consistency with a chair. 📉",
      "That swipe of sauce literally moved the finish line. 🧾",
      "That latte basically turned your goals into a suggestion. 😈",
      "That “quick” treat openly filed paperwork. 📈",
      "That “quick” treat basically wrote a love letter to fatigue. 😈",
      "That swipe of sauce literally invited consequences over. ⏱️",
      "That donut proudly hit your consistency with a chair. 🥊",
      "That bite proudly hit your consistency with a chair. 🗓️",
      "That snack quietly invited consequences over. 🏀",
      "Mid reminder: the mirror is an honest snitch. 🪞",
      "That latte literally invited consequences over. 🗓️",
      "That bite literally challenged your conditioning. 📉",
      "That latte openly scheduled overtime. 😈",
      "That latte quietly called gravity for backup. 🔥",
      "That snack literally added a chapter to your villain arc. ☢️",
      "Mid reminder: you can’t PR (personal record) your way out of inconsistency. 🏋️",
      "That extra serving just raised your training tax. 🥊",
      "That plate openly invited consequences over. ⚠️",
      "That plate basically added a chapter to your villain arc. ☢️",
      "That bite basically raised your training tax. ⏱️",
      "That “quick” treat literally added a chapter to your villain arc. ⚠️",
      "That bite literally turned your goals into a suggestion. 🥊",
      "That snack accidentally turned your goals into a suggestion. 🥊",
      "That swipe of sauce accidentally called gravity for backup. ⚠️",
      "That donut basically invited consequences over. 🔥",
      "That latte quietly filed paperwork. ☢️",
      "That swipe of sauce basically turned your goals into a suggestion. 🧾",
      "That extra serving just turned your goals into a suggestion. 📈",
      "That plate accidentally turned your goals into a suggestion. 📉",
      "That latte just activated hard mode. 🧾",
      "That snack proudly moved the finish line. ⚠️",
      "That donut literally raised your training tax. 📉",
      "That plate literally hit your consistency with a chair. 📈",
      "That late-night munch just turned your goals into a suggestion. 🔥",
    ];

    const HIGH_LINES = [
      "This isn’t cardio… it’s consequences with a soundtrack. 🎧",
      "That snack is loud. Quiet it with sweat. 🔥",
      "Your body keeps receipts. 🧾",
      "You want bounce? Stop anchoring yourself. 🏀⚓",
      "Physics doesn’t care about cravings. 🧠🚫",
      "You trained hard. Then you betrayed the blueprint. 🗺️",
      "Discipline isn’t seasonal. 🌦️",
      "You don’t burn this off. You rebuild authority. 👑",
      "Elite is repetition, not enthusiasm. 🔁",
      "Gravity appreciates your donation. 🧲",
      "High reminder: calories are numbers, not negotiators. 🔢",
      "That swipe of sauce just moved the finish line. 🧾",
      "That extra serving literally activated hard mode. 🥊",
      "That extra serving accidentally filed paperwork. ⏱️",
      "That latte basically filed paperwork. ⚠️",
      "That swipe of sauce proudly reset your discipline clock. 📈",
      "That late-night munch openly wrote a love letter to fatigue. ⚠️",
      "That plate literally added a chapter to your villain arc. ⏱️",
      "That extra serving basically hit your consistency with a chair. ☢️",
      "That swipe of sauce accidentally hit your consistency with a chair. 🏀",
      "That swipe of sauce literally activated hard mode. 🗓️",
      "That snack proudly added a chapter to your villain arc. 😈",
      "High reminder: comfort now is interest later. 💳",
      "That plate basically filed paperwork. 📉",
      "That late-night munch quietly called gravity for backup. 🔥",
      "That late-night munch proudly moved the finish line. 🗓️",
      "That “quick” treat openly moved the finish line. 📈",
      "That plate basically called gravity for backup. ⏱️",
      "That swipe of sauce literally invited consequences over. ☢️",
      "That latte proudly reset your discipline clock. ☢️",
      "That donut accidentally filed paperwork. ⏱️",
      "That bite proudly raised your training tax. 🗓️",
      "That late-night munch quietly turned your goals into a suggestion. 🏀",
      "That bite basically wrote a love letter to fatigue. 🧾",
      "That late-night munch basically added a chapter to your villain arc. ⚠️",
      "That bite proudly hit your consistency with a chair. 🧾",
      "That swipe of sauce basically turned your goals into a suggestion. 🥊",
      "That late-night munch accidentally activated hard mode. ⚠️",
      "That late-night munch accidentally filed paperwork. ⚠️",
      "That swipe of sauce quietly raised your training tax. 🗓️",
      "That plate just hit your consistency with a chair. ☢️",
      "That swipe of sauce literally challenged your conditioning. 😈",
      "That bite just invited consequences over. ⚠️",
      "That “quick” treat openly added a chapter to your villain arc. ⏱️",
      "That swipe of sauce openly scheduled overtime. 🥊",
      "That swipe of sauce openly wrote a love letter to fatigue. 🔥",
      "That snack quietly reset your discipline clock. 🧾",
      "That donut quietly challenged your conditioning. 🗓️",
      "That “quick” treat just wrote a love letter to fatigue. 🧾",
      "High reminder: motivation is a spark. Discipline is the grid. ⚡",
      "High reminder: you can’t PR (personal record) your way out of inconsistency. 🏋️",
      "That late-night munch quietly scheduled overtime. ⏱️",
      "That snack just wrote a love letter to fatigue. 🥊",
      "That “quick” treat just filed paperwork. 🔥",
      "That donut literally moved the finish line. ☢️",
      "That plate openly challenged your conditioning. 🗓️",
      "That extra serving proudly wrote a love letter to fatigue. ⏱️",
      "That extra serving literally invited consequences over. ⚠️",
      "That bite basically called gravity for backup. ⚠️",
      "That extra serving just scheduled overtime. 📈",
      "That snack accidentally activated hard mode. 📉",
      "That late-night munch literally challenged your conditioning. ☢️",
      "That “quick” treat just hit your consistency with a chair. 🏀",
      "High reminder: the mirror is an honest snitch. 🪞",
      "That plate openly turned your goals into a suggestion. 😈",
      "That late-night munch quietly raised your training tax. ⏱️",
      "High reminder: your body tracks patterns, not promises. 📊",
      "That plate literally reset your discipline clock. 😈",
      "That snack basically called gravity for backup. 🧾",
      "That swipe of sauce literally filed paperwork. 📈",
      "That donut openly added a chapter to your villain arc. 🧾",
      "That latte quietly challenged your conditioning. 📉",
      "That donut quietly reset your discipline clock. 🏀",
      "That extra serving literally raised your training tax. ☢️",
      "That extra serving quietly called gravity for backup. 😈",
      "That bite accidentally moved the finish line. ⏱️",
      "That donut openly invited consequences over. 📈",
      "That donut just raised your training tax. ⏱️",
      "That latte quietly hit your consistency with a chair. 🔥",
      "That latte just raised your training tax. 📈",
      "That bite basically filed paperwork. 🔥",
      "That bite literally activated hard mode. 😈",
      "That plate accidentally invited consequences over. 🔥",
      "That extra serving basically added a chapter to your villain arc. 🥊",
      "That plate openly raised your training tax. 🏀",
      "That plate literally activated hard mode. ☢️",
      "That plate basically moved the finish line. 📈",
      "That “quick” treat literally raised your training tax. ☢️",
      "That bite just scheduled overtime. 🔥",
      "That snack just challenged your conditioning. 📉",
      "That donut basically turned your goals into a suggestion. 📈",
      "That snack accidentally filed paperwork. ⚠️",
      "That “quick” treat literally called gravity for backup. 🏀",
      "That snack accidentally invited consequences over. 🔥",
      "That snack literally moved the finish line. 📉",
      "That late-night munch accidentally reset your discipline clock. 📈",
      "That snack quietly scheduled overtime. 🏀",
      "That donut literally activated hard mode. 🏀",
      "That extra serving openly challenged your conditioning. 🏀",
      "That extra serving just turned your goals into a suggestion. 📈",
      "That snack quietly raised your training tax. 📉",
      "That extra serving accidentally reset your discipline clock. 😈",
      "That “quick” treat literally scheduled overtime. 🗓️",
      "That snack just hit your consistency with a chair. 🗓️",
      "That swipe of sauce just called gravity for backup. 😈",
      "That bite literally challenged your conditioning. 📉",
      "That extra serving proudly moved the finish line. ☢️",
      "That latte quietly added a chapter to your villain arc. 🧾",
      "That snack literally turned your goals into a suggestion. 🧾",
      "That “quick” treat quietly challenged your conditioning. ⚠️",
      "That latte openly activated hard mode. 🥊",
      "That donut literally scheduled overtime. 📉",
      "That latte proudly wrote a love letter to fatigue. ⏱️",
      "That “quick” treat just invited consequences over. 🗓️",
      "That latte literally invited consequences over. 🗓️",
      "That latte basically called gravity for backup. 🗓️",
      "That plate literally scheduled overtime. ⚠️",
      "That latte proudly scheduled overtime. 📉",
      "That swipe of sauce proudly added a chapter to your villain arc. 😈",
      "That latte quietly moved the finish line. 🗓️",
    ];

    const NUCLEAR_LINES = [
      "This isn’t a snack. It’s an event. Train accordingly. ☢️",
      "We’ve crossed into ‘character development’ territory. 📈",
      "Every bite is a vote. You voted soft. 🗳️",
      "You can’t gaslight gravity. 🧲🚫",
      "You didn’t indulge. You invested in resistance. 📦",
      "Entropy wins when discipline naps. 😴",
      "You don’t negotiate with thermodynamics. 🌡️",
      "That fork just committed treason. 🗡️",
      "You want to fly? Stop fueling gravity. 🪽",
      "Villain origin story unlocked. 🦹",
      "That snack openly added a chapter to your villain arc. 📈",
      "That plate openly filed paperwork. 🗓️",
      "That extra serving literally turned your goals into a suggestion. ⚠️",
      "That “quick” treat openly turned your goals into a suggestion. 🔥",
      "That swipe of sauce proudly filed paperwork. ⚠️",
      "Nuclear reminder: your body tracks patterns, not promises. 📊",
      "That bite literally invited consequences over. ⚠️",
      "That extra serving accidentally raised your training tax. 😈",
      "That bite basically scheduled overtime. 📉",
      "That donut literally added a chapter to your villain arc. 📉",
      "That bite openly filed paperwork. 🧾",
      "That bite proudly turned your goals into a suggestion. 😈",
      "That snack quietly activated hard mode. 📉",
      "That latte basically added a chapter to your villain arc. 📈",
      "That swipe of sauce literally wrote a love letter to fatigue. ⏱️",
      "Nuclear reminder: motivation is a spark. Discipline is the grid. ⚡",
      "That plate quietly invited consequences over. 🥊",
      "That late-night munch literally wrote a love letter to fatigue. 📉",
      "That donut openly turned your goals into a suggestion. ☢️",
      "That swipe of sauce proudly activated hard mode. 🗓️",
      "That latte openly moved the finish line. 📈",
      "Nuclear reminder: train like you mean it, eat like you mean it. 🎯",
      "That “quick” treat openly filed paperwork. 🏀",
      "That donut accidentally moved the finish line. 🔥",
      "That plate just activated hard mode. 📈",
      "That late-night munch basically invited consequences over. 🧾",
      "That snack literally wrote a love letter to fatigue. 🧾",
      "That plate quietly called gravity for backup. 🔥",
      "That extra serving proudly scheduled overtime. 🔥",
      "That extra serving openly filed paperwork. 📈",
      "That plate accidentally moved the finish line. ⏱️",
      "That bite just wrote a love letter to fatigue. 😈",
      "That late-night munch literally challenged your conditioning. 🏀",
      "That donut openly activated hard mode. 🥊",
      "That plate just hit your consistency with a chair. 🗓️",
      "That “quick” treat just scheduled overtime. ⏱️",
      "That latte literally scheduled overtime. 🔥",
      "That donut quietly wrote a love letter to fatigue. ☢️",
      "That late-night munch literally hit your consistency with a chair. 🔥",
      "That late-night munch proudly reset your discipline clock. 😈",
      "That latte accidentally called gravity for backup. 🧾",
      "That late-night munch proudly scheduled overtime. ☢️",
      "That “quick” treat accidentally invited consequences over. 📈",
      "That swipe of sauce quietly called gravity for backup. ⚠️",
      "That “quick” treat accidentally called gravity for backup. 🔥",
      "That bite literally activated hard mode. 🔥",
      "That latte proudly activated hard mode. 😈",
      "That bite accidentally raised your training tax. ☢️",
      "That extra serving proudly called gravity for backup. 🔥",
      "That swipe of sauce just hit your consistency with a chair. 🔥",
      "That latte literally hit your consistency with a chair. 🏀",
      "That snack just called gravity for backup. 📉",
      "That extra serving literally invited consequences over. 📉",
      "That plate just raised your training tax. 📈",
      "That donut basically scheduled overtime. ⚠️",
      "Nuclear reminder: calories are numbers, not negotiators. 🔢",
      "That snack quietly hit your consistency with a chair. 🔥",
      "That plate openly wrote a love letter to fatigue. 📈",
      "That swipe of sauce quietly challenged your conditioning. 😈",
      "That “quick” treat just added a chapter to your villain arc. ⏱️",
      "That swipe of sauce openly turned your goals into a suggestion. 🏀",
      "That “quick” treat basically raised your training tax. ☢️",
      "That swipe of sauce openly raised your training tax. 🥊",
      "That late-night munch openly called gravity for backup. ⏱️",
      "That late-night munch openly activated hard mode. ☢️",
      "That extra serving proudly activated hard mode. ⏱️",
      "That plate quietly challenged your conditioning. 🗓️",
      "That swipe of sauce just scheduled overtime. 🥊",
      "That extra serving literally hit your consistency with a chair. 🔥",
      "That “quick” treat openly wrote a love letter to fatigue. ⏱️",
      "That snack literally invited consequences over. ☢️",
      "That swipe of sauce literally added a chapter to your villain arc. ⚠️",
      "That late-night munch literally filed paperwork. 🔥",
      "That swipe of sauce basically moved the finish line. 🏀",
      "That latte just wrote a love letter to fatigue. 🥊",
      "That snack literally filed paperwork. 🏀",
      "That bite literally moved the finish line. ☢️",
      "That donut accidentally invited consequences over. ⚠️",
      "That “quick” treat basically moved the finish line. ⏱️",
      "That bite just reset your discipline clock. 🔥",
      "That late-night munch literally turned your goals into a suggestion. 🏀",
      "That extra serving basically challenged your conditioning. 🧾",
      "That latte just turned your goals into a suggestion. ☢️",
      "That swipe of sauce openly invited consequences over. 📉",
      "That late-night munch basically raised your training tax. 🔥",
      "That plate basically turned your goals into a suggestion. 🗓️",
      "That “quick” treat literally activated hard mode. 🥊",
      "That extra serving quietly added a chapter to your villain arc. 🧾",
      "That donut proudly called gravity for backup. 😈",
      "That latte proudly filed paperwork. 😈",
      "That donut accidentally raised your training tax. 😈",
      "That extra serving accidentally reset your discipline clock. 📉",
      "That bite accidentally called gravity for backup. 📈",
      "That donut just filed paperwork. ⏱️",
      "That extra serving literally wrote a love letter to fatigue. 🧾",
      "That bite accidentally challenged your conditioning. 🔥",
      "That latte openly raised your training tax. 🗓️",
      "That latte basically challenged your conditioning. 🔥",
      "That plate just scheduled overtime. ⚠️",
      "That bite literally added a chapter to your villain arc. 🔥",
      "That latte just reset your discipline clock. 🗓️",
      "That “quick” treat accidentally hit your consistency with a chair. ⚠️",
      "That donut quietly challenged your conditioning. 🗓️",
      "That extra serving proudly moved the finish line. 🏀",
      "That snack just moved the finish line. 🥊",
      "That donut basically reset your discipline clock. ⏱️",
      "That “quick” treat accidentally challenged your conditioning. 🔥",
      "That plate quietly reset your discipline clock. ⚠️",
      "That snack just scheduled overtime. ⏱️",
      "That snack openly challenged your conditioning. 🔥",
    ];

  function tierLines(tier) {
    if (tier === "low") return LOW_LINES;
    if (tier === "med") return MED_LINES;
    if (tier === "high") return HIGH_LINES;
    if (tier === "nuclear") return NUCLEAR_LINES;
    return MED_LINES;
  }

  function getBrutalLine(ctx) {
    const meta = buildMeta(ctx || {});
    const lines = tierLines(meta.tier);

    // Small chance to inject “specific-ish” spice without math:
    // (We keep it vague-friendly for all users.)
    const spice = [
      "Receipts don’t care about your feelings. 🧾",
      "Standards don’t rise themselves. 📈",
      "Consistency is the whole cheat code. 🔁",
      "You want results? Pay in reps. 🥊",
      "Your future self is watching this decision. 👀",
      "You can’t out-trend fundamentals. 🧠",
      "Discipline isn’t a mood. It’s a policy. 🧱",
    ];

    // Blend: mostly tier lines, sometimes spice.
    if (Math.random() < 0.10) return pick(spice);
    return pick(lines);
  }

  function getBrutalContextLine(ctx) {
    const meta = buildMeta(ctx || {});
    const options = [
      "Real-world factor applied (fatigue/rest).",
      "Same formula, less optimism.",
      "Estimate tuned for humans, not robots.",
      "Reality-adjusted: your body isn’t a calculator. 🧠",
      "Translation: the snack was cute, the consequences aren’t. 😈",
      "Reminder: consistency beats intensity cosplay. 🎭",
      "Data note: effort counts, patterns count more. 📊",
    ];

    // If they provided labels/categories, lightly acknowledge it (without being boring).
    const extras = [];
    if (meta.workoutLabel) extras.push(`Workout label noted: "${meta.workoutLabel}".`);
    if (meta.category) extras.push(`Category tagged: "${meta.category}".`);
    if (extras.length) return pick(extras.concat(options));

    return pick(options);
  }

  // Optional richer output for UIs that want more flavor.
  function getBrutalBundle(ctx) {
    const meta = buildMeta(ctx || {});
    const profile = chaosProfile(meta.tier);

    const primary = getBrutalLine(ctx);

    let secondary = null;
    if (Math.random() < profile.second) {
      // Pull a different line, avoid duplicates if possible.
      const lines = tierLines(meta.tier);
      let tries = 6;
      do {
        secondary = pick(lines);
        tries--;
      } while (secondary === primary && tries > 0);
    }

    let context = null;
    if (Math.random() < profile.context) {
      context = getBrutalContextLine(ctx);
    }

    return { primary, secondary, context, tier: meta.tier };
  }

  // Export
  window.BrutalMode = {
    getBrutalLine,
    getBrutalContextLine,
    getBrutalBundle,
  };
})();
