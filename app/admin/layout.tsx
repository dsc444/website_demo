import { auth0 } from "@/app/lib/auth0";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();
  
  // 1. Check if they are even logged in
  if (!session) {
    redirect("/auth/login");
  }

  const user = session.user;

  // 2. Role Check
  // Note: Adjust the key below to match your Auth0 Action namespace
  const roles = user["https://fin-and-fillet.com/roles"] as string[] || [];
  const isAdmin = roles.includes("Admin");

  if (!isAdmin) {
    // If they aren't an admin, send them to the customer profile instead
    redirect("/dashboard/profile");
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <nav className="bg-red-600 text-white p-4 flex justify-between">
        <span className="font-bold uppercase tracking-tighter">Admin Command Center</span>
        <span className="text-xs">Security Level: High</span>
      </nav>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}