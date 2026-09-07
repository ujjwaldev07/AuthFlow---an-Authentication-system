import { LogOut, ShieldCheck, UserRound, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function signOut() { await logout(); navigate("/login", { replace: true }); }

  return (
    <main className="min-h-screen bg-grid">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <div className="flex items-center gap-2"><ThemeToggle /><button onClick={signOut} className="btn border bg-white dark:bg-slate-900"><LogOut size={17}/> Logout</button></div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="glass overflow-hidden rounded-3xl p-7 sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600"><ShieldCheck size={14}/> Authenticated</div>
              <h1 className="text-4xl font-black tracking-tight">Welcome, {user?.name}.</h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Your protected user dashboard is ready.</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"><UserRound size={28}/></div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[["Account", user?.email ?? ""], ["Role", user?.role ?? ""], ["Session", "JWT protected"]].map(([label, value]) => (
              <div key={label} className="rounded-2xl border bg-white/60 p-5 dark:bg-slate-950/50">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</div>
                <div className="mt-2 font-semibold capitalize">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed p-5 text-sm text-slate-500">
            <Settings2 size={19}/> This page is protected by the backend JWT middleware.
          </div>
        </div>
      </section>
    </main>
  );
}
