import React, { useState, useEffect } from 'react';
import { Wind, Music, Eye, Activity, ShieldAlert, Brain, Compass, Smile, Sparkles } from 'lucide-react';

interface Technique {
  title: string;
  subtitle: string;
  how: string;
  why: string;
  tips?: string[];
}

export const LabourNavigationView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'breathing' | 'diversion' | 'comfort'>('breathing');
  
  // Interactive Breathing Guide State
  const [isPacerActive, setIsPacerActive] = useState(false);
  const [pacerMode, setPacerMode] = useState<'early' | 'active' | 'transition' | 'pushing'>('early');
  const [pacerPhase, setPacerPhase] = useState<'Inhale' | 'Exhale' | 'Hee-Hee' | 'Hoo' | 'Puff'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Breathing pacer logic
  useEffect(() => {
    if (!isPacerActive) return;

    let timer: any;
    if (pacerMode === 'early') {
      // 4s Inhale, 4s Exhale
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setPacerPhase((phase) => (phase === 'Inhale' ? 'Exhale' : 'Inhale'));
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (pacerMode === 'active') {
      // Hee-Hee (2s), Hoo (3s)
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setPacerPhase((phase) => {
              if (phase === 'Hee-Hee') {
                setSecondsLeft(3);
                return 'Hoo';
              } else {
                setSecondsLeft(2);
                return 'Hee-Hee';
              }
            });
            return 2;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (pacerMode === 'transition') {
      // Cooling breath: Rapid puffs (1s cycles)
      timer = setInterval(() => {
        setPacerPhase((phase) => (phase === 'Puff' ? 'Puff' : 'Puff'));
        setSecondsLeft(1);
      }, 1000);
    } else if (pacerMode === 'pushing') {
      // Inhale (3s), Push Groan (5s)
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setPacerPhase((phase) => {
              if (phase === 'Inhale') {
                setSecondsLeft(5);
                return 'Exhale'; // Groan
              } else {
                setSecondsLeft(3);
                return 'Inhale';
              }
            });
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPacerActive, pacerMode, pacerPhase]);

  // Reset pacer details on mode change
  useEffect(() => {
    if (pacerMode === 'early') {
      setPacerPhase('Inhale');
      setSecondsLeft(4);
    } else if (pacerMode === 'active') {
      setPacerPhase('Hee-Hee');
      setSecondsLeft(2);
    } else if (pacerMode === 'transition') {
      setPacerPhase('Puff');
      setSecondsLeft(1);
    } else if (pacerMode === 'pushing') {
      setPacerPhase('Inhale');
      setSecondsLeft(3);
    }
  }, [pacerMode]);

  const breathingTechniques: Record<'early' | 'active' | 'transition' | 'pushing', Technique> = {
    early: {
      title: 'First Stage: Early Labor',
      subtitle: 'Slow, Deep Belly Breathing',
      how: 'Inhale deeply through your nose for 4 seconds, expanding your belly and chest. Exhale slowly through your mouth for 4 seconds, letting your body go completely limp.',
      why: 'This saves your energy and keeps you calm when contractions are just starting.'
    },
    active: {
      title: 'First Stage: Active Labor',
      subtitle: 'Patterned "Hee-Hee-Hoo" Breathing',
      how: 'As contractions get stronger, switch to lighter, shallower breathing. Take two quick, short breaths in through your nose ("hee-hee") and one long breath out through your mouth ("hoo").',
      why: 'This keeps you focused and prevents you from holding your breath when pain peaks.'
    },
    transition: {
      title: 'Transition Stage',
      subtitle: 'The "Cooling" Breath',
      how: 'If you feel the urge to push before you are fully dilated, blow out short, sharp puffs of air rapidly (like blowing out a candle).',
      why: 'This physically prevents you from bearing down too early, protecting your cervix.'
    },
    pushing: {
      title: 'Second Stage: Pushing',
      subtitle: 'Open-Glottis Breathing',
      how: 'Take a deep breath in as a contraction starts. As you bear down to push, slowly let air out through your mouth with a low groan or grunt.',
      why: 'Avoid holding your breath and straining ("purple pushing"), as letting air out gently protects your pelvic floor and keeps oxygen flowing to the baby.'
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      
      {/* Title Header */}
      <div className="mb-4">
        <span className="text-xs uppercase tracking-widest font-bold text-wellora-terracotta flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" /> Labor Navigation Suite
        </span>
        <h2 className="font-serif text-2xl font-bold text-wellora-mocha mt-1">
          Active Coping & Comfort
        </h2>
        <p className="text-xs text-wellora-mocha/60 mt-1 leading-normal">
          Use the physical coping mechanisms and distraction tools below to regulate adrenaline, manage contractions, and support labor progression.
        </p>
      </div>

      {/* Category Tab Selector */}
      <div className="grid grid-cols-3 gap-2 bg-wellora-rose/10 p-1 rounded-2xl">
        <button
          onClick={() => setActiveCategory('breathing')}
          className={`py-2 px-3 text-xs rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCategory === 'breathing'
              ? 'bg-white text-wellora-terracotta shadow-sm'
              : 'text-wellora-mocha hover:bg-white/40'
          }`}
        >
          <Wind className="w-4 h-4" /> Breathing
        </button>
        <button
          onClick={() => setActiveCategory('diversion')}
          className={`py-2 px-3 text-xs rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCategory === 'diversion'
              ? 'bg-white text-wellora-terracotta shadow-sm'
              : 'text-wellora-mocha hover:bg-white/40'
          }`}
        >
          <Brain className="w-4 h-4" /> Diversion
        </button>
        <button
          onClick={() => setActiveCategory('comfort')}
          className={`py-2 px-3 text-xs rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCategory === 'comfort'
              ? 'bg-white text-wellora-terracotta shadow-sm'
              : 'text-wellora-mocha hover:bg-white/40'
          }`}
        >
          <Activity className="w-4 h-4" /> Comfort
        </button>
      </div>

      {/* Breathing Category Details */}
      {activeCategory === 'breathing' && (
        <div className="flex flex-col gap-6">
          
          {/* Interactive Breathing Metronome */}
          <div className="bg-gradient-to-tr from-wellora-mocha to-wellora-mocha/90 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-wellora-rose/20 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <span className="text-[10px] uppercase tracking-wider font-bold text-wellora-rose">Interactive Tool</span>
                <h4 className="font-serif text-lg font-bold text-white mt-0.5">Labor Breathing Companion</h4>
                <p className="text-[11px] text-wellora-beige/80 mt-1 max-w-sm">
                  Select a labor phase below and activate the pacer. Synchronize your breathing to the visual expansion.
                </p>

                {/* Phase Selection Chips */}
                <div className="flex flex-wrap gap-1.5 mt-4 justify-center md:justify-start">
                  {(Object.keys(breathingTechniques) as Array<keyof typeof breathingTechniques>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setPacerMode(key)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                        pacerMode === key
                          ? 'bg-wellora-terracotta border-wellora-terracotta text-white'
                          : 'bg-white/10 border-white/20 text-wellora-beige hover:bg-white/20'
                      }`}
                    >
                      {breathingTechniques[key].subtitle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breathing Circle Pacer */}
              <div className="flex flex-col items-center justify-center flex-shrink-0 w-40">
                <div 
                  className={`w-28 h-28 rounded-full border-4 border-wellora-rose/30 flex flex-col items-center justify-center transition-all duration-1000 ${
                    isPacerActive 
                      ? pacerPhase === 'Inhale' || pacerPhase === 'Hee-Hee' 
                        ? 'scale-110 bg-wellora-rose/20' 
                        : 'scale-90 bg-wellora-terracotta/20'
                      : 'bg-white/5'
                  }`}
                >
                  {isPacerActive ? (
                    <>
                      <span className="text-xs uppercase tracking-wide text-wellora-rose font-bold animate-pulse">
                        {pacerPhase}
                      </span>
                      <span className="text-2xl font-serif font-bold mt-1 text-white">
                        {pacerMode === 'transition' ? '💨' : `${secondsLeft}s`}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-wellora-beige/65">Pacer Idle</span>
                  )}
                </div>

                <button
                  onClick={() => setIsPacerActive(!isPacerActive)}
                  className={`mt-4 px-6 py-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
                    isPacerActive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-wellora-terracotta hover:bg-wellora-terracotta/95 text-white'
                  }`}
                >
                  {isPacerActive ? 'Stop Pacer' : 'Start Pacer'}
                </button>
              </div>
            </div>
          </div>

          {/* Cards for Breathing stages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(breathingTechniques) as Array<keyof typeof breathingTechniques>).map((key) => {
              const tech = breathingTechniques[key];
              return (
                <div key={key} className="bg-white rounded-3xl p-5 border border-wellora-rose/15 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold text-wellora-terracotta bg-wellora-rose/10 px-2.5 py-0.5 rounded-md">
                        {tech.title}
                      </span>
                      <Wind className="w-4 h-4 text-wellora-rose" />
                    </div>
                    <h4 className="font-serif text-base font-bold text-wellora-mocha mb-2">{tech.subtitle}</h4>
                    <p className="text-xs text-wellora-mocha/80 leading-relaxed mb-3">
                      <strong>How:</strong> {tech.how}
                    </p>
                  </div>
                  <p className="text-[11px] text-wellora-mocha/60 border-t border-wellora-rose/10 pt-3">
                    <strong>Why:</strong> {tech.why}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Diversion Category Details */}
      {activeCategory === 'diversion' && (
        <div className="flex flex-col gap-4">
          
          <div className="bg-wellora-beige/30 p-4 rounded-3xl border border-wellora-rose/15 flex items-start gap-3.5 mb-2">
            <Sparkles className="w-5 h-5 text-wellora-terracotta mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-wellora-mocha uppercase tracking-wider">Gate Control Theory</h4>
              <p className="text-xs text-wellora-mocha/70 mt-1 leading-normal">
                Diversion therapy stimulates non-pain neurological paths, effectively closing the "spinal gate" to pain signals before they fully reach the brain.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Visual Distraction */}
            <div className="bg-white rounded-3xl p-5 border border-wellora-rose/15 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0 text-sky-500">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-wellora-mocha">Visual Distraction (Focal Points)</h4>
                <p className="text-xs text-wellora-mocha/75 leading-relaxed mt-2">
                  Bring a specific item to your birth space (a sonogram photo, a calming picture, or a battery-operated candle). Stare at it intently during a contraction to visually anchor your attention.
                </p>
              </div>
            </div>

            {/* Auditory Distraction */}
            <div className="bg-white rounded-3xl p-5 border border-wellora-rose/15 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-500">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-wellora-mocha">Auditory Distraction (Soundscapes)</h4>
                <p className="text-xs text-wellora-mocha/75 leading-relaxed mt-2">
                  Create two playlists ahead of time: one with upbeat, familiar songs for early labor to keep your spirits high, and one with ambient, low-tempo music or nature sounds for active labor.
                </p>
              </div>
            </div>

            {/* Mental Games */}
            <div className="bg-white rounded-3xl p-5 border border-wellora-rose/15 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 text-purple-500">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-wellora-mocha">Mental Games</h4>
                <p className="text-xs text-wellora-mocha/75 leading-relaxed mt-2">
                  Count backward from 100 by 3s, recite a favorite poem, or list names alphabetically (e.g., countries, foods) to heavily engage your prefrontal cortex, blocking pain perception.
                </p>
              </div>
            </div>

            {/* Environment Shifts */}
            <div className="bg-white rounded-3xl p-5 border border-wellora-rose/15 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 text-amber-500">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-wellora-mocha">Environment Shifts</h4>
                <p className="text-xs text-wellora-mocha/75 leading-relaxed mt-2">
                  Change your surroundings immediately. Move from the bed to a warm shower, or dim the room lights and use fairy lights. New sensory inputs act as natural distractions.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Physical Comfort Category Details */}
      {activeCategory === 'comfort' && (
        <div className="flex flex-col gap-4">
          
          <div className="bg-red-50 p-4 rounded-3xl border border-red-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">Labor Safety Guidelines</h4>
              <p className="text-[11px] text-red-700 mt-1 leading-normal">
                Avoid sudden, jerky movements. Maintain an upright posture whenever possible but listen to your body and rest progressively to conserve energy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* The Labor Companion Sway */}
            <div className="bg-white rounded-3xl p-5 border border-wellora-rose/15 shadow-sm">
              <h4 className="font-serif text-sm font-bold text-wellora-mocha flex items-center gap-2">
                <span className="text-base">🤝</span> The Labor Companion Sway
              </h4>
              <p className="text-xs text-wellora-mocha/75 leading-relaxed mt-2">
                Wrap your arms around your partner's or support person's neck and sway your hips from side to side during contractions to utilize gravity.
              </p>
            </div>

            {/* The Comb Trick */}
            <div className="bg-white rounded-3xl p-5 border border-wellora-rose/15 shadow-sm">
              <h4 className="font-serif text-sm font-bold text-wellora-mocha flex items-center gap-2">
                <span className="text-base">🪮</span> The Comb Trick (Acupressure)
              </h4>
              <p className="text-xs text-wellora-mocha/75 leading-relaxed mt-2">
                Hold a small plastic hair comb in your palm so the teeth press against the base of your fingers. Squeezing it releases endorphins to mask labor waves.
              </p>
            </div>

            {/* Counter-Pressure */}
            <div className="bg-white rounded-3xl p-5 border border-wellora-rose/15 shadow-sm">
              <h4 className="font-serif text-sm font-bold text-wellora-mocha flex items-center gap-2">
                <span className="text-base">👐</span> Counter-Pressure
              </h4>
              <p className="text-xs text-wellora-mocha/75 leading-relaxed mt-2">
                Have your birth partner press their palms firmly against your lower back or hips (the "double hip squeeze") during a contraction to relieve intense back labor.
              </p>
            </div>

            {/* Rest Progressively */}
            <div className="bg-white rounded-3xl p-5 border border-wellora-rose/15 shadow-sm">
              <h4 className="font-serif text-sm font-bold text-wellora-mocha flex items-center gap-2">
                <span className="text-base">🛌</span> Rest Progressively
              </h4>
              <p className="text-xs text-wellora-mocha/75 leading-relaxed mt-2">
                Do not stay on your feet. Match movement to energy: alternate walking, sitting on a birth ball, kneeling over pillows, and resting on your left side.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
