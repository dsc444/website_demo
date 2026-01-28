import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import path from "path";
import FishEditor from "../FishEditor";
import AddFishForm from "./AddFishForm"; // We will create this next

export default async function AdminSettings() {
  const dbPath = path.join(process.cwd(), "app", "db.json");
  const fileData = await fs.readFile(dbPath, "utf-8").catch(() => "{}");
  const data = JSON.parse(fileData);
  const savedPrices = data.prices || {};

  // Combine hardcoded defaults with any new ones from the JSON
  const baseFish = ["Halibut", "Salmon", "Cod", "Turbot"];
  const dbFish = Object.keys(savedPrices);
  const fullFishList = Array.from(new Set([...baseFish, ...dbFish]));

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Market Price Control</h1>
          <a href="/auth/logout" className="bg-zinc-800 hover:bg-red-900/40 text-zinc-400 hover:text-red-400 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-zinc-700">
            LOGOUT
          </a>
        </div>

        {/* NEW: Add Fish Section */}
        <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-white">Add New Fish Type</h2>
          <AddFishForm />
        </div>

        <div className="grid gap-4">
          {fullFishList.map((fish) => (
            <FishEditor 
              key={fish} 
              name={fish} 
              initialPrice={savedPrices[fish] || "10.00"} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}