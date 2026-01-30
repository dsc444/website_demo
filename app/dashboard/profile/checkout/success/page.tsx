"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useBasket } from "../../BasketContext";

export default function SuccessPage() {
  const { setBasket } = useBasket();

  useEffect(() => {
    // Aggressive Clear Logic
    setBasket([]);
    localStorage.removeItem("user_basket");
    localStorage.setItem("user_basket", JSON.stringify([]));
  }, [setBasket]);

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* BACKGROUND DECOR (The "Nice Colours") */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      {/* TOP LEFT RETURN BUTTON */}
      <div className="absolute top-0 left-0 p-6">
        <Link 
          href="/dashboard/profile" 
          className="flex items-center gap-2 text-xs font-black tracking-widest text-zinc-400 hover:text-emerald-500 transition-all uppercase group"
        >
          <svg 
            className="transform group-hover:-translate-x-1 transition-transform" 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Market
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
        
        {/* Animated Icon Circle */}
        <div className="relative mx-auto w-32 h-32 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping opacity-30" />
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-4">
          <h1 className="text-7xl font-black italic tracking-tighter dark:text-white uppercase leading-none">
            Payment <br/> 
            <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">Confirmed</span>
          </h1>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Transaction Successful</p>
            <div className="h-1 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">
              Your order is being processed. We’ve sent a digital receipt to your email address (no, we lied. Darragh hasn't built that yet).
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-6">
          <Link 
            href="/dashboard/profile" 
            className="inline-block bg-zinc-900 dark:bg-white text-white dark:text-black font-black px-14 py-5 rounded-2xl hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:scale-105 transition-all active:scale-95 shadow-2xl"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>

      {/* Decorative Corner Text */}
      <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none select-none">
        <h2 className="text-8xl font-black italic uppercase leading-none text-zinc-400">Secure</h2>
      </div>
    </div>
  );
}