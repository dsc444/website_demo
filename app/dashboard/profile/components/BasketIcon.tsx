"use client";
import { useBasket } from "../BasketContext";
import Link from "next/link"; // Add this

export default function BasketIcon() {
  const { itemCount } = useBasket();

  return (
    <Link href="/dashboard/profile/basket"> {/* Wrap in Link */}
      <div className="relative group cursor-pointer">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-all">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-zinc-600 dark:text-zinc-400"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-zinc-950">
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  );
}