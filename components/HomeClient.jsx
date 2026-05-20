"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import SearchPanel from "@/components/gallery/SearchPanel";
import ImageGrid from "@/components/gallery/ImageGrid";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/components/ui/Toast";
import { motion } from "framer-motion";
import Link from "next/link";
import Swal from "sweetalert2";
import { favoritesApi, searchApi } from "@/services/apiClient";

export default function HomeClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [category, setCategory] = useState("all");
  const [count, setCount] = useState("12");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(9);
  const debouncedQuery = useDebounce(query);

  const visibleResults = useMemo(() => results.slice(0, pageSize), [results, pageSize]);

  useEffect(() => {
    if (!authLoading && !user) {
      Swal.fire({
        title: "Login required",
        text: "Search, history, favorites, and personalized recommendations require an account.",
        icon: "info",
        confirmButtonText: "Login",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
        }
      }).then(() => router.replace("/login?next=/search"));
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    function onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 520) {
        setPageSize((value) => Math.min(value + 6, results.length));
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [results.length]);

  async function runSearch(event) {
    event?.preventDefault();
    if (!user) {
      await Swal.fire({
        title: "Login required",
        text: "Please login or create an account to search images.",
        icon: "warning",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
        }
      });
      router.push("/login?next=/search");
      return;
    }
    if (debouncedQuery.trim().length < 2) {
      toast?.push("Please enter at least two characters.", "error");
      return;
    }
    setLoading(true);
    const data = await searchApi.images({ query: debouncedQuery, category, count });
    setLoading(false);

    if (!data.ok) {
      Swal.fire({
        title: "Search failed",
        text: data.message || "We could not complete that search. Please try again.",
        icon: "error",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
        }
      });
      return;
    }
    setPageSize(9);
    setResults(data.results || []);
    toast?.push(data.cache?.hit ? "Results loaded instantly from cache." : "Results loaded successfully.", "success");
  }

  async function saveFavorite(image) {
    if (!user) {
      Swal.fire({
        title: "Login required",
        text: "Login to save favorites.",
        icon: "warning",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
        }
      });
      return;
    }
    const data = await favoritesApi.save({
      provider: image.provider,
      externalId: image.id,
      title: image.description || image.title,
      imageUrl: image.imageUrl,
      thumbUrl: image.thumbUrl,
      pageUrl: image.pageUrl,
      author: image.author,
      metadata: { width: image.width, height: image.height }
    });
    toast?.push(data.ok ? (data.alreadyExists ? "Already in favorites." : "Saved to favorites.") : data.message, data.ok ? "success" : "error");
  }

  return (
    <>
      <Header user={user} />
      <main className="saas-container flex min-h-[calc(100vh-64px)] flex-col gap-6 py-8">
        <motion.section
          className="saas-card flex items-center justify-between gap-5 rounded-[2rem] p-7 max-md:flex-col max-md:items-start"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700 dark:text-blue-200">imagesCenter</p>
            <h1 className="mt-2 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] font-black leading-tight text-slate-950 dark:text-white">
              Search workspace for premium cloud image discovery.
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              Search Unsplash, Pexels, and Pixabay from one brokered interface, save favorites, and keep database-backed history.
            </p>
            {!user && (
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/login" className="saas-button">Login to search</Link>
                <Link href="/signup" className="saas-button-secondary">Create account</Link>
              </div>
            )}
          </div>
        </motion.section>

        <SearchPanel
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          count={count}
          setCount={setCount}
          loading={loading}
          disabled={!user}
          onSubmit={runSearch}
        />

        <ImageGrid results={visibleResults} loading={loading} onFavorite={saveFavorite} />

        {visibleResults.length < results.length && (
          <button className="saas-button self-center px-6 py-3" onClick={() => setPageSize((value) => value + 6)}>
            Load more
          </button>
        )}
      </main>
    </>
  );
}
