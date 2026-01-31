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

export async function handleOrderSuccess(orderId: string) {
  try {
    // 1. Get order data from your local JSON database on Hetzner
    const fileData = await fs.readFile(ORDERS_PATH, "utf-8");
    const orders = JSON.parse(fileData);
    const order = orders.find((o: any) => o.id === orderId);

    if (!order) throw new Error("Order not found");

    // 2. Grab Admin Email from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      console.warn("ADMIN_EMAIL is not defined in .env!");
    }

    // 3. Send to Customer
    await resend.emails.send({
      from: 'Orders <orders@darraghcollins.xyz>',
      to: order.address.email, // Ensure your createOrder action saves the email here!
      subject: 'Order Confirmed! 🚀',
      html: `<h1>Thanks for your order, ${order.address.firstName}!</h1>
             <p>Total: €${order.total.toFixed(2)}</p>`
    });

    // 4. Send to Admin (You)
    if (adminEmail) {
      await resend.emails.send({
        from: 'System <orders@darraghcollins.xyz>',
        to: adminEmail,
        subject: '💰 New Order Received!',
        html: `<p>New order #${order.id} from ${order.address.firstName} ${order.address.surname}</p>
               <p>Amount: €${order.total}</p>
               <p>Email: ${order.address.email}</p>`
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Post-Order Email Error:", error);
    return { success: false };
  }
}