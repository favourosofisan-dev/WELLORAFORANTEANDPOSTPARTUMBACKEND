import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import { UserProfileProvider, useUserProfile } from './context/UserProfileContext';
import { BabyProvider } from './context/BabyContext';
import { LandingView } from './views/LandingView';
import { OnboardingView } from './views/OnboardingView';
import { DashboardView } from './views/DashboardView';
import { ExercisesView } from './views/ExercisesView';
import { BabyView } from './views/BabyView';
import { AntenatalGuideView } from './views/AntenatalGuideView';
import { LabourNavigationView } from './views/LabourNavigationView';
import { ProfileView } from './views/ProfileView';
import { LegalView } from './views/LegalView';
import { BreathingTool } from './components/BreathingTool';
import type { Exercise } from './data/mockData';
import { Home, Dumbbell, Baby as BabyIcon, User, Calendar, X, ShieldAlert, Wind, Sparkles } from 'lucide-react';
import './App.css';
import { LoginView } from './views/LoginView';
import { AIChatView } from './views/AIChatView';

const MainAppContent: React.FC = () => {
  const { profile, logout } = useUserProfile();
  
  // Navigation states
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'app' | 'login' | 'legal'>(() => {
    // Determine view based on profile status
    const saved = localStorage.getItem('wellora_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isLoggedIn && parsed.disclaimerAccepted) {
          return 'app';
        }
      } catch (e) {}
    }
    return 'landing';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'exercises' | 'baby' | 'profile' | 'antenatal' | 'ai'>('home');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showBreathingModal, setShowBreathingModal] = useState<boolean>(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const triggerTabTransition = (tab: typeof activeTab) => {
    setLoading(true);
    // Simulate lightweight premium skeleton screen transition
    setTimeout(() => {
      setActiveTab(tab);
      setSelectedExercise(null);
      setLoading(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleStartOnboarding = () => {
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentView('app');
    setActiveTab('home');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
    setActiveTab('home');
    setSelectedExercise(null);
  };

  // Render sub-sections within the active workspace portal
  const renderPortalContent = () => {
    if (loading) {
      // Premium Skeleton Screen Loader (satisfies OWASP & mobile skeleton requirements)
      return (
        <div className="flex flex-col gap-6 animate-pulse p-4">
          <div className="h-32 bg-wellora-rose/15 rounded-3xl w-full" />
          <div className="h-6 bg-wellora-rose/15 rounded-md w-1/4 mt-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-40 bg-wellora-rose/10 rounded-2xl w-full" />
            <div className="h-40 bg-wellora-rose/10 rounded-2xl w-full" />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <DashboardView 
            onNavigate={(tab) => triggerTabTransition(tab)} 
            onSelectExercise={(ex) => {
              setSelectedExercise(ex);
              setActiveTab('exercises');
            }}
            onOpenBreathingTool={() => setShowBreathingModal(true)}
          />
        );
      case 'exercises':
        return (
          <ExercisesView 
            selectedExercise={selectedExercise}
            onSelectExercise={setSelectedExercise}
          />
        );
      case 'baby':
        return <BabyView />;
      case 'antenatal':
        return profile.stage === 'labour' ? <LabourNavigationView /> : <AntenatalGuideView />;
      case 'ai':
        return <AIChatView />;
      case 'profile':
        return (
          <ProfileView 
            onLogout={handleLogout} 
            onOpenDisclaimer={() => setShowDisclaimerModal(true)}
            onOpenLegal={() => setCurrentView('legal')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-wellora-beige/20 text-wellora-mocha flex flex-col font-sans">
      
      {/* 1. Landing View Router */}
      {currentView === 'landing' && (
        <LandingView 
          onStartJourney={handleStartOnboarding}
          onExploreFeatures={handleStartOnboarding}
          onLogin={() => setCurrentView('login')}
          onOpenLegal={() => setCurrentView('legal')}
        />
      )}
      {currentView === 'login' && (
        <LoginView
          onLoginSuccess={() => {
            setCurrentView('app');
            setActiveTab('home');
          }}
        />
      )}

      {/* Legal View */}
      {currentView === 'legal' && (
        <LegalView onBack={() => setCurrentView('landing')} />
      )}

      {/* 2. Onboarding View Router */}
      {currentView === 'onboarding' && (
        <OnboardingView 
          onComplete={handleOnboardingComplete}
          onBackToLanding={() => setCurrentView('landing')}
        />
      )}

      {/* 3. Logged-in App Portal layout */}
      {currentView === 'app' && (
        <div className="flex-1 flex flex-col md:flex-row min-h-screen pb-24 md:pb-0">
          
          {/* Sidebar Navigation for Desktop */}
          <aside className="hidden md:flex flex-col w-64 bg-white border-r border-wellora-rose/15 p-6 sticky top-0 h-screen select-none">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-wellora-terracotta flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
                W
              </div>
              <span className="font-serif text-lg font-bold tracking-wide text-wellora-mocha">
                wellora <span className="text-wellora-terracotta italic font-normal">mama</span>
              </span>
            </div>

            <nav className="flex flex-col gap-2 flex-grow">
              {[
                { id: 'home', label: 'Dashboard', icon: Home },
                { id: 'exercises', label: 'Exercises', icon: Dumbbell },
                { id: 'baby', label: 'Baby & Vaccines', icon: BabyIcon },
                profile.stage === 'labour'
                  ? { id: 'antenatal', label: 'Labour Navigation', icon: Wind }
                  : { id: 'antenatal', label: 'Antenatal', icon: Calendar },
                { id: 'ai', label: 'Wellora AI', icon: Sparkles },
                { id: 'profile', label: 'My Profile', icon: User }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => triggerTabTransition(tab.id as any)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-wellora-terracotta text-white shadow-sm' 
                        : 'text-wellora-mocha hover:bg-wellora-rose/10 hover:text-wellora-mocha/90'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-wellora-rose/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-wellora-rose/20 flex items-center justify-center text-sm font-bold text-wellora-mocha">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="overflow-hidden">
                <span className="block text-xs font-bold text-wellora-mocha truncate">{profile.name || 'Sarah'}</span>
                <span className="text-[9px] text-wellora-mocha/50 truncate block">{profile.email}</span>
              </div>
            </div>
          </aside>

          {/* Main Workspace Frame */}
          <main className="flex-1 flex flex-col min-h-screen">
            
            {/* Top Responsive Navbar for Mobile */}
            <header className="md:hidden sticky top-0 z-40 bg-wellora-beige/85 backdrop-blur-md border-b border-wellora-rose/15 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-wellora-terracotta flex items-center justify-center text-white font-serif font-bold text-xs">
                  W
                </div>
                <span className="font-serif text-sm font-bold tracking-wide text-wellora-mocha">
                  wellora <span className="text-wellora-terracotta italic font-normal text-xs">mama</span>
                </span>
              </div>
              
              {/* Short milestone preview pill */}
              <div className="text-[10px] bg-wellora-rose/15 text-wellora-terracotta px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {profile.stage === 'pregnant' ? 'Expecting' : profile.stage === 'postpartum' ? 'Postpartum' : profile.stage === 'labour' ? 'In Labour' : 'Caregiver'}
              </div>
            </header>

            {/* View Area Wrapper */}
            <div className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto">
              {renderPortalContent()}
            </div>
          </main>

          {/* Bottom Navigation for Mobile (Enforces >44px touch targets) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-wellora-rose/15 px-4 py-2 flex justify-around items-center shadow-lg">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'exercises', label: 'Exercises', icon: Dumbbell },
              { id: 'ai', label: 'Wellora AI', icon: Sparkles },
              { id: 'baby', label: 'Baby', icon: BabyIcon },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => triggerTabTransition(tab.id as any)}
                  className={`flex flex-col items-center justify-center flex-1 h-12 rounded-xl transition-all ${
                    isActive ? 'text-wellora-terracotta' : 'text-wellora-mocha/50'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-[9px] font-semibold mt-1">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Floating AI Button */}
          {activeTab !== 'ai' && (
            <button
              onClick={() => triggerTabTransition('ai')}
              className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-wellora-terracotta text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
              style={{ minHeight: '44px', minWidth: '44px' }}
              title="Chat with Wellora AI"
            >
              <Sparkles className="w-5 h-5 fill-current" />
            </button>
          )}
        </div>
      )}

      {/* 4. Labor Breathing Simulation Overlay Modal */}
      {showBreathingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative border border-wellora-rose/20 animate-scale-up">
            <button
              onClick={() => setShowBreathingModal(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-wellora-beige text-wellora-mocha/60"
            >
              <X className="w-5 h-5" />
            </button>
            <BreathingTool onComplete={() => alert('Well done! Session complete.')} />
          </div>
        </div>
      )}

      {/* 5. Medical Disclaimer Overlay Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-wellora-rose/25 relative animate-scale-up">
            <button
              onClick={() => setShowDisclaimerModal(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-wellora-beige text-wellora-mocha/60"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-4 text-amber-600">
              <ShieldAlert className="w-6 h-6 fill-amber-50" />
              <h3 className="font-serif text-xl font-bold">Medical Safeguards</h3>
            </div>

            <div className="space-y-3 text-xs text-wellora-mocha/80 leading-relaxed max-h-80 overflow-y-auto pr-2">
              <p>
                <strong>Wellora Mama is an educational wellness platform and does not provide clinical medical diagnosis, triage treatment, or obstetric therapy.</strong>
              </p>
              <p>
                The exercises, timelines, schedules, and tips represent fitness and wellness recommendations compiled for informational purposes. They are not a replacement for advice from your OB-GYN, midwife, or pediatrician.
              </p>
              <p>
                Always consult a healthcare provider before changing physical activities. 
                <strong>Immediate Emergency Warnings:</strong> Stop exercising immediately if you feel localized pelvic girdle friction, sudden abdominal cramping, lightheaded dizziness, shortness of breath, headache, vaginal bleeding, or chest pressure.
              </p>
              <p className="text-[10px] text-wellora-mocha/50 pt-2 border-t border-wellora-rose/10">
                Wellora Family Systems Inc. • Secure & Private Client Architecture.
              </p>
            </div>

            <button
              onClick={() => setShowDisclaimerModal(false)}
              className="w-full mt-6 py-2.5 bg-wellora-terracotta text-white font-semibold rounded-full hover:bg-wellora-terracotta/95 shadow-sm text-xs"
            >
              Close Disclaimer
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <>
      <SplashScreen />
      <UserProfileProvider>
        <BabyProvider>
          <MainAppContent />
        </BabyProvider>
      </UserProfileProvider>
    </>
  );
};

export default App;
