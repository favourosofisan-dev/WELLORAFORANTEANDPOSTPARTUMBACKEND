export interface Exercise {
  id: string;
  title: string;
  category: 'Pelvic Floor' | 'Core Stability' | 'Lower Body' | 'Upper Body' | 'Mobility' | 'Breathing' | 'Labor Preparation' | 'Recovery';
  targetTrimesters: ('First' | 'Second' | 'Third')[];
  targetPostpartumWeeks: ('0-6' | '6-12' | '3+') [];
  isPregnancySafe: boolean;
  isPostpartumSafe: boolean;
  duration: string;
  instructions: string[];
  breathingCues: string[];
  safetyWarnings: string[];
  benefits: string;
  description?: string;
  videoUrlPlaceholder?: string;
}

export interface Vaccine {
  id: string;
  name: string;
  description: string;
  ageMilestone: 'Birth' | '6 Weeks' | '10 Weeks' | '14 Weeks' | '6 Months' | '9 Months' | '15 Months';
  monthsOffset: number;
  isRequired: boolean;
}

export interface CareArticle {
  id: string;
  title: string;
  category: 'Safe Sleep' | 'Nutrition' | 'Hydration' | 'Dental Care' | 'Common Illnesses';
  summary: string;
  content: string[];
  tips: string[];
}

export interface LaborPrepGuide {
  id: string;
  title: string;
  category: 'Breathing Techniques' | 'Diversion Therapy' | 'Comfort Positions' | 'Birth Preparation';
  description: string;
  instructions: string[];
  videoPlaceholder: string;
}

