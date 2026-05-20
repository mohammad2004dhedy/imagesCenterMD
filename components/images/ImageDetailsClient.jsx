"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Heart } from "lucide-react";
import Header from "@/components/layout/Header";
import { useToast } from "@/components/ui/Toast";
import { favoritesApi } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";

export default function ImageDetailsClient() {
  const params = useSearchParams();
  const toast = useToast();
  const { user } = useAuth();
  const image = {
    title: params.get("title") || "Image detail",
    imageUrl: params.get("imageUrl") || "/images/special1.jpg",
    provider: params.get("provider") || "source",
    externalId: params.get("externalId") || params.get("imageUrl") || "",
    author: params.get("author") || "",
    pageUrl: params.get("pageUrl") || ""
  };
  const fromFavorites = params.get("from") === "favorites";

  async function save() {
    const data = await favoritesApi.save({
      provider: image.provider,
      externalId: image.externalId,
      title: image.title,
      imageUrl: image.imageUrl,
      thumbUrl: image.imageUrl,
      pageUrl: image.pageUrl,
      author: image.author
    });
    toast?.push(data.ok ? (data.alreadyExists ? "Already in favorites." : "Saved to favorites.") : data.message, data.ok ? "success" : "error");
  }

  return (
    <>
      <Header user={user} />
      <main className="saas-container flex flex-col gap-6 py-8">
        <Link className="inline-flex w-fit items-center gap-2 font-black text-blue-600" href="/search">
          <ArrowLeft size={18} /> Back to search
        </Link>
        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="saas-card relative min-h-[520px] overflow-hidden rounded-[2rem] bg-slate-950">
            <Image src={image.imageUrl} alt={image.title} fill className="object-contain" sizes="100vw" priority />
          </div>
          <aside className="saas-card h-fit rounded-[2rem] p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700 dark:text-blue-200">{image.provider}</p>
            <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{image.title}</h1>
            {image.author && <p className="mt-2 text-slate-600 dark:text-slate-300">Created by {image.author}</p>}
            <div className="mt-6 grid gap-3">
              {!fromFavorites && (
                <button onClick={save} className="saas-button">
                  <Heart size={18} /> Save favorite
                </button>
              )}
              <a href={image.imageUrl} download className="saas-button-secondary">
                <Download size={18} /> Download
              </a>
              {image.pageUrl && (
                <a href={image.pageUrl} target="_blank" rel="noreferrer" className="saas-button-secondary">
                  <ExternalLink size={18} /> Open source
                </a>
              )}
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
