"use server";
import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { DATA_DIR, DB_PATH, SETTINGS_PATH, COOKIES_PATH } from "./config";

// Helper to handle empty files or missing files safely
async function readJsonFile(filePath: string, fallback: string = "{}") {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    // If the file exists but is empty, return the fallback
    return content.trim() ? JSON.parse(content) : JSON.parse(fallback);
  } catch {
    // If the file doesn't exist, return the fallback
    return JSON.parse(fallback);
  }
}

export async function saveUserNote(formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) return;

  await fs.mkdir(DATA_DIR, { recursive: true });
  const data = await readJsonFile(DB_PATH);
  
  data[session.user.sub] = formData.get("note");
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  revalidatePath("/");
}

export async function saveAccountSettings(formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) return;

  const settings = {
    fullName: formData.get("fullName"),
    workplace: formData.get("workplace"),
    address: formData.get("address"),
    emailList: formData.get("emailList") === "on",
    phoneAlerts: formData.get("phoneAlerts") === "on",
    theme: formData.get("theme"),
  };

  await fs.mkdir(DATA_DIR, { recursive: true });
  const data = await readJsonFile(SETTINGS_PATH);
  
  data[`profile_${session.user.sub}`] = settings;
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2));
  revalidatePath("/profile/settings");
}

export async function saveCookieConsent(consentData: any) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    // Note: fallback for cookies is an array "[]"
    const data = await readJsonFile(COOKIES_PATH, "[]");
    
    data.push({ ...consentData, timestamp: new Date().toISOString() });
    await fs.writeFile(COOKIES_PATH, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error("Cookie Save Error:", error);
    return { success: false };
  }
}