export const EXERCISES: Exercise[] = [
  // ─────────────────────────────────────────────
  // ALL-STAGE EXERCISES (Trimesters 1-2-3 + all postpartum)
  // ─────────────────────────────────────────────
  {
    id: 'pelvic-tilts',
    title: 'Pelvic Tilts',
    category: 'Pelvic Floor',
    targetTrimesters: ['First', 'Second', 'Third'],
    targetPostpartumWeeks: ['0-6', '6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '2 min',
    instructions: [
      'Stand with feet hip-width apart, or lie on your back with knees bent and feet flat on the floor.',
      'Place your hands on your hips to feel the tilt.',
      'Inhale slowly and slightly arch your lower back, pushing your tailbone back.',
      'Exhale gently, flatten your back, and tuck your pelvis under.',
      'Repeat 10 times slowly, focusing on small, controlled movements.'
    ],
    breathingCues: [
      'Inhale as you expand your abdomen and arch your back.',
      'Exhale fully through pursed lips as you tuck and engage the deep abdominal muscles.'
    ],
    safetyWarnings: [
      'Stop immediately if you feel pain, dizziness, bleeding, sharp abdominal cramps, or generic discomfort.',
      'Avoid holding your breath. Maintain a steady, calm breathing rhythm throughout.'
    ],
    benefits: 'Strengthens core and pelvic muscles, improves spine mobility, and relieves lower back tension common during pregnancy.'
  },
  {
    id: 'kegels',
    title: 'Kegel Restorations',
    category: 'Pelvic Floor',
    targetTrimesters: ['First', 'Second', 'Third'],
    targetPostpartumWeeks: ['0-6', '6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '3 min',
    instructions: [
      'Sit comfortably or lie on your side.',
      'Locate your pelvic floor muscles (the ones used to stop the flow of urine).',
      'Contract (squeeze) these muscles and hold for 3-5 seconds.',
      'Relax completely for 5 seconds. This relaxation phase is just as important as the contraction.',
      'Repeat 10-15 times.'
    ],
    breathingCues: [
      'Exhale as you squeeze and lift the pelvic floor.',
      'Inhale as you fully release and relax the muscles.'
    ],
    safetyWarnings: [
      'Do not squeeze your glutes, thighs, or abdominals. Only contract the pelvic floor.',
      'Avoid practicing while actually urinating, as this can lead to urinary tract issues.'
    ],
    benefits: 'Improves bladder control, prepares the pelvic floor for labor, and accelerates healing of the perineum postpartum.'
  },
  {
    id: 'cat-cow',
    title: 'Cat-Cow Stretch',
    category: 'Mobility',
    targetTrimesters: ['First', 'Second', 'Third'],
    targetPostpartumWeeks: ['0-6', '6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '4 min',
    instructions: [
      'Begin on your hands and knees in a tabletop position.',
      'Inhale as you gently drop your belly, lift your chest, and look slightly upward (Cow pose).',
      'Exhale as you round your spine, tucking your chin to your chest and tucking your tailbone (Cat pose).',
      'Move fluidly between these two positions for 10 full breath cycles.'
    ],
    breathingCues: [
      'Inhale as you expand your chest (Cow). Keep shoulders back.',
      'Exhale as you round your back (Cat), pushing the floor away.'
    ],
    safetyWarnings: [
      'In Cow pose, do not over-arch the lower back, especially in the third trimester when the belly is heavy.',
      'Stop if you feel any strain in the lower back or pelvis.'
    ],
    benefits: 'Relieves back stiffness, maintains spine flexibility, and helps position the baby optimally for birth.'
  },
  {
    id: 'diaphragmatic-breathing',
    title: 'Diaphragmatic Breathing',
    category: 'Breathing',
    targetTrimesters: ['First', 'Second', 'Third'],
    targetPostpartumWeeks: ['0-6', '6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '5 min',
    instructions: [
      'Sit comfortably on a chair with support, or lie on your side with a pillow between your knees.',
      'Place one hand on your chest and the other on your belly.',
      'Breathe in slowly through your nose, letting your belly expand outward while keeping your chest relatively still.',
      'Exhale slowly and completely through your mouth, feeling your belly deflate.',
      'Focus on slow, rhythmic breaths for 5 minutes.'
    ],
    breathingCues: [
      'Breathe in for 4 seconds, letting your ribs expand sideways and belly expand forward.',
      'Breathe out for 4-6 seconds, letting go of all tension.'
    ],
    safetyWarnings: [
      'If you feel lightheaded, return to normal breathing immediately.',
      'Never hold your breath at the top or bottom of the cycle.'
    ],
    benefits: 'Calms the nervous system, lowers heart rate, and teaches deep abdominal engagement necessary for labor and core restoration.'
  },
  {
    id: 'wall-pushups',
    title: 'Wall Push-Ups',
    category: 'Upper Body',
    targetTrimesters: ['First', 'Second', 'Third'],
    targetPostpartumWeeks: ['0-6', '6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '3 min',
    instructions: [
      'Stand facing a wall, about arm-length away. Place your palms flat on the wall at shoulder height and shoulder-width apart.',
      'Inhale, bend your elbows, and slowly lower your chest toward the wall. Keep your body in a straight line from head to heels.',
      'Exhale as you press through your hands to return to the starting position.',
      'Perform 3 sets of 10 repetitions, resting 30 seconds between sets.'
    ],
    breathingCues: [
      'Inhale as you lower towards the wall.',
      'Exhale as you push away, engaging your chest and core muscles.'
    ],
    safetyWarnings: [
      'Ensure your feet are secure on a non-slip surface.',
      'Do not sag your hips or arch your lower back.'
    ],
    benefits: 'Strengthens the chest, shoulders, and arms without putting pressure on the abdomen, ideal for later trimesters.'
  },
  {
    id: 'side-lying-leg-lifts',
    title: 'Side-Lying Leg Lifts',
    category: 'Lower Body',
    targetTrimesters: ['First', 'Second', 'Third'],
    targetPostpartumWeeks: ['0-6', '6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '4 min',
    instructions: [
      'Lie on your side on a comfortable mat, with your head resting on your bottom arm or a pillow.',
      'Stack your hips and keep your bottom leg slightly bent for balance.',
      'Keeping your top leg straight and foot flexed, slowly lift it to about hip height.',
      'Hold for 2 seconds at the top, then lower slowly without letting it touch the bottom leg.',
      'Perform 12-15 repetitions, then switch sides.'
    ],
    breathingCues: [
      'Exhale as you lift the leg upward, engaging your hip abductors.',
      'Inhale as you slowly lower back down with control.'
    ],
    safetyWarnings: [
      'Do not roll your hips backwards during the lift — keep them stacked.',
      'In late pregnancy, place a pillow between your knees for extra comfort.'
    ],
    benefits: 'Strengthens the outer hips and glutes, stabilizes the pelvis, and improves hip joint mobility without abdominal compression.'
  },
  {
    id: 'seated-hip-circles',
    title: 'Seated Hip Circles',
    category: 'Mobility',
    targetTrimesters: ['First', 'Second', 'Third'],
    targetPostpartumWeeks: ['0-6', '6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '3 min',
    instructions: [
      'Sit on a birthing ball or firm chair with feet flat on the floor, hip-width apart.',
      'Place hands on thighs for support.',
      'Slowly draw large circles with your hips — moving forward, out to the right, back, then left.',
      'Complete 10 circles clockwise, then 10 counterclockwise.',
      'Keep movements smooth and controlled, breathing throughout.'
    ],
    breathingCues: [
      'Breathe in for two counts as your hips move forward and outward.',
      'Breathe out for two counts as your hips move backward and inward.'
    ],
    safetyWarnings: [
      'Use a stable ball or chair to avoid losing balance.',
      'Stop if you feel any sharp pelvic girdle pain or instability.'
    ],
    benefits: 'Loosens the hip joints, relieves round ligament tension, and encourages optimal baby positioning in the third trimester.'
  },

  // ─────────────────────────────────────────────
  // FIRST & SECOND TRIMESTER (+ postpartum 6-12wk, 3+)
  // ─────────────────────────────────────────────
  {
    id: 'bird-dog',
    title: 'Bird Dog',
    category: 'Core Stability',
    targetTrimesters: ['First', 'Second'],
    targetPostpartumWeeks: ['6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '5 min',
    instructions: [
      'Start on your hands and knees in a tabletop position, wrists directly under shoulders, knees under hips.',
      'Keep your head, neck, and spine in a neutral line.',
      'Inhale to prepare, then exhale as you slowly extend your right arm forward and left leg backward.',
      'Hold for 2 seconds, maintaining a level pelvis and avoiding arching your lower back.',
      'Inhale as you return to the starting position.',
      'Alternate sides and repeat for 8-10 repetitions per side.'
    ],
    breathingCues: [
      'Exhale as you reach, drawing your belly button gently toward your spine.',
      'Inhale as you lower your hand and knee back to the mat.'
    ],
    safetyWarnings: [
      'Avoid lifting the extended leg higher than hip height to prevent arching the back.',
      'If you lose balance or feel joint discomfort in the third trimester, practice extending just the legs first.'
    ],
    benefits: 'Stabilizes the core, hips, and lower back. Promotes spinal alignment and improves balance.'
  },
  {
    id: 'gentle-glute-bridges',
    title: 'Gentle Glute Bridges',
    category: 'Lower Body',
    targetTrimesters: ['First', 'Second'],
    targetPostpartumWeeks: ['6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '4 min',
    instructions: [
      'Lie flat on your back with knees bent and feet flat on the floor, hip-width apart. (For pregnant mothers in 2nd/3rd trimester, do this propped up on a wedge pillow or incline).',
      'Press your heels into the floor and lift your hips up until your body forms a straight line from shoulders to knees.',
      'Hold the position at the top for 2 seconds, squeezing your glutes.',
      'Slowly lower your hips back to the floor.',
      'Repeat for 2 sets of 10 repetitions.'
    ],
    breathingCues: [
      'Exhale as you lift your hips, engaging the pelvic floor.',
      'Inhale as you lower back down.'
    ],
    safetyWarnings: [
      'Avoid lying flat on your back for prolonged periods in the second and third trimester (modify with a wedge/incline).',
      'If you feel pelvic pain or pubic joint pain, discontinue immediately.'
    ],
    benefits: 'Strengthens the glutes and hamstrings, supports the pelvic girdle, and relieves lower back pain.'
  },
  {
    id: 'standing-calf-raises',
    title: 'Standing Calf Raises',
    category: 'Lower Body',
    targetTrimesters: ['First', 'Second'],
    targetPostpartumWeeks: ['6-12', '3+'],
    isPregnancySafe: true,
    isPostpartumSafe: true,
    duration: '3 min',
    instructions: [
      'Stand behind a sturdy chair or counter, holding it lightly for balance.',
      'Stand with feet hip-width apart, toes pointing forward.',
      'Slowly rise onto the balls of your feet, lifting your heels as high as comfortable.',
      'Hold for 2 seconds at the top, then slowly lower back down.',
      'Complete 3 sets of 15 repetitions with 30 seconds rest between sets.'
    ],
    breathingCues: [
      'Exhale as you rise up onto your toes.',
      'Inhale as you lower your heels back to the floor.'
    ],
    safetyWarnings: [
      'Hold a stable surface to prevent losing balance, especially as your center of gravity shifts in pregnancy.',
      'Stop if you feel calf cramping — stretch immediately and hydrate.'
    ],
    benefits: 'Improves calf circulation, reduces ankle swelling common in pregnancy, and strengthens the lower legs for labor positioning.'
  },
  {
    id: 'prenatal-chair-squat',
    title: 'Prenatal Chair Squat',
    category: 'Lower Body',
    targetTrimesters: ['First', 'Second'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '4 min',
    instructions: [
      'Stand in front of a sturdy chair with feet shoulder-width apart, toes slightly turned out.',
      'Extend both arms forward for balance, then slowly lower yourself toward the chair as if about to sit.',
      'Stop just before touching the seat (or rest lightly if needed), keeping chest up and knees tracking over toes.',
      'Press through your heels to stand back up, squeezing glutes at the top.',
      'Complete 2 sets of 10 repetitions.'
    ],
    breathingCues: [
      'Inhale as you lower down into the squat.',
      'Exhale as you press through your heels and stand back up.'
    ],
    safetyWarnings: [
      'Do not perform deep squats in the third trimester if you have pelvic girdle pain (PGP) or placenta previa.',
      'Ensure the chair is stable and against a wall before starting.'
    ],
    benefits: 'Strengthens quadriceps, glutes, and core muscles. Prepares the body for labor positions and improves overall lower body endurance.'
  },

  // ─────────────────────────────────────────────
  // SECOND & THIRD TRIMESTER ONLY
  // ─────────────────────────────────────────────
  {
    id: 'birth-ball-hip-rolls',
    title: 'Birth Ball Hip Rolls',
    category: 'Labor Preparation',
    targetTrimesters: ['Second', 'Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '5 min',
    instructions: [
      'Sit on an inflated birthing ball with feet flat on the floor, wider than hip-width for stability.',
      'Relax your shoulders and place hands on your thighs.',
      'Begin rolling your hips in slow, deliberate figure-eight or circular patterns.',
      'Continue for 5 minutes, breathing rhythmically throughout.',
      'Pause and reverse direction every 30 seconds.'
    ],
    breathingCues: [
      'Keep breathing slow and steady — inhale through the nose, exhale through the mouth.',
      'Allow the breath to guide the rhythm of your hip movement.'
    ],
    safetyWarnings: [
      'Ensure the birthing ball is correctly inflated — it should compress slightly when you sit.',
      'Have a wall or chair nearby in case you need to steady yourself.',
      'Do not use an overly small ball that causes your knees to rise above your hips.'
    ],
    benefits: 'Encourages baby engagement in the pelvis, relieves back pressure, and conditions the hips and pelvis for labor. Also excellent for comfort during early contractions.'
  },

  // ─────────────────────────────────────────────
  // THIRD TRIMESTER ONLY
  // ─────────────────────────────────────────────
  {
    id: 'supported-birth-squat',
    title: 'Supported Birth Squat',
    category: 'Labor Preparation',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    description: 'A supported squat to open the pelvic outlet and prepare for pushing during labor.',
    duration: '2 min',
    instructions: [
      'Stand with your back to a wall or holding onto a sturdy railing, feet wider than shoulder-width, toes turned out 30-45°.',
      'Slowly lower into a deep squat, keeping heels flat on the floor.',
      'Use the wall or railing for support — do not balance unsupported.',
      'Hold the squat for 20-30 seconds, breathing deeply.',
      'Rise slowly, pressing through the heels, and rest for 30 seconds before repeating. Aim for 3-5 repetitions.'
    ],
    breathingCues: [
      'Breathe in deeply as you descend into the squat.',
      'Breathe out slowly and fully during the hold, relaxing the pelvic floor completely.'
    ],
    safetyWarnings: [
      'Avoid this exercise if you have breech presentation, placenta previa, or symphysis pubis dysfunction (SPD).',
      'Never attempt unsupported — always use a wall, birth partner, or railing.',
      'Stop immediately if you feel pressure, pain, or strong Braxton Hicks contractions.'
    ],
    benefits: 'Opens the pelvic outlet by up to 28%, encouraging baby descent and engagement. Excellent preparation for pushing positions during active labor.'
  },
  {
    id: 'diversion-sensory-breathing',
    title: 'Slow-Paced Labor Breathing',
    category: 'Labor Preparation',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '5 min',
    instructions: [
      'Find a comfortable position (sitting, leaning on a birth ball, or lying on your side).',
      'Relax your shoulders, jaw, and hands completely.',
      'As a contraction begins (real or simulated), take an organizing breath: a deep breath in through your nose and a slow sigh out.',
      'Inhale slowly through your nose to a comfortable count of 4.',
      'Exhale gently through your mouth — as if blowing out a candle — to a count of 6.',
      'Continue this pattern until the simulated contraction ends, then release with another deep organizing sigh.'
    ],
    breathingCues: [
      '4-count inhale through the nose: calm, steady, expanding your ribcage sideways.',
      '6-count exhale through pursed lips: slow release, releasing all tension in the jaw and shoulders.'
    ],
    safetyWarnings: [
      'If you feel lightheaded, return to normal breathing and rest.',
      'Practice this daily for 5 minutes so it becomes automatic during labor.'
    ],
    benefits: 'Activates the parasympathetic nervous system to counteract labor pain. Reduces cortisol, maintains oxygen delivery to the baby, and provides a rhythmic focus point during contractions.'
  },

  // ─────────────────────────────────────────────
  // EARLY POSTPARTUM (0-6 weeks) — Recovery
  // ─────────────────────────────────────────────
  {
    id: 'deep-belly-breathing-postnatal',
    title: 'Deep Belly Breathing (Postnatal)',
    category: 'Recovery',
    targetTrimesters: [],
    targetPostpartumWeeks: ['0-6'],
    isPregnancySafe: false,
    isPostpartumSafe: true,
    duration: '5 min',
    instructions: [
      'Lie on your back with knees bent and feet flat, or sit comfortably supported.',
      'Place one hand on your chest and one on your lower belly.',
      'Breathe in deeply through your nose — your belly should rise, chest stays still.',
      'As you breathe out through your mouth, gently draw your lower belly inward toward your spine.',
      'This gentle inward pull at the exhale is the beginning of core re-engagement.',
      'Repeat for 10-15 breath cycles, 2-3 times per day.'
    ],
    breathingCues: [
      'Inhale for 4 counts, expanding the belly like a balloon.',
      'Exhale for 6 counts, gently and naturally drawing the navel inward — do not force or strain.'
    ],
    safetyWarnings: [
      'Never brace, bear down, or force the abdominal muscles inward in the first 6 weeks.',
      'If you had a C-section, ensure your incision is fully comfortable before engaging the core muscles, even gently.'
    ],
    benefits: 'Re-establishes the connection between the brain and the deep core muscles (transverse abdominis). Reduces post-birth abdominal pressure and prepares the body for progressive core rehabilitation.'
  },
  {
    id: 'heel-slides',
    title: 'Heel Slides',
    category: 'Recovery',
    targetTrimesters: [],
    targetPostpartumWeeks: ['0-6'],
    isPregnancySafe: false,
    isPostpartumSafe: true,
    duration: '3 min',
    instructions: [
      'Lie on your back with both knees bent, feet flat on the floor.',
      'Gently engage your deep abdominals by drawing your navel lightly inward.',
      'Keeping your lower back in contact with the floor, slowly slide one heel away from your body until your leg is straight.',
      'Pause for a breath, then slide the heel back to the starting position.',
      'Alternate legs for 10 repetitions per side.'
    ],
    breathingCues: [
      'Exhale as you slide the heel out — use the breath to engage your deep core.',
      'Inhale as you slide the heel back in and fully relax.'
    ],
    safetyWarnings: [
      'If your lower back arches off the floor as you extend the leg, stop the movement earlier.',
      'Do not hold your breath or strain — this should feel effortless.'
    ],
    benefits: 'Gently activates the lower abdominals and hip flexors while protecting the pelvic floor. Ideal for re-establishing neuromuscular core connections in the first weeks postpartum.'
  },
  {
    id: 'pelvic-floor-release',
    title: 'Pelvic Floor Release',
    category: 'Pelvic Floor',
    targetTrimesters: [],
    targetPostpartumWeeks: ['0-6', '6-12'],
    isPregnancySafe: false,
    isPostpartumSafe: true,
    duration: '3 min',
    instructions: [
      'Lie on your back in a supported position, or sit comfortably on a cushion.',
      'Take a slow breath in and gently contract the pelvic floor (as if stopping urine flow).',
      'Hold the contraction for 3 seconds.',
      'Now fully exhale and consciously release and let go — imagine the pelvic floor muscles softening and dropping like a flower opening.',
      'Stay in the release phase for 5 seconds, ensuring complete relaxation.',
      'Repeat the contract-and-release cycle 10 times.'
    ],
    breathingCues: [
      'Inhale and gently contract the pelvic floor upward.',
      'Exhale and deliberately relax and release every bit of tension downward.'
    ],
    safetyWarnings: [
      'This exercise is as much about relaxation as contraction — do not skip the release phase.',
      'If you have post-birth stitches (episiotomy or tear), begin only once cleared by your midwife or OB (usually 4-6 weeks postpartum).'
    ],
    benefits: 'Restores pelvic floor strength and coordination. The conscious release phase is critical for avoiding hypertonic (overly tight) pelvic floor muscles, which can cause pain and dysfunction postpartum.'
  },

  // ─────────────────────────────────────────────
  // MID & LATE POSTPARTUM (6-12 weeks and 3+ months)
  // ─────────────────────────────────────────────
  {
    id: 'modified-knee-plank',
    title: 'Modified Knee Plank',
    category: 'Core Stability',
    targetTrimesters: [],
    targetPostpartumWeeks: ['6-12', '3+'],
    isPregnancySafe: false,
    isPostpartumSafe: true,
    duration: '4 min',
    instructions: [
      'Begin on your hands and knees (tabletop position), wrists directly below shoulders.',
      'Walk your knees back 6 inches, creating a diagonal line from your knees to your shoulders.',
      'Engage your core by drawing your navel gently inward — without holding your breath.',
      'Hold this position for 20-30 seconds, keeping your hips level and back flat.',
      'Rest for 30 seconds and repeat 3-4 times.'
    ],
    breathingCues: [
      'Breathe in through your nose, keeping the core engaged without strain.',
      'Exhale through your mouth — the core should not bulge outward on the exhale.'
    ],
    safetyWarnings: [
      'If you see or feel doming or "coning" in your midsection, drop to the floor immediately — this indicates the core load is too high.',
      'Do not perform full plank until cleared by a pelvic floor physiotherapist, especially post C-section.'
    ],
    benefits: 'Rebuilds deep core stability needed for everyday tasks like carrying your baby, feeding, and lifting. The modified position prevents diastasis recti aggravation.'
  },
  {
    id: 'dead-bug-core',
    title: 'Dead Bug Core Exercise',
    category: 'Core Stability',
    targetTrimesters: [],
    targetPostpartumWeeks: ['6-12', '3+'],
    isPregnancySafe: false,
    isPostpartumSafe: true,
    duration: '5 min',
    instructions: [
      'Lie on your back with your knees bent to 90 degrees and raised so shins are parallel to the floor (tabletop legs).',
      'Extend both arms straight up toward the ceiling.',
      'Take a breath in, then exhale and simultaneously lower your right arm overhead and extend your left leg straight out (do not let either touch the floor).',
      'Hold for a breath, then return both limbs to starting position.',
      'Alternate sides for 8-10 repetitions per side.'
    ],
    breathingCues: [
      'Exhale slowly and fully as you extend the arm and leg — the breath drives the core engagement.',
      'Inhale as you return to the starting position.'
    ],
    safetyWarnings: [
      'Keep your lower back pressed into the floor at all times — if it arches, reduce range of motion.',
      'If you feel any doming of the abdominals, reduce the leg extension length until the core is stronger.'
    ],
    benefits: 'Excellent for rebuilding anti-rotation core stability, essential for carrying babies on one hip, twisting to pick things up, and overall postpartum functional fitness.'
  },

  // ─────────────────────────────────────────────
  // LATE POSTPARTUM (3+ months)
  // ─────────────────────────────────────────────
  {
    id: 'side-bridge-modified',
    title: 'Side Bridge (Modified)',
    category: 'Core Stability',
    targetTrimesters: [],
    targetPostpartumWeeks: ['3+'],
    isPregnancySafe: false,
    isPostpartumSafe: true,
    duration: '5 min',
    instructions: [
      'Lie on your side with your bottom knee bent at 90 degrees and bottom elbow directly beneath your shoulder.',
      'Stack your hips and keep the top foot resting on the floor in front of you for stability.',
      'Exhale and lift your hips off the floor, creating a straight line from knee to shoulder.',
      'Hold for 20-30 seconds while breathing normally.',
      'Lower slowly and repeat on the other side. Aim for 2-3 holds per side.'
    ],
    breathingCues: [
      'Exhale to initiate the lift, drawing the core upward.',
      'Breathe slowly and naturally during the hold — avoid breath-holding.'
    ],
    safetyWarnings: [
      'Ensure your bottom shoulder is not shrugging toward your ear — keep it packed and stable.',
      'If you feel hip or shoulder pain, return to easier core exercises and build up gradually.'
    ],
    benefits: 'Targets the lateral core chain (obliques, glutes medius, QL), essential for postpartum spine stability, reducing hip drop, and preventing the classic new-parent lower back pain.'
  },
  {
    id: 'first-sumo-squats',
    title: 'Bodyweight Sumo Squats',
    category: 'Lower Body',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '5 min',
    instructions: [
      'Stand wide with feet beyond hip width, toes turned out, squat down keeping chest lifted, then rise.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Avoid deep squats if you feel dizziness; keep balance against a wall if needed.',
      'Maintain the Talk Test intensity.'
    ],
    benefits: 'Strengthens legs and opens pelvis without compressing the vena cava.'
  },
  {
    id: 'first-wall-slides',
    title: 'Wall Slides',
    category: 'Mobility',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Back against wall, slide down into a shallow squat, hold 3 seconds, then slide back up.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Maintain contact with wall, avoid sliding too low.'
    ],
    benefits: 'Improves hip and knee mobility while supporting the back.'
  },
  {
    id: 'first-clamshells',
    title: 'Side‑Lying Clamshells',
    category: 'Pelvic Floor',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Lie on side, knees bent, keep feet together, lift top knee while keeping hips stacked.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Do not let hips roll backward.'
    ],
    benefits: 'Activates glutes and pelvic floor safely for early pregnancy.'
  },
  {
    id: 'first-supported-lunges',
    title: 'Supported Lunges',
    category: 'Lower Body',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '4 min',
    instructions: [
      'Place hand on wall or sturdy chair for balance, step forward into a shallow lunge, keep torso upright.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Do not let front knee go past toes.'
    ],
    benefits: 'Strengthens quads and improves balance without over‑loading the abdomen.'
  },
  {
    id: 'first-incline-push-ups',
    title: 'Incline Push‑Ups',
    category: 'Upper Body',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Hands on a sturdy counter or sofa edge, body at an angle, perform push‑up.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Maintain a straight line, stop if wrist discomfort occurs.'
    ],
    benefits: 'Builds chest and arm strength with reduced load.'
  },
  {
    id: 'first-scapular-squeezes',
    title: 'Scapular Squeezes',
    category: 'Upper Body',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Sit or stand, elbows at 90°, pull shoulder blades together, hold briefly.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Avoid shrugging shoulders.'
    ],
    benefits: 'Improves posture and upper‑back activation.'
  },
  {
    id: 'first-arm-circles',
    title: 'Arm Circles',
    category: 'Upper Body',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Extend arms to the sides, draw small controlled circles forward then backward.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Keep movements smooth, stop if shoulder pain appears.'
    ],
    benefits: 'Warms up shoulders and improves mobility.'
  },
  {
    id: 'first-wall-angels',
    title: 'Wall Angels',
    category: 'Upper Body',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Back and arms flat against wall, slide arms overhead like a snow angel.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Maintain contact with wall, avoid arching lower back.'
    ],
    benefits: 'Enhances shoulder mobility and posture.'
  },
  {
    id: 'first-goal-post-pulses',
    title: 'Goal‑Post Pulses',
    category: 'Upper Body',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Arms up in goal‑post position, gently pulse elbows backward.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Keep shoulders relaxed.'
    ],
    benefits: 'Activates upper back and improves shoulder stability.'
  },
  {
    id: 'first-doorway-chest-stretch',
    title: 'Doorway Chest Stretch',
    category: 'Upper Body',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Hands on door frame, step forward gently until chest opens.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Do not push too far; stretch should be gentle.'
    ],
    benefits: 'Relieves tight chest muscles and improves posture.'
  },
  {
    id: 'first-brisk-marching',
    title: 'Brisk Low‑Impact Marching',
    category: 'Mobility',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '5 min',
    instructions: [
      'March in place, lift knees to hip height, swing arms naturally.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Maintain Talk Test intensity.'
    ],
    benefits: 'Boosts circulation and warms up the body.'
  },
  {
    id: 'first-side-step-taps',
    title: 'Side‑to‑Side Step Taps',
    category: 'Mobility',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Step left foot out to the side, tap right foot next to it, repeat on opposite side.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Keep movements controlled.'
    ],
    benefits: 'Improves lateral coordination.'
  },
  {
    id: 'first-standing-hip-hikes',
    title: 'Standing Hip Hikes',
    category: 'Mobility',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Stand on one foot (hold wall for balance), lift opposite hip gently, lower.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Maintain balance, stop if dizziness.'
    ],
    benefits: 'Strengthens hip abductors and stabilizers.'
  },
  {
    id: 'first-standing-torso-twists',
    title: 'Standing Torso Twists (Gentle)',
    category: 'Mobility',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Hands on hips, rotate shoulders left and right while hips stay forward.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Move within comfort range, avoid strain.'
    ],
    benefits: 'Maintains spinal mobility.'
  },
  {
    id: 'first-pelvic-clocks',
    title: 'Pelvic Clocks',
    category: 'Mobility',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Hands on hips, rotate pelvis in circular motion clockwise then counter‑clockwise.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Keep movements smooth, avoid jerking.'
    ],
    benefits: 'Promotes pelvic mobility and circulation.'
  },
  {
    id: 'first-tailor-pose',
    title: 'Tailor Pose (Butterfly Stretch)',
    category: 'Mobility',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Sit, soles of feet together, gently let knees drop open.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Do not force knees; keep stretch gentle.'
    ],
    benefits: 'Opens pelvis and relaxes inner thighs.'
  },
  {
    id: 'first-modified-childs-pose',
    title: 'Modified Child’s Pose',
    category: 'Recovery',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Knees wide, sit back on heels, forehead to hands, breathe gently.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Avoid if you feel abdominal pressure.'
    ],
    benefits: 'Relieves lower back tension and promotes relaxation.'
  },
  {
    id: 'first-thread-the-needle',
    title: 'Thread the Needle',
    category: 'Mobility',
    targetTrimesters: ['First'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'On all‑fours, reach one arm up, then slide under chest, lower shoulder to floor, hold, switch sides.'
    ],
    breathingCues: [],
    safetyWarnings: [
      'Move slowly, stop if shoulder discomfort.'
    ],
    benefits: 'Stretches upper back and improves thoracic mobility.'
  },
  {
    id: 'third-kegels-release',
    title: 'Kegels with Controlled Release',
    category: 'Pelvic Floor',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Sit comfortably on a sturdy chair with your feet flat on the ground and knees wide to accommodate your belly.',
      'Tighten your pelvic floor muscles (as if trying to stop the flow of urine).',
      'Hold the contraction steadily for 3 seconds.',
      'Focus on completely and slowly releasing the pelvic floor muscles, letting them soften and drop.',
      'Rest for 3-5 seconds, then repeat for 10-12 repetitions.'
    ],
    breathingCues: [
      'Exhale as you contract and lift your pelvic floor.',
      'Inhale fully and deeply as you release and let the muscles relax completely.'
    ],
    safetyWarnings: [
      'Do not hold your breath. Keep your jaw and stomach relaxed during contractions.',
      'Avoid the Vena Cava Position: Do not lie flat on your back to perform this. Tilt your body to the left using a pillow if lying down.'
    ],
    benefits: 'Helps support the heavy weight of your baby, protects your lower back, and prepares your pelvic muscles to push during labor.',
    description: 'Tighten your pelvic floor muscles, hold for 3 seconds, and focus on completely relaxing them.'
  },
  {
    id: 'third-belly-pumps',
    title: 'All-Fours Belly Pumps',
    category: 'Core Stability',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Get down on your hands and knees (tabletop position) on a comfortable mat.',
      'Inhale slowly and let your belly drop completely towards the floor, relaxing your abs.',
      'Exhale gently and pull your baby up toward your spine, engaging your deep core (transverse abdominis).',
      'Maintain a neutral spine throughout; do not arch or round your back.',
      'Perform 10-15 pumps slowly.'
    ],
    breathingCues: [
      'Inhale fully through your nose as you expand and let your belly hang.',
      'Exhale slowly through your mouth as you gently hug your baby in towards your spine.'
    ],
    safetyWarnings: [
      'Keep the movement gentle and controlled. Stop immediately if you feel contractions or sharp pelvic pain.',
      'Do not strain or pull in too aggressively.'
    ],
    benefits: 'Supports the heavy weight of the baby, stabilizes the deep core, and prevents lower back strain.',
    description: 'On your hands and knees, let your belly drop completely as you inhale, then gently pull your baby up toward your spine as you exhale.'
  },
  {
    id: 'third-standing-pelvic-tilts',
    title: 'Standing Pelvic Tilts',
    category: 'Pelvic Floor',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Stand with your knees slightly bent, feet wider than hip-width apart, and place hands on your hips.',
      'Tuck your tailbone under gently, flattening your lower back.',
      'Hold the tilt for a brief moment, then release to neutral.',
      'Perform 10-15 times slowly.'
    ],
    breathingCues: [
      'Exhale as you tuck your pelvis and engage your deep abdominals.',
      'Inhale as you release back to a neutral stance.'
    ],
    safetyWarnings: [
      'Widen Your Stance: Keep your feet wider than hip-width during all standing exercises to keep your balance secure.',
      'Do not tuck too aggressively or use sudden, jerky movements.'
    ],
    benefits: 'Helps support the heavy weight of your baby, protects your lower back, and prepares your pelvic muscles to push.',
    description: 'Stand with your knees slightly bent, hands on hips, and tuck your tailbone under, flattening your lower back.'
  },
  {
    id: 'third-bird-dog-short',
    title: 'Bird-Dog (Short Holds)',
    category: 'Core Stability',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '4 min',
    instructions: [
      'Get down on hands and knees in tabletop position.',
      'Extend opposite arm and leg parallel to the floor just for a brief moment (1-2 seconds) to practice balancing safely.',
      'Lower back to hands and knees and alternate sides.',
      'Perform 8-10 repetitions per side.'
    ],
    breathingCues: [
      'Exhale as you extend your arm and leg, keeping your hips stable.',
      'Inhale as you return to the starting tabletop position.'
    ],
    safetyWarnings: [
      'Keep holds brief to maintain stability as relaxin has loosened your joints.',
      'Ensure opposite arm and leg do not raise higher than your shoulder and hip respectively.'
    ],
    benefits: 'Builds core strength and safe balance without overloading the spine.',
    description: 'On your hands and knees, extend opposite arm and leg just for a brief moment to practice balancing safely.'
  },
  {
    id: 'third-seated-cat-cow',
    title: 'Seated Cat-Cow',
    category: 'Mobility',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Sit tall on a sturdy chair, placing your feet wider than hip-width.',
      'Inhale, open your chest, and press your chest forward to arch your upper spine gently (Cow).',
      'Exhale, gently round your upper spine and look down towards your belly (Cat).',
      'Repeat slowly for 10-12 breath cycles.'
    ],
    breathingCues: [
      'Inhale fully to expand your chest and pull your shoulders back.',
      'Exhale slowly to round your back and stretch the shoulder blades.'
    ],
    safetyWarnings: [
      'Keep movements gentle and slow. Do not over-extend or over-arch the lower back.'
    ],
    benefits: 'Relieves back pain, supports chest expansion, and encourages baby alignment.',
    description: 'Sit on a sturdy chair; gently round your upper spine, then press your chest forward.'
  },
  {
    id: 'third-clamshells',
    title: 'Side-Lying Clamshells',
    category: 'Pelvic Floor',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Lie on your side (preferably left side) with your knees bent at 90 degrees.',
      'Place a pillow under your head and another pillow under your belly for support.',
      'Lift your top knee while keeping your feet glued together and your hips stacked and stable.',
      'Lower the knee back down slowly.',
      'Repeat 10-12 times on one side before switching.'
    ],
    breathingCues: [
      'Exhale as you open your knees like a clamshell.',
      'Inhale as you slowly close them.'
    ],
    safetyWarnings: [
      'Avoid the Vena Cava Position: Do not lie flat on your back. Use a pillow to tilt your body to the left.',
      'Ensure you do not rotate your hips backwards during the movement.'
    ],
    benefits: 'Strengthens outer hips and glutes, which helps support the pelvic floor and keeps hips stable.',
    description: 'Lie on your side with knees bent; lift your top knee while keeping your feet glued together to keep your hips stable.'
  },
  {
    id: 'third-supported-deep-squat',
    title: 'Supported Deep Squat (Malasana)',
    category: 'Lower Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '4 min',
    instructions: [
      'Stand with your feet wider than shoulder-width apart, toes turned out.',
      'Hold onto a sturdy table, bedframe, or door frame for balance.',
      'Lower your hips down low to stretch your inner thighs and pelvic floor.',
      'Hold for 3-5 deep breaths, focusing on total relaxation of the pelvic floor.',
      'Slowly rise back up to standing.'
    ],
    breathingCues: [
      'Inhale deeply into your lower abdomen as you lower down, letting the pelvic floor release.',
      'Exhale slowly as you lift, maintaining support from the table.'
    ],
    safetyWarnings: [
      'Widen Your Stance: Keep feet wide to keep your balance secure.',
      'Avoid deep squatting if the baby is breech or if you have symphysis pubis dysfunction.'
    ],
    benefits: 'Opens up your pelvis to help the baby drop and builds leg strength for labor positions.',
    description: 'Hold onto a sturdy table, bedframe, or door frame, and lower your hips down low to stretch your inner thighs and pelvic floor.'
  },
  {
    id: 'third-wall-slides',
    title: 'Wall Slides',
    category: 'Lower Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Lean your back flat against a wall with your feet placed wider than hip-width apart.',
      'Slide down into a shallow squat, holding for 2 seconds.',
      'Slide back up slowly to standing.',
      'Perform 10 repetitions.'
    ],
    breathingCues: [
      'Inhale as you slide down the wall.',
      'Exhale as you push through your heels to stand back up.'
    ],
    safetyWarnings: [
      'Do not squat too deeply. Keep it shallow to protect your pelvic joints.',
      'Widen Your Stance: Keep your feet wider than hip-width to stay balanced.'
    ],
    benefits: 'Builds quad and glute strength while keeping the lower back safely supported.',
    description: 'Lean your back flat against a wall and slide down into a shallow squat, holding for 2 seconds before sliding back up.'
  },
  {
    id: 'third-sumo-squat-pulsing',
    title: 'Sumo Squat Pulsing (Shallow)',
    category: 'Lower Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Take a wide stance with toes turned outward around 45 degrees.',
      'Drop into a shallow squat, keeping your torso upright.',
      'Pulse up and down slightly (2-3 inches) for 10-15 seconds.',
      'Stand up to rest, then repeat 3-4 times.'
    ],
    breathingCues: [
      'Breathe slowly and rhythmically throughout the pulsing motion.'
    ],
    safetyWarnings: [
      'Widen Your Stance: Keep feet wide to keep your balance secure.',
      'Stop immediately if you feel joint instability or pelvic pain.'
    ],
    benefits: 'Builds isometric endurance in the legs for birthing positions while keeping the impact minimal.',
    description: 'Take a wide stance with toes turned outward, drop into a shallow squat, and pulse up and down slightly.'
  },
  {
    id: 'third-seated-knee-extensions',
    title: 'Seated Knee Extensions',
    category: 'Lower Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Sit tall in a sturdy chair, feet flat on the floor.',
      'Slowly straighten one leg out in front of you, flexing your thigh muscle.',
      'Lower the leg back down with control.',
      'Alternate legs, performing 10-12 repetitions per leg.'
    ],
    breathingCues: [
      'Exhale as you extend the leg and flex.',
      'Inhale as you lower it back down.'
    ],
    safetyWarnings: [
      'Do not slump or bend forward; keep your back straight.',
      'Move with a slow, controlled pace.'
    ],
    benefits: 'Strengthens your quadriceps safely while seated, reducing weight load on your joints.',
    description: 'Sit tall in a chair and slowly straighten one leg out in front of you, flexing your thigh muscle, then alternate.'
  },
  {
    id: 'third-chair-lunges',
    title: 'Chair Lunges',
    category: 'Lower Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '4 min',
    instructions: [
      'Stand facing a sturdy chair, place one foot onto the seat.',
      'Gently lean forward to stretch your hip flexors on the opposite leg.',
      'Hold the stretch for 15-20 seconds.',
      'Step down and switch sides.'
    ],
    breathingCues: [
      'Breathe deeply and slowly as you hold the lunge stretch, releasing tension.'
    ],
    safetyWarnings: [
      'Ensure the chair is positioned against a wall so it cannot slide.',
      'Keep your upper body upright to avoid compressing the abdomen.'
    ],
    benefits: 'Stretches tight hip flexors and improves pelvic mobility.',
    description: 'Stand facing a chair, place one foot onto the seat, and gently lean forward to stretch your hip flexors.'
  },
  {
    id: 'third-standing-calf-raises',
    title: 'Standing Calf Raises',
    category: 'Lower Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Hold onto a wall or counter for balance.',
      'Stand with your feet wider than hip-width apart.',
      'Raise up onto your tiptoes, hold for 1-2 seconds, and slowly lower.',
      'Perform 15-20 repetitions.'
    ],
    breathingCues: [
      'Exhale as you lift up onto your tiptoes.',
      'Inhale as you lower your heels back to the floor.'
    ],
    safetyWarnings: [
      'Widen Your Stance: Feet should be wide to secure balance.',
      'Always use a sturdy support.'
    ],
    benefits: 'Builds calf strength and promotes circulation to prevent fluid retention (swelling).',
    description: 'Hold onto a wall or counter for balance and raise up onto your tiptoes to keep lower-body circulation moving.'
  },
  {
    id: 'third-seated-leg-taps',
    title: 'Seated Leg Taps',
    category: 'Lower Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Sit on a sturdy chair with feet flat.',
      'Tap your feet out to the side one at a time, moving from the hip joint.',
      'Perform 10 taps on each side.'
    ],
    breathingCues: [
      'Breathe rhythmically. Exhale as you tap out, inhale as you bring it back.'
    ],
    safetyWarnings: [
      'Keep the movement comfortable; do not stretch the hip too wide.'
    ],
    benefits: 'Improves mobility in the hip socket without stressing the joints.',
    description: 'Sit on a chair and tap your feet out to the side one at a time, moving from the hip joint.'
  },
  {
    id: 'third-wall-pushups',
    title: 'Wall Push-Ups',
    category: 'Upper Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Stand an arm\'s length away from a wall, feet wider than hip-width.',
      'Place your hands wide on the wall.',
      'Lower your chest toward it, keeping your core stable and hips in line.',
      'Push back slowly to starting position.',
      'Repeat 10-12 times.'
    ],
    breathingCues: [
      'Inhale as you lower toward the wall.',
      'Exhale as you push back.'
    ],
    safetyWarnings: [
      'Widen Your Stance: Keep feet wide to keep your balance secure.',
      'Do not let your back sag.'
    ],
    benefits: 'Strengthens your chest and arms safely to prepare for holding your baby.',
    description: 'Stand an arm\'s length away from a wall, place your hands wide, and lower your chest toward it.'
  },
  {
    id: 'third-scapular-squeezes',
    title: 'Scapular Squeezes (W-Shaped)',
    category: 'Upper Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Bring your elbows down to your sides to form a \'W\' shape.',
      'Pinch your shoulder blades together, holding for 3 seconds.',
      'Release the pinch and repeat 12-15 times.'
    ],
    breathingCues: [
      'Exhale as you squeeze and pinch your shoulder blades.',
      'Inhale as you release.'
    ],
    safetyWarnings: [
      'Do not shrug your shoulders up; keep them pulled down away from your ears.'
    ],
    benefits: 'Realigns posture, opens up the chest, and relieves upper back tension.',
    description: 'Bring your elbows down to your sides to form a \'W\' shape and pinch your shoulder blades together.'
  },
  {
    id: 'third-seated-bicep-curls',
    title: 'Seated Bicep Curls',
    category: 'Upper Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Sit straight, clench your fists.',
      'Bring your hands up to your shoulders using slow, deliberate self-resistance (squeeze your bicep).',
      'Lower down slowly and repeat 15 times.'
    ],
    breathingCues: [
      'Exhale as you curl your fists up.',
      'Inhale as you lower them down.'
    ],
    safetyWarnings: [
      'Avoid swinging your shoulders; isolate the movement in the arms.'
    ],
    benefits: 'Builds arm strength for carrying and nursing your baby.',
    description: 'Sit straight, clench your fists, and bring your hands up to your shoulders using slow, deliberate self-resistance.'
  },
  {
    id: 'third-arm-circles',
    title: 'Arm Circles (Small & Slow)',
    category: 'Upper Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Extend arms outward at shoulder height.',
      'Make small circles forward for 30 seconds, then backward for 30 seconds.',
      'Keep your movements slow and controlled.'
    ],
    breathingCues: [
      'Breathe naturally and deeply throughout the exercise.'
    ],
    safetyWarnings: [
      'Lower your arms if you feel shoulder or neck strain.',
      'Widen Your Stance if standing.'
    ],
    benefits: 'Improves shoulder mobility and builds endurance for holding your baby.',
    description: 'Extend arms outward at shoulder height and make small circles to build endurance for holding your baby.'
  },
  {
    id: 'third-wall-angels',
    title: 'Wall Angels',
    category: 'Upper Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Lean your back against a wall, with heels about a foot away.',
      'Press your elbows and wrists against the wall.',
      'Slowly slide your arms up and down, keeping contact with the wall.',
      'Perform 8-10 repetitions.'
    ],
    breathingCues: [
      'Exhale as you slide up, inhale as you slide down.'
    ],
    safetyWarnings: [
      'Do not arch your lower back off the wall as your arms slide upward.'
    ],
    benefits: 'Opens tight chest muscles and strengthens postural stabilizers in the upper back.',
    description: 'Lean your back against a wall, press your elbows and wrists against it, and slowly slide your arms up and down.'
  },
  {
    id: 'third-goal-post-chest',
    title: 'Goal-Post Chest Opener',
    category: 'Upper Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Bring your arms up like a football goal-post (elbows bent at 90 degrees).',
      'Pull your elbows gently backward to stretch tight chest muscles.',
      'Hold the stretch for 3 seconds, then return to neutral.',
      'Repeat 10 times.'
    ],
    breathingCues: [
      'Inhale as you open wide and stretch your chest.',
      'Exhale as you release the stretch.'
    ],
    safetyWarnings: [
      'Perform the stretch gently; do not force your shoulders back.'
    ],
    benefits: 'Counters the forward pull of heavy breasts and opens up the ribcage.',
    description: 'Bring your arms up like a football goal-post and pull your elbows gently backward to stretch tight chest muscles.'
  },
  {
    id: 'third-shoulder-shrugs',
    title: 'Shoulder Shrugs and Rolls',
    category: 'Upper Body',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Lift your shoulders up to your ears.',
      'Roll them backward and down in a slow circle.',
      'Repeat 10-15 times to release tension.'
    ],
    breathingCues: [
      'Inhale as you shrug up.',
      'Exhale as you roll down and back.'
    ],
    safetyWarnings: [
      'Keep the rolls slow and smooth; do not jerk your neck.'
    ],
    benefits: 'Relieves stress and muscle tension in the upper shoulders and neck.',
    description: 'Lift your shoulders up to your ears and roll them backward to release built-up neck tension.'
  },
  {
    id: 'third-side-step-taps',
    title: 'Gentle Side-to-Side Step Taps',
    category: 'Mobility',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '4 min',
    instructions: [
      'Take slow, wide steps from side to side in your room.',
      'Tap your foot gently as you complete each step.',
      'Keep a slow, steady pace for 3-4 minutes.'
    ],
    breathingCues: [
      'Breathe deeply and rhythmically. Avoid holding your breath.'
    ],
    safetyWarnings: [
      'Ensure you do not cross your legs or move too fast to prevent loss of balance.',
      'Widen Your Stance: Keep movements wide and stable.'
    ],
    benefits: 'Increases light circulation to reduce fluid retention and swelling in the lower limbs.',
    description: 'Take slow, wide steps from side to side in your room to keep your heart rate up slightly.'
  },
  {
    id: 'third-pelvic-clocks',
    title: 'Pelvic Clocks / Hip Circles',
    category: 'Mobility',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Stand with feet wide, hands on hips.',
      'Make big, slow circular loops with your pelvis.',
      'Perform 10 circles clockwise, then 10 counter-clockwise.'
    ],
    breathingCues: [
      'Inhale as your hips circle forward.',
      'Exhale as your hips circle backward.'
    ],
    safetyWarnings: [
      'Widen Your Stance: Feet should be wider than hip-width apart.',
      'Keep knees soft and movements slow.'
    ],
    benefits: 'Relieves lower back stiffness and encourages optimal pelvic positioning.',
    description: 'Stand with feet wide, hands on hips, and make big, slow circular loops with your pelvis.'
  },
  {
    id: 'third-seated-ankle-circles',
    title: 'Seated Ankle Circles',
    category: 'Mobility',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Sit down in a supportive chair.',
      'Lift one foot slightly off the floor.',
      'Roll your ankle in circles clockwise for 10 repetitions, then counter-clockwise.',
      'Switch feet and repeat.'
    ],
    breathingCues: [
      'Breathe deeply and naturally throughout the ankle circles.'
    ],
    safetyWarnings: [
      'Sit comfortably and fully back in the chair to avoid slips.'
    ],
    benefits: 'Promotes blood circulation in the feet and ankles, reducing swelling.',
    description: 'Sit down, lift one foot, and roll your ankle in circles clockwise and counter-clockwise to reduce swelling.'
  },
  {
    id: 'third-standing-torso-twists',
    title: 'Standing Torso Twists (Shoulders Only)',
    category: 'Mobility',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '2 min',
    instructions: [
      'Stand with your feet wider than hip-width.',
      'Keep your hips locked facing forward.',
      'Gently sway your arms and shoulders left to right, rotating your upper spine.',
      'Continue for 1-2 minutes.'
    ],
    breathingCues: [
      'Exhale as you twist to the side, inhale as you rotate back to center.'
    ],
    safetyWarnings: [
      'Widen Your Stance: Keep feet wide to keep your balance secure.',
      'Ensure your hips remain facing forward to protect your abdominal ligaments.'
    ],
    benefits: 'Stretches upper back and shoulders while keeping the lower abdomen stable.',
    description: 'Keep your hips locked facing forward while gently swaying your arms and shoulders left to right.'
  },
  {
    id: 'third-open-knee-tailor',
    title: 'Open-Knee Tailor Pose',
    category: 'Mobility',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Sit with the soles of your feet together on a mat.',
      'Push your feet further away from your body to accommodate your belly comfortably.',
      'Let your knees open gently toward the sides.',
      'Hold the stretch for 1-2 minutes, breathing deeply.'
    ],
    breathingCues: [
      'Inhale deeply, expanding your lower abdomen.',
      'Exhale slowly, allowing your inner thighs to open and relax.'
    ],
    safetyWarnings: [
      'Do not force your knees downward; allow gravity to open them naturally.',
      'Ensure your spine remains straight; sit against a wall if you need back support.'
    ],
    benefits: 'Relieves inner thigh tightness and opens up the pelvis to help the baby drop.',
    description: 'Sit with the soles of your feet together, but push your feet further away from your body to accommodate your belly.'
  },
  {
    id: 'third-standing-hip-hikes',
    title: 'Standing Hip Hikes',
    category: 'Mobility',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'Hold onto a counter or wall for balance.',
      'Stand on one leg, keeping your knee soft.',
      'Lift your opposite hip up and down slightly, using your hip muscles.',
      'Perform 10 hikes, then switch sides.'
    ],
    breathingCues: [
      'Exhale as you hike your hip up.',
      'Inhale as you lower it back down.'
    ],
    safetyWarnings: [
      'Always hold onto a sturdy surface. Avoid sudden, jerky movements.',
      'Stop if you feel any sharp pelvic girdle pain.'
    ],
    benefits: 'Stabilizes the pelvis and strengthens the lateral hip muscles.',
    description: 'Hold a counter for balance, stand on one leg, and lift your opposite hip up and down slightly.'
  },
  {
    id: 'third-perineal-breathing',
    title: 'Perineal Breathing',
    category: 'Breathing',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '5 min',
    instructions: [
      'Sit comfortably supported on a chair or birthing ball.',
      'Inhale fully into your lower abdomen.',
      'Imagine your pelvic floor opening up like a blossoming flower.',
      'Exhale slowly, keeping the pelvic floor completely relaxed.',
      'Practice for 5 minutes.'
    ],
    breathingCues: [
      'Inhale: Direct your breath down, relaxing and expanding the pelvic floor muscles.',
      'Exhale: Release the air gently, keeping the pelvic floor relaxed (do not contract).'
    ],
    safetyWarnings: [
      'Do not push or bear down. This is an exercise in conscious relaxation.'
    ],
    benefits: 'Essential labor prep; teaches you how to release the pelvic floor while inhaling to allow the baby to descend.',
    description: 'Inhale fully into your lower abdomen, imagining your pelvic floor opening up like a blossoming flower (crucial for pushing).'
  },
  {
    id: 'third-open-wide-childs-pose',
    title: 'Open Wide Child’s Pose',
    category: 'Labor Preparation',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '5 min',
    instructions: [
      'Spread your knees as wide as possible to give your belly plenty of room.',
      'Keep your big toes touching behind you.',
      'Lean forward onto a stack of pillows or a bolster.',
      'Breathe deeply and relax in this position for 3-5 minutes.'
    ],
    breathingCues: [
      'Breathe deeply into your lower back and ribs, expanding them as you inhale.',
      'Exhale and let your hips melt down toward your heels.'
    ],
    safetyWarnings: [
      'Avoid if you feel any knee pain. Ensure your belly is not squished or compressed.'
    ],
    benefits: 'Stretches the lower back, opens the pelvis, and promotes mental and physical relaxation.',
    description: 'Keep your big toes touching but spread your knees as wide as possible to give your belly plenty of room; lean forward onto a stack of pillows.'
  },
  {
    id: 'third-thread-needle-gentle',
    title: 'Thread the Needle (Gentle)',
    category: 'Mobility',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '3 min',
    instructions: [
      'From an all-fours position, slide one arm under your chest.',
      'Rest your forearm on the floor to stretch your shoulder without twisting your lower belly.',
      'Keep your hips level and square.',
      'Hold for 3-4 deep breaths, then switch sides.'
    ],
    breathingCues: [
      'Inhale to prepare in tabletop.',
      'Exhale as you slide your arm under and relax into the shoulder stretch.'
    ],
    safetyWarnings: [
      'Do not rotate your lower torso. Keep the stretch focused on your upper back and shoulders.',
      'Stop if you feel any abdominal cramping.'
    ],
    benefits: 'Relieves upper back stiffness and opens the shoulders safely.',
    description: 'From an all-fours position, slide one arm under your chest to stretch your shoulder without twisting your lower belly.'
  },
  {
    id: 'third-wall-supported-forward-lean',
    title: 'Wall-Supported Forward Lean',
    category: 'Labor Preparation',
    targetTrimesters: ['Third'],
    targetPostpartumWeeks: [],
    isPregnancySafe: true,
    isPostpartumSafe: false,
    duration: '4 min',
    instructions: [
      'Stand facing a wall, feet wider than hip-width.',
      'Place your forearms flat against the wall.',
      'Rest your forehead on your hands.',
      'Gently sway your hips side to side to relieve pelvic pressure.',
      'Perform for 2-3 minutes.'
    ],
    breathingCues: [
      'Inhale deeply into your belly, allowing it to hang and relax.',
      'Exhale slowly to release all back and hip tension.'
    ],
    safetyWarnings: [
      'Widen Your Stance: Feet should be wide to secure your balance.',
      'Stop if you feel contractions or dizziness.'
    ],
    benefits: 'Relieves lower back pain, takes baby\'s weight off your spine, and helps position the baby for labor.',
    description: 'Stand facing a wall, place your forearms flat against it, rest your forehead on your hands, and sway your hips to relieve pelvic pressure.'
  },
];

