"use server";
import fs from "fs/promises";
import { DATA_DIR, stripe, resend, ORDERS_PATH } from "./config";
import { auth0 } from "@/app/lib/auth0";

// Helper to handle empty files or missing files safely
async function readOrdersFile() {
  try {
    const content = await fs.readFile(ORDERS_PATH, "utf-8");
    return content.trim() ? JSON.parse(content) : { orders: [] };
  } catch {
    return { orders: [] };
  }
}

export async function createPaymentIntent(amount: number) {
  try {
    // Ensure data directory exists early
    await fs.mkdir(DATA_DIR, { recursive: true });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });
    return { clientSecret: paymentIntent.client_secret as string };
  } catch (error) { 
    console.error("Stripe Intent Error:", error);
    throw new Error("Stripe Error"); 
  }
}

export async function createOrder(orderData: any) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Use the safe reader
    const data = await readOrdersFile();

    const newOrder = {
      id: `ORD-${Math.random().toString(36).toUpperCase().substring(2, 7)}`,
      userId: session.user.sub,
      timestamp: new Date().toISOString(),
      status: "Pending confirmation",
      ...orderData,
    };

    if (!data.orders) data.orders = [];
    data.orders.unshift(newOrder);

    await fs.writeFile(ORDERS_PATH, JSON.stringify(data, null, 2));
    return { success: true, orderId: newOrder.id };
  } catch (error) { 
    console.error("Order Creation Error:", error);
    return { success: false }; 
  }
}

export async function handleOrderSuccess(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { 
        expand: ['line_items', 'customer_details'] 
    });
    
    const items = session.line_items?.data.map(i => i.description).join(", ");
    
    await resend.emails.send({
      from: 'Orders <orders@darraghcollins.xyz>',
      to: session.customer_details?.email!,
      subject: 'Order Confirmed! 🚀',
      html: `<h1>Thanks!</h1><p>Items: ${items}</p>`
    });

    return { success: true };
  } catch (error) {
    console.error("Post-Order Email Error:", error);
    return { success: false, error: "Failed to send confirmation" };
  }
}