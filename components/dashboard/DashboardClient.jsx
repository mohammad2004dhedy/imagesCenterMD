"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import { Activity, ArrowRight, Clock3, Heart, ImagePlus, Search, Settings, Sparkles } from "lucide-react";
import { favoritesApi, historyApi } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardClient() {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([historyApi.list(), favoritesApi.list()]).then(([historyData, favoriteData]) => {
      setHistory(historyData.history || []);
      setFavorites(favoriteData.favorites || []);
    });
  }, []);

  const popular = useMemo(() => history.slice(0, 5), [history]);

  return (
    <>
      <Header user={user} />
      <main className="saas-container flex flex-col gap-6 py-8">
        <section className="saas-card overflow-hidden rounded-[2rem] p-7">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700 dark:text-blue-200">Personal dashboard</p>
          <h1 className="mt-3 max-w-4xl text-[clamp(2.2rem,5vw,4.4rem)] font-black leading-none text-slate-950 dark:text-white">{user?.name ? `${user.name}'s image command center` : "Your image command center"}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">Saved images, search history, activity, settings, and recommendations stay connected to your account.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="saas-button" href="/search"><Search size={18} /> Search images</Link>
            <Link className="saas-button-secondary" href="/favorites"><Heart size={18} /> Favorites</Link>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Metric icon={ImagePlus} label="Saved images" value={favorites.length} />
          <Metric icon={Clock3} label="History entries" value={history.length} />
          <Metric icon={Activity} label="Recent activity" value={history.slice(0, 7).length} />
          <Metric icon={Sparkles} label="Recommendations" value={popular.length} />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Panel title="Recent searches" href="/history">
            {popular.length ? popular.map((item) => (
              <Link key={item.id} href={`/search?q=${encodeURIComponent(item.keyword)}`} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-blue-50 dark:bg-white/10 dark:text-slate-100">
                <span>{item.keyword}</span>
                <ArrowRight size={18} />
              </Link>
            )) : <Empty text="Searches will appear after your first protected query." />}
          </Panel>
          <Panel title="Account settings" href="/dashboard">
            <div className="rounded-3xl bg-slate-50 p-5 dark:bg-white/10">
              <Settings className="text-blue-600" />
              <h3 className="mt-4 font-black text-slate-950 dark:text-white">Secure SaaS account</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Secure session cookies protect personalized features. PostgreSQL stores users, history, favorites, reports, and analytics.</p>
            </div>
          </Panel>
        </section>
      </main>
    </>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="saas-card rounded-3xl p-5">
      <span className="grid h-12 w-12 place-items-center rounded-2xl saas-gradient text-white"><Icon size={22} /></span>
      <p className="mt-4 text-sm font-extrabold text-slate-500 dark:text-slate-300">{label}</p>
      <strong className="mt-1 block text-3xl font-black text-slate-950 dark:text-white">{value}</strong>
    </div>
  );
}

function Panel({ title, href, children }) {
  return (
    <section className="saas-card rounded-3xl p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2>
        <Link href={href} className="font-black text-blue-600">View</Link>
      </div>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function Empty({ text }) {
  return <p className="rounded-2xl border border-dashed border-blue-200 p-5 text-slate-500 dark:border-white/10 dark:text-slate-300">{text}</p>;
}
