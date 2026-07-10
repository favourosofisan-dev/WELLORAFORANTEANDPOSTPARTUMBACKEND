import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import type { UserStage } from '../context/UserProfileContext';
import { LogOut, ShieldAlert, Award, Flame, RotateCcw } from 'lucide-react';

interface ProfileViewProps {
  onLogout: () => void;
  onOpenDisclaimer: () => void;
  onOpenLegal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onLogout, onOpenDisclaimer, onOpenLegal }) => {
  const { profile, updateStage, toggleGoal, resetProgress } = useUserProfile();

  const [activeStage, setActiveStage] = useState<UserStage>(profile.stage);
  const [dueDate, setDueDate] = useState<string>(profile.dueOrBirthDate || '');
  const [weeksPostpartum, setWeeksPostpartum] = useState<number>(profile.weeksPostpartum || 6);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    let trimester: 'First' | 'Second' | 'Third' | null = null;
    if (activeStage === 'pregnant') {
      trimester = 'Second'; // Default fallback
      if (dueDate) {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeksConceived = Math.max(0, 40 - Math.floor(diffDays / 7));
        if (weeksConceived <= 13) trimester = 'First';
        else if (weeksConceived <= 27) trimester = 'Second';
        else trimester = 'Third';
      }
      updateStage('pregnant', { trimester, dueOrBirthDate: dueDate, weeksPostpartum: null });
    } else if (activeStage === 'labour') {
      updateStage('labour', { trimester: null, dueOrBirthDate: null, weeksPostpartum: null });
    } else if (activeStage === 'postpartum') {
      updateStage('postpartum', { trimester: null, dueOrBirthDate: null, weeksPostpartum });
    } else {
      updateStage('caregiver', { trimester: null, dueOrBirthDate: null, weeksPostpartum: null });
    }

    alert('Profile preferences updated successfully!');
  };

  const handleResetApp = () => {
    if (window.confirm('Are you sure you want to delete all saved exercises, points, and baby information? This action is irreversible.')) {
      resetProgress();
      localStorage.clear();
      onLogout();
    }
  };

  const allGoals = [
    'Stay Active',
    'Prepare For Labor',
    'Recover After Birth',
    'Reduce Back Pain',
    'Improve Mobility',
    'Track Baby\'s Health'
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-16 h-16 rounded-full bg-wellora-rose/25 flex items-center justify-center text-3xl font-bold border border-wellora-rose/30">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-wellora-mocha">{profile.name || 'Sarah Jenkins'}</h2>
            <p className="text-xs text-wellora-mocha/50 mt-0.5">{profile.email || 'sarah@example.com'}</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-2 py-0.5 bg-wellora-beige border border-wellora-rose/10 text-[9px] uppercase font-bold text-wellora-mocha/80 rounded-full">
                {profile.stage === 'pregnant' ? 'Expecting Stage' : profile.stage === 'labour' ? 'Labour Navigation' : profile.stage === 'postpartum' ? 'Postpartum Stage' : 'Parent Stage'}
              </span>
              {profile.isPro ? (
                <span className="px-2 py-0.5 bg-purple-100 border border-purple-300 text-[9px] uppercase font-bold text-purple-700 rounded-full">
                  ★ Pro Subscriber
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 text-[9px] uppercase font-bold text-gray-500 rounded-full">
                  Free Tier
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-wellora-rose/10 w-full sm:w-auto justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-wellora-terracotta fill-current" />
              <span className="text-lg font-serif font-bold text-wellora-mocha">{profile.streak}</span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-wide text-wellora-mocha/50">Active Streak</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Award className="w-4 h-4 text-wellora-terracotta" />
              <span className="text-lg font-serif font-bold text-wellora-mocha">{profile.points}</span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-wide text-wellora-mocha/50">Points</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-serif font-bold text-wellora-mocha">{profile.completedExercises.length}</span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-wide text-wellora-mocha/50">Completed</span>
          </div>
        </div>
      </div>

      {/* Preferences & Stage Settings Form */}
      <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm">
        <h3 className="font-serif text-base font-bold text-wellora-mocha mb-4">
          Personalize Stage Preferences
        </h3>

        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-wellora-mocha mb-2">My Active Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'pregnant', label: 'Pregnant' },
                { key: 'labour', label: 'In Labour' },
                { key: 'postpartum', label: 'Postpartum' },
                { key: 'caregiver', label: 'Caregiver' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setActiveStage(opt.key as any)}
                  className={`py-2 px-3 text-xs rounded-xl border font-semibold transition-all ${
                    activeStage === opt.key
                      ? 'bg-wellora-terracotta text-white border-wellora-terracotta shadow-sm'
                      : 'bg-white border-wellora-rose/25 text-wellora-mocha hover:bg-wellora-rose/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {activeStage === 'pregnant' && (
            <div className="p-4 bg-wellora-beige/25 border border-wellora-rose/10 rounded-2xl animate-fade-in">
              <label className="block text-xs font-bold text-wellora-mocha mb-1">Estimated Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-wellora-rose/20 rounded-xl bg-white text-wellora-mocha focus:outline-none"
              />
            </div>
          )}

          {activeStage === 'postpartum' && (
            <div className="p-4 bg-wellora-beige/25 border border-wellora-rose/10 rounded-2xl animate-fade-in">
              <label className="block text-xs font-bold text-wellora-mocha mb-1">Weeks Postpartum</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {[
                  { val: 3, label: '0–6 Weeks' },
                  { val: 8, label: '6–12 Weeks' },
                  { val: 15, label: '3+ Months' }
                ].map((w) => (
                  <button
                    key={w.val}
                    type="button"
                    onClick={() => setWeeksPostpartum(w.val)}
                    className={`py-1.5 px-3 text-xs rounded-lg border font-semibold transition-all ${
                      weeksPostpartum === w.val
                        ? 'bg-wellora-mocha text-white border-wellora-mocha'
                        : 'bg-white border-wellora-rose/20 text-wellora-mocha hover:bg-wellora-rose/5'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-wellora-terracotta text-white font-semibold rounded-full hover:bg-wellora-terracotta/95 shadow-sm text-xs mt-2 transition-all"
          >
            Apply Stage Changes
          </button>
        </form>
      </div>

      {/* Subscription Settings */}
      <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm">
        <h3 className="font-serif text-base font-bold text-wellora-mocha mb-2">
          Wellora Mama Subscription
        </h3>
        <p className="text-xs text-wellora-mocha/50 mb-4 leading-normal">
          Toggle your Pro subscription status to test both free-tier limits and premium AI-powered wellness features.
        </p>
        <div className="flex items-center justify-between p-4 bg-wellora-beige/25 border border-wellora-rose/10 rounded-2xl">
          <div>
            <span className="block text-xs font-bold text-wellora-mocha">Wellora Mama Pro Access</span>
            <span className="text-[10px] text-wellora-mocha/60">Unlock Wellora AI Wellness Companion, personalized daily plans, and midwife mode.</span>
          </div>
          <button
            onClick={() => updateProfile({ isPro: !profile.isPro })}
            className={`px-4 py-2 text-xs font-semibold rounded-full shadow-sm transition-all ${
              profile.isPro
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-wellora-terracotta hover:bg-wellora-terracotta/95 text-white'
            }`}
          >
            {profile.isPro ? 'Switch to Free' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>

      {/* Wellness Goals Management */}
      <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm">
        <h3 className="font-serif text-base font-bold text-wellora-mocha mb-3">
          My Wellness Goals
        </h3>
        <p className="text-xs text-wellora-mocha/50 mb-4 leading-normal">
          Toggle objectives to align recommended tips in your dashboard profile.
        </p>

        <div className="flex flex-wrap gap-2">
          {allGoals.map((goal) => {
            const isSelected = profile.goals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-wellora-rose/15 text-wellora-terracotta border-wellora-terracotta/40'
                    : 'bg-white border-wellora-rose/20 text-wellora-mocha/60 hover:text-wellora-mocha'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety, Privacy & Session Actions */}
      <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm flex flex-col gap-3">
        <h3 className="font-serif text-base font-bold text-wellora-mocha mb-1">
          App Settings & Security
        </h3>

        {/* Disclaimer Trigger */}
        <button
          onClick={onOpenDisclaimer}
          className="w-full py-3 px-4 bg-wellora-beige/30 hover:bg-wellora-rose/10 border border-wellora-rose/10 text-left rounded-2xl text-xs font-semibold text-wellora-mocha flex items-center justify-between transition-all"
        >
          <span className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-wellora-terracotta" /> View Legal & Medical Disclaimers
          </span>
          <span>&rarr;</span>
        </button>

        {/* Terms & Privacy Trigger */}
        <button
          onClick={onOpenLegal}
          className="w-full py-3 px-4 bg-wellora-beige/30 hover:bg-wellora-rose/10 border border-wellora-rose/10 text-left rounded-2xl text-xs font-semibold text-wellora-mocha flex items-center justify-between transition-all"
        >
          <span className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-wellora-terracotta" /> View Terms & Privacy Policy
          </span>
          <span>&rarr;</span>
        </button>

        {/* Reset App */}
        <button
          onClick={handleResetApp}
          className="w-full py-3 px-4 bg-red-50 hover:bg-red-100/60 border border-red-100 text-left rounded-2xl text-xs font-semibold text-red-700 flex items-center justify-between transition-all"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset All App Progress & Data
          </span>
          <span>&rarr;</span>
        </button>

        {/* Log Out */}
        <button
          onClick={onLogout}
          className="w-full py-3.5 bg-wellora-mocha text-white hover:bg-wellora-mocha/90 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm mt-3 transition-all"
        >
          <LogOut className="w-4 h-4" /> Log Out Session
        </button>
      </div>

    </div>
  );
};
