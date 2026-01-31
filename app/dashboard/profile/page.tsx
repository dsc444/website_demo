import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
// 1. Import your centralized path
import { DB_PATH } from "@/app/actions/config"; 
import NoteForm from "./NoteForm";
import MarketTable from "./components/MarketTable";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CustomerDashboard() {
  const session = await auth0.getSession();
  const user = session?.user;

  let myNote = "";
  let livePrices: Record<string, string> = {};

  // 2. Implementation of Safe Read
  try {
    const fileContent = await fs.readFile(DB_PATH, "utf-8");
    // Ensure we don't JSON.parse an empty string
    const data = fileContent.trim() ? JSON.parse(fileContent) : {};

    if (user?.sub) {
      // User notes are stored directly by sub ID
      myNote = typeof data[user.sub] === 'string' ? data[user.sub] : "";
    }
    
    // Fallback to empty object if prices key is missing
    livePrices = data.prices || {};
    
  } catch (e) {
    console.error("📋 Dashboard Info: Data folder or db.json not initialized yet.");
    // No crash here—just proceeds with empty variables
  }

  return (
    <div className="space-y-8 p-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif text-zinc-900 dark:text-white">
          Why hello there <span className="italic">{user?.given_name || "Partner"}</span>
        </h1>
        <p className="text-zinc-500 text-sm tracking-wide uppercase">
          Care to purchase our wears?? — {new Date().toLocaleDateString()}
        </p>
      </section>

      <MarketTable livePrices={livePrices} />

      <div className="p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 max-w-2xl">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight mb-2">
          If you write something here only you will be able to see it.
        </h3>
        <NoteForm initialNote={myNote} />
      </div>
    </div>
  );
}