"use client";
import { useBasket } from "../BasketContext";
import Link from "next/link";

export default function BasketPage() {
  // Destructure the new functions from context
  const { basket, updateQuantity, removeFromBasket } = useBasket();
  const shippingFee = 6.00;

  const subtotal = basket.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal > 0 ? subtotal + shippingFee : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex justify-start">
        <Link 
          href="/dashboard/profile" 
          className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-emerald-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          BACK TO MARKET
        </Link>
      </div>

      <h1 className="text-3xl font-black italic tracking-tighter dark:text-white uppercase">Your Basket</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {basket.length > 0 ? (
            basket.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                <div className="flex-1">
                  <p className="font-bold text-lg dark:text-white">{item.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">
                    ${item.price.toFixed(2)} /kg
                  </p>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors text-zinc-600 dark:text-zinc-300 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-sm dark:text-white">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors text-zinc-600 dark:text-zinc-300 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* REMOVE BUTTON */}
                  <button 
                    onClick={() => removeFromBasket(item.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <p className="text-zinc-500 italic">Your basket is currently empty.</p>
            </div>
          )}
        </div>

        {/* Summary Card (Unchanged) */}
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-fit space-y-6">
          <h2 className="font-bold uppercase text-xs tracking-widest text-zinc-400">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Subtotal</span>
              <span className="font-mono dark:text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Shipping Fee</span>
              <span className="font-mono dark:text-white">${shippingFee.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
              <span className="font-bold dark:text-white text-lg">Total</span>
              <span className="font-mono text-2xl font-black text-emerald-500">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
          
          <Link href="/dashboard/profile/checkout" className="block w-full">
            <button 
              disabled={basket.length === 0}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-xl hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-all disabled:opacity-50 cursor-pointer"
            >
              CHECKOUT NOW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}