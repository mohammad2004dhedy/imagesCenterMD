"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Bookmark, Clock3, ImagePlus, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const href = user ? "/search" : "/login?next=/search";

  return (
    <>
      <Header user={user} />
      <main className="overflow-hidden">
        <section className="saas-container grid min-h-[calc(100vh-64px)] items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-black text-blue-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-blue-200">
              <Sparkles size={16} /> AI-powered image discovery
            </span>
            <h1 className="mt-6 text-[clamp(2.75rem,7vw,5.9rem)] font-black leading-[0.94] text-slate-950 dark:text-white">
              Find the right image in seconds.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600 dark:text-slate-300">
              imagesCenter helps you search across trusted image libraries, save favorites, and return to your recent searches whenever inspiration strikes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={href}
                className={`saas-button ${loading ? "pointer-events-none opacity-70" : ""}`}
              >
                {user ? "Start searching" : "Get started"} <ArrowRight size={18} />
              </Link>
              {!user && (
                <Link href="/signup" className="saas-button-secondary">
                  Create account
                </Link>
              )}
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["12k+", "indexed visuals"],
                ["3", "image providers"],
                ["100%", "secure sessions"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/10">
                  <strong className="block text-3xl font-black text-slate-950 dark:text-white">{value}</strong>
                  <span className="mt-1 block text-sm font-bold text-slate-500 dark:text-slate-300">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="saas-card relative overflow-hidden rounded-[2rem] p-4"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <div className="rounded-[1.5rem] saas-gradient p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15"><ImagePlus size={22} /></span>
                  <div>
                    <p className="text-sm font-black">Personal image library</p>
                    <p className="text-xs text-white/75">Search, save, and revisit</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">Pro</span>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  [Search, "Multi-source search", "Explore results from leading image providers"],
                  [Bookmark, "Saved favorites", "Keep your best finds in one place"],
                  [Clock3, "Recent searches", "Pick up where you left off"],
                  [ShieldCheck, "Private account", "Your saved images stay tied to your session"]
                ].map(([Icon, title, text]) => (
                  <div key={title} className="rounded-3xl bg-white/15 p-5 ring-1 ring-white/15">
                    <Icon size={22} />
                    <h3 className="mt-4 font-black">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
