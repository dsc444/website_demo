"use server";
import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { DATA_DIR, DB_PATH } from "./config";

// Shared helper to prevent JSON.parse crashes on empty/missing files
async function readDbFile() {
  try {
    const content = await fs.readFile(DB_PATH, "utf-8");
    return content.trim() ? JSON.parse(content) : { prices: {} };
  } catch {
    return { prices: {} };
  }
}

export async function updateFishPrice(fishName: string, newPrice: string) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await readDbFile();

    if (!data.prices) data.prices = {};
    data.prices[fishName] = newPrice;

    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    revalidatePath("/admin/settings");
    revalidatePath("/");
  } catch (error) { 
    console.error("Price Update Failed:", error); 
  }
}

export async function addNewFish(name: string, price: string) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await readDbFile();

    if (!data.prices) data.prices = {};
    // Only add if it doesn't exist
    if (!data.prices[name]) {
      data.prices[name] = price;
    }

    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    revalidatePath("/admin/settings");
  } catch (error) {
    console.error("Add Fish Failed:", error);
  }
}

export async function deleteItem(id: string) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await readDbFile();

    if (data?.prices && data.prices[id] !== undefined) {
      delete data.prices[id];
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
      revalidatePath("/admin/settings");
    }
  } catch (error) { 
    console.error("Delete Failed:", error); 
  }
}