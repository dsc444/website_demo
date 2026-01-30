"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Market Prices', path: '/dashboard/profile' },
    { name: 'My Orders', path: '/dashboard/profile/orders' },
    { name: 'Account Settings', path: '/dashboard/profile/settings' },
  ];

  return (
    <div className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col">
      {/* Brand/Logo Section */}
      <div className="mb-10 px-4">
        <h2 className="text-emerald-500 font-black tracking-tighter text-xl italic">Data Extravaganza</h2>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-zinc-900 text-emerald-400 border border-zinc-800 pointer-events-none' 
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section at the Bottom */}
      <div className="mt-auto pt-6 border-t border-zinc-900">
        <a 
          href="/auth/logout" 
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all group"
        >
          {/* Logout Icon (Optional SVG) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="group-hover:stroke-red-400 transition-colors"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
        </a>
      </div>
    </div>
  );
}