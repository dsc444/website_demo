import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import path from "path";
import NoteForm from "./NoteForm";
import MarketTable from "./components/MarketTable"; // Import the new client component

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CustomerDashboard() {
  const session = await auth0.getSession();
  const user = session?.user;

  let myNote = "";
  let livePrices: Record<string, string> = {};

  try {
    const dbPath = path.join(process.cwd(), "app", "db.json");
    const fileContent = await fs.readFile(dbPath, "utf-8");
    const data = JSON.parse(fileContent);

    if (user?.sub) {
      myNote = typeof data[user.sub] === 'string' ? data[user.sub] : "";
    }
    livePrices = data.prices || {};
  } catch (e) {
    console.log("No db.json found.");
  }

  return (
    <div className="space-y-8 p-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif text-zinc-900 dark:text-white">
          Morning Catch, <span className="italic">{user?.given_name || "Partner"}</span>
        </h1>
        <p className="text-zinc-500 text-sm tracking-wide uppercase">
          Live Market Rates — {new Date().toLocaleDateString()}
        </p>
      </section>

      {/* Use the new Client Component here */}
      <MarketTable livePrices={livePrices} />

      <div className="p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 max-w-2xl">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight mb-2">
          Private Merchant Notes
        </h3>
        <NoteForm initialNote={myNote} />
      </div>
    </div>
  );
}