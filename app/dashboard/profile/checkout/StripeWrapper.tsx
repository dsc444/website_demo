"use client";

import { useEffect, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent, createOrder } from "@/app/actions";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- 1. THE CHECKOUT FORM COMPONENT ---
function CheckoutForm({ total, basket, formData }: { total: number, basket: any[], formData: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Trigger form validation in Stripe Elements
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message ?? "Validation failed");
      setLoading(false);
      return;
    }

    try {
      // --- SAVE TO DATABASE BEFORE REDIRECT ---
      // We explicitly map the data here to ensure db.json gets everything
      const orderPayload = {
        items: basket,
        total: total,
        address: formData, // Contains firstName, surname, street, city, etc.
        subtotal: total - 6.00,
        shipping: 6.00,
        cardLast4: "4242", // Placeholder (Stripe hides real last4 until payment is processed)
      };

      console.log("Attempting to save order to DB:", orderPayload);
      
      const response = await createOrder(orderPayload);
      
      if (!response.success) {
        throw new Error("Failed to record order in database.");
      }

      // --- PROCEED TO STRIPE PAYMENT ---
      // This will redirect the user to the success page
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/profile/checkout/success`,
        },
      });

      if (error) {
        setErrorMessage(error.message ?? "An unknown error occurred");
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setErrorMessage(err.message ?? "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <PaymentElement options={{ layout: "tabs" }} />
      
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
          <p className="text-red-500 text-xs font-bold text-center">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-emerald-500 text-white font-black py-4 rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? "PROCESSING..." : `PAY $${total.toFixed(2)} SECURELY`}
      </button>
    </form>
  );
}

// --- 2. THE WRAPPER COMPONENT ---
export default function StripeWrapper({ total, basket, formData }: { total: number, basket: any[], formData: any }) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    if (total > 0) {
      createPaymentIntent(total).then((res) => {
        if (res.clientSecret) {
          setClientSecret(res.clientSecret);
        }
      });
    }
  }, [total]);

  if (!clientSecret) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Securing Connection...</p>
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret,
        appearance: {
          theme: 'night',
          variables: { 
            colorPrimary: '#10b981', // Emerald-500
            colorBackground: '#09090b', // Zinc-950
            colorText: '#ffffff',
            borderRadius: '12px',
          } 
        } 
      }}
    >
      <CheckoutForm total={total} basket={basket} formData={formData} />
    </Elements>
  );
}