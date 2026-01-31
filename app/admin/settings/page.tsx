import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
//import path from "path";
import FishEditor from "../FishEditor";
import AddFishForm from "./AddFishForm";
import { DB_PATH } from "@/app/actions/config"; 
import { deleteItem } from "@/app/actions"; // Ensure this matches your export name

export default async function AdminSettings() {
  //const dbPath = path.join(process.cwd(), "db.json");
  //const fileData = await fs.readFile(dbPath, "utf-8").catch(() => "{}");\
  const fileData = await fs.readFile(DB_PATH, "utf-8").catch(() => "{}");
  const data = JSON.parse(fileData);
  const savedPrices = data.prices || {};

  // Combine hardcoded defaults with any new ones from the JSON
  const baseFish = ["base"];
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
            <div key={fish} className="relative group">
              <FishEditor 
                name={fish} 
                initialPrice={savedPrices[fish] || "10.00"} 
              />
              
              {/* Only allow deletion if the fish exists in the JSON data */}
              {savedPrices[fish] && (
                <form 
                  action={async () => {
                    "use server";
                    await deleteItem(fish);
                  }}
                  className="absolute top-4 right-4"
                >
                  <button 
                    type="submit"
                    className="bg-zinc-800 hover:bg-red-600 text-zinc-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold border border-zinc-700 hover:border-red-500 transition-all"
                  >
                    DELETE &gt;
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}