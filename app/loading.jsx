import { ImagePlus } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <section className="saas-card grid w-full max-w-sm place-items-center gap-5 rounded-[2rem] p-8 text-center">
        <span className="relative grid h-16 w-16 place-items-center rounded-3xl saas-gradient text-white shadow-xl shadow-blue-600/20">
          <ImagePlus size={28} />
          <span className="absolute inset-0 animate-ping rounded-3xl bg-blue-500/20" />
        </span>
        <div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white">Loading workspace</h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-300">Preparing your visual dashboard.</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full w-1/2 animate-[loading-slide_1.1s_ease-in-out_infinite] rounded-full saas-gradient" />
        </div>
      </section>
    </main>
  );
}
