"use client";

import { Search, SlidersHorizontal } from "lucide-react";

const categories = [
  { value: "all", label: "All sources" },
  { value: "pexels", label: "Pexels" },
  { value: "unsplash", label: "Unsplash" },
  { value: "pixabay", label: "Pixabay" },
  { value: "illustration", label: "Illustration" },
  { value: "vector", label: "Vector" },
  { value: "dark", label: "Dark images" }
];

const optionClassName = "bg-white text-slate-950 dark:bg-slate-900 dark:text-white";

export default function SearchPanel({ query, setQuery, category, setCategory, count, setCount, onSubmit, loading, disabled }) {
  return (
    <form onSubmit={onSubmit} className={`saas-card sticky top-20 z-20 w-full rounded-[1.75rem] p-4 ${disabled ? "opacity-80" : ""}`}>
      {disabled && <div className="mb-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 dark:border-white/10 dark:bg-white/10 dark:text-blue-200">Login or create an account to start searching.</div>}
      <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_190px_150px_auto]">
        <label className="relative block">
          <span className="sr-only">Search images</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
          <input
            className="h-[52px] w-full rounded-2xl border border-slate-200 bg-white/80 pl-12 pr-4 text-slate-950 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:ring-blue-500/20"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search mountains, cities, vectors, products..."
            disabled={disabled}
          />
        </label>
        <label className="relative block">
          <span className="sr-only">Image category</span>
          <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
          <select
            className="h-[52px] w-full rounded-2xl border border-slate-200 bg-white/80 pl-12 pr-4 text-slate-950 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:ring-blue-500/20"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={disabled}
          >
            {categories.map((item) => (
              <option className={optionClassName} key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <select
          className="h-[52px] w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-slate-950 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:ring-blue-500/20"
          value={count}
          onChange={(event) => setCount(event.target.value)}
          aria-label="Number of results"
          disabled={disabled}
        >
          {[6, 9, 12, 18, 24, 30].map((value) => (
            <option className={optionClassName} key={value} value={value}>
              {value} images
            </option>
          ))}
        </select>
        <button className="saas-button h-[52px] px-7 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || disabled}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
