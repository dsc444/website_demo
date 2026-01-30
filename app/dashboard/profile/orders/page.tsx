import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import path from "path";
import OrdersListClient from "./OrdersListClient";

export default async function MyOrders() {
  const session = await auth0.getSession();
  const user = session?.user;

  let userOrders = [];

  try {
    const dbPath = path.join(process.cwd(), "orders.json");
    const fileContent = await fs.readFile(dbPath, "utf-8");
    const data = JSON.parse(fileContent);

    // Filter orders by user ID
    if (user?.sub && data.orders) {
      userOrders = data.orders.filter((order: any) => order.userId === user.sub);
    }
  } catch (e) {
    console.log("Error loading orders:", e);
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Order History
        </h1>
        <div className="h-1 w-20 bg-emerald-500 rounded-full" />
      </header>

      {/* Passing data to the client component for the interactive bits */}
      <OrdersListClient initialOrders={userOrders} />
    </div>
  );
}