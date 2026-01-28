import { auth0 } from "@/app/lib/auth0";
import { redirect } from "next/navigation";
import Sidebar from "./profile/components/Sidebar"; 
import { BasketProvider } from "./profile/BasketContext"; // Import the context
import BasketIcon from "./profile/components/BasketIcon"; // Import the icon

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { user } = session;
     //<Sidebar user={user}/>
  return (
    <BasketProvider>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        <Sidebar  /> 

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-8 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center gap-4">
               <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                 Fin & Fillet Wholesaler
               </span>
               {/* THE BASKET ICON GOES HERE */}
               <BasketIcon />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">{user.name}</p>
                <p className="text-[10px] text-zinc-500">{user.email}</p>
              </div>
              <img 
                src={user.picture} 
                alt="User" 
                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800" 
              />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950">
            {children}
          </main>
        </div>
      </div>
    </BasketProvider>
  );
}