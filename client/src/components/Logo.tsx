import { ShieldCheck } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
        <ShieldCheck size={23} strokeWidth={2.2} />
      </div>
      <div>
        <div className="font-bold tracking-tight">AuthFlow</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Secure by design</div>
      </div>
    </div>
  );
}
