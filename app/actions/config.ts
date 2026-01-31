import path from "path";
import Stripe from "stripe";
import { Resend } from 'resend';

// PATHS - All inside /data for persistence
export const DATA_DIR = path.join(process.cwd(), "data");
export const DB_PATH = path.join(DATA_DIR, "db.json");
export const ORDERS_PATH = path.join(DATA_DIR, "orders.json");
export const SETTINGS_PATH = path.join(DATA_DIR, "settings.json");
export const COOKIES_PATH = path.join(DATA_DIR, "cookies.json");

// STRIPE
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-12-15.acacia" as any,
  typescript: true,
});

// RESEND
export const resend = new Resend(process.env.RESEND_API_KEY);