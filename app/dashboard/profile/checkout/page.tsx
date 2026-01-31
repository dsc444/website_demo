"use client";
import { useState } from "react";
import { useBasket } from "../BasketContext";
import Link from "next/link";
import StripeWrapper from "./StripeWrapper";

export default function CheckoutPage() {
  const { basket } = useBasket();
  const [paymentMethod, setPaymentMethod] = useState("card");

  // 1. Form State tracking
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    houseNo: "",
    street: "",
    city: "",
    county: "",
    eircode: "",
    email: ""
  });

  // 2. Validation Check: Ensure all keys have a non-empty value
  const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const shippingFee = 6.00;
  const subtotal = basket.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal > 0 ? subtotal + shippingFee : 0;

  if (basket.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-zinc-500 italic">Your basket is empty.</p>
        <Link href="/dashboard/profile" className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-bold">
          Go to Market
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-start">
        <Link href="/dashboard/profile/basket" className="text-sm font-bold text-zinc-500 hover:text-emerald-500 flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          BACK TO BASKET
        </Link>
      </div>

      <h1 className="text-4xl font-black italic tracking-tighter dark:text-white uppercase">Checkout (just put 4242424242424242 for card)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: Address Details */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 dark:text-white text-zinc-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs">1</span>
              Delivery Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">First Name *</label>
                <input name="firstName" value={formData.firstName} onChange={handleInputChange} required className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Surname *</label>
                <input name="surname" value={formData.surname} onChange={handleInputChange} required className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">House No. *</label>
                <input name="houseNo" value={formData.houseNo} onChange={handleInputChange} required className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" />
              </div>
              <div className="flex flex-col gap-1.5 col-span-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Street Details *</label>
                <input name="street" value={formData.street} onChange={handleInputChange} required className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Town/City *</label>
                <input name="city" value={formData.city} onChange={handleInputChange} required className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">County *</label>
                <select name="county" value={formData.county} onChange={handleInputChange} required className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white appearance-none">
                  <option value="">Select County</option>
                  <option value="antrim">Antrim</option>
                  <option value="armagh">Armagh</option>
                  <option value="carlow">Carlow</option>
                  <option value="cavan">Cavan</option>
                  <option value="clare">Clare</option>
                  <option value="cork">Cork</option>
                  <option value="derry">Derry</option>
                  <option value="donegal">Donegal</option>
                  <option value="down">Down</option>
                  <option value="dublin">Dublin</option>
                  <option value="fermanagh">Fermanagh</option>
                  <option value="galway">Galway</option>
                  <option value="kerry">Kerry</option>
                  <option value="kildare">Kildare</option>
                  <option value="kilkenny">Kilkenny</option>
                  <option value="laois">Laois</option>
                  <option value="leitrim">Leitrim</option>
                  <option value="limerick">Limerick</option>
                  <option value="longford">Longford</option>
                  <option value="louth">Louth</option>
                  <option value="mayo">Mayo</option>
                  <option value="meath">Meath</option>
                  <option value="monaghan">Monaghan</option>
                  <option value="offaly">Offaly</option>
                  <option value="roscommon">Roscommon</option>
                  <option value="sligo">Sligo</option>
                  <option value="tipperary">Tipperary</option>
                  <option value="tyrone">Tyrone</option>
                  <option value="waterford">Waterford</option>
                  <option value="westmeath">Westmeath</option>
                  <option value="wexford">Wexford</option>
                  <option value="wicklow">Wicklow</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Eircode *</label>
                <input name="eircode" value={formData.eircode} onChange={handleInputChange} required placeholder="D01 X123" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Email ()</label>
                <input className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" />
              </div>
            </div>
          </section>

          {/* Section 2: Payment Options - Now Locked based on isFormValid */}
          <section className={`space-y-6 transition-all duration-500 ${!isFormValid ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 dark:text-white text-zinc-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs">2</span>
              Payment Method
            </h2>

            {/* Lock Indicator */}
            {!isFormValid && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <p className="text-[10px] font-black uppercase tracking-widest">Complete address to unlock payment</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label 
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-emerald-500' : 'border-zinc-300'}`}>
                  {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm dark:text-white">Credit / Debit Card</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Secure via Stripe</span>
                </div>
              </label>

              <label 
                onClick={() => setPaymentMethod("invoice")}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'invoice' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'invoice' ? 'border-emerald-500' : 'border-zinc-300'}`}>
                  {paymentMethod === 'invoice' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm dark:text-white">Pay on Invoice</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">14-Day Net Terms</span>
                </div>
              </label>
            </div>

            <div className="mt-8 transition-all duration-500">
              {paymentMethod === "card" ? (
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
                   <StripeWrapper total={total} basket={basket} formData={formData}/>
                </div>
              ) : (
                <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/20 text-center space-y-4">
                  <p className="text-zinc-500 text-sm max-w-md mx-auto italic">
                    By clicking complete, your order will be placed immediately and an invoice will be generated and sent to your billing email.
                  </p>
                  <button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-xl hover:scale-[1.01] transition-transform cursor-pointer">
                    COMPLETE INVOICE ORDER
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Your Order</h3>
            
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {basket.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold dark:text-white">{item.name}</span>
                    <span className="text-xs text-zinc-500">{item.quantity}kg @ ${item.price.toFixed(2)}</span>
                  </div>
                  <span className="font-mono font-bold dark:text-zinc-300">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="dark:text-white font-mono font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipping</span>
                <span className="dark:text-white font-mono font-bold">${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4">
                <span className="text-lg font-black dark:text-white uppercase tracking-tighter">Total</span>
                <span className="text-3xl font-black text-emerald-500 font-mono italic">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {paymentMethod === 'card' && isFormValid && (
              <p className="text-[9px] text-center text-zinc-400 uppercase font-black leading-tight">
                Complete payment via the secure<br/>Stripe field on the left<br/>GIVE ME MONEY!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}