export const VACCINES: Vaccine[] = [
  {
    id: 'bcg',
    name: 'BCG (Tuberculosis)',
    description: 'Protects against tuberculosis. Single dose given shortly after birth.',
    ageMilestone: 'Birth',
    monthsOffset: 0,
    isRequired: true
  },
  {
    id: 'opv-birth',
    name: 'OPV-0 (Oral Polio Vaccine)',
    description: 'Polio protection. Initial dose given at birth.',
    ageMilestone: 'Birth',
    monthsOffset: 0,
    isRequired: true
  },
  {
    id: 'hepb-birth',
    name: 'Hepatitis B - Dose 1',
    description: 'Protects against Hepatitis B virus. Given within 24 hours of birth.',
    ageMilestone: 'Birth',
    monthsOffset: 0,
    isRequired: true
  },
  {
    id: 'penta-1',
    name: 'Pentavalent 1 (DTP-HepB-Hib)',
    description: 'Combined protection against Diphtheria, Tetanus, Pertussis, Hep B, and Hib.',
    ageMilestone: '6 Weeks',
    monthsOffset: 1.5,
    isRequired: true
  },
  {
    id: 'opv-1',
    name: 'OPV-1 & IPV-1 (Polio)',
    description: 'First routing doses of oral and inactivated polio vaccines.',
    ageMilestone: '6 Weeks',
    monthsOffset: 1.5,
    isRequired: true
  },
  {
    id: 'rotavirus-1',
    name: 'Rotavirus 1',
    description: 'Protects infants against severe diarrheal disease.',
    ageMilestone: '6 Weeks',
    monthsOffset: 1.5,
    isRequired: true
  },
  {
    id: 'penta-2',
    name: 'Pentavalent 2 (DTP-HepB-Hib)',
    description: 'Second dose for continued core protection.',
    ageMilestone: '10 Weeks',
    monthsOffset: 2.3,
    isRequired: true
  },
  {
    id: 'opv-2',
    name: 'OPV-2 (Polio)',
    description: 'Second oral polio vaccine dose.',
    ageMilestone: '10 Weeks',
    monthsOffset: 2.3,
    isRequired: true
  },
  {
    id: 'rotavirus-2',
    name: 'Rotavirus 2',
    description: 'Second oral dose for rotavirus protection.',
    ageMilestone: '10 Weeks',
    monthsOffset: 2.3,
    isRequired: true
  },
  {
    id: 'penta-3',
    name: 'Pentavalent 3 (DTP-HepB-Hib)',
    description: 'Third and final primary dose of pentavalent series.',
    ageMilestone: '14 Weeks',
    monthsOffset: 3.2,
    isRequired: true
  },
  {
    id: 'opv-3',
    name: 'OPV-3 & IPV-2 (Polio)',
    description: 'Completes primary polio immunization series.',
    ageMilestone: '14 Weeks',
    monthsOffset: 3.2,
    isRequired: true
  },
  {
    id: 'measles-1',
    name: 'Measles-Rubella 1 (MR)',
    description: 'First dose of protection against measles and rubella.',
    ageMilestone: '9 Months',
    monthsOffset: 9,
    isRequired: true
  },
  {
    id: 'yellow-fever',
    name: 'Yellow Fever Vaccine',
    description: 'Given in endemic regions for lifelong protection.',
    ageMilestone: '9 Months',
    monthsOffset: 9,
    isRequired: false
  },
  {
    id: 'mmr-booster',
    name: 'MMR Booster',
    description: 'Booster for Measles, Mumps, and Rubella to ensure long-term immunity.',
    ageMilestone: '15 Months',
    monthsOffset: 15,
    isRequired: true
  }
];

