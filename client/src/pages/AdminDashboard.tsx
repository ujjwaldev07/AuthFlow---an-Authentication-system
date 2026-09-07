import { ShieldAlert, LogOut, Users, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function signOut() { await logout(); navigate("/login", { replace: true }); }

  return (
    <main className="min-h-screen bg-grid">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <div className="flex items-center gap-2"><ThemeToggle/><button onClick={signOut} className="btn border bg-white dark:bg-slate-900"><LogOut size={17}/> Logout</button></div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="glass rounded-3xl p-7 sm:p-10">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-500 text-white"><ShieldAlert size={27}/></div>
            <div><div className="text-sm font-semibold text-amber-600">Admin area</div><h1 className="text-3xl font-black">Control center</h1></div>
          </div>
          <p className="mt-5 max-w-2xl text-slate-500 dark:text-slate-400">Hello {user?.name}. This route requires the <b>admin</b> role on the server, not just the frontend.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border p-5"><Users size={21}/><div className="mt-4 font-bold">User management</div><p className="mt-1 text-sm text-slate-500">Ready for your next module.</p></div>
            <div className="rounded-2xl border p-5"><LockKeyhole size={21}/><div className="mt-4 font-bold">Access control</div><p className="mt-1 text-sm text-slate-500">JWT + role middleware enabled.</p></div>
            <div className="rounded-2xl border p-5"><ShieldAlert size={21}/><div className="mt-4 font-bold">Protected API</div><p className="mt-1 text-sm text-slate-500">Admin endpoint is server protected.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}
