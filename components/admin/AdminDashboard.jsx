"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, ArrowLeft, Database, Search, Users } from "lucide-react";
import { adminApi } from "@/services/apiClient";
import Header from "@/components/layout/Header";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .stats()
      .then((data) => (data.ok ? setStats(data.stats) : setError(data.message)))
      .catch(() => setError("Unable to load dashboard."));
  }, []);

  if (error) {
    return (
      <>
        <Header />
        <main className="saas-container flex flex-col gap-6 py-8">
          <Link className="inline-flex w-fit items-center gap-2 font-black text-blue-600" href="/"><ArrowLeft size={18} /> Back home</Link>
          <div className="saas-card grid min-h-80 place-items-center rounded-[2rem] p-6 text-center font-black text-red-600">{error}</div>
        </main>
      </>
    );
  }

  if (!stats) return (
    <>
      <Header />
      <main className="saas-container flex flex-col gap-6 py-8"><div className="saas-card grid min-h-80 place-items-center rounded-[2rem] p-6 text-center">Loading dashboard...</div></main>
    </>
  );

  const apiUsage = Object.entries(stats.apiUsage || {}).map(([provider, count]) => ({ provider, count }));

  return (
    <>
      <Header />
      <main className="saas-container flex flex-col gap-6 py-8">
        <Link className="inline-flex w-fit items-center gap-2 font-black text-blue-600" href="/">
          <ArrowLeft size={18} /> Back to search
        </Link>
        <section className="saas-card rounded-[2rem] p-7">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700 dark:text-blue-200">Admin dashboard</p>
          <h1 className="mt-2 text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-none text-slate-950 dark:text-white">Search analytics dashboard</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">Monitor usage, provider activity, cache behavior, and user engagement from one clean control surface.</p>
        </section>
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Users} label="Total users" value={stats.totalUsers} />
          <Metric icon={Search} label="Total searches" value={stats.totalSearches} />
          <Metric icon={Activity} label="Active users" value={stats.activeUsers} />
          <Metric icon={Database} label="Cache entries" value={stats.cache?.entries || 0} />
        </section>
        <section className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="API usage" data={apiUsage} dataKey="count" xKey="provider" />
          <ChartCard title="Popular keywords" data={stats.popularKeywords || []} dataKey="count" xKey="keyword" />
        </section>
        <section className="saas-card rounded-[2rem] p-6">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Platform health</h2>
          <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
            Search activity, provider usage, cache behavior, and active users are tracked here for admins.
          </p>
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

function ChartCard({ title, data, dataKey, xKey }) {
  return (
    <div className="saas-card rounded-3xl p-6">
      <h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey={xKey} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey={dataKey} fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
