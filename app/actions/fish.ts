"use server";
import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { DB_PATH } from "./config";

export async function updateFishPrice(fishName: string, newPrice: string) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const fileData = await fs.readFile(DB_PATH, "utf-8").catch(() => "{}");
    const data = JSON.parse(fileData);
    if (!data.prices) data.prices = {};
    data.prices[fishName] = newPrice;
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    revalidatePath("/admin/settings");
    revalidatePath("/");
  } catch (error) { console.error("Price Update Failed:", error); }
}

export async function addNewFish(name: string, price: string) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");
  const fileData = await fs.readFile(DB_PATH, "utf-8").catch(() => "{}");
  const data = JSON.parse(fileData);
  if (!data.prices) data.prices = {};
  if (!data.prices[name]) data.prices[name] = price;
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  revalidatePath("/admin/settings");
}

export async function deleteItem(id: string) {
  try {
    const fileData = await fs.readFile(DB_PATH, "utf-8");
    const data = JSON.parse(fileData);
    if (data?.prices) {
      delete data.prices[id];
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
      revalidatePath("/admin/settings");
    }
  } catch (error) { console.error("Delete Failed:", error); }
}