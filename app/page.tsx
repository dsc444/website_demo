import Image from "next/image";
import { auth0 } from "@/app/lib/auth0";
import { redirect } from "next/navigation";

export default async function GuestHome() {
  const session = await auth0.getSession();

  // 1. If session exists, determine the correct landing spot
  if (session && session.user) {
    const user = session.user;
    
    // Log for server-side debugging (visible in PM2 logs)
    console.log("Session detected for user:", user.email);

    // Replace the URL below with the exact namespace used in your Auth0 Action
    const roles = (user["https://fin-and-fillet.com/roles"] as string[]) || [];
    
    console.log("DEBUG: Your roles are:", roles);

    if (roles.includes("Admin")) {
      return redirect("/admin/settings"); // Use return to stop execution
    } else {
      return redirect("/dashboard/profile"); 
    }
  }

  // 2. If no session, show the Public Landing Page
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start border-x border-zinc-100 dark:border-zinc-900">
        
        <div className="flex w-full justify-between items-center">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Fin & Fillet Logo"
            width={100}
            height={20}
            priority
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 border border-zinc-200 px-2 py-1 rounded">
            Guest Access
          </span>
        </div>

        <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <div className="space-y-2">
            <h1 className="text-4xl font-light tracking-tight text-black dark:text-zinc-50">
              Fin & <span className="font-serif italic text-blue-600">Fillet</span>
            </h1>
            <p className="text-sm uppercase tracking-widest text-zinc-500">Premium Seafood Wholesalers</p>
          </div>
          
          <p className="max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Our daily catch is sourced directly from sustainable North Atlantic fisheries. 
            <span className="block mt-4 font-medium text-black dark:text-white">
              Login to view today's market rates and place wholesale orders.
            </span>
          </p>

          <div className="w-full space-y-3 opacity-50 grayscale select-none">
            <div className="flex justify-between border-b pb-2">
              <span>Wild King Salmon</span>
              <span className="blur-sm">$XX.XX / lb</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Hokkaido Scallops</span>
              <span className="blur-sm">$XX.XX / lb</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm font-medium sm:flex-row w-full mt-12">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 md:w-[200px]"
            href="/auth/login"
          >
            Customer Login
          </a>
          
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-200 px-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 md:w-[158px]"
            href="https://nextjs.org/docs"
          >
            Inquiry
          </a>
        </div>

        <footer className="mt-16 text-xs text-zinc-400">
          © 2026 Fin & Fillet Market. Licensed for Wholesale Only.
        </footer>
      </main>
    </div>
  );
}