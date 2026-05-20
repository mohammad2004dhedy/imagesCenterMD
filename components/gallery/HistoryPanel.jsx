"use client";

import { RotateCcw, Trash2 } from "lucide-react";

export default function HistoryPanel({ open, history, onReuse, onClear, onDelete }) {
  return (
    <aside
      className={`saas-card fixed right-4 top-20 z-40 w-[min(92vw,370px)] rounded-[1.75rem] p-5 transition duration-300 max-md:right-0 max-md:top-16 max-md:w-full max-md:rounded-none ${
        open ? "translate-y-0 opacity-100" : "-translate-y-4 pointer-events-none opacity-0"
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-white/10">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">Search history</h2>
        <button className="text-red-600 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30" onClick={onClear} aria-label="Clear history">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="grid max-h-80 gap-2 overflow-y-auto">
        {!history.length && <p className="text-sm font-bold text-blue-600">No saved searches yet.</p>}
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:bg-blue-50 dark:bg-white/10 dark:hover:bg-white/15"
          >
            <button className="text-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30" onClick={() => onReuse(item.keyword)} aria-label="Reuse search">
              <RotateCcw size={16} />
            </button>
            <button className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30" onClick={() => onReuse(item.keyword)}>
              <span className="block truncate text-sm font-extrabold text-slate-950 dark:text-white">{item.keyword}</span>
              <small className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{new Date(item.createdAt).toLocaleString()}</small>
            </button>
            <b className="text-xs text-blue-900 dark:text-blue-200">{item.resultCount}</b>
            <button className="text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30" onClick={() => onDelete(item.id)} aria-label="Delete history item">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
