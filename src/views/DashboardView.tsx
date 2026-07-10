import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { useBaby } from '../context/BabyContext';
import { EXERCISES } from '../data/mockData';
import type { Exercise } from '../data/mockData';
import { Flame, CheckSquare, Square, Calendar, ShieldAlert, Award, ArrowRight, ChevronDown, ChevronUp, Activity, Lightbulb, UserRoundCheck, User2, Wind, Sparkles, Clock, Droplet, CheckCircle } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: 'home' | 'exercises' | 'baby' | 'profile' | 'antenatal') => void;
  onSelectExercise: (exercise: Exercise) => void;
  onOpenBreathingTool: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigate, 
  onSelectExercise, 
  onOpenBreathingTool 
}) => {
  const { profile, completeExercise } = useUserProfile();
  const { babies } = useBaby();
  const [showAntenatal, setShowAntenatal] = useState(false);

  // AI Daily Planner states
  const [aiPlan, setAiPlan] = useState<any>(() => {
    const saved = localStorage.getItem('wellora_ai_daily_plan');
    return saved ? JSON.parse(saved) : null;
  });
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [showPlannerForm, setShowPlannerForm] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [painLevel, setPainLevel] = useState(0);
  const [preferences, setPreferences] = useState('');

  const generateAiPlan = async () => {
    setGeneratingPlan(true);
    try {
      const response = await fetch('/api/ai/daily-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: profile,
          energyLevel,
          painLevel,
          preferences
        }),
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        throw new Error(errObj.message || "Upgrade to Wellora Mama Pro to generate AI plans.");
      }

      const plan = await response.json();
      setAiPlan(plan);
      localStorage.setItem('wellora_ai_daily_plan', JSON.stringify(plan));
      setShowPlannerForm(false);
    } catch (err: any) {
      alert(err.message || "Failed to generate wellness plan.");
    } finally {
      setGeneratingPlan(false);
    }
  };

  const resetAiPlan = () => {
    setAiPlan(null);
    localStorage.removeItem('wellora_ai_daily_plan');
    setShowPlannerForm(false);
  };

  // Filter exercises strictly appropriate for user stage/trimester
  const getTodayExercises = (): Exercise[] => {
    if (profile.stage === 'pregnant') {
      const trimesterStr = profile.trimester || 'First';
      // Strictly filter: only exercises tagged for this exact trimester
      return EXERCISES.filter(ex =>
        ex.isPregnancySafe && ex.targetTrimesters.includes(trimesterStr as 'First' | 'Second' | 'Third')
      ); // Show all matching exercises, no slice limit
    } else if (profile.stage === 'labour') {
      // Labor: only breathing and labor prep exercises
      return EXERCISES.filter(ex =>
        ex.category === 'Breathing' || ex.category === 'Labor Preparation'
      );
    } else if (profile.stage === 'postpartum') {
      const weeks = profile.weeksPostpartum || 6;
      let weekTag: '0-6' | '6-12' | '3+' = '6-12';
      if (weeks <= 6) weekTag = '0-6';
      else if (weeks <= 12) weekTag = '6-12';
      else weekTag = '3+';
      // Strictly filter: only exercises tagged for this postpartum window
      return EXERCISES.filter(ex =>
        ex.isPostpartumSafe && ex.targetPostpartumWeeks.includes(weekTag)
      ); // Show all matching exercises
    } else {
      // Caregiver: general mobility and breathing exercises
      return EXERCISES.filter(ex =>
        ex.category === 'Breathing' || ex.category === 'Mobility'
      );
    }
  };

  // Label shown above the exercise list
  const getExerciseListLabel = () => {
    if (profile.stage === 'pregnant') {
      return `Recommended for ${profile.trimester || 'First'} Trimester`;
    } else if (profile.stage === 'labour') {
      return 'Recommended for Labor Coping';
    } else if (profile.stage === 'postpartum') {
      const weeks = profile.weeksPostpartum || 6;
      if (weeks <= 6) return 'Recommended for 0–6 Weeks Postpartum';
      if (weeks <= 12) return 'Recommended for 6–12 Weeks Postpartum';
      return 'Recommended for 3+ Months Postpartum';
    }
    return 'General Wellness Exercises';
  };

  const todayExercises = getTodayExercises();

  // Get stage label
  const getStageHeaderLabel = () => {
    if (profile.stage === 'pregnant') {
      return `${profile.trimester} Trimester`;
    } else if (profile.stage === 'labour') {
      return 'Active Labor';
    } else if (profile.stage === 'postpartum') {
      const weeks = profile.weeksPostpartum || 4;
      return `${weeks} Weeks Postpartum`;
    } else {
      return 'Caregiver / Parent Stage';
    }
  };

  // Get active tip
  const getWellnessTip = () => {
    if (profile.stage === 'pregnant') {
      return {
        title: 'Hydration & Muscle Fatigue',
        text: 'Drink at least 8-10 glasses of water daily. Dehydration can trigger Braxton Hicks contractions and increase muscle cramping.'
      };
    } else if (profile.stage === 'labour') {
      return {
        title: 'Save Energy & Breathe',
        text: 'Keep your face and jaw relaxed. Tension in your mouth and jaw leads to tension in your pelvic floor. Breathe slowly.'
      };
    } else if (profile.stage === 'postpartum') {
      return {
        title: 'Immediate Pelvic Resting',
        text: 'Focus on breathing and gentle Kegels. Avoid abdominal pressure or high-impact lifting for the first 6 weeks to allow the pelvic floor muscles to recover.'
      };
    } else {
      return {
        title: 'Sleep Syncing',
        text: 'Try to sleep when the baby sleeps, even if it is a 20-minute nap. Fatigue builds up quickly and impacts your immunity.'
      };
    }
  };

  const activeTip = getWellnessTip();

  // Calculate pregnancy progress percentage
  const getProgressPercentage = () => {
    if (profile.stage !== 'pregnant') return 100;
    if (!profile.dueOrBirthDate) return 50; // default middle
    
    const due = new Date(profile.dueOrBirthDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Conceived ~280 days ago
    const elapsedDays = Math.max(0, Math.min(280, 280 - diffDays));
    return Math.round((elapsedDays / 280) * 100);
  };

  const progressPercent = getProgressPercentage();

  // Count upcoming vaccines
  const getVaccineAlerts = () => {
    if (babies.length === 0) return null;
    
    let overdueCount = 0;
    let upcomingCount = 0;
    let targetBabyName = '';

    babies.forEach(baby => {
      baby.vaccineRecords.forEach(rec => {
        if (rec.status === 'Overdue') {
          overdueCount++;
          targetBabyName = baby.name;
        } else if (rec.status === 'Upcoming') {
          upcomingCount++;
        }
      });
    });

    return { overdueCount, upcomingCount, targetBabyName };
  };

  const vaccineAlerts = getVaccineAlerts();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Greetings Header */}
      <div className="bg-gradient-to-tr from-wellora-rose/10 to-wellora-terracotta/20 p-6 rounded-3xl border border-wellora-rose/15 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-wellora-terracotta">
              Your Daily Compass
            </span>
            <h1 className="font-serif text-3xl font-bold text-wellora-mocha mt-1">
              Good Morning, {profile.name || 'Sarah'}
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2.5 py-0.5 bg-white/80 border border-wellora-rose/30 text-wellora-mocha rounded-full text-[10px] font-bold">
                {getStageHeaderLabel()}
              </span>
              {profile.stage === 'pregnant' && profile.dueOrBirthDate && (
                <span className="px-2.5 py-0.5 bg-wellora-terracotta text-white rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Due {new Date(profile.dueOrBirthDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-white/90 border border-wellora-rose/25 rounded-2xl px-3 py-1.5 shadow-sm">
            <Flame className="w-5 h-5 text-wellora-terracotta fill-current" />
            <div className="text-left">
              <span className="block text-xs font-bold text-wellora-mocha leading-none">{profile.streak} Days</span>
              <span className="text-[9px] text-wellora-mocha/60">Active Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Antenatal Date Reminders */}
      {(() => {
        if (!profile.antenatalData?.appointmentDate) return null;
        
        const apptDate = new Date(profile.antenatalData.appointmentDate);
        const today = new Date();
        const d1 = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());
        const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const diffTime = d1.getTime() - d2.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          return (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-6 py-4 rounded-3xl flex items-start gap-3 shadow-sm animate-scale-up">
              <Calendar className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0 animate-pulse" />
              <div className="flex-1">
                <h4 className="font-bold text-xs">Antenatal Appointment Tomorrow!</h4>
                <p className="text-[11px] text-amber-800 leading-normal mt-0.5">
                  Your appointment is scheduled for tomorrow, {profile.antenatalData.appointmentDate}. Write down your questions, packet your medical logs, and get ready!
                </p>
                <button onClick={() => onNavigate('antenatal')} className="text-[10px] font-bold text-wellora-terracotta underline mt-1 block">
                  Open Health Tracker &rarr;
                </button>
              </div>
            </div>
          );
        }

        if (diffDays === 0) {
          return (
            <div className="bg-purple-50 border border-purple-200 text-purple-950 px-6 py-4 rounded-3xl flex items-start gap-3 shadow-sm animate-scale-up">
              <Calendar className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0 animate-bounce" />
              <div className="flex-1">
                <h4 className="font-bold text-xs">Antenatal Appointment Today!</h4>
                <p className="text-[11px] text-purple-800 leading-normal mt-0.5">
                  Today is your scheduled appointment date ({profile.antenatalData.appointmentDate}). Make sure to log your blood pressure and vitamin intake before your visit.
                </p>
                <button onClick={() => onNavigate('antenatal')} className="text-[10px] font-bold text-purple-700 underline mt-1 block">
                  Log Vitals & Vitals Form &rarr;
                </button>
              </div>
            </div>
          );
        }

        if (diffDays < 0) {
          return (
            <div className="bg-red-50 border border-red-200 text-red-950 px-6 py-4 rounded-3xl flex items-start gap-3 shadow-sm animate-scale-up">
              <Calendar className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-xs">Update Scheduled Appointment</h4>
                <p className="text-[11px] text-red-800 leading-normal mt-0.5">
                  Your previous scheduled check-up date ({profile.antenatalData.appointmentDate}) has passed. Please schedule your next visit and update the reminder timer.
                </p>
                <button onClick={() => onNavigate('antenatal')} className="text-[10px] font-bold text-red-600 underline mt-1 block">
                  Set Next Appointment Date &rarr;
                </button>
              </div>
            </div>
          );
        }

        return null;
      })()}

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Columns: Exercises & TIP */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Antenatal Check Card – only for pregnant mothers */}
          {profile.stage === 'pregnant' && (
            <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm mb-6">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowAntenatal(!showAntenatal)}>
                <h3 className="font-serif text-lg font-bold text-wellora-mocha flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-wellora-terracotta" />
                  <button type="button" onClick={() => onNavigate('antenatal')} className="text-wellora-mocha underline focus:outline-none">Antenatal Checklist</button>
                </h3>
                {showAntenatal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              {showAntenatal && (
                <ul className="list-disc list-inside text-wellora-mocha space-y-2 mt-2">
                  <li>Daily prenatal vitamin intake</li>
                  <li>Blood pressure & weight monitoring</li>
                  <li>Scheduled ultrasound appointments</li>
                  <li>Gestational diabetes screening (if applicable)</li>
                  <li>Hydration & nutrition reminders</li>
                  <li>Review of trimester‑specific health tips</li>
                </ul>
              )}
            </div>
          )}

          {/* Labour Coping Card – only for labour stage */}
          {profile.stage === 'labour' && (
            <div className="bg-gradient-to-tr from-wellora-mocha to-wellora-mocha/90 text-white rounded-3xl p-6 shadow-md mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-wellora-rose/25 rounded-full blur-xl" />
              <div className="relative z-10">
                <span className="text-[10px] bg-wellora-rose text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Active Phase
                </span>
                <h3 className="font-serif text-xl font-bold mt-2">Labour Coping Guide</h3>
                <p className="text-xs text-wellora-beige/85 mt-1.5 leading-relaxed">
                  Access real-time breathing pacers, acupressure guides (the comb trick), and partner counter-pressure instructions.
                </p>
                <button
                  onClick={() => onNavigate('antenatal')}
                  className="mt-4 px-5 py-2 bg-wellora-terracotta hover:bg-wellora-terracotta/90 text-white text-xs font-bold rounded-full shadow transition-all flex items-center gap-1.5"
                >
                  Open Labour Navigation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
          
          {/* Today's Wellness Plan */}
          <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-lg font-bold text-wellora-mocha flex items-center gap-2">
                  <Activity className="w-5 h-5 text-wellora-terracotta" />
                  Today's Wellness Plan
                </h3>
              <button 
                onClick={() => onNavigate('exercises')}
                className="text-xs text-wellora-terracotta hover:underline font-semibold flex items-center gap-0.5"
              >
                Full Library <ArrowRight className="w-3 h-3" />
              </button>
                      {/* Tabs for Standard vs AI Plan */}
            <div className="flex gap-4 mb-4 border-b border-wellora-rose/10 pb-2">
              <button
                type="button"
                onClick={() => {
                  setShowPlannerForm(false);
                }}
                className={`text-xs font-semibold pb-1 border-b-2 transition-all cursor-pointer ${
                  !showPlannerForm && !aiPlan
                    ? 'border-wellora-terracotta text-wellora-mocha font-bold'
                    : 'border-transparent text-wellora-mocha/60 hover:text-wellora-mocha'
                }`}
              >
                Recommended Routine
              </button>
              <button
                type="button"
                onClick={() => {
                  if (profile.isPro) {
                    if (!aiPlan) {
                      setShowPlannerForm(true);
                    }
                  } else {
                    setShowPlannerForm(true);
                  }
                }}
                className={`text-xs font-semibold pb-1 border-b-2 transition-all flex items-center gap-1 cursor-pointer ${
                  showPlannerForm || aiPlan
                    ? 'border-purple-600 text-purple-700 font-bold'
                    : 'border-transparent text-purple-600/70 hover:text-purple-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Custom Plan
              </button>
            </div>

            {/* Content Switcher */}
            {!showPlannerForm && !aiPlan ? (
              // -------------------------------------------------------------
              // STANDARD PLAN VIEW
              // -------------------------------------------------------------
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-wellora-terracotta/10 text-wellora-terracotta rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {getExerciseListLabel()}
                  </span>
                </div>
                <p className="text-xs text-wellora-mocha/60 mb-4">
                  Tap any exercise to open full instructions and track your progress.
                </p>

                <div className="flex flex-col gap-3">
                  {todayExercises.map((ex) => {
                    const isCompleted = profile.completedExercises.includes(ex.id);
                    return (
                      <div 
                        key={ex.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                          isCompleted 
                            ? 'bg-wellora-beige/10 border-wellora-rose/30 opacity-75' 
                            : 'border-wellora-rose/10 hover:border-wellora-rose/30 hover:bg-wellora-beige/5'
                        }`}
                      >
                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => onSelectExercise(ex)}>
                          <div className="w-10 h-10 rounded-xl bg-wellora-rose/15 flex items-center justify-center text-lg">
                            {ex.category === 'Pelvic Floor' ? <UserRoundCheck className="w-5 h-5" /> : ex.category === 'Breathing' ? <Wind className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-wellora-mocha">{ex.title}</h4>
                            <div className="flex gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 bg-wellora-beige rounded text-[9px] text-wellora-mocha/70">
                                {ex.duration}
                              </span>
                              <span className="px-1.5 py-0.5 bg-wellora-rose/10 rounded text-[9px] text-wellora-terracotta font-semibold">
                                {ex.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => completeExercise(ex.id, 120)}
                          className="p-1 hover:bg-wellora-rose/10 rounded-full transition-all text-wellora-mocha/80"
                          title={isCompleted ? "Completed" : "Mark as Completed"}
                        >
                          {isCompleted ? (
                            <CheckSquare className="w-5 h-5 text-wellora-terracotta" />
                          ) : (
                            <Square className="w-5 h-5 text-wellora-rose" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Quick breathing tool trigger */}
                {profile.stage !== 'caregiver' && (
                  <button 
                    onClick={onOpenBreathingTool}
                    className="w-full mt-4 py-2.5 bg-wellora-rose/10 hover:bg-wellora-rose/20 text-wellora-terracotta text-xs font-semibold rounded-2xl border border-dashed border-wellora-rose/40 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Wind className="w-4 h-4" /> Start Labor Paced Breathing Guide
                  </button>
                )}
              </>
            ) : !profile.isPro ? (
              // -------------------------------------------------------------
              // FREE LOCK TEASER VIEW
              // -------------------------------------------------------------
              <div className="p-6 bg-purple-50/50 border border-purple-100 rounded-3xl text-center space-y-4 animate-scale-up">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-wellora-mocha">AI Personalized Planning</h4>
                  <p className="text-[11px] text-wellora-mocha/60 mt-1 max-w-xs mx-auto leading-normal">
                    Generate plans customized to your pregnancy week, trimester, energy status, and pain levels. Includes safe exercises, hydration targets, and stretches.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('ai')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-wellora-terracotta text-white rounded-full text-[10px] font-bold shadow-sm transition-all cursor-pointer"
                >
                  Upgrade to Wellora Pro
                </button>
              </div>
            ) : showPlannerForm || !aiPlan ? (
              // -------------------------------------------------------------
              // PRO PLANNER FORM
              // -------------------------------------------------------------
              <div className="space-y-4 p-4 bg-purple-50/20 border border-purple-100/60 rounded-3xl animate-scale-up text-left">
                <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> AI Wellness Generator Parameters
                </h4>

                <div className="space-y-3">
                  {/* Energy slider */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-wellora-mocha font-bold">
                      <span>Energy Level</span>
                      <span className="text-purple-700 font-bold">{energyLevel}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                      className="w-full mt-1 accent-purple-600"
                    />
                  </div>

                  {/* Pain slider */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-wellora-mocha font-bold">
                      <span>Pain / Muscle Tension Level</span>
                      <span className="text-purple-700 font-bold">{painLevel}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={painLevel}
                      onChange={(e) => setPainLevel(parseInt(e.target.value))}
                      className="w-full mt-1 accent-purple-600"
                    />
                  </div>

                  {/* Focus notes */}
                  <div>
                    <label className="block text-[10px] font-bold text-wellora-mocha mb-1">Focus Areas / Specific Pain (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Lower back pain, swollen ankles, fatigue"
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-wellora-rose/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600 text-wellora-mocha"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={generateAiPlan}
                    disabled={generatingPlan}
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {generatingPlan ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Generate Custom Plan
                      </>
                    )}
                  </button>
                  {aiPlan && (
                    <button
                      type="button"
                      onClick={() => setShowPlannerForm(false)}
                      className="px-4 py-2 border border-purple-200 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // -------------------------------------------------------------
              // PRO COMPLETED PLAN RENDER
              // -------------------------------------------------------------
              <div className="space-y-4 p-5 bg-gradient-to-tr from-purple-50/40 to-rose-50/30 border border-purple-100 rounded-3xl animate-scale-up text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" /> Today's AI Personalized Plan
                    </h4>
                    <span className="text-[9px] text-wellora-mocha/50 block">Customized for energy {energyLevel}/10 and pain {painLevel}/10</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPlannerForm(true)}
                    className="text-[10px] text-purple-600 hover:underline font-bold cursor-pointer"
                  >
                    Adjust
                  </button>
                </div>

                <div className="space-y-3 text-xs text-wellora-mocha/90">
                  {/* Exercise */}
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      🏃
                    </div>
                    <div>
                      <span className="block font-bold text-purple-900 text-[10px] uppercase">Recommended Workout</span>
                      <p className="text-[11px] text-wellora-mocha/80 leading-normal mt-0.5">{aiPlan.exercise}</p>
                    </div>
                  </div>

                  {/* Stretch */}
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      🧘
                    </div>
                    <div>
                      <span className="block font-bold text-pink-900 text-[10px] uppercase">Comfort Stretch</span>
                      <p className="text-[11px] text-wellora-mocha/80 leading-normal mt-0.5">{aiPlan.stretch}</p>
                    </div>
                  </div>

                  {/* Hydration */}
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      💧
                    </div>
                    <div>
                      <span className="block font-bold text-blue-900 text-[10px] uppercase">Hydration Target</span>
                      <p className="text-[11px] text-wellora-mocha/80 leading-normal mt-0.5">{aiPlan.hydration}</p>
                    </div>
                  </div>

                  {/* Breathing */}
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      🌬️
                    </div>
                    <div>
                      <span className="block font-bold text-teal-900 text-[10px] uppercase">Paced Breathing</span>
                      <p className="text-[11px] text-wellora-mocha/80 leading-normal mt-0.5">{aiPlan.breathing}</p>
                    </div>
                  </div>

                  {/* Safety Reminder */}
                  <div className="flex gap-2.5 items-start bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
                    <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-bold text-amber-900 text-[9px] uppercase">Safety Advisory</span>
                      <p className="text-[10px] text-amber-800 leading-normal mt-0.5">{aiPlan.reminder}</p>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div className="flex gap-2.5 items-start bg-purple-50/30 p-2.5 rounded-xl border border-purple-100/30 italic text-purple-900">
                    <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[8px] flex-shrink-0 mt-0.5">💖</div>
                    <p className="text-[10px] leading-normal">{aiPlan.motivationalMessage}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetAiPlan}
                  className="w-full mt-2 py-2 border border-purple-200 text-purple-700 text-xs font-semibold rounded-2xl hover:bg-purple-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Reset to Standard Routine
                </button>
              </div>
            )}
          </div>

          {/* Daily Wellness Tip */}
          <div className="bg-wellora-beige/35 rounded-3xl p-6 border border-wellora-rose/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-wellora-terracotta/10 border border-wellora-terracotta/20 flex items-center justify-center text-xl flex-shrink-0 text-wellora-terracotta">
                <Lightbulb className="w-5 h-5" />
              </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-wellora-mocha">{activeTip.title}</h4>
              <p className="text-xs text-wellora-mocha/80 mt-1 leading-relaxed">
                {activeTip.text}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Pregnancy Tracker Progress Widget */}
          {profile.stage === 'pregnant' && (
            <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm">
                <span className="text-xs font-bold text-wellora-mocha">
                  <UserRoundCheck className="w-4 h-4 inline-block mr-1" /> Pregnancy Countdown
                </span>
              
              <div className="w-full bg-wellora-beige rounded-full h-3 mb-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-wellora-rose to-wellora-terracotta h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-wellora-mocha/60">
                <span>Conception</span>
                <span className="font-bold text-wellora-mocha">{progressPercent}% complete</span>
                <span>Due Date</span>
              </div>

              {profile.dueOrBirthDate && (
                <div className="mt-4 p-3 bg-wellora-beige/30 border border-wellora-rose/10 rounded-2xl text-center">
                  <p className="text-xs text-wellora-mocha/80 font-medium">
                    We are currently in <span className="font-bold text-wellora-terracotta">{profile.trimester} Trimester</span>
                  </p>
                  <p className="text-[10px] text-wellora-mocha/50 mt-0.5">
                    Approximately {Math.ceil((100 - progressPercent) * 2.8)} days remaining
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Baby Vaccine Alert Widget */}
          <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm">
                <h3 className="font-serif text-base font-bold text-wellora-mocha mb-3 flex items-center gap-1.5">
                  <User2 className="w-4 h-4 inline-block mr-1" /> Baby Care & Schedules
                </h3>

            {babies.length === 0 ? (
              <div className="text-center py-4 flex flex-col items-center">
                <p className="text-xs text-wellora-mocha/60 mb-4 leading-normal">
                  Registered babies get custom, birthday-aligned vaccine calendar schedules automatically.
                </p>
                <button 
                  onClick={() => onNavigate('baby')}
                  className="w-full py-2 bg-wellora-terracotta text-white hover:bg-wellora-terracotta/95 text-xs font-semibold rounded-2xl shadow-sm transition-all"
                >
                  Create Baby Profile
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {babies.map(baby => {
                  const completed = baby.vaccineRecords.filter(r => r.status === 'Completed').length;
                  const total = baby.vaccineRecords.length;
                  const completionRate = Math.round((completed / total) * 100);
                  
                  return (
                    <div key={baby.id} className="p-3 bg-wellora-beige/20 rounded-2xl border border-wellora-rose/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-wellora-mocha">{baby.name}</span>
                        <span className="text-[10px] text-wellora-mocha/50">{completionRate}% Vaccines</span>
                      </div>
                      
                      <div className="w-full bg-wellora-beige rounded-full h-1.5 mb-2.5 overflow-hidden">
                        <div 
                          className="bg-wellora-rose h-full rounded-full"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {vaccineAlerts && vaccineAlerts.overdueCount > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-red-800 leading-tight">Vaccine Overdue Warning</p>
                      <p className="text-[9px] text-red-700 leading-tight mt-0.5">
                        {vaccineAlerts.targetBabyName} has {vaccineAlerts.overdueCount} dose{vaccineAlerts.overdueCount > 1 ? 's' : ''} past schedule.
                      </p>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => onNavigate('baby')}
                  className="w-full mt-1.5 py-2 border border-wellora-mocha/20 hover:bg-wellora-rose/10 text-wellora-mocha text-xs font-semibold rounded-2xl transition-all"
                >
                  Go to Vaccine Tracker
                </button>
              </div>
            )}
          </div>

          {/* Points & Rewards Widget */}
          <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm text-center flex flex-col items-center">
            <Award className="w-8 h-8 text-wellora-terracotta mb-2" />
            <span className="text-[10px] uppercase font-bold text-wellora-mocha/60 tracking-wider">
              Wellness Points
            </span>
            <span className="text-3xl font-serif font-bold text-wellora-mocha mt-1">
              +{profile.points}
            </span>
            <p className="text-[10px] text-wellora-mocha/50 mt-1 max-w-[180px]">
              Earn 10 points for each exercise you complete. Maintain your streak to log achievements!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
