import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <section className="saas-card grid min-h-80 max-w-xl place-items-center rounded-[2rem] p-6 text-center">
        <h1 className="text-3xl font-black">Page not found</h1>
        <p className="leading-7 text-slate-600 dark:text-slate-300">The page you requested does not exist or is not available in this workspace.</p>
        <Link className="saas-button" href="/">
          Back home
        </Link>
      </section>
    </main>
  );
}
