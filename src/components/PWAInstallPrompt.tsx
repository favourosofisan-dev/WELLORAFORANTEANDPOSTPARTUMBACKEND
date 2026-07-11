import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI to notify the user they can add to home screen
      
      // Check if user dismissed it recently
      const dismissed = localStorage.getItem('wellora_pwa_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up.
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember for 7 days
    localStorage.setItem('wellora_pwa_dismissed', 'true');
    setTimeout(() => {
      localStorage.removeItem('wellora_pwa_dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // For iOS - simple detection for a manual prompt since iOS doesn't support beforeinstallprompt
  const [isIosPrompt, setIsIosPrompt] = useState(false);
  
  useEffect(() => {
    const isIos = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase());
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    if (isIos && !isInStandaloneMode) {
      const dismissed = localStorage.getItem('wellora_ios_pwa_dismissed');
      if (!dismissed) {
        setIsIosPrompt(true);
      }
    }
  }, []);

  const handleIosDismiss = () => {
    setIsIosPrompt(false);
    localStorage.setItem('wellora_ios_pwa_dismissed', 'true');
    setTimeout(() => {
      localStorage.removeItem('wellora_ios_pwa_dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt && !isIosPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-[100] animate-fade-in-up">
      <div className="bg-wellora-mocha text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border-2 border-wellora-terracotta/30">
        <div className="flex flex-col">
          <span className="font-serif font-bold text-lg mb-1">Install Wellora Mama</span>
          {showPrompt ? (
             <span className="text-xs text-white/80">Add to your home screen for quick access</span>
          ) : (
            <span className="text-xs text-white/80">Tap share <span className="inline-block mx-1">⎋</span> then "Add to Home Screen"</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showPrompt && (
            <button 
              onClick={handleInstallClick}
              className="bg-wellora-terracotta hover:bg-wellora-terracotta/90 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          )}
          <button 
            onClick={showPrompt ? handleDismiss : handleIosDismiss}
            className="p-2 text-white/60 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
