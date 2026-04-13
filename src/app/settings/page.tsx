"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [smartCategorization, setSmartCategorization] = useState(true);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <span>Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

        <div className="flex justify-between items-center">
          <span>Smart Categorization</span>
          <input
            type="checkbox"
            checked={smartCategorization}
            onChange={() =>
              setSmartCategorization(!smartCategorization)
            }
          />
        </div>
      </div>
    </main>
  );
}
