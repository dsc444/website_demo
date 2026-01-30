import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import path from "path";
import SettingsForm from "./SettingsForm"; // We'll create this next

export default async function AccountSettingsPage() {
  const session = await auth0.getSession();
  const dbPath = path.join(process.cwd(), "db.json");
  const fileData = await fs.readFile(dbPath, "utf-8").catch(() => "{}");
  const data = JSON.parse(fileData);
  
  // Get existing settings or default to empty
  const initialSettings = data[`profile_${session?.user.sub}`] || {
    fullName: "",
    workplace: "",
    address: "",
    emailList: false,
    phoneAlerts: false,
    theme: "dark"
  };

  return (
    <div className="p-8 max-w-2xl">
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}