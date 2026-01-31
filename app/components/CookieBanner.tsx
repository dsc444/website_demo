'use client';
import { useState, useEffect } from 'react';
import { saveCookieConsent } from '@/app/actions';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [selections, setSelections] = useState({
    necessary: true, 
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setIsVisible(true);
  }, []);

  // Master function to handle all button clicks
  const processChoice = async (finalConsent: typeof selections) => {
    // 1. Save locally so the banner disappears for this user
    localStorage.setItem('cookie-consent', JSON.stringify(finalConsent));
    
    // 2. SAVE TO SERVER JSON (via your Server Action)
    await saveCookieConsent(finalConsent);
    
    // 3. Close the banner
    setIsVisible(false);
  };

  const onAcceptAll = () => {
    processChoice({ necessary: true, analytics: true, marketing: true });
  };

  const onAcceptSelected = () => {
    processChoice(selections);
  };

  const onDenyAll = () => {
    processChoice({ necessary: true, analytics: false, marketing: false });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-[100] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-5">
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-emerald-500">Privacy & Consent</h2>
      
      <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 mb-6">
        This website uses cookies to improve your experience. By clicking <span className="text-zinc-900 dark:text-white font-bold">“Deny”</span>, you consent to the use of Necessary cookies only. 
      </p>

      {/* Selection Toggles */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <label className="text-[10px] font-bold uppercase text-zinc-400">Necessary (Auth/Security)</label>
          <span className="text-[9px] font-black text-emerald-500 uppercase">Always On</span>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer" 
             onClick={() => setSelections({...selections, analytics: !selections.analytics})}>
          <label className="text-[10px] font-bold uppercase cursor-pointer">Analytics</label>
          <input type="checkbox" checked={selections.analytics} readOnly className="accent-emerald-500 h-3 w-3" />
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
             onClick={() => setSelections({...selections, marketing: !selections.marketing})}>
          <label className="text-[10px] font-bold uppercase cursor-pointer">Marketing</label>
          <input type="checkbox" checked={selections.marketing} readOnly className="accent-emerald-500 h-3 w-3" />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onAcceptAll} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black uppercase py-3 rounded-lg hover:opacity-90 transition-all">
            Accept All
          </button>
          <button onClick={onAcceptSelected} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-[10px] font-black uppercase py-3 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
            Accept Selection
          </button>
        </div>
        <button onClick={onDenyAll} className="text-zinc-400 hover:text-red-500 text-[9px] font-black uppercase py-2 tracking-widest transition-all">
          Deny All Non-Essential
        </button>
      </div>
    </div>
  );
}