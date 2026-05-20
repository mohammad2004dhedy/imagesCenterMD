"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, Eye, Heart, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ImageGrid({ results, loading, onFavorite }) {
  const [preview, setPreview] = useState(null);

  if (loading) return <SkeletonGrid />;

  if (!results.length) {
    return (
      <section className="grid min-h-[360px] w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 max-sm:grid-cols-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="saas-card aspect-square min-h-[250px] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-800 dark:to-slate-700"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          />
        ))}
      </section>
    );
  }

  return (
    <>
      <section className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 max-sm:grid-cols-1">
        {results.map((image, index) => (
          <motion.article
            key={`${image.provider}-${image.id}`}
            className="saas-card group overflow-hidden rounded-[1.75rem] transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/10"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.035, 0.22) }}
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={image.thumbUrl || image.imageUrl}
                alt={image.title || "Image search result"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                priority={index < 3}
              />
              <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-end justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent p-3 pt-14 transition duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0">
                <button
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-blue-600 transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
                  onClick={() => onFavorite(image)}
                  aria-label="Save favorite"
                >
                  <Heart size={18} />
                </button>
                <div className="flex gap-2">
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-blue-600 transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30" onClick={() => setPreview(image)} aria-label="Preview image">
                    <Eye size={18} />
                  </button>
                  <a className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-blue-600 transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30" href={image.downloadUrl || image.imageUrl} download aria-label="Download image">
                    <Download size={18} />
                  </a>
                  <a className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-blue-600 transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30" href={image.pageUrl || image.imageUrl} target="_blank" rel="noreferrer" aria-label="Open source page">
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex min-h-20 items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <h3 className="line-clamp-2 font-extrabold leading-5 text-slate-950 dark:text-white">{image.description || image.title || "Image result"}</h3>
                <p className="mt-1 text-xs font-black uppercase tracking-wider text-blue-600">{image.provider}</p>
              </div>
              <Link
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 transition hover:bg-blue-100 dark:bg-white/10 dark:text-blue-200"
                href={`/images/${encodeURIComponent(`${image.provider}-${image.id}`)}?title=${encodeURIComponent(image.description || image.title || "Image")}&imageUrl=${encodeURIComponent(image.imageUrl)}&provider=${encodeURIComponent(image.provider)}&externalId=${encodeURIComponent(image.id)}&author=${encodeURIComponent(image.author || "")}&pageUrl=${encodeURIComponent(image.pageUrl || "")}`}
              >
                Details
              </Link>
            </div>
          </motion.article>
        ))}
      </section>
      {preview && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/80 p-4 backdrop-blur" role="dialog" aria-modal="true">
          <div className="w-[min(100%,980px)] overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-white/10">
              <div>
                <h2 className="font-black text-slate-950 dark:text-white">{preview.title}</h2>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-600">{preview.provider} {preview.author ? `by ${preview.author}` : ""}</p>
              </div>
              <button className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30" onClick={() => setPreview(null)} aria-label="Close preview">
                <X size={20} />
              </button>
            </div>
            <div className="relative h-[min(70vh,680px)] bg-slate-950">
              <Image src={preview.imageUrl} alt={preview.title || "Image preview"} fill className="object-contain" sizes="100vw" />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 p-4">
              <button className="inline-flex min-h-11 items-center justify-center rounded-2xl border-2 border-blue-100 bg-white px-5 font-black text-blue-600 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10" onClick={() => onFavorite(preview)}>Save favorite</button>
              <a className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5" href={preview.downloadUrl || preview.imageUrl} download>Download</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SkeletonGrid() {
  return (
    <section className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 max-sm:grid-cols-1">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="saas-card aspect-square overflow-hidden rounded-[1.75rem]">
          <div className="relative h-full bg-brand-100/70 dark:bg-white/10">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent animate-[shimmer_1.2s_infinite]" />
          </div>
        </div>
      ))}
    </section>
  );
}
