"use client";

import { useState } from "react";
// 1. Ensure this points to your barrel export in actions/index.ts
import { saveUserNote } from "@/app/actions";

export default function NoteForm({ initialNote }: { initialNote: string }) {
  const [note, setNote] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      await saveUserNote(formData);
      // Optional: You could add a "Saved!" toast here
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to save note. Please check if the server data folder is writable.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3">
      <textarea
        name="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Remember to ask about the fresh Halibut..."
        className="w-full min-h-[100px] rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
      />
      <button
        type="submit"
        disabled={isSaving}
        className="self-end rounded-lg bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-hover hover:bg-zinc-800 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Private Note"}
      </button>
    </form>
  );
}