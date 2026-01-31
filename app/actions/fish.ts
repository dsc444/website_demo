"use server";
import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { DATA_DIR, DB_PATH, IMAGE_DIR } from "./config";

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
    const data = await readDbFile();
    if (!data.prices) data.prices = {};

    // FIX: Maintain the object structure so we don't lose the image path
    if (data.prices[fishName] && typeof data.prices[fishName] === "object") {
      data.prices[fishName] = {
        ...data.prices[fishName],
        price: newPrice,
      };
    } else {
      // Fallback for old data or new entries
      data.prices[fishName] = { price: newPrice, image: "" };
    }

    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) { 
    console.error("Price Update Failed:", error); 
    return { success: false, error: "Failed to write to disk" };
  }
}

export async function addNewFish(formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File; // The PNG from the form

  try {
    // 1. Ensure directories exist
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(IMAGE_DIR, { recursive: true });

    // 2. Handle the Image Upload
    let imagePath = "";
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a clean filename (e.g., "Gold Fish" -> "gold-fish.png")
      const fileName = `${name.toLowerCase().replace(/\s+/g, "-")}.png`;
      const filePath = path.join(IMAGE_DIR, fileName);
      
      await fs.writeFile(filePath, buffer);
      imagePath = `/images/${fileName}`; // The URL path for your <img> tags
    }

    // 3. Update the JSON Database
    const data = await readDbFile();
    if (!data.prices) data.prices = {};
    
    // Store price AND the new image path
    data.prices[name] = {
      price: price,
      image: imagePath
    };

    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Add Fish Failed:", error);
    return { success: false, error: "Could not add fish or upload image" };
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
    return { success: true };
  } catch (error) { 
    console.error("Delete Failed:", error); 
    return { success: false, error: "Could not remove fish" };
  }
}