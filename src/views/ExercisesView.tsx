import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { EXERCISES } from '../data/mockData';
import type { Exercise } from '../data/mockData';
import { Search, Star, CheckCircle2, ShieldAlert, X, Play, Clock, Trophy, Bookmark, BookmarkCheck } from 'lucide-react';

interface ExercisesViewProps {
  selectedExercise: Exercise | null;
  onSelectExercise: (exercise: Exercise | null) => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({ 
  selectedExercise, 
  onSelectExercise 
}) => {
  const { profile, completeExercise, toggleSaveExercise } = useUserProfile();
  
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCompletionToast, setShowCompletionToast] = useState<string | null>(null);
  const [forYouOnly, setForYouOnly] = useState<boolean>(true); // Default to For You
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'Pelvic Floor',
    'Core Stability',
    'Lower Body',
    'Upper Body',
    'Mobility',
    'Breathing',
    'Labor Preparation',
    'Recovery'
  ];

  // Returns exercises that match user's current stage
  const getStageMatchedExercises = (): Exercise[] => {
    if (profile.stage === 'pregnant') {
      const trim = profile.trimester || 'First';
      return EXERCISES.filter(ex =>
        ex.isPregnancySafe && ex.targetTrimesters.includes(trim as 'First' | 'Second' | 'Third')
      );
    } else if (profile.stage === 'postpartum') {
      const weeks = profile.weeksPostpartum || 6;
      let weekTag: '0-6' | '6-12' | '3+' = '6-12';
      if (weeks <= 6) weekTag = '0-6';
      else if (weeks <= 12) weekTag = '6-12';
      else weekTag = '3+';
      return EXERCISES.filter(ex =>
        ex.isPostpartumSafe && ex.targetPostpartumWeeks.includes(weekTag)
      );
    }
    return EXERCISES; // caregivers see all
  };

  const stageMatchedExercises = getStageMatchedExercises();

  const getForYouLabel = () => {
    if (profile.stage === 'pregnant') return `${profile.trimester || 'First'} Trimester`;
    if (profile.stage === 'postpartum') {
      const weeks = profile.weeksPostpartum || 6;
      if (weeks <= 6) return '0–6 Weeks Postpartum';
      if (weeks <= 12) return '6–12 Weeks Postpartum';
      return '3+ Months Postpartum';
    }
    return 'General';
  };

  // Base pool: either stage-matched or all exercises
  const baseExercises = forYouOnly ? stageMatchedExercises : EXERCISES;

  // Apply category + search filters on top
  const filteredExercises = baseExercises.filter((ex) => {
    const matchesCategory = activeCategory === 'All' || ex.category === activeCategory;
    const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.benefits.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleMarkCompleted = (ex: Exercise) => {
    completeExercise(ex.id, 120);
    setShowCompletionToast(ex.title);
    setTimeout(() => {
      setShowCompletionToast(null);
    }, 4000);
  };

  // Stage gate: if user has no stage configured, show prompt
  if (!profile.stage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white rounded-3xl border border-wellora-rose/15 shadow-sm animate-fade-in">
        <div className="w-16 h-16 bg-wellora-rose/15 rounded-2xl flex items-center justify-center mb-5">
          <span className="text-3xl">🏋️‍♀️</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-wellora-mocha mb-2">Set Your Stage First</h2>
        <p className="text-sm text-wellora-mocha/60 max-w-xs leading-relaxed mb-6">
          To generate exercises safe for you, Wellora needs to know your pregnancy or postpartum stage. Please complete your profile setup.
        </p>
        <div className="text-[11px] text-wellora-mocha/40 mt-2">
          Go to <span className="font-bold text-wellora-terracotta">My Profile</span> → Edit Stage to continue.
        </div>
      </div>
    );
  }

  // Stage gate: pregnant user must have trimester set
  if (profile.stage === 'pregnant' && !profile.trimester) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white rounded-3xl border border-wellora-rose/15 shadow-sm animate-fade-in">
        <div className="w-16 h-16 bg-wellora-rose/15 rounded-2xl flex items-center justify-center mb-5">
          <span className="text-3xl">🤰</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-wellora-mocha mb-2">Which Trimester Are You In?</h2>
        <p className="text-sm text-wellora-mocha/60 max-w-xs leading-relaxed mb-6">
          Wellora needs your current trimester to recommend safe pregnancy exercises. Please update your profile with your trimester before accessing exercises.
        </p>
        <div className="text-[11px] text-wellora-mocha/40 mt-2">
          Go to <span className="font-bold text-wellora-terracotta">My Profile</span> → Edit Stage to continue.
        </div>
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in pb-12">
      
      {/* Toast Alert on completion */}
      {showCompletionToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
          <div className="bg-wellora-mocha text-white p-4 rounded-2xl shadow-xl border border-wellora-rose/30 flex items-center gap-3 animate-bounce">
            <div className="w-10 h-10 rounded-full bg-wellora-terracotta flex items-center justify-center text-xl flex-shrink-0 text-white">
              🎉
            </div>
            <div>
              <p className="text-xs font-bold">Great job!</p>
              <p className="text-[11px] text-wellora-beige/80">
                You completed <span className="font-bold text-wellora-rose">{showCompletionToast}</span>
              </p>
              <p className="text-[10px] text-wellora-terracotta font-bold mt-0.5">
                +10 Wellness Points • Streak Updated 🔥
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Catalog View */}
      {!selectedExercise ? (
        <div>
          {/* Catalog Title */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest font-bold text-wellora-terracotta">
              Exercise Library
            </span>
            <h2 className="font-serif text-2xl font-bold text-wellora-mocha mt-1">
              Gentle Movements & Breathing
            </h2>
            <p className="text-xs text-wellora-mocha/60 mt-1 leading-normal">
              Filter by category or search target routines below. Consult your clinician before starting.
            </p>
          </div>

          {/* For You Smart Filter Banner */}
          <div className={`flex items-center justify-between p-3.5 rounded-2xl border mb-4 transition-all ${
            forYouOnly
              ? 'bg-wellora-terracotta/8 border-wellora-terracotta/25'
              : 'bg-wellora-beige/30 border-wellora-rose/15'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <div>
                <p className="text-xs font-bold text-wellora-mocha">
                  {forYouOnly ? `${stageMatchedExercises.length} exercises for ${getForYouLabel()}` : `Showing all ${EXERCISES.length} exercises`}
                </p>
                <p className="text-[10px] text-wellora-mocha/50">
                  {forYouOnly ? 'Tailored to your current stage' : 'Include exercises for all stages'}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setForYouOnly(!forYouOnly); setActiveCategory('All'); }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                forYouOnly
                  ? 'bg-wellora-terracotta text-white border-wellora-terracotta shadow-sm'
                  : 'bg-white border-wellora-rose/25 text-wellora-mocha hover:bg-wellora-rose/5'
              }`}
            >
              {forYouOnly ? 'For You ✓' : 'Show All'}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-wellora-mocha/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pelvic tilts, stretches, core stability..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-wellora-rose/25 rounded-2xl focus:ring-1 focus:ring-wellora-terracotta focus:outline-none bg-white shadow-sm"
            />
          </div>

          {/* Category Chips Scrollbar */}
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? 'bg-wellora-terracotta text-white border-wellora-terracotta shadow-sm'
                    : 'bg-white border-wellora-rose/25 text-wellora-mocha hover:bg-wellora-rose/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Grid */}
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-wellora-rose/15 p-8 mt-4">
              <span className="text-3xl">🔍</span>
              <h3 className="font-serif text-sm font-bold mt-2 text-wellora-mocha">No Exercises Found</h3>
              <p className="text-xs text-wellora-mocha/50 mt-1">Try adapting your search parameters or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {filteredExercises.map((ex) => {
                const isCompleted = profile.completedExercises.includes(ex.id);
                const isSaved = profile.savedExercises.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    className="bg-white rounded-3xl border border-wellora-rose/15 p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-wellora-rose/30 transition-all"
                  >
                    <div>
                      <div className="flex gap-3.5 items-start mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-wellora-rose/10 flex-shrink-0 overflow-hidden flex items-center justify-center text-lg">
                          {!imageError[ex.id] ? (
                            <img 
                              src={`/images/exercises/${ex.id}.png`} 
                              alt={ex.title} 
                              className="w-full h-full object-cover"
                              onError={() => setImageError(prev => ({ ...prev, [ex.id]: true }))}
                            />
                          ) : (
                            ex.category === 'Pelvic Floor' ? <Star className="w-5 h-5 text-wellora-terracotta" /> : <CheckCircle2 className="w-5 h-5 text-wellora-terracotta" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] uppercase font-bold tracking-wide text-wellora-terracotta bg-wellora-rose/10 px-2 py-0.5 rounded-md">
                              {ex.category}
                            </span>
                            
                            <div className="flex gap-1.5">
                              {isSaved && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-wellora-terracotta" />}
                            </div>
                          </div>
                          <h3 className="font-serif text-base font-bold text-wellora-mocha">
                            {ex.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-wellora-mocha/60 line-clamp-2 mb-4 leading-normal">
                        {ex.benefits}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-wellora-rose/10 text-xs font-semibold">
                      <span className="text-[10px] text-wellora-mocha/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ex.duration}
                      </span>
                      
                      <button
                        onClick={() => onSelectExercise(ex)}
                        className="px-4 py-1.5 bg-wellora-mocha text-white text-[11px] rounded-full hover:bg-wellora-mocha/90 transition-all"
                      >
                        Open Routine
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Exercise Detailed View Overlay */
        <div className="bg-white rounded-3xl border border-wellora-rose/20 shadow-xl overflow-hidden animate-fade-in">
          
          {/* Header Action Bar */}
          <div className="px-6 py-4 bg-wellora-beige/30 border-b border-wellora-rose/15 flex justify-between items-center">
            <button
              onClick={() => onSelectExercise(null)}
              className="text-xs font-semibold text-wellora-mocha/70 hover:text-wellora-mocha flex items-center gap-1 transition-all"
            >
              <X className="w-4 h-4" /> Close Routine
            </button>
            
            <span className="text-xs font-bold text-wellora-terracotta uppercase tracking-wider">
              {selectedExercise.category} Module
            </span>
          </div>

          {/* 16:9 Video Placeholder Container */}
          <div className="relative aspect-video w-full bg-wellora-mocha flex flex-col items-center justify-center text-center p-6 select-none border-b border-wellora-rose/15">
            <div className="absolute inset-0 bg-gradient-to-tr from-wellora-mocha to-wellora-terracotta/40 opacity-70" />
            
            <div className="relative z-10 flex flex-col items-center max-w-sm px-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-3 shadow-lg">
                <Play className="w-6 h-6 fill-current pl-0.5" />
              </div>
              <h4 className="font-serif text-base font-bold text-white">Video Coming Soon</h4>
              <p className="text-[11px] text-wellora-beige/85 mt-1 leading-normal">
                This exercise video is being prepared by our certified maternal health specialists.
              </p>
            </div>
            
            <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded text-[9px] text-wellora-beige">
              16:9 Aspect Video Container
            </div>
          </div>

          {/* Detailed Content */}
          <div className="p-6 md:p-8 flex flex-col gap-6">
            
            {/* Title, Badge, Duration */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-wellora-mocha">
                  {selectedExercise.title}
                </h1>
                
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2.5 py-0.5 bg-wellora-rose/15 text-wellora-terracotta rounded-full text-[10px] font-bold">
                    {selectedExercise.duration}
                  </span>
                  {/* Only show the user's current stage badge, not all trimesters */}
                  {profile.stage === 'pregnant' && profile.trimester && (
                    <span className="px-2.5 py-0.5 bg-wellora-beige border border-wellora-rose/30 text-wellora-mocha rounded-full text-[10px] font-bold">
                      {profile.trimester} Trimester
                    </span>
                  )}
                  {profile.stage === 'postpartum' && (
                    <span className="px-2.5 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-[10px] font-bold">
                      Postpartum Recovery
                    </span>
                  )}
                  {profile.stage === 'labour' && (
                    <span className="px-2.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-full text-[10px] font-bold">
                      Labour Stage
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 bg-wellora-beige border border-wellora-rose/20 text-wellora-mocha/70 rounded-full text-[10px] font-bold">
                    {selectedExercise.category}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSaveExercise(selectedExercise.id)}
                  className={`p-2 rounded-full border transition-all ${
                    profile.savedExercises.includes(selectedExercise.id)
                      ? 'bg-amber-50 border-amber-300 text-amber-500'
                      : 'bg-white border-wellora-rose/25 text-wellora-mocha/60 hover:text-wellora-mocha'
                  }`}
                  title="Save for later"
                >
                  {profile.savedExercises.includes(selectedExercise.id) ? (
                    <BookmarkCheck className="w-5 h-5 fill-current" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Description/Explanation section */}
            {selectedExercise.description && (
              <div className="p-4 bg-wellora-rose/5 border border-wellora-rose/15 rounded-2xl">
                <h4 className="text-xs font-bold text-wellora-mocha mb-1">Exercise Overview</h4>
                <p className="text-xs text-wellora-mocha/85 leading-relaxed italic">
                  "{selectedExercise.description}"
                </p>
              </div>
            )}

            {/* Benefits section */}
            <div>
              <h4 className="text-xs font-bold text-wellora-mocha mb-1">Wellness Benefits</h4>
              <p className="text-xs text-wellora-mocha/80 leading-relaxed bg-wellora-beige/25 p-3.5 rounded-2xl border border-wellora-rose/10">
                {selectedExercise.benefits}
              </p>
            </div>

            {/* Movement Instructions */}
            <div>
              <h4 className="text-xs font-bold text-wellora-mocha mb-2">Step-by-Step Instructions</h4>
              <ol className="space-y-2.5 pl-5 list-decimal text-xs text-wellora-mocha/80 leading-relaxed">
                {selectedExercise.instructions.map((inst, idx) => (
                  <li key={idx} className="pl-1">
                    {inst}
                  </li>
                ))}
              </ol>
            </div>

            {/* Breathing Cues */}
            {selectedExercise.breathingCues && selectedExercise.breathingCues.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-wellora-mocha mb-2">Breathing Cues</h4>
                <ul className="space-y-2 pl-5 list-disc text-xs text-wellora-mocha/80 leading-relaxed">
                  {selectedExercise.breathingCues.map((cue, idx) => (
                    <li key={idx} className="pl-1 text-wellora-terracotta">
                      {cue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety Alert Panel */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-red-800 uppercase tracking-wide">Safety Guideline & Warnings</h5>
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[11px] text-red-700 leading-normal">
                  {selectedExercise.safetyWarnings.map((warn, idx) => (
                    <li key={idx}>{warn}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Third Trimester Golden Rules */}
            {selectedExercise.targetTrimesters.includes('Third') && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0 text-sm font-bold">
                  ⚠️
                </div>
                <div>
                  <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Third Trimester Golden Rules</h5>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-[11px] text-amber-800 leading-normal">
                    <li>
                      <strong className="text-amber-950">Avoid the "Vena Cava" Position:</strong> Do not lie flat on your back. If you must be on the floor, tilt your body to the left using a pillow.
                    </li>
                    <li>
                      <strong className="text-amber-950">Widen Your Stance:</strong> Keep your feet wider than hip-width during all standing exercises to keep your balance secure.
                    </li>
                    <li>
                      <strong className="text-amber-950">Stop Immediately If:</strong> You experience contractions, vaginal bleeding, fluid leaking, dizziness, shortness of breath before exertion, or pelvic pain.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex gap-4 pt-4 border-t border-wellora-rose/10 mt-2">
              <button
                onClick={() => handleMarkCompleted(selectedExercise)}
                className="flex-1 py-3 bg-wellora-terracotta text-white hover:bg-wellora-terracotta/95 font-semibold rounded-full shadow-md text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Trophy className="w-4 h-4" /> Mark as Completed
              </button>
              
              <button
                onClick={() => onSelectExercise(null)}
                className="px-6 py-3 border border-wellora-mocha/20 text-wellora-mocha hover:bg-wellora-rose/10 font-medium rounded-full text-sm transition-all"
              >
                Back to Library
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
