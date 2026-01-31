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
    return { clientSecret: paymentIntent.client_secret as string};
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

export async function handleOrderSuccess() {
  // 1. Identify who is logged in
  const session = await auth0.getSession();
  if (!session?.user) {
    console.error("Unauthorized: No session found on success page");
    return { success: false };
  }

  const userId = session.user.sub;
  console.log("Searching for latest order for User:", userId);
  
  try {
    const data = await readOrdersFile();
    const orders = data.orders || []; 

    // 2. Find the LATEST order for this user (since unshift adds to front, it's orders[0])
    const userOrder = orders.find((o: any) => o.userId === userId);

    if (!userOrder) {
      console.error("No order found in JSON for this user");
      return { success: false };
    }

    const itemsHtml = userOrder.items.map((item: any) => `
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #27272a; color: #d4d4d8; font-size: 14px;">
        <span style="font-weight: bold;">${item.name} <span style="color: #52525b;">x${item.quantity}</span></span>
        <span style="font-family: monospace; color: #ffffff;">€${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    // 3. Send the email
    const customerEmail = userOrder.address.email;
    const adminEmail = process.env.ADMIN_EMAIL;

    await resend.emails.send({
      from: 'Orders <orders@orders.darraghcollins.xyz>',
      to: customerEmail,
      subject: 'Order Confirmed! 🚀',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="background-color: #09090b; font-family: sans-serif; padding: 40px 20px; color: #ffffff;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 40px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
              
              <div style="width: 80px; height: 80px; background-color: #10b981; border-radius: 100px; margin: 0 auto 30px auto; display: table; text-align: center;">
                <span style="display: table-cell; vertical-align: middle; font-size: 40px;">✅</span>
              </div>

              <h1 style="text-align: center; font-size: 48px; font-weight: 900; font-style: italic; text-transform: uppercase; margin: 0; line-height: 1;">
                Payment <br/> <span style="color: #10b981;">Confirmed</span>
              </h1>
              <p style="text-align: center; font-size: 10px; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 2px; margin-top: 20px;">
                Order ID: ${userOrder.id}
              </p>

              <div style="margin: 40px 0; padding: 20px 0; border-top: 1px solid #27272a; border-bottom: 1px solid #27272a;">
                <h4 style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #10b981; letter-spacing: 1px; margin-bottom: 10px;">Delivery Address</h4>
                <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0;">
                  ${userOrder.address.firstName} ${userOrder.address.surname}<br/>
                  ${userOrder.address.houseNo} ${userOrder.address.street}<br/>
                  ${userOrder.address.city}, ${userOrder.address.county}<br/>
                  <strong>${userOrder.address.eircode}</strong>
                </p>
              </div>

              <div style="margin-bottom: 30px;">
                <h4 style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #52525b; letter-spacing: 1px; margin-bottom: 15px;">Order Summary</h4>
                ${itemsHtml}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                <span style="font-size: 24px; font-weight: 900; font-style: italic; text-transform: uppercase;">Total</span>
                <span style="font-size: 24px; font-weight: 900; font-style: italic; color: #10b981;">€${userOrder.total.toFixed(2)}</span>
              </div>

              <div style="text-align: center; margin-top: 50px;">
                <a href="https://darraghcollins.xyz/dashboard/profile/orders" style="background-color: #ffffff; color: #000000; padding: 15px 40px; border-radius: 15px; text-decoration: none; font-weight: 900; font-size: 14px; display: inline-block;">
                  VIEW ORDER STATUS
                </a>
              </div>

            </div>
          </body>
        </html>
      `
    });

    await resend.emails.send({
      from: 'Orders <orders@orders.darraghcollins.xyz>',
      to: adminEmail ? [adminEmail] : [customerEmail],
      subject: 'Order Confirmed! 🚀',
      html: `<h1>Order Confirmed!</h1><p>Thanks ${userOrder.address.firstName}, your order ${userOrder.id} is being processed.</p>`
    });

    console.log("Email sent to:", customerEmail);
    return { success: true };
  } catch (error) {
    console.error("Email Action Failed:", error);
    return { success: false };
  }
}