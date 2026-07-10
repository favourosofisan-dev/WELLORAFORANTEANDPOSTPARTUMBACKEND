import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind, ShieldAlert } from 'lucide-react';

interface BreathingToolProps {
  onComplete?: () => void;
}

export const BreathingTool: React.FC<BreathingToolProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(120); // Default 2 min
  const [duration, setDuration] = useState(120);
  const [cycleCount, setCycleCount] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);

  // Breathing cycle times: Inhale 4s, Hold 4s, Exhale 6s, Rest 2s
  useEffect(() => {
    let interval: any = null;
    let cycleTimer: any = null;

    if (isActive && secondsLeft > 0) {
      // General countdown
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Phase cycling
      let currentPhase: typeof phase = 'Inhale';
      let ticks = 0;

      cycleTimer = setInterval(() => {
        ticks += 1;
        
        if (currentPhase === 'Inhale') {
          setPulseScale(1.4); // Expand
          if (ticks >= 4) {
            currentPhase = 'Hold';
            setPhase('Hold');
            ticks = 0;
          }
        } else if (currentPhase === 'Hold') {
          setPulseScale(1.4); // Keep expanded
          if (ticks >= 2) {
            currentPhase = 'Exhale';
            setPhase('Exhale');
            ticks = 0;
          }
        } else if (currentPhase === 'Exhale') {
          setPulseScale(1.0); // Contract
          if (ticks >= 6) {
            currentPhase = 'Rest';
            setPhase('Rest');
            ticks = 0;
            setCycleCount((c) => c + 1);
          }
        } else if (currentPhase === 'Rest') {
          setPulseScale(1.0); // Keep small
          if (ticks >= 2) {
            currentPhase = 'Inhale';
            setPhase('Inhale');
            ticks = 0;
          }
        }
      }, 1000);

    } else {
      setIsActive(false);
      setPulseScale(1.0);
      setPhase('Inhale');
    }

    return () => {
      if (interval) clearInterval(interval);
      if (cycleTimer) clearInterval(cycleTimer);
    };
  }, [isActive, secondsLeft, onComplete]);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(duration);
    setCycleCount(0);
    setPhase('Inhale');
    setPulseScale(1.0);
  };

  const changeDuration = (mins: number) => {
    setIsActive(false);
    setDuration(mins * 60);
    setSecondsLeft(mins * 60);
    setCycleCount(0);
    setPhase('Inhale');
    setPulseScale(1.0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale':
        return { text: 'Inhale through your nose...', color: 'text-wellora-terracotta', desc: 'Expand your belly' };
      case 'Hold':
        return { text: 'Hold gently...', color: 'text-wellora-mocha', desc: 'Relax your shoulders' };
      case 'Exhale':
        return { text: 'Exhale through your mouth...', color: 'text-wellora-rose', desc: 'Sigh out the tension' };
      case 'Rest':
        return { text: 'Rest and prepare...', color: 'text-wellora-mocha', desc: 'Breathe naturally' };
    }
  };

  const instruction = getPhaseInstruction();

  return (
    <div className="flex flex-col items-center bg-wellora-beige/40 rounded-2xl p-6 border border-wellora-rose/20 shadow-inner">
      <div className="flex items-center gap-2 mb-4 text-wellora-mocha">
        <Wind className="w-5 h-5 text-wellora-terracotta" />
        <h3 className="font-serif text-lg font-bold">Labor Breathing Companion</h3>
      </div>

      {/* Breathing Bubble */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-6">
        {/* Outer Ripple */}
        <div 
          className="absolute inset-0 rounded-full bg-wellora-rose/10 transition-all duration-[4000ms] ease-in-out"
          style={{ transform: `scale(${pulseScale * 1.1})` }}
        />
        {/* Middle Bubble */}
        <div 
          className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-wellora-rose/20 to-wellora-terracotta/20 transition-all duration-[4000ms] ease-in-out"
          style={{ transform: `scale(${pulseScale})` }}
        />
        {/* Core Bubble */}
        <div 
          className="absolute w-36 h-36 rounded-full bg-white shadow-lg flex flex-col items-center justify-center p-4 text-center transition-all duration-[4000ms] ease-in-out"
          style={{ transform: `scale(${pulseScale * 0.95})` }}
        >
          <span className={`text-xl font-bold transition-colors duration-500 ${instruction.color}`}>
            {phase}
          </span>
          <span className="text-xs text-wellora-mocha/60 mt-1">
            {instruction.desc}
          </span>
        </div>
      </div>

      {/* Guide details */}
      <div className="text-center mb-6 h-12">
        <p className="text-sm font-medium text-wellora-mocha">{instruction.text}</p>
        {cycleCount > 0 && (
          <p className="text-xs text-wellora-mocha/70 mt-1">Completed Cycles: <span className="font-bold text-wellora-terracotta">{cycleCount}</span></p>
        )}
      </div>

      {/* Timer Display */}
      <div className="text-3xl font-mono text-wellora-mocha font-bold mb-4">
        {formatTime(secondsLeft)}
      </div>

      {/* Duration Selectors */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => changeDuration(2)}
          disabled={isActive}
          className={`px-3 py-1 text-xs rounded-full border transition-all ${
            duration === 120 
              ? 'bg-wellora-mocha text-white border-wellora-mocha' 
              : 'border-wellora-mocha/30 text-wellora-mocha hover:bg-wellora-rose/20'
          } disabled:opacity-50`}
        >
          2 Min Session
        </button>
        <button 
          onClick={() => changeDuration(5)}
          disabled={isActive}
          className={`px-3 py-1 text-xs rounded-full border transition-all ${
            duration === 300 
              ? 'bg-wellora-mocha text-white border-wellora-mocha' 
              : 'border-wellora-mocha/30 text-wellora-mocha hover:bg-wellora-rose/20'
          } disabled:opacity-50`}
        >
          5 Min Session
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={toggleActive}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium shadow-md transition-all ${
            isActive 
              ? 'bg-wellora-rose text-white hover:bg-wellora-rose/90' 
              : 'bg-wellora-terracotta text-white hover:bg-wellora-terracotta/90'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Begin Session
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-white text-wellora-mocha border border-wellora-mocha/20 rounded-full font-medium hover:bg-wellora-rose/10 transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Safety Reminder */}
      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-6 max-w-sm">
        <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-amber-800 leading-tight">
          <strong>Safety Note:</strong> Keep your breaths gentle and comfortable. Do not hold your breath to the point of discomfort. Stop if you feel any lightheadedness or dizziness.
        </p>
      </div>
    </div>
  );
};
