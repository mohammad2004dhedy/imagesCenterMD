"use client";

import Link from "next/link";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { ArrowLeft, Clock3, Search, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { historyApi } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";

export default function HistoryClient() {
  const toast = useToast();
  const [history, setHistory] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;

    historyApi.list().then((data) => {
      if (!active) return;
      setHistory(data.history || []);
    });

    return () => {
      active = false;
    };
  }, []);

  async function remove(id) {
    const result = await Swal.fire({
      title: "Delete history entry?",
      text: "This search will be removed from your account history.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-2xl bg-blue-600 px-5 py-3 font-black text-white",
        cancelButton: "ml-3 rounded-2xl border-2 border-blue-100 bg-white px-5 py-3 font-black text-blue-600"
      }
    });
    if (!result.isConfirmed) return;
    await historyApi.delete(id);
    setHistory((items) => items.filter((item) => item.id !== id));
    toast?.push("History entry deleted.", "success");
  }

  return (
    <>
      <Header user={user} />
      <main className="saas-container flex flex-col gap-6 py-8">
        <Link className="inline-flex w-fit items-center gap-2 font-black text-blue-600" href="/dashboard">
          <ArrowLeft size={18} /> Dashboard
        </Link>

        <section className="saas-card rounded-[2rem] p-7">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700 dark:text-blue-200">Search archive</p>
          <h1 className="mt-2 text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-none text-slate-950 dark:text-white">Search history</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">Re-run previous searches or remove entries from your account timeline.</p>
        </section>

        {history.length ? (
          <section className="saas-card rounded-[2rem] p-6">
            <div className="grid gap-3">
              {history.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-blue-50 dark:bg-white/10 dark:hover:bg-white/15">
                  <div>
                    <h2 className="text-base font-black text-slate-950 dark:text-white">{item.keyword}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                      {item.provider || "brokered"} · {item.resultCount || 0} results · {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/search?q=${encodeURIComponent(item.keyword)}`} className="saas-button min-h-11 px-4">
                      <Search size={16} /> Search
                    </Link>
                    <button onClick={() => remove(item.id)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border-2 border-red-100 bg-white px-4 font-black text-red-600 transition hover:-translate-y-0.5 dark:border-red-500/20 dark:bg-white/10">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="saas-card grid min-h-80 place-items-center rounded-[2rem] p-6 text-center">
            <Clock3 size={36} />
            <h2 className="text-xl font-black text-blue-600 dark:text-blue-200">No history yet</h2>
            <p className="max-w-md leading-7 text-slate-600 dark:text-slate-300">Your searches will be saved here.</p>
            <Link className="saas-button" href="/search">
              Start searching
            </Link>
          </section>
        )}
      </main>
    </>
  );
}
