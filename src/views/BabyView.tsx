import React, { useState } from 'react';
import { useBaby } from '../context/BabyContext';
import { CARE_ARTICLES } from '../data/mockData';
import type { CareArticle } from '../data/mockData';
import { Baby as BabyIcon, Plus, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';

export const BabyView: React.FC = () => {
  const { babies, addBaby, toggleVaccineStatus, removeBaby } = useBaby();

  const [activeBabyId, setActiveBabyId] = useState<string>(babies[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState<boolean>(babies.length === 0);
  const [selectedArticle, setSelectedArticle] = useState<CareArticle | null>(null);

  // Form input states
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Neutral');
  const [birthWeight, setBirthWeight] = useState('');
  const [formError, setFormError] = useState('');

  const activeBaby = babies.find((b) => b.id === activeBabyId) || babies[0];

  const handleAddBabySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter the baby\'s name.');
      return;
    }
    if (!birthDate) {
      setFormError('Please enter the baby\'s birth date.');
      return;
    }

    addBaby(name, birthDate, gender, birthWeight ? `${birthWeight} lbs` : undefined);
    
    // Reset form
    setName('');
    setBirthDate('');
    setGender('Neutral');
    setBirthWeight('');
    setShowAddForm(false);
    
    // Set active baby to the new one
    // setTimeout to allow the state to update
    setTimeout(() => {
      if (babies.length > 0) {
        setActiveBabyId(babies[babies.length - 1].id);
      }
    }, 50);
  };

  // Helper to calculate baby's current age
  const calculateBabyAge = (dobString: string): string => {
    const dob = new Date(dobString);
    const today = new Date();
    const diffTime = today.getTime() - dob.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expecting soon';
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} old`;
    }
    
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 13) {
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} old`;
    }

    const diffMonths = Math.floor(diffDays / 30.4);
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} old`;
    }

    const diffYears = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30.4);
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} old`;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Tab Switcher & Baby Profile Selector */}
      {babies.length > 0 && !showAddForm && (
        <div className="flex justify-between items-center bg-white rounded-3xl p-4 border border-wellora-rose/15 shadow-sm">
          <div className="flex gap-2 items-center overflow-x-auto max-w-[70%]">
            {babies.map((baby) => (
              <button
                key={baby.id}
                onClick={() => {
                  setActiveBabyId(baby.id);
                  setShowAddForm(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeBaby?.id === baby.id
                    ? 'bg-wellora-terracotta text-white'
                    : 'bg-wellora-beige/50 text-wellora-mocha border border-wellora-rose/15 hover:bg-wellora-rose/10'
                }`}
              >
                <BabyIcon className="w-3.5 h-3.5" />
                {baby.name}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 bg-wellora-mocha text-white rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-wellora-mocha/90 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Profile
          </button>
        </div>
      )}

      {/* Main Form: Register Baby */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-wellora-rose/10">
            <h3 className="font-serif text-lg font-bold text-wellora-mocha flex items-center gap-2">
              <BabyIcon className="w-5 h-5 text-wellora-terracotta" /> Add Baby Profile
            </h3>
            {babies.length > 0 && (
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-xs text-wellora-mocha/50 hover:text-wellora-mocha"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleAddBabySubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-wellora-mocha mb-1">Baby Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Leo James"
                className="w-full px-3 py-2 text-sm border border-wellora-rose/25 rounded-xl focus:ring-1 focus:ring-wellora-terracotta focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-wellora-mocha mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-wellora-rose/25 rounded-xl focus:ring-1 focus:ring-wellora-terracotta focus:outline-none text-wellora-mocha"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-wellora-mocha mb-1">Gender (Optional)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-wellora-rose/25 rounded-xl focus:ring-1 focus:ring-wellora-terracotta focus:outline-none bg-white"
                >
                  <option value="Neutral">Neutral</option>
                  <option value="Boy">Boy</option>
                  <option value="Girl">Girl</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-wellora-mocha mb-1">Birth Weight (Optional, lbs)</label>
              <input
                type="number"
                step="0.1"
                value={birthWeight}
                onChange={(e) => setBirthWeight(e.target.value)}
                placeholder="7.2"
                className="w-full px-3 py-2 text-sm border border-wellora-rose/25 rounded-xl focus:ring-1 focus:ring-wellora-terracotta focus:outline-none"
              />
            </div>

            {formError && (
              <p className="text-xs text-red-500 font-bold">{formError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-wellora-terracotta text-white hover:bg-wellora-terracotta/95 font-semibold rounded-full mt-2 shadow-sm transition-all"
            >
              Generate Vaccine & Growth Trackers
            </button>
          </form>
        </div>
      )}

      {/* Baby Details & Vaccine Logs */}
      {!showAddForm && activeBaby && (
        <div className="flex flex-col gap-6">
          
          {/* Baby Card Summary */}
          <div className="bg-gradient-to-tr from-wellora-rose/10 to-wellora-terracotta/15 p-6 rounded-3xl border border-wellora-rose/15 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm border border-wellora-rose/20">
                {activeBaby.gender === 'Boy' ? '👶‍♂️' : activeBaby.gender === 'Girl' ? '👶‍♀️' : '👶'}
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-wellora-mocha leading-tight">{activeBaby.name}</h3>
                <p className="text-xs text-wellora-mocha/60 mt-0.5">
                  Born: {new Date(activeBaby.birthDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-white/70 text-[9px] font-bold text-wellora-mocha rounded-full">
                    {calculateBabyAge(activeBaby.birthDate)}
                  </span>
                  {activeBaby.birthWeight && (
                    <span className="px-2 py-0.5 bg-wellora-terracotta text-white text-[9px] font-bold rounded-full">
                      Weight: {activeBaby.birthWeight}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Completion Percent circle display */}
            <div className="text-right">
              <span className="text-3xl font-serif font-bold text-wellora-mocha">
                {Math.round(
                  (activeBaby.vaccineRecords.filter((r) => r.status === 'Completed').length /
                    activeBaby.vaccineRecords.length) * 100
                )}%
              </span>
              <p className="text-[9px] uppercase tracking-wider font-bold text-wellora-mocha/60 mt-0.5">Doses Completed</p>
            </div>
          </div>

          {/* Automatic Vaccine Timeline Schedule */}
          <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm">
            <h3 className="font-serif text-base font-bold text-wellora-mocha mb-4 flex items-center gap-1.5">
              <span>📅</span> Automatic Immunization Tracker (WHO Schedule)
            </h3>
            
            <p className="text-xs text-wellora-mocha/60 mb-5 leading-normal">
              Based on date of birth. Tick checklist boxes to mark status as Completed.
            </p>

            <div className="flex flex-col gap-3">
              {activeBaby.vaccineRecords.map((record) => {
                const isCompleted = record.status === 'Completed';
                const isOverdue = record.status === 'Overdue';

                return (
                  <div
                    key={record.vaccineId}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-4 justify-between ${
                      isCompleted
                        ? 'bg-wellora-beige/10 border-wellora-rose/25 opacity-70'
                        : isOverdue
                          ? 'border-red-200 bg-red-50/20'
                          : 'border-wellora-rose/10 bg-wellora-beige/5'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleVaccineStatus(activeBaby.id, record.vaccineId)}
                        className="mt-1 accent-wellora-terracotta w-4.5 h-4.5 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-wellora-mocha flex items-center gap-2">
                          {record.vaccineName}
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                            isCompleted
                              ? 'bg-wellora-terracotta text-white'
                              : isOverdue
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-wellora-rose/20 text-wellora-terracotta'
                          }`}>
                            {record.status}
                          </span>
                        </h4>
                        
                        <p className="text-[10px] text-wellora-mocha/50 mt-1">
                          Milestone: <span className="font-semibold text-wellora-mocha">{record.milestone}</span> • Target: <span className="font-semibold">{record.scheduledDate}</span>
                        </p>
                        
                        {isCompleted && record.completedDate && (
                          <p className="text-[9px] text-green-700 font-bold mt-0.5">
                            Given on: {record.completedDate}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-wellora-rose/10 flex justify-between items-center text-[10px] text-wellora-mocha/40">
              <span>* Always consult your pediatrician for actual clinical validations.</span>
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to remove this baby profile?")) {
                    removeBaby(activeBaby.id);
                  }
                }}
                className="text-red-500 hover:underline font-bold"
              >
                Remove Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Baby Care Resource Library (Section 10) */}
      {!selectedArticle ? (
        <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-sm">
          <h3 className="font-serif text-base font-bold text-wellora-mocha mb-4 flex items-center gap-1.5">
            <BookOpen className="w-4.5 h-4.5 text-wellora-terracotta" /> Infant Care reference Library
          </h3>
          <p className="text-xs text-wellora-mocha/60 mb-5 leading-normal">
            Certified safe parenting articles regarding newborn safety, feedings, and hydration.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CARE_ARTICLES.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="p-4 rounded-2xl border border-wellora-rose/10 hover:border-wellora-rose/25 text-left bg-wellora-beige/5 hover:bg-wellora-beige/10 transition-all flex justify-between items-center"
              >
                <div className="pr-4">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-wellora-terracotta bg-wellora-rose/10 px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                  <h4 className="text-xs font-bold text-wellora-mocha mt-2">
                    {article.title}
                  </h4>
                  <p className="text-[10px] text-wellora-mocha/60 mt-1 line-clamp-1 leading-normal">
                    {article.summary}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-wellora-mocha/40 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Selected Article Drawer Detail */
        <div className="bg-white rounded-3xl p-6 border border-wellora-rose/15 shadow-md animate-fade-in">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-wellora-rose/10">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-xs font-semibold text-wellora-mocha/70 hover:text-wellora-mocha flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Care Guides
            </button>
            <span className="text-[9px] uppercase font-bold tracking-wider text-wellora-terracotta bg-wellora-rose/10 px-2.5 py-0.5 rounded">
              {selectedArticle.category} Article
            </span>
          </div>

          <h2 className="font-serif text-lg font-bold text-wellora-mocha mb-3">
            {selectedArticle.title}
          </h2>

          <div className="space-y-3 mb-6">
            {selectedArticle.content.map((p, idx) => (
              <p key={idx} className="text-xs text-wellora-mocha/80 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Quick Tips Summary Card */}
          <div className="bg-wellora-beige/35 border border-wellora-rose/15 rounded-2xl p-4 mb-4">
            <h4 className="text-xs font-bold text-wellora-mocha mb-2 flex items-center gap-1">
              <span>📌</span> Quick Takeaways & Tips
            </h4>
            <ul className="space-y-1.5 text-[11px] text-wellora-mocha/80 pl-5 list-disc">
              {selectedArticle.tips.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setSelectedArticle(null)}
            className="w-full py-2.5 bg-wellora-mocha text-white hover:bg-wellora-mocha/90 text-xs font-semibold rounded-full"
          >
            Close Guide
          </button>
        </div>
      )}

    </div>
  );
};
