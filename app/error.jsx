"use client";

import Link from "next/link";

export default function ErrorPage({ reset }) {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <section className="saas-card grid min-h-80 max-w-xl place-items-center rounded-[2rem] p-6 text-center">
        <h1 className="text-3xl font-black">Something went wrong</h1>
        <p className="leading-7 text-slate-600 dark:text-slate-300">MDImages hit a recoverable error. Try again or return to the dashboard.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="saas-button" onClick={() => reset()}>
            Retry
          </button>
          <Link className="saas-button-secondary" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
