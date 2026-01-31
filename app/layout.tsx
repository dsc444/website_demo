import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";
import CookieBanner from './components/CookieBanner'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Darragh's Data | Extravaganza",
  description: "Fresh data market land",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> 
      <body 
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased 
          flex flex-col min-h-screen
          bg-white text-zinc-900 
          dark:bg-zinc-950 dark:text-white
          transition-colors duration-300
        `}
      >
        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>

        {/* COOKIE POPUP */}
        <CookieBanner />

        {/* FOOTER SECTION */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Darragh's Data Extravaganza. You better not sue me.
            </p>
            
            <div className="flex gap-8">
              <Link 
                href="/privacy" 
                className="text-zinc-400 hover:text-emerald-500 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-zinc-400 hover:text-emerald-500 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}