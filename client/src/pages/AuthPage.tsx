import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, Mail, Shield, UserRound } from "lucide-react";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const [params] = useSearchParams();
  const defaultRole = params.get("role") === "admin" ? "admin" : "user";
  const [role, setRole] = useState<Role>(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = mode === "login"
        ? await login(email, password)
        : await register(name, email, password, role, adminKey);
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-grid">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo /><ThemeToggle />
      </header>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-8 lg:grid-cols-2 lg:py-16">
        <section className="hidden lg:block">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur dark:bg-slate-900/70 dark:text-indigo-300">
            <Shield size={14} /> Modern authentication infrastructure
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-[1.05] tracking-tight xl:text-6xl">
            One secure gateway for your entire app.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Clean authentication, encrypted passwords, JWT sessions and role-based access — wrapped in a polished interface.
          </p>
          <div className="mt-8 space-y-3">
            {["JWT-protected API routes", "bcrypt password hashing", "Admin and user authorization"].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="text-emerald-500" size={19} /> {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass mx-auto w-full max-w-md rounded-3xl p-6 sm:p-8">
          <div className="mb-7">
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{mode === "login" ? "Welcome back" : "Create your account"}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight">{mode === "login" ? "Sign in" : "Get started"}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {mode === "login" ? "Enter your credentials to continue." : "Your secure workspace is a few steps away."}
            </p>
          </div>

          {mode === "register" && (
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              {(["user", "admin"] as Role[]).map(r => (
                <button type="button" key={r} onClick={() => setRole(r)}
                  className={`rounded-lg py-2.5 text-sm font-semibold capitalize transition ${role === r ? "bg-white shadow-sm dark:bg-slate-950" : "text-slate-500"}`}>
                  {r}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Full name</span>
                <div className="relative"><UserRound className="absolute left-3 top-3.5 text-slate-400" size={18} /><input className="input pl-10" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Johnson" required /></div>
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <div className="relative"><Mail className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="email" className="input pl-10" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Password</span>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input type={showPassword ? "text" : "password"} className="input pl-10 pr-11" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required />
                <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-3.5 text-slate-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
              </div>
            </label>

            {mode === "register" && role === "admin" && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Admin registration key</span>
                <div className="relative"><KeyRound className="absolute left-3 top-3.5 text-slate-400" size={18} /><input className="input pl-10" value={adminKey} onChange={e => setAdminKey(e.target.value)} placeholder="Server-provided key" required /></div>
              </label>
            )}

            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div>}

            <button disabled={busy} className="btn-primary w-full">
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"} {!busy && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <Link className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400" to={mode === "login" ? "/register" : "/login"}>
              {mode === "login" ? "Create one" : "Sign in"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
