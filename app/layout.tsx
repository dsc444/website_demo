import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    // 1. REMOVED className="dark" from here so the JS can control it
    <html lang="en"> 
      <body 
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased 
          flex min-h-screen
          /* 2. UPDATED these to be theme-aware */
          bg-white text-zinc-900 
          dark:bg-zinc-950 dark:text-white
          transition-colors duration-300
        `}
      >
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}