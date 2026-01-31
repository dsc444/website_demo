"use server";
import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { Resend } from 'resend';

const dbPath = path.join(process.cwd(), "db.json");
const ordersPath = path.join(process.cwd(), "orders.json");
const settingsPath = path.join(process.cwd(), "settings.json");
const tempstripe = process.env.STRIPE_SECRET_KEY;
const resend = new Resend(process.env.RESEND_API_KEY);

if (!tempstripe) {
  console.warn("⚠️ STRIPE_SECRET_KEY is missing from env variables.");
}

const stripe = new Stripe(tempstripe || "", {
  apiVersion: "2023-10-16" as any, // Use the latest stable or your preferred version
});

// SAVE PRIVATE MERCHANT NOTE
export async function saveUserNote(formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.sub;
  const note = formData.get("note") as string;

  try {
    const fileData = await fs.readFile(dbPath, "utf-8").catch(() => "{}");
    const data = JSON.parse(fileData);

    data[userId] = note;

    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
    revalidatePath("/");
  } catch (error) {
    console.error("FAILED TO WRITE NOTE:", error);
  }
}

// UPDATE INDIVIDUAL FISH PRICE
export async function updateFishPrice(fishName: string, newPrice: string) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const fileData = await fs.readFile(dbPath, "utf-8").catch(() => "{}");
    const data = JSON.parse(fileData);

    if (!data.prices) data.prices = {};
    data.prices[fishName] = newPrice;

    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
    
    revalidatePath("/admin/settings");
    revalidatePath("/");
  } catch (error) {
    console.error("FAILED TO UPDATE PRICE:", error);
  }
}

export async function addNewFish(name: string, price: string) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const fileData = await fs.readFile(dbPath, "utf-8").catch(() => "{}");
  const data = JSON.parse(fileData);

  if (!data.prices) data.prices = {};
  
  // Only add if it doesn't exist to avoid accidental overwrites
  if (!data.prices[name]) {
    data.prices[name] = price;
  }

  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  revalidatePath("/admin/settings");
}

export async function saveAccountSettings(formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.sub;
  const settings = {
    fullName: formData.get("fullName"),
    workplace: formData.get("workplace"),
    address: formData.get("address"),
    emailList: formData.get("emailList") === "on",
    phoneAlerts: formData.get("phoneAlerts") === "on",
    theme: formData.get("theme"),
  };

  const fileData = await fs.readFile(settingsPath, "utf-8").catch(() => "{}");
  const data = JSON.parse(fileData);

  // Save specific user profile settings
  data[`profile_${userId}`] = settings;

  await fs.writeFile(settingsPath, JSON.stringify(data, null, 2), "utf-8");
  revalidatePath("/profile/settings");
}

export async function createPaymentIntent(amount: number) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured on the server.");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });

    return { clientSecret: paymentIntent.client_secret as string };
  } catch (error) {
    console.error("Stripe Error:", error);
    throw new Error("Could not create payment session.");
  }
}

export async function saveOrder(orderData: any) {
  const fileData = await fs.readFile(ordersPath, "utf-8");
  const db = JSON.parse(fileData);

  const newOrder = {
    id: `ORD-${Math.random().toString(36).toUpperCase().substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: "Pending confirmation", // Initial status
    ...orderData
  };

  db.orders = [newOrder, ...(db.orders || [])];
  await fs.writeFile(ordersPath, JSON.stringify(db, null, 2));
  return newOrder;
}

export async function createOrder(orderData: any) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user?.sub) throw new Error("Unauthorized");

  try {
    const fileContent = await fs.readFile(ordersPath, "utf-8");
    const data = JSON.parse(fileContent);

    // Create the new order object
    const newOrder = {
      id: `ORD-${Math.random().toString(36).toUpperCase().substring(2, 7)}`,
      userId: user.sub,
      timestamp: new Date().toISOString(),
      status: "Pending confirmation",
      ...orderData,
    };

    // Initialize orders array if it doesn't exist
    if (!data.orders) data.orders = [];
    
    // Add new order to the start of the list
    data.orders.unshift(newOrder);

    await fs.writeFile(ordersPath, JSON.stringify(data, null, 2));
    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error("Failed to save order:", error);
    return { success: false };
  }
}

export async function deleteItem(id: string) {
const dbPath = path.join(process.cwd(), "db.json");
  
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const data = JSON.parse(fileData);

    // FIX: Check if prices exists before trying to modify it
    if (data && data.prices) {
      delete data.prices[id];
      
      await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
      revalidatePath("/admin");
    } else {
      console.error("DEBUG: 'prices' object not found in db.json");
    }
  } catch (error) {
    console.error("Failed to delete fish:", error);
  }
}

export async function handleOrderSuccess(sessionId: string) {
  if (!sessionId) return;

  try {
    // 1. Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details'],
    });

    const customerEmail = session.customer_details?.email;
    const address = session.customer_details?.address;
    const items = session.line_items?.data.map(item => item.description).join(", ");

    // 2. Email to Customer
    await resend.emails.send({
      from: 'Orders <orders@darraghcollins.xyz>',
      to: customerEmail!,
      subject: 'Order Confirmed! 🚀',
      html: `<h1>Thanks for your order!</h1><p>We are preparing your: ${items}</p>`
    });

    // 3. Email to Admin
    await resend.emails.send({
      from: 'System <system@darraghcollins.xyz>',
      to: 'your-admin-email@gmail.com', // <--- CHANGE THIS
      subject: `NEW ORDER: ${session.id}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Customer:</strong> ${customerEmail}</p>
        <p><strong>Items:</strong> ${items}</p>
        <p><strong>Address:</strong> ${JSON.stringify(address)}</p>
        <p><strong>Stripe Ref:</strong> ${session.id}</p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Email processing error:", error);
    return { error: "Failed to process emails" };
  }
}

export async function saveCookieConsent(consentData: any) {
  try {
    const filePath = path.join(process.cwd(), 'cookies.json');
    
    // 1. Read existing data or start with empty array
    let currentData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (e) {
      currentData = [];
    }

    // 2. Add new consent entry with a timestamp
    const newEntry = {
      ...consentData,
      timestamp: new Date().toISOString(),
    };
    currentData.push(newEntry);

    // 3. Save back to the server
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
    return { success: true };
  } catch (error) {
    console.error("Failed to save cookie consent:", error);
    return { success: false };
  }
}