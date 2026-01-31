"use client";
import { useState, useEffect } from "react";
import { saveAccountSettings } from "@/app/actions/users";

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [theme, setTheme] = useState(initialSettings.theme || "dark");

  // This effect runs every time 'theme' changes
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);

  return (
    <form action={saveAccountSettings} className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2">Business Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Full Name</label>
            <input 
              name="fullName"
              defaultValue={initialSettings.fullName} 
              className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg text-zinc-900 dark:text-white" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 font-bold uppercase">Workplace</label>
            <input 
              name="workplace"
              defaultValue={initialSettings.workplace}
              className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg text-zinc-900 dark:text-white" 
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs text-zinc-500 font-bold uppercase">Address</label>
            <input 
              name="address"
              defaultValue={initialSettings.address}
              className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg text-zinc-900 dark:text-white" 
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2">Notifications & UI</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Email List</p>
              <p className="text-xs text-zinc-500">Weekly market reports.</p>
            </div>
            <input 
              type="checkbox" 
              name="emailList"
              defaultChecked={initialSettings.emailList}
              className="w-5 h-5 accent-emerald-500" 
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Interface Theme</p>
              <p className="text-xs text-zinc-500">Switch between Light and Dark mode.</p>
            </div>
            <select 
              name="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-zinc-200 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 p-1 rounded text-sm text-zinc-900 dark:text-white"
            >
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          </div>
        </div>
      </section>

      <button 
        type="submit"
        className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black py-3 rounded-xl hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors"
      >
        SAVE ALL SETTINGS
      </button>
    </form>
  );
}