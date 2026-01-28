"use client";
import { useState } from "react";

export default function OrdersListClient({ initialOrders }: { initialOrders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  if (initialOrders.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-zinc-800 rounded-3xl">
        <p className="text-zinc-500 italic">No orders found. Start shopping to fill this up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialOrders.map((order) => (
        <button
          key={order.id}
          onClick={() => setSelectedOrder(order)}
          className="w-full flex flex-col md:flex-row md:items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-emerald-500 transition-all group text-left shadow-lg"
        >
          <div className="flex items-center gap-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{order.id}</span>
              <p className="font-bold text-white text-lg">
                {new Date(order.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </p>
            </div>
            <div className="hidden md:block h-10 w-[1px] bg-zinc-800" />
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase">Amount</p>
              <p className="text-xl font-black text-white font-mono italic">${order.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-zinc-500 uppercase">Status</p>
              <p className="text-xs font-bold text-zinc-300 uppercase">{order.status}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 group-hover:bg-emerald-500 transition-colors">
              <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </button>
      ))}

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-zinc-800 p-8 md:p-12 space-y-10 relative shadow-2xl">
            
            <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            {/* Header */}
            <div className="space-y-2">
               <h2 className="text-4xl font-black italic uppercase text-white leading-none">{selectedOrder.id}</h2>
               <p className="text-zinc-500 font-medium">Placed on {new Date(selectedOrder.timestamp).toLocaleString()}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-zinc-800/50">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Delivery Address</h4>
                <div className="text-sm text-zinc-300 leading-relaxed font-medium">
                  {selectedOrder.address.firstName} {selectedOrder.address.surname}<br/>
                  {selectedOrder.address.houseNo} {selectedOrder.address.street}<br/>
                  {selectedOrder.address.city}, {selectedOrder.address.county}<br/>
                  <span className="text-white font-bold">{selectedOrder.address.eircode}</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Payment Info</h4>
                <div className="flex items-center gap-3 bg-zinc-900 p-4 rounded-2xl">
                   <div className="w-8 h-5 bg-zinc-800 rounded sm" />
                   <p className="text-sm text-zinc-300 font-mono">**** **** **** {selectedOrder.cardLast4}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Order Summary</h4>
              {selectedOrder.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-zinc-300 font-bold">{item.name} <span className="text-zinc-600 px-2">x{item.quantity}</span></span>
                  <span className="font-mono text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-zinc-900 space-y-2">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Shipping</span>
                  <span>$6.00</span>
                </div>
                <div className="flex justify-between text-2xl font-black italic uppercase text-white">
                  <span>Total</span>
                  <span className="text-emerald-500">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* TRACKER */}
            <div className="pt-6">
               <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-10 text-center">Order Status</h4>
               <OrderTracker currentStatus={selectedOrder.status} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderTracker({ currentStatus }: { currentStatus: string }) {
  const steps = ["Pending confirmation", "In progress", "Out for delivery", "Delivered"];
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="relative flex justify-between">
      {/* Background Line */}
      <div className="absolute top-3 left-0 w-full h-[2px] bg-zinc-800 -z-10" />
      {/* Active Line */}
      <div 
        className="absolute top-3 left-0 h-[2px] bg-emerald-500 transition-all duration-1000 -z-10" 
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      />
      
      {steps.map((step, idx) => (
        <div key={step} className="flex flex-col items-center gap-4">
          <div className={`w-6 h-6 rounded-full border-4 transition-all duration-500 ${
            idx <= currentIndex ? 'bg-emerald-500 border-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-zinc-900 border-zinc-800 shadow-none'
          }`} />
          <span className={`text-[9px] font-black uppercase tracking-tighter text-center max-w-[70px] leading-tight transition-colors ${
            idx <= currentIndex ? 'text-white' : 'text-zinc-600'
          }`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}