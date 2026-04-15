"use client";

import { useTheme } from "@/context/theme-provider";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 rounded-lg border bg-gray-200 text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 transition"
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
