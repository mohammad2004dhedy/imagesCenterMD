import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Unauthorized | MDImages"
};

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <section className="saas-card grid max-w-xl place-items-center gap-4 rounded-[2rem] p-8 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-200">
          <ShieldAlert size={30} />
        </span>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Unauthorized</h1>
        <p className="max-w-md leading-7 text-slate-600 dark:text-slate-300">
          This area is available to admin users only.
        </p>
        <Link href="/dashboard" className="saas-button">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
