import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Heart, Calendar, Activity, CheckCircle } from 'lucide-react';

interface LandingViewProps {
  onStartJourney: () => void;
  onExploreFeatures: () => void;
  onLogin: () => void;
  onOpenLegal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStartJourney, onExploreFeatures, onLogin, onOpenLegal }) => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Simple timeline activation logic based on scroll percentage
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY / (height || 1);
      
      if (scrolled < 0.2) setActiveTimelineStep(0);
      else if (scrolled < 0.4) setActiveTimelineStep(1);
      else if (scrolled < 0.6) setActiveTimelineStep(2);
      else if (scrolled < 0.8) setActiveTimelineStep(3);
      else setActiveTimelineStep(4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const timelineSteps = [
    { label: 'Pregnancy', description: 'Trimester guidance' },
    { label: 'Labor Preparation', description: 'Breathing & positions' },
    { label: 'Postpartum Recovery', description: 'Core restoration' },
    { label: 'Baby Care', description: 'Sleep & nutrition' },
    { label: 'Immunization Tracker', description: 'Smart schedules' }
  ];

  return (
    <div className="min-h-screen bg-wellora-beige text-wellora-mocha overflow-x-hidden selection:bg-wellora-rose/30">
      
      {/* Premium Navbar */}
      <header className="sticky top-0 z-50 bg-wellora-beige/85 backdrop-blur-md border-b border-wellora-mocha/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/wellora-mama-logo.png"
            alt="Wellora Mama Logo"
            className="w-9 h-9 rounded-full object-cover shadow-sm"
          />
          <span className="font-serif text-xl font-bold tracking-wide text-wellora-mocha">
            wellora <span className="text-wellora-terracotta italic font-normal">mama</span>
          </span>
        </div>
      </header>

      {/* Hero Section with Parallax Background */}
      <section className="relative h-[85vh] flex items-center justify-center px-6 overflow-hidden border-b border-wellora-rose/10">
        
        {/* Parallax elements */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-wellora-beige via-wellora-beige to-white transition-transform ease-out pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        
        {/* Soft floating background abstract shapes (instead of placeholders, styled SVGs) */}
        <div 
          className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-wellora-rose/10 filter blur-3xl transition-transform duration-200"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        />
        <div 
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-wellora-terracotta/5 filter blur-3xl transition-transform duration-200"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        />

        {/* Foreground Content */}
        <div className="relative max-w-4xl text-center z-10 flex flex-col items-center">
          
          {/* Brand Logo and Floating Hearts */}
          <div className="flex items-center gap-1.5 mb-6 px-4 py-1.5 rounded-full bg-white/70 border border-wellora-rose/20 shadow-sm animate-pulse">
            <Heart className="w-4 h-4 text-wellora-rose fill-current" />
            <span className="text-xs uppercase tracking-widest font-semibold font-sans text-wellora-mocha/80">
              Welcoming you to maternal wellness
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-wellora-mocha leading-tight mb-6">
            Wellora Mama — Supporting You <br />
            <span className="italic text-wellora-terracotta font-normal">Through Every Stage of Motherhood</span>
          </h1>

          <p className="font-sans text-base md:text-lg text-wellora-mocha/80 max-w-2xl leading-relaxed mb-8">
            Pregnancy wellness, labor preparation, postpartum recovery, infant care guidance, and immunization tracking — all in one calm, supportive space.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onStartJourney}
              className="px-8 py-3.5 bg-wellora-terracotta text-white font-medium rounded-full shadow-md hover:bg-wellora-terracotta/95 transition-all flex items-center gap-2 hover:gap-3 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreFeatures}
              className="px-8 py-3.5 bg-white text-wellora-mocha border border-wellora-mocha/20 hover:bg-wellora-rose/10 font-medium rounded-full shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
            >
              Explore Features
            </button>
          </div>

          {/* Login button below CTAs */}
          <button
            onClick={onLogin}
            className="mt-2 px-6 py-2 bg-transparent text-wellora-mocha/70 border border-wellora-mocha/20 hover:bg-white/60 hover:text-wellora-mocha font-medium rounded-full text-sm transition-all"
          >
            Already have an account? <span className="font-bold text-wellora-terracotta">Log In</span>
          </button>
          
          {/* Real Wellora Mama Avatar */}
          <div className="mt-12 w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden animate-bounce">
            <img
              src="/images/WELLORA MAMA AVATAR.jpeg"
              alt="Wellora Mama Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area: Timeline + Story Sections */}
      <section className="relative py-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-12 bg-white rounded-3xl shadow-sm border border-wellora-rose/10 -mt-10 mb-20 z-20">
        
        {/* Left Side: Sticky Timeline */}
        <div className="w-full md:w-1/3 md:sticky md:top-24 h-fit pr-4">
          <div className="bg-wellora-beige/30 p-6 rounded-2xl border border-wellora-rose/15 shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-6 text-wellora-mocha">Your Journey Map</h3>
            
            <div className="relative pl-6 border-l-2 border-wellora-rose/20 flex flex-col gap-8">
              {/* Scroll Timeline Progress Line */}
              <div 
                className="absolute top-0 left-[-2px] w-[2px] bg-wellora-terracotta transition-all duration-500 ease-out"
                style={{ 
                  height: `${(activeTimelineStep / (timelineSteps.length - 1)) * 100}%` 
                }}
              />

              {timelineSteps.map((step, idx) => {
                const isActive = idx <= activeTimelineStep;
                const isCurrent = idx === activeTimelineStep;
                return (
                  <div key={idx} className="relative flex flex-col items-start">
                    {/* Circle Node */}
                    <div 
                      className={`absolute left-[-31px] w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-wellora-terracotta border-wellora-terracotta text-white shadow-md' 
                          : isActive 
                            ? 'bg-wellora-rose border-wellora-rose text-white' 
                            : 'bg-white border-wellora-rose/30 text-wellora-mocha/30'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    </div>

                    <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                      isCurrent ? 'text-wellora-terracotta text-base' : isActive ? 'text-wellora-mocha' : 'text-wellora-mocha/40'
                    }`}>
                      {step.label}
                    </h4>
                    <p className={`text-xs transition-colors duration-300 ${
                      isCurrent ? 'text-wellora-mocha/80' : 'text-wellora-mocha/50'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-wellora-rose/20">
              <button 
                onClick={onStartJourney}
                className="w-full py-2.5 px-4 bg-wellora-mocha text-white text-xs font-semibold rounded-full hover:bg-wellora-mocha/90 transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                Join Wellora Today <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Reveal Sections */}
        <div className="w-full md:w-2/3 flex flex-col gap-24">
          
          {/* Section 1: Pregnancy */}
          <div className="flex flex-col gap-4 border-b border-wellora-rose/10 pb-12 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-wellora-rose/20 text-wellora-terracotta rounded-full text-xs font-bold uppercase tracking-wider">
                Stage 1 — Pregnancy
              </span>
              <Calendar className="w-4 h-4 text-wellora-rose" />
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-wellora-mocha leading-tight">
              Your body is changing. <br />
              <span className="italic font-normal text-wellora-terracotta">We're here to guide you gently.</span>
            </h2>
            
            <p className="text-sm md:text-base text-wellora-mocha/80 leading-relaxed">
              Every week of pregnancy is a milestone. Wellora calculates your trimester dynamically and delivers specialized core stability, lower body stretches, and pelvic floor exercises that accommodate your growing bump. We supply medical-disclaimer backed instructions to keep you and your baby completely safe.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-wellora-beige/30 rounded-xl border border-wellora-rose/10">
                <p className="text-xs font-bold text-wellora-mocha">Weekly Trimester Tips</p>
                <p className="text-[11px] text-wellora-mocha/70 mt-1">Curated advice on hydration, safe sleeping positions, and nutrition.</p>
              </div>
              <div className="p-3 bg-wellora-beige/30 rounded-xl border border-wellora-rose/10">
                <p className="text-xs font-bold text-wellora-mocha">Pregnancy Workouts</p>
                <p className="text-[11px] text-wellora-mocha/70 mt-1">Exercises like Pelvic Tilts and Cat-Cow targeted to relieve back tension.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Labor Prep */}
          <div className="flex flex-col gap-4 border-b border-wellora-rose/10 pb-12">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-wellora-rose/20 text-wellora-terracotta rounded-full text-xs font-bold uppercase tracking-wider">
                Stage 2 — Labor Prep
              </span>
              <Activity className="w-4 h-4 text-wellora-rose" />
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-wellora-mocha leading-tight">
              Breathe, move, and prepare <br />
              <span className="italic font-normal text-wellora-terracotta">with absolute confidence.</span>
            </h2>
            
            <p className="text-sm md:text-base text-wellora-mocha/80 leading-relaxed">
              Prepare for labor with guided breathing cycles, focal point therapy guides, comfort positioning maps (like birth ball guides and supported squads), and partner countersheets. Our labor prep module becomes active as you enter the second and third trimester, giving you exercises that expand the pelvic outlet.
            </p>

            <div className="mt-4 p-4 bg-wellora-rose/5 rounded-xl border border-wellora-rose/15 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-wellora-mocha flex items-center gap-1">
                  <span>💨</span> Interactive Breathing Guide
                </p>
                <p className="text-[11px] text-wellora-mocha/70 mt-0.5">Visual cue system designed to mimic Lamaze contraction pacing.</p>
              </div>
              <button 
                onClick={onStartJourney} 
                className="text-xs px-3 py-1.5 bg-wellora-rose text-white rounded-full hover:bg-wellora-rose/90 transition-all font-semibold"
              >
                Try Breathing Tool
              </button>
            </div>
          </div>

          {/* Section 3: Postpartum */}
          <div className="flex flex-col gap-4 border-b border-wellora-rose/10 pb-12">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-wellora-rose/20 text-wellora-terracotta rounded-full text-xs font-bold uppercase tracking-wider">
                Stage 3 — Postpartum
              </span>
              <Heart className="w-4 h-4 text-wellora-rose" />
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-wellora-mocha leading-tight">
              Recovery is a vital part <br />
              <span className="italic font-normal text-wellora-terracotta">of your sacred journey.</span>
            </h2>
            
            <p className="text-sm md:text-base text-wellora-mocha/80 leading-relaxed">
              Postpartum recovery requires a gentle touch. Our program shifts seamlessly to adapt to your postpartum weeks (0-6 weeks immediate rest, 6-12 weeks core restoration, and 3+ months strength building). Learn diastasis recti safe movement patterns, pelvic floor re-education, and postural exercises to relieve tension from breastfeeding.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="p-2 text-center bg-wellora-beige/30 rounded-lg border border-wellora-rose/10 text-xs font-semibold">
                0-6 Weeks: Rest
              </div>
              <div className="p-2 text-center bg-wellora-beige/30 rounded-lg border border-wellora-rose/10 text-xs font-semibold">
                6-12 Weeks: Rebuild
              </div>
              <div className="p-2 text-center bg-wellora-beige/30 rounded-lg border border-wellora-rose/10 text-xs font-semibold">
                3+ Months: Return
              </div>
            </div>
          </div>

          {/* Section 4: Baby Care & Immunizations */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-wellora-rose/20 text-wellora-terracotta rounded-full text-xs font-bold uppercase tracking-wider">
                Stage 4 — Infant Care & Tracking
              </span>
              <CheckCircle className="w-4 h-4 text-wellora-rose" />
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-wellora-mocha leading-tight">
              From feeding to sleep to immunizations, <br />
              <span className="italic font-normal text-wellora-terracotta">stay perfectly organized and informed.</span>
            </h2>
            
            <p className="text-sm md:text-base text-wellora-mocha/80 leading-relaxed">
              Once your baby is born, transition your profile to unlock the baby tracker. Add multiple baby profiles, check baby care references on safe sleep guidelines and hydration, and let the app automatically generate a complete immunization checklist based on their birthday. Never miss a dose with Upcoming, Overdue, and Completed status sheets.
            </p>

            <div className="mt-4 p-3 bg-wellora-beige/40 rounded-xl border border-wellora-rose/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👶</span>
                <div>
                  <p className="text-xs font-bold text-wellora-mocha">Automatic Vaccine Scheduler</p>
                  <p className="text-[10px] text-wellora-mocha/60">Generate targeted schedules instantly matching WHO guidelines.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Brand Storytelling Callout */}
      <section className="bg-wellora-mocha text-wellora-beige py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <Heart className="w-10 h-10 text-wellora-rose mb-4 animate-bounce" />
          <h2 className="font-serif text-3xl mb-6">Designed with Love and Security</h2>
          <p className="text-sm md:text-base text-wellora-beige/80 mb-8 leading-relaxed">
            We believe that every mother deserves a safe, quiet space to track her health and care for her little one. Wellora is built to be a warm educational companion, protecting your data with privacy controls and safeguarding your routines with medical guidelines.
          </p>
          <button 
            onClick={onStartJourney}
            className="px-8 py-3 bg-wellora-terracotta text-white hover:bg-wellora-terracotta/95 rounded-full font-medium transition-all shadow hover:shadow-lg"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wellora-beige py-12 px-6 border-t border-wellora-mocha/10 text-center text-xs text-wellora-mocha/50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-1 font-serif text-sm font-bold text-wellora-mocha">
            wellora <span className="text-wellora-terracotta font-normal italic">mama</span>
          </div>
          <div>
            &copy; 2026 Wellora Family. Educational wellness application. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span onClick={onOpenLegal} className="hover:underline cursor-pointer">Privacy Policy</span>
            <span onClick={onOpenLegal} className="hover:underline cursor-pointer">Terms of Service</span>
            <span onClick={onOpenLegal} className="hover:underline cursor-pointer">Medical Disclaimer</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
