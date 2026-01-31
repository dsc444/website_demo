"use server";
import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { DB_PATH, SETTINGS_PATH, COOKIES_PATH } from "./config";

export async function saveUserNote(formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) return;
  const data = JSON.parse(await fs.readFile(DB_PATH, "utf-8").catch(() => "{}"));
  data[session.user.sub] = formData.get("note");
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  revalidatePath("/");
}

export async function saveAccountSettings(formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) return;
  const settings = {
    fullName: formData.get("fullName"),
    theme: formData.get("theme"),
    // ... add other fields here
  };
  const data = JSON.parse(await fs.readFile(SETTINGS_PATH, "utf-8").catch(() => "{}"));
  data[`profile_${session.user.sub}`] = settings;
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2));
  revalidatePath("/profile/settings");
}

export async function saveCookieConsent(consentData: any) {
  const data = JSON.parse(await fs.readFile(COOKIES_PATH, "utf-8").catch(() => "[]"));
  data.push({ ...consentData, timestamp: new Date().toISOString() });
  await fs.writeFile(COOKIES_PATH, JSON.stringify(data, null, 2));
  return { success: true };
}