export const CARE_ARTICLES: CareArticle[] = [
  {
    id: 'safe-sleep',
    title: 'Safe Sleep Guidelines for Your Newborn',
    category: 'Safe Sleep',
    summary: 'Essential rules to reduce the risk of SIDS and ensure a safe, restful night for your baby.',
    content: [
      'Sudden Infant Death Syndrome (SIDS) is a primary concern for new parents. By following established safe sleep guidelines, you can significantly reduce the risks.',
      'Place your baby on their back to sleep for every sleep time—naps and night time. This is the single most important action.',
      'Use a firm, flat sleep surface, such as a mattress in a safety-approved crib, covered only by a fitted sheet. Never use pillows, quilts, or soft bumpers.',
      'Keep soft objects, loose bedding, and toys out of the baby\'s sleep area. Sleep sacks are recommended over loose blankets to keep your baby warm.',
      'Room-share—keep baby\'s sleep area in the same room where you sleep, close to your bed, for at least the first 6 months. Do not co-sleep in the same bed, which poses choking and suffocation risks.'
    ],
    tips: [
      'Always place baby flat on their back.',
      'Maintain room temperature between 68-72°F (20-22°C) to prevent overheating.',
      'Avoid blankets; use a wearable sleep sack instead.',
      'Ensure the crib mattress fits snugly with no gaps.'
    ]
  },
  {
    id: 'newborn-nutrition',
    title: 'Newborn Feeding & Nutrition: Breast & Formula',
    category: 'Nutrition',
    summary: 'A guide to feeding cues, schedules, and ensuring your baby gets proper nourishment in the early months.',
    content: [
      'In the first few weeks, babies feed on demand rather than a strict schedule. This typically translates to 8 to 12 times in a 24-hour period.',
      'Look for early hunger cues: rooting (turning head and opening mouth), sucking on hands, lip-smacking, and increased alertness. Crying is a late hunger cue; try to feed before they become distressed.',
      'For breastfeeding mothers, nurse from both breasts per feeding session to encourage supply, letting baby finish the first side before switching.',
      'For formula feeding, newborns typically take 1 to 2 ounces per feeding in the first week, progressing to 3 to 4 ounces by the end of the first month.',
      'Monitor weight gain and wet diapers. Expect 6 or more wet diapers and 3-4 bowel movements per day by the first week.'
    ],
    tips: [
      'Feed on demand, typically every 2 to 3 hours.',
      'Watch for hands-to-mouth movements as early hunger signs.',
      'Ensure a deep latch during breastfeeding to reduce nipple discomfort.',
      'Burp your baby halfway through and at the end of each feed.'
    ]
  },
  {
    id: 'hydration-guidance',
    title: 'Understanding Baby Hydration needs',
    category: 'Hydration',
    summary: 'Why water is not needed for young infants, and how to spot signs of dehydration.',
    content: [
      'Infants under 6 months of age receive all their necessary hydration from breastmilk or formula. You should NOT give water or juice to babies under 6 months.',
      'Giving water to a young baby can dilute their blood sodium levels, leading to water intoxication, and fills them up without providing critical calories.',
      'Once solid foods are introduced around 6 months, you can offer small sips of water in a sippy cup (no more than 2-4 ounces per day).',
      'Watch closely for signs of dehydration: fewer than 6 wet diapers in 24 hours, dry or sticky mouth, no tears when crying, sunken eyes, or unusual lethargy.'
    ],
    tips: [
      'Breastmilk/formula only for the first 6 months.',
      'Never dilute formula with extra water.',
      'Check for a soft spot (fontanelle) that appears sunken, which indicates dehydration.'
    ]
  },
  {
    id: 'common-illness',
    title: 'Handling Common Illnesses: Fevers and Colds',
    category: 'Common Illnesses',
    summary: 'How to manage congestion, when to call the pediatrician, and understanding baby fevers.',
    content: [
      'Newborn immune systems are developing, making them susceptible to mild viruses. However, a fever in a baby under 3 months is always a medical emergency.',
      'For babies under 3 months, a rectal temperature of 100.4°F (38°C) or higher requires immediate evaluation by a doctor.',
      'For older babies, fevers are a natural response to fighting infection. Focus on comfort: keep them hydrated, dress them in light layers, and consult a doctor for appropriate dosage of infant acetaminophen or ibuprofen (never aspirin).',
      'For colds and nasal congestion, babies cannot clear their own noses. Use a bulb syringe or nasal aspirator with saline drops to clear secretions before feeds and sleep.'
    ],
    tips: [
      'Under 3 months: Any fever >= 100.4°F is an immediate ER visit.',
      'Use saline drops and a nasal bulb to relieve stuffy noses.',
      'Monitor breathing rate: rapid breathing or retractions (skin pulling in under ribs) requires immediate care.',
      'Never give cold medicines to infants without pediatric authorization.'
    ]
  }
];

