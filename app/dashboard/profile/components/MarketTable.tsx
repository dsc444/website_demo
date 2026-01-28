"use client";
import { useBasket } from "../BasketContext";

export default function MarketTable({ livePrices }: { livePrices: Record<string, string> }) {
  const { addToBasket } = useBasket();
  const fishNames = Object.keys(livePrices);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">Product</th>
            <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 text-center">Current Price</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {fishNames.length > 0 ? (
            fishNames.map((fishName) => (
              <tr key={fishName} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{fishName}</td>
                <td className="px-6 py-4 font-mono text-blue-600 dark:text-emerald-400 text-center text-lg">
                  ${parseFloat(livePrices[fishName]).toFixed(2)}
                  <span className="text-[10px] text-zinc-400 ml-1">/kg</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => addToBasket({
                      id: fishName, 
                      name: fishName, 
                      price: parseFloat(livePrices[fishName]) 
                    })}
                    className="text-xs font-black px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-all active:scale-95"
                  >
                    Quick Order
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-zinc-500 italic">No market data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}