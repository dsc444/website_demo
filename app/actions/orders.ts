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
  console.log("Searching for Session ID:", sessionId); // This will show in Docker logs
  
  try {
    const fileData = await fs.readFile(ORDERS_PATH, "utf-8");
    const orders = JSON.parse(fileData);

    // Look for the order where the sessionId matches
    // NOTE: Ensure your 'createOrder' action actually saves 'sessionId' into the JSON!
    const order = orders.find((o: any) => o.sessionId === sessionId);

    if (!order) {
      console.error("Order not found in JSON for session:", sessionId);
      return { success: false };
    }

    // ONLY RUNS IF ORDER IS FOUND
    const adminEmail = process.env.ADMIN_EMAIL;

    await resend.emails.send({
      from: 'Orders <orders@darraghcollins.xyz>',
      to: [order.address.email, adminEmail!], // Sending to both at once
      subject: 'Order Confirmed! 🚀',
      html: `<h1>Thanks ${order.address.firstName}!</h1><p>Order Total: €${order.total}</p>`
    });

    console.log("Email sent successfully via Resend");
    return { success: true };
  } catch (error) {
    console.error("Email Action Failed:", error);
    return { success: false };
  }
}