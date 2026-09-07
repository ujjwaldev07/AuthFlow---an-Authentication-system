import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button aria-label="Toggle theme" onClick={() => setDark(v => !v)}
      className="rounded-xl border bg-white p-2.5 text-slate-600 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
