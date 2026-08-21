import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { Calendar, ShieldAlert, User, Award, CheckCircle, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
  onBackToLanding: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, onBackToLanding }) => {
  const { profile, updateStage, toggleGoal, acceptDisclaimer, signUp } = useUserProfile();
  
  const [step, setStep] = useState<number>(0); // 0: Welcome, 1: Who Are You?, 2: Goals, 3: Disclaimer, 4: Account Creation, 5: Generation
  const [loading, setLoading] = useState<boolean>(false);
  
  // Form states
  const [stage, setStage] = useState<'pregnant' | 'postpartum' | 'caregiver'>('pregnant');
  const [trimester, setTrimester] = useState<'First' | 'Second' | 'Third'>('First');
  const [dueOrBirthDate, setDueOrBirthDate] = useState<string>('');
  const [weeksPostpartum, setWeeksPostpartum] = useState<number>(4);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
 
  // Calculation helpers
  const handleDueDateChange = (dateStr: string) => {
    setDueOrBirthDate(dateStr);
    if (!dateStr) return;
 
    const due = new Date(dateStr);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const weeksConceived = Math.max(0, 40 - Math.floor(diffDays / 7));
    
    if (weeksConceived <= 13) {
      setTrimester('First');
    } else if (weeksConceived <= 27) {
      setTrimester('Second');
    } else {
      setTrimester('Third');
    }
  };
 
  const handleNextStep = async () => {
    setErrors({});
    
    if (step === 1) {
      // Save stage choices into context
      if (stage === 'pregnant') {
        updateStage('pregnant', { trimester, dueOrBirthDate, weeksPostpartum: null });
      } else if (stage === 'postpartum') {
        // Map weeks selector
        updateStage('postpartum', { trimester: null, dueOrBirthDate, weeksPostpartum });
      } else {
        updateStage('caregiver', { trimester: null, dueOrBirthDate: null, weeksPostpartum: null });
      }
    }
 
    if (step === 3 && !disclaimerChecked) {
      setErrors({ disclaimer: 'You must read and accept the medical disclaimer to proceed.' });
      return;
    }
 
    if (step === 3 && disclaimerChecked) {
      acceptDisclaimer();
    }
 
    if (step === 4) {
      const errs: { [key: string]: string } = {};
      if (!name.trim()) errs.name = 'Please enter your name.';
      if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email address.';
      if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
      
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
 
      setLoading(true);
      try {
        await signUp(name.trim(), email.trim(), password, {
          stage,
          trimester: stage === 'pregnant' ? trimester : null,
          weeksPostpartum: stage === 'postpartum' ? weeksPostpartum : null,
          dueOrBirthDate: stage !== 'caregiver' ? dueOrBirthDate : null,
          goals: profile.goals,
        });
      } catch (err: any) {
        setErrors({ submit: err.message || 'Failed to create account. Please make sure the database is connected.' });
        setLoading(false);
        return;
      }
      setLoading(false);
    }
 
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (step === 0) {
      onBackToLanding();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const goalOptions = [
    { id: 'Stay Active', label: 'Stay Active', desc: 'Pregnancy-safe stretching & resistance' },
    { id: 'Prepare For Labor', label: 'Prepare For Labor', desc: 'Breathing, alignment & delivery conditioning' },
    { id: 'Recover After Birth', label: 'Recover After Birth', desc: 'Immediate postpartum care & core restoration' },
    { id: 'Reduce Back Pain', label: 'Reduce Back Pain', desc: 'Stretch and relieve common sciatic tension' },
    { id: 'Improve Mobility', label: 'Improve Mobility', desc: 'Maintain flexibility and balance' },
    { id: 'Track Baby\'s Health', label: 'Track Baby\'s Health', desc: 'Organize infant care & immunization schedules' }
  ];

  return (
    <div className="min-h-screen bg-wellora-beige flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-wellora-rose/15 shadow-xl p-8 transition-all duration-300 relative overflow-hidden">
        
        {/* Progress Dots */}
        {step > 0 && step < 5 && (
          <div className="flex justify-center gap-1.5 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-wellora-terracotta' : i < step ? 'w-2 bg-wellora-rose' : 'w-2 bg-wellora-rose/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 0: Welcome Screen */}
        {step === 0 && (
          <div className="text-center flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-full bg-wellora-beige border border-wellora-rose/30 flex items-center justify-center text-wellora-terracotta text-3xl mb-6 shadow-sm">
              🌸
            </div>
            <h1 className="font-serif text-3xl text-wellora-mocha mb-3 font-bold">Welcome to Wellora Mama</h1>
            <p className="text-sm text-wellora-mocha/70 max-w-sm leading-relaxed mb-8">
              Your warm and reassuring companion for pregnancy, labor preparation, postpartum recovery, baby care, and immunization tracking.
            </p>

            <button
              onClick={() => setStep(1)}
              className="w-full py-3.5 bg-wellora-terracotta text-white font-medium rounded-full shadow hover:bg-wellora-terracotta/95 transition-all flex items-center justify-center gap-2"
            >
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={onBackToLanding}
              className="mt-4 text-xs font-semibold text-wellora-mocha/60 hover:text-wellora-mocha"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Step 1: Who Are You Selection */}
        {step === 1 && (
          <div>
            <h2 className="font-serif text-2xl text-wellora-mocha font-bold mb-1">Tell us about yourself</h2>
            <p className="text-xs text-wellora-mocha/60 mb-6">We will personalize your daily wellness routines based on this.</p>

            <div className="flex flex-col gap-3 mb-6">
              {/* Pregnant Option */}
              <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                stage === 'pregnant' ? 'bg-wellora-beige/35 border-wellora-terracotta shadow-sm' : 'border-wellora-rose/20 hover:bg-wellora-rose/5'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤰</span>
                  <div>
                    <p className="text-sm font-bold text-wellora-mocha">I am Pregnant</p>
                    <p className="text-[11px] text-wellora-mocha/50">Expectant mother seeking prenatal guidance</p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="stage" 
                  checked={stage === 'pregnant'} 
                  onChange={() => setStage('pregnant')} 
                  className="accent-wellora-terracotta w-4 h-4"
                />
              </label>

              {/* Postpartum Option */}
              <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                stage === 'postpartum' ? 'bg-wellora-beige/35 border-wellora-terracotta shadow-sm' : 'border-wellora-rose/20 hover:bg-wellora-rose/5'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤱</span>
                  <div>
                    <p className="text-sm font-bold text-wellora-mocha">I am Postpartum</p>
                    <p className="text-[11px] text-wellora-mocha/50">Recovery, pelvic re-education & core stability</p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="stage" 
                  checked={stage === 'postpartum'} 
                  onChange={() => setStage('postpartum')} 
                  className="accent-wellora-terracotta w-4 h-4"
                />
              </label>

              {/* Caregiver/Parent Option */}
              <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                stage === 'caregiver' ? 'bg-wellora-beige/35 border-wellora-terracotta shadow-sm' : 'border-wellora-rose/20 hover:bg-wellora-rose/5'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👶</span>
                  <div>
                    <p className="text-sm font-bold text-wellora-mocha">I am a Parent / Caregiver</p>
                    <p className="text-[11px] text-wellora-mocha/50">Tracking vaccines & baby growth</p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="stage" 
                  checked={stage === 'caregiver'} 
                  onChange={() => setStage('caregiver')} 
                  className="accent-wellora-terracotta w-4 h-4"
                />
              </label>
            </div>

            {/* Dynamic Stage Details */}
            {stage === 'pregnant' && (
              <div className="p-4 bg-wellora-beige/25 rounded-2xl border border-wellora-rose/10 flex flex-col gap-4 animate-fade-in">
                <p className="text-xs font-bold text-wellora-mocha uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-wellora-terracotta" /> Due Date and Trimester Calculator
                </p>
                
                <div>
                  <label className="block text-[11px] font-semibold text-wellora-mocha/70 mb-1">Enter Estimated Due Date</label>
                  <input 
                    type="date" 
                    value={dueOrBirthDate}
                    onChange={(e) => handleDueDateChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-wellora-rose/30 text-sm focus:ring-1 focus:ring-wellora-terracotta focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-wellora-mocha/70 mb-1">Or Select Current Trimester</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['First', 'Second', 'Third'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTrimester(t as any);
                          // Clear due date if choosing manual trimester
                          setDueOrBirthDate('');
                        }}
                        className={`py-2 px-3 text-xs rounded-lg border font-medium transition-all ${
                          trimester === t && !dueOrBirthDate
                            ? 'bg-wellora-terracotta text-white border-wellora-terracotta shadow-sm'
                            : trimester === t && dueOrBirthDate
                              ? 'bg-wellora-rose text-white border-wellora-rose'
                              : 'bg-white border-wellora-rose/30 hover:bg-wellora-rose/5 text-wellora-mocha'
                        }`}
                      >
                        {t} Trim
                      </button>
                    ))}
                  </div>
                </div>

                {dueOrBirthDate && (
                  <div className="mt-2 py-1.5 px-3 bg-wellora-terracotta/10 text-wellora-mocha rounded-lg text-xs font-medium text-center">
                    Calculated Stage: <span className="font-bold text-wellora-terracotta">{trimester} Trimester</span>
                  </div>
                )}
              </div>
            )}

            {stage === 'postpartum' && (
              <div className="p-4 bg-wellora-beige/25 rounded-2xl border border-wellora-rose/10 flex flex-col gap-4 animate-fade-in">
                <p className="text-xs font-bold text-wellora-mocha uppercase tracking-wider">
                  Postpartum Timeline
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-wellora-mocha/70 mb-2">How many weeks postpartum are you?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 3, label: '0–6 Weeks' },
                      { val: 9, label: '6–12 Weeks' },
                      { val: 16, label: '3+ Months' }
                    ].map((w) => (
                      <button
                        key={w.val}
                        type="button"
                        onClick={() => setWeeksPostpartum(w.val)}
                        className={`py-2 px-3 text-xs rounded-lg border font-medium transition-all ${
                          weeksPostpartum === w.val 
                            ? 'bg-wellora-terracotta text-white border-wellora-terracotta shadow-sm' 
                            : 'bg-white border-wellora-rose/30 hover:bg-wellora-rose/5 text-wellora-mocha'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              <button 
                onClick={handlePrevStep}
                className="flex-1 py-3 border border-wellora-mocha/20 text-wellora-mocha hover:bg-wellora-rose/10 font-medium rounded-full text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={handleNextStep}
                className="flex-1 py-3 bg-wellora-terracotta text-white hover:bg-wellora-terracotta/95 font-medium rounded-full text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div>
            <h2 className="font-serif text-2xl text-wellora-mocha font-bold mb-1">Define your goals</h2>
            <p className="text-xs text-wellora-mocha/60 mb-6">Select all that apply to help us prioritize your schedule.</p>

            <div className="grid grid-cols-1 gap-2.5 mb-8">
              {goalOptions.map((goal) => {
                const isSelected = profile.goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected 
                        ? 'bg-wellora-beige/35 border-wellora-terracotta shadow-sm' 
                        : 'border-wellora-rose/20 hover:bg-wellora-rose/5'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected ? 'bg-wellora-terracotta border-wellora-terracotta text-white' : 'border-wellora-rose/40 bg-white'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-wellora-mocha">{goal.label}</p>
                      <p className="text-[10px] text-wellora-mocha/50 mt-0.5">{goal.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button 
                onClick={handlePrevStep}
                className="flex-1 py-3 border border-wellora-mocha/20 text-wellora-mocha hover:bg-wellora-rose/10 font-medium rounded-full text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={handleNextStep}
                className="flex-1 py-3 bg-wellora-terracotta text-white hover:bg-wellora-terracotta/95 font-medium rounded-full text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Medical Disclaimer */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-amber-600">
              <ShieldAlert className="w-6 h-6 fill-amber-50" />
              <h2 className="font-serif text-2xl font-bold">Medical Safeguards</h2>
            </div>
            
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 mb-6 text-wellora-mocha max-h-60 overflow-y-auto leading-relaxed">
              <h4 className="font-bold text-xs uppercase tracking-wide text-amber-800 mb-2">
                Wellora Mama Disclaimer & Terms
              </h4>
              <p className="text-[11px] text-amber-900 mb-3">
                Wellora Mama is an educational wellness companion designed to support mothers with prenatal stretching, pelvic floor exercise guides, baby immunization logs, and recovery tutorials.
              </p>
              <p className="text-[11px] text-amber-900 mb-3">
                <strong>We do NOT provide medical diagnostics, medical advice, clinical treatment, or triage emergency care.</strong> The exercises, breathing guides, and instructions represent fitness suggestions.
              </p>
              <p className="text-[11px] text-amber-900">
                You should always consult with your OB-GYN, midwife, or physician before beginning any physical regimen. Stop immediately if you experience dizziness, localized pelvic pain, bleeding, contractions, or heartbeat palpitations.
              </p>
            </div>

            <label className="flex items-start gap-3 p-3 bg-wellora-beige/25 rounded-xl border border-wellora-rose/10 cursor-pointer mb-8">
              <input 
                type="checkbox"
                checked={disclaimerChecked}
                onChange={(e) => {
                  setDisclaimerChecked(e.target.checked);
                  setErrors({});
                }}
                className="mt-1 accent-wellora-terracotta w-4 h-4 flex-shrink-0"
              />
              <span className="text-[11px] text-wellora-mocha/80 leading-normal">
                I understand that Wellora Mama provides educational wellness content and does not replace medical advice from qualified healthcare professionals.
              </span>
            </label>

            {errors.disclaimer && (
              <p className="text-xs text-red-500 font-bold mb-4">{errors.disclaimer}</p>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <button 
                onClick={handlePrevStep}
                className="flex-1 py-3 border border-wellora-mocha/20 text-wellora-mocha hover:bg-wellora-rose/10 font-medium rounded-full text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={handleNextStep}
                disabled={!disclaimerChecked}
                className="flex-1 py-3 bg-wellora-terracotta text-white hover:bg-wellora-terracotta/95 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-full text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                Accept & Proceed <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Account Creation */}
        {step === 4 && (
          <div>
            <h2 className="font-serif text-2xl text-wellora-mocha font-bold mb-1">Create Account</h2>
            <p className="text-xs text-wellora-mocha/60 mb-6">Set up your credentials to secure your profile records.</p>

            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="flex flex-col gap-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-wellora-mocha mb-1">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-wellora-mocha/40" />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full pl-9 pr-4 py-2 text-sm border border-wellora-rose/30 rounded-xl focus:ring-1 focus:ring-wellora-terracotta focus:outline-none"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 font-semibold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-wellora-mocha mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full px-3 py-2 text-sm border border-wellora-rose/30 rounded-xl focus:ring-1 focus:ring-wellora-terracotta focus:outline-none"
                />
                {errors.email && <p className="text-xs text-red-500 font-semibold mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-wellora-mocha mb-1">Secure Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-wellora-rose/30 rounded-xl focus:ring-1 focus:ring-wellora-terracotta focus:outline-none" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-wellora-mocha/40 hover:text-wellora-mocha"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                  <p className="text-[10px] text-wellora-mocha/40 mt-1">Your password is stored securely.</p>
                {errors.password && <p className="text-xs text-red-500 font-semibold mt-1">{errors.password}</p>}
              </div>
            </form>

            {errors.submit && (
              <p className="text-xs text-red-500 font-bold mb-4 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{errors.submit}</p>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <button 
                onClick={handlePrevStep}
                disabled={loading}
                className="flex-1 py-3 border border-wellora-mocha/20 text-wellora-mocha hover:bg-wellora-rose/10 font-medium rounded-full text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={handleNextStep}
                disabled={loading}
                className="flex-1 py-3 bg-wellora-terracotta text-white hover:bg-wellora-terracotta/95 font-medium rounded-full text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Dashboard Generation Loading Simulation */}
        {step === 5 && (
          <div className="text-center py-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-t-wellora-terracotta border-wellora-rose/20 animate-spin mb-6" />
            <h2 className="font-serif text-2xl text-wellora-mocha font-bold mb-2">Generating Dashboard...</h2>
            <p className="text-xs text-wellora-mocha/60 max-w-sm mb-6 leading-relaxed">
              Analyzing your status ({stage === 'pregnant' ? `${trimester} Trimester` : stage === 'postpartum' ? `${weeksPostpartum} weeks postpartum` : 'Caregiver'}), filtering exercises, and building your personalized wellness calendar.
            </p>
            
            <div className="w-full text-left bg-wellora-beige/30 border border-wellora-rose/10 rounded-2xl p-4 mb-6">
              <p className="text-xs font-bold mb-2 text-wellora-mocha flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" /> Custom Plan Compiled
              </p>
              <ul className="text-[10px] text-wellora-mocha/70 space-y-1 pl-5 list-disc">
                <li>Selected Goals: {profile.goals.join(', ') || 'General Wellness'}</li>
                <li>Trimester-Aware Exercises filtered</li>
                <li>Emergency triggers established</li>
                <li>{stage === 'caregiver' ? 'Infant vaccine scheduling pre-configured' : 'Vaccine schedule setup ready'}</li>
              </ul>
            </div>

            <button 
              onClick={onComplete}
              className="w-full py-3.5 bg-wellora-mocha text-white hover:bg-wellora-mocha/90 font-semibold rounded-full shadow-md flex items-center justify-center gap-2"
            >
              Enter My Dashboard <Award className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
