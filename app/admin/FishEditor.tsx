"use client";

import { useState } from "react";
// 1. Point to your centralized actions
import { updateFishPrice } from "@/app/actions";

export default function FishEditor({ 
  name, 
  initialPrice 
}: { 
  name: string, 
  initialPrice: any // We'll handle the type extraction inside
}) {
  
  // 2. Extract the price value safely
  const getInitialValue = () => {
    if (typeof initialPrice === "object" && initialPrice !== null) {
      return parseFloat(initialPrice.price) || 0;
    }
    return parseFloat(initialPrice) || 0;
  };

  const [price, setPrice] = useState(getInitialValue());
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Sync state if initialPrice changes (important for Next.js revalidation)
  useEffect(() => {
    setPrice(getInitialValue());
  }, [initialPrice]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 3. updateFishPrice now receives the string "1.10"
      // Our server action logic already handles merging this with the image path!
      const result = await updateFishPrice(name, price.toFixed(2));
      
      if (result.success) {
        setLastSaved(new Date().toLocaleTimeString());
      } else {
        throw new Error("Server rejected the price update.");
      }
    } catch (err) {
      console.error("Fish Update Failed:", err);
      alert("Error: Could not update price.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-white">{name}</h2>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">
          {lastSaved ? `Updated at ${lastSaved}` : `Current: $${price.toFixed(2)} /kg`}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-zinc-800 rounded-lg p-1 border border-zinc-700">
          <button 
            onClick={() => setPrice(p => Math.max(0, p - 0.1))}
            className="px-3 py-1 hover:bg-zinc-700 rounded text-xl text-zinc-400"
          >
            -
          </button>
          <input 
            type="number" 
            value={price.toFixed(2)}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            step="0.1"
            className="bg-transparent w-20 text-center font-mono text-emerald-400 focus:outline-none"
          />
          <button 
            onClick={() => setPrice(p => p + 0.1)}
            className="px-3 py-1 hover:bg-zinc-700 rounded text-xl text-zinc-400"
          >
            +
          </button>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
        >
          {isSaving ? "Updating..." : "Update Market Price"}
        </button>
      </div>
    </div>
  );
}