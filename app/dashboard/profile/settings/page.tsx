import { auth0 } from "@/app/lib/auth0";
import fs from "fs/promises";
import { SETTINGS_PATH } from "@/app/actions/config";
import SettingsForm from "./SettingsForm";

export default async function AccountSettingsPage() {
  const session = await auth0.getSession();
  
  // 2. Safe read from the central DATA_DIR path
  let initialSettings = {
    fullName: "",
    workplace: "",
    address: "",
    emailList: false,
    phoneAlerts: false,
    theme: "dark"
  };

  try {
    const fileData = await fs.readFile(SETTINGS_PATH, "utf-8");
    // Ensure we don't parse empty files created by 'touch'
    const data = fileData.trim() ? JSON.parse(fileData) : {};
    
    if (session?.user?.sub) {
      const userSettings = data[`profile_${session.user.sub}`];
      if (userSettings) {
        initialSettings = userSettings;
      }
    }
  } catch (error) {
    // If file doesn't exist yet, we just use the defaults above
    console.log("No settings.json found yet, using defaults.");
  }

  return (
    <div className="p-8 max-w-2xl">
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}