"use client";
import { useState } from "react";
import { addNewFish } from "@/app/actions";

export default function AddFishForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("10.00");

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Fish Name</label>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Swordfish"
          className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Starting Price</label>
        <input 
          type="number"
          step="0.1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-white w-24 focus:outline-none"
        />
      </div>
      <button 
        onClick={async () => {
          if(!name) return;
          await addNewFish(name, price);
          setName("");
        }}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors"
      >
        Add to Market
      </button>
    </div>
  );
}