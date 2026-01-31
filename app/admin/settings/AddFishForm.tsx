"use client";

import { useState } from "react";
// 1. Centralized action import
import { addNewFish } from "@/app/actions";

export default function AddFishForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("10.00");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    if (!name || isPending) return;

    setIsPending(true);
    try {
      // 2. Call the server action
      const result = await addNewFish(name, price);
      
      if (result.success) {
        setName("");
        setPrice("10.00");
        // Optional: Trigger a success notification here
      } else {
        alert(result.error || "Failed to add fish.");
      }
    } catch (err) {
      console.error("Critical Error adding fish:", err);
      alert("Check server logs—permissions or path mismatch.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-end bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Fish Name</label>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Swordfish"
          disabled={isPending}
          className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Starting Price</label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">$</span>
          <input 
            type="number"
            step="0.1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isPending}
            className="bg-zinc-950 border border-zinc-800 p-2 pl-6 rounded-lg text-white w-28 focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>
      <button 
        onClick={handleSubmit}
        disabled={isPending || !name}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
      >
        {isPending ? "Adding..." : "Add to Market"}
      </button>
    </div>
  );
}