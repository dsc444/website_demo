"use client";
import { useState } from "react";
import { updateFishPrice } from "@/app/actions";

export default function FishEditor({ name, initialPrice }: { name: string, initialPrice: string }) {
  const [price, setPrice] = useState(parseFloat(initialPrice));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateFishPrice(name, price.toFixed(2));
    setIsSaving(false);
  };

  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-white">{name}</h2>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">Current: ${price.toFixed(2)} /kg</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-zinc-800 rounded-lg p-1 border border-zinc-700">
          <button 
            onClick={() => setPrice(p => Math.max(0, p - 0.1))}
            className="px-3 py-1 hover:bg-zinc-700 rounded text-xl"
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
            className="px-3 py-1 hover:bg-zinc-700 rounded text-xl"
          >
            +
          </button>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
        >
          {isSaving ? "Updating..." : "Enter Price Change"}
        </button>
      </div>
    </div>
  );
}