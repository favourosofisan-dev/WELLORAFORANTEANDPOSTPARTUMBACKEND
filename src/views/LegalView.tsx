import React, { useState } from 'react';
import { ShieldCheck, FileText, ArrowLeft, ChevronRight } from 'lucide-react';

interface LegalViewProps {
  onBack: () => void;
  defaultTab?: 'privacy' | 'terms';
}

export const LegalView: React.FC<LegalViewProps> = ({ onBack, defaultTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(defaultTab);

  return (
    <div className="min-h-screen bg-wellora-beige flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-wellora-rose/15 px-4 sm:px-6 py-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-wellora-mocha/70 hover:text-wellora-mocha transition-all text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="w-6 h-6 rounded-full bg-wellora-terracotta flex items-center justify-center text-white font-serif font-bold text-xs">
            W
          </div>
          <span className="font-serif text-sm font-bold text-wellora-mocha">
            wellora <span className="text-wellora-terracotta italic font-normal">mama</span>
          </span>
        </div>
        <div className="w-16" /> {/* spacer for centering */}
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Page Title */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-wellora-terracotta/10 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-wellora-terracotta" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-wellora-mocha">Legal Information</h1>
          <p className="text-xs text-wellora-mocha/60 mt-1">Last Updated: June 2026</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-2xl p-1 border border-wellora-rose/15 shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'privacy'
                ? 'bg-wellora-terracotta text-white shadow-sm'
                : 'text-wellora-mocha/60 hover:text-wellora-mocha'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'terms'
                ? 'bg-wellora-terracotta text-white shadow-sm'
                : 'text-wellora-mocha/60 hover:text-wellora-mocha'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </button>
        </div>

        {/* Privacy Policy Content */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-3xl border border-wellora-rose/15 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-xl font-bold text-wellora-mocha mb-1">Wellora Mama Privacy Policy</h2>
              <p className="text-[11px] text-wellora-mocha/50">Welcome to Wellora Mama. Your privacy is important to us.</p>
            </div>

            {[
              {
                num: '1',
                title: 'Information We Collect',
                intro: 'We may collect:',
                bullets: [
                  'Name and email address',
                  'Account login information',
                  'Pregnancy status and trimester',
                  'Due date (optional)',
                  'Postpartum status',
                  'Wellness activity and progress data',
                  'Child birth date (if provided)',
                  'Immunization tracking information entered by the user',
                ]
              },
              {
                num: '2',
                title: 'How We Use Your Information',
                intro: 'We use your information to:',
                bullets: [
                  'Provide personalized wellness content',
                  'Track exercise progress',
                  'Deliver reminders and notifications',
                  'Improve app performance and user experience',
                  'Provide customer support',
                ]
              },
              {
                num: '3',
                title: 'Data Protection',
                intro: 'We implement reasonable security measures to protect your information from unauthorized access, loss, or misuse.',
                bullets: []
              },
              {
                num: '4',
                title: 'Information Sharing',
                intro: 'Wellora Mama does not sell personal information. We may share data only:',
                bullets: [
                  'When required by law',
                  'To protect user safety',
                  'With trusted service providers that help operate the app',
                ]
              },
              {
                num: '5',
                title: 'User Rights',
                intro: 'You may:',
                bullets: [
                  'Request access to your data',
                  'Request correction of inaccurate data',
                  'Request deletion of your account and personal information',
                ]
              },
              {
                num: '6',
                title: "Children's Privacy",
                intro: 'Wellora Mama is intended for parents and caregivers and is not designed for direct use by children.',
                bullets: []
              },
              {
                num: '7',
                title: 'Contact Us',
                intro: 'For privacy-related questions:',
                bullets: ['Email: support@wellora.com']
              }
            ].map((section) => (
              <div key={section.num} className="border-t border-wellora-rose/10 pt-5">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-wellora-terracotta/10 text-wellora-terracotta text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {section.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm font-bold text-wellora-mocha mb-1.5">{section.title}</h3>
                    <p className="text-xs text-wellora-mocha/70 leading-relaxed mb-2">{section.intro}</p>
                    {section.bullets.length > 0 && (
                      <ul className="space-y-1">
                        {section.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-wellora-mocha/70">
                            <ChevronRight className="w-3 h-3 text-wellora-terracotta mt-0.5 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Terms of Service Content */}
        {activeTab === 'terms' && (
          <div className="bg-white rounded-3xl border border-wellora-rose/15 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-xl font-bold text-wellora-mocha mb-1">Wellora Mama Terms of Service</h2>
              <p className="text-[11px] text-wellora-mocha/50">By using Wellora Mama, you agree to these Terms of Service.</p>
            </div>

            {[
              {
                num: '1',
                title: 'Acceptance',
                intro: 'By accessing or using Wellora Mama, you agree to be bound by these Terms.',
                bullets: []
              },
              {
                num: '2',
                title: 'Intended Use',
                intro: 'Wellora Mama provides wellness, educational, informational, and organizational tools related to:',
                bullets: [
                  'Pregnancy wellness',
                  'Postpartum recovery',
                  'Infant care education',
                  'Immunization tracking',
                ]
              },
              {
                num: '3',
                title: 'Not Medical Care',
                intro: 'Wellora Mama is not a healthcare provider. The app does not:',
                bullets: [
                  'Diagnose diseases',
                  'Prescribe treatments',
                  'Replace medical professionals',
                  'Provide emergency medical services',
                ],
                footer: 'Always seek advice from qualified healthcare professionals regarding medical concerns.'
              },
              {
                num: '4',
                title: 'User Responsibility',
                intro: 'Users are responsible for:',
                bullets: [
                  'Providing accurate information',
                  'Following healthcare provider guidance',
                  'Determining whether activities are appropriate for their individual circumstances',
                ]
              },
              {
                num: '5',
                title: 'Limitation of Liability',
                intro: 'To the maximum extent permitted by law, Wellora Mama shall not be liable for:',
                bullets: [
                  'Injuries resulting from exercise participation',
                  'Decisions made based on app content',
                  'Delayed medical treatment',
                  'Pregnancy or childbirth complications',
                ]
              },
              {
                num: '6',
                title: 'Intellectual Property',
                intro: 'All app content, branding, logos, text, and designs belong to Wellora unless otherwise stated.',
                bullets: []
              },
              {
                num: '7',
                title: 'Account Termination',
                intro: 'We reserve the right to suspend or terminate accounts that violate these terms.',
                bullets: []
              },
              {
                num: '8',
                title: 'Changes to Terms',
                intro: 'These Terms may be updated periodically. Continued use of the app constitutes acceptance of any changes.',
                bullets: []
              }
            ].map((section) => (
              <div key={section.num} className="border-t border-wellora-rose/10 pt-5">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-wellora-terracotta/10 text-wellora-terracotta text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {section.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm font-bold text-wellora-mocha mb-1.5">{section.title}</h3>
                    <p className="text-xs text-wellora-mocha/70 leading-relaxed mb-2">{section.intro}</p>
                    {section.bullets.length > 0 && (
                      <ul className="space-y-1 mb-2">
                        {section.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-wellora-mocha/70">
                            <ChevronRight className="w-3 h-3 text-wellora-terracotta mt-0.5 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {'footer' in section && section.footer && (
                      <p className="text-xs text-wellora-mocha/70 leading-relaxed italic">{section.footer}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-wellora-terracotta text-white rounded-full font-semibold text-sm hover:bg-wellora-terracotta/95 transition-all shadow-sm"
          >
            Return to App
          </button>
          <p className="text-[10px] text-wellora-mocha/40 mt-3">
            Wellora Family Systems Inc. • support@wellora.com
          </p>
        </div>
      </div>
    </div>
  );
};
