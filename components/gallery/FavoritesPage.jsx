"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Heart } from "lucide-react";
import Header from "@/components/layout/Header";
import { favoritesApi } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    favoritesApi
      .list()
      .then((data) => setFavorites(data.favorites || []));
  }, []);

  return (
    <>
      <Header user={user} />
      <main className="saas-container flex flex-col gap-6 py-8">
        <Link className="inline-flex w-fit items-center gap-2 font-black text-blue-600" href="/">
          <ArrowLeft size={18} /> Back home
        </Link>
        <section className="saas-card rounded-[2rem] p-7">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700 dark:text-blue-200">Saved collection</p>
          <h1 className="mt-2 text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-none text-slate-950 dark:text-white">Favorite images</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">Your saved images appear here after you add them from the search gallery.</p>
        </section>
        {favorites.length ? (
          <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
            {favorites.map((item) => (
              <article
                key={`${item.provider}-${item.externalId}`}
                className="saas-card group flex h-[380px] flex-col overflow-hidden rounded-[1.5rem] transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/10"
              >
                <Link
                  href={`/images/${encodeURIComponent(`${item.provider}-${item.externalId}`)}?title=${encodeURIComponent(item.title || "Image")}&imageUrl=${encodeURIComponent(item.imageUrl)}&provider=${encodeURIComponent(item.provider)}&externalId=${encodeURIComponent(item.externalId)}&author=${encodeURIComponent(item.author || "")}&pageUrl=${encodeURIComponent(item.pageUrl || "")}&from=favorites`}
                  className="relative block h-[230px] shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800"
                >
                  <Image
                    src={item.thumbUrl || item.imageUrl}
                    alt={item.title || "Favorite image"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h2 className="line-clamp-2 text-sm font-black leading-5 text-slate-950 dark:text-white">
                      {item.title || "Untitled image"}
                    </h2>
                    <p className="mt-1 line-clamp-1 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-200">
                      {item.provider}{item.author ? ` by ${item.author}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3">
                    <Link
                      className="min-w-0 flex-1 rounded-full bg-blue-50 px-3 py-2 text-center text-xs font-black text-blue-700 transition hover:bg-blue-100 dark:bg-white/10 dark:text-blue-200"
                      href={`/images/${encodeURIComponent(`${item.provider}-${item.externalId}`)}?title=${encodeURIComponent(item.title || "Image")}&imageUrl=${encodeURIComponent(item.imageUrl)}&provider=${encodeURIComponent(item.provider)}&externalId=${encodeURIComponent(item.externalId)}&author=${encodeURIComponent(item.author || "")}&pageUrl=${encodeURIComponent(item.pageUrl || "")}&from=favorites`}
                    >
                      Details
                    </Link>
                    <a
                      className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
                      href={item.pageUrl || item.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open source page"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="saas-card grid min-h-80 place-items-center rounded-[2rem] p-6 text-center">
            <Heart size={34} />
            <h2 className="text-xl font-black text-blue-600 dark:text-blue-200">No favorites yet</h2>
            <p className="max-w-md leading-7 text-slate-600 dark:text-slate-300">Search for images and use the heart button to build your collection.</p>
            <Link className="saas-button" href="/search">Start searching</Link>
          </section>
        )}
      </main>
    </>
  );
}