export const LABOR_PREP_GUIDES: LaborPrepGuide[] = [
  {
    id: 'slow-paced-breathing',
    title: 'Slow-Paced Breathing',
    category: 'Breathing Techniques',
    description: 'A calming, restorative breathing pattern designed to manage early labor contractions and reduce the stress response.',
    instructions: [
      'Find a comfortable position (sitting, leaning on a birth ball, or lying on your side).',
      'Relax your shoulders and jaw.',
      'As a contraction begins, take an organizing breath—a deep breath in through your nose and a slow sigh out through your mouth.',
      'Inhale slowly through your nose to a comfortable count of 4.',
      'Exhale gently through your mouth (as if blowing out a candle) to a count of 6.',
      'Continue this pattern until the contraction ends, then release with another deep organizing sigh.'
    ],
    videoPlaceholder: 'Slow Breathing Demo'
  },
  {
    id: 'comfort-positions',
    title: 'Gravity-Assisted Comfort Positions',
    category: 'Comfort Positions',
    description: 'Active labor positions that utilize gravity to help the baby descend into the pelvis and relieve pressure on the lower back.',
    instructions: [
      'Standing & Leaning: Stand facing your support partner or a wall. Wrap arms around partner\'s neck and sway gently, letting your hips loose.',
      'Hands and Knees: Get on all fours on a soft mat. This position takes pressure off your spine (great for back labor) and allows for pelvic rocks.',
      'Sitting on Birth Ball: Sit on a inflated labor ball with knees wide. Roll hips in circles or figure-eights to encourage baby descent.',
      'Supported Squat: Squatting opens the pelvic outlet. Use a squat bar, birth stool, or lean back against a partner for support. Hold only during contractions or for short intervals.'
    ],
    videoPlaceholder: 'Active Labor Positions Video'
  },
  {
    id: 'diversion-sensory',
    title: 'Sensory Diversion and Gate Control',
    category: 'Diversion Therapy',
    description: 'Techniques that use tactile, visual, or auditory stimulation to block pain signals from fully reaching the brain.',
    instructions: [
      'Counterpressure: Have a partner press the heels of their hands firmly against your lower back (sacrum) during contractions.',
      'Double Hip Squeeze: Partner places hands on both sides of your hips and presses inward and slightly upward, relieving pelvic joint strain.',
      'Focal Points: Choose an object in the room or close your eyes and visualize a calming place to anchor your focus during surges.',
      'Aromatherapy: Lavender for relaxation, peppermint for nausea, or citrus for energy applied to a cotton ball near you.'
    ],
    videoPlaceholder: 'Partner Support Counterpressure'
  }
];
