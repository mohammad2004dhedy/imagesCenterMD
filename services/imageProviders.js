import { env } from "@/lib/env";

export async function searchUnsplash({ query, count }) {
  if (!env.unsplashAccessKey) return [];
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(count));
  url.searchParams.set("content_filter", "high");
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${env.unsplashAccessKey}` },
    next: { revalidate: 900 }
  });
  if (!res.ok) throw new Error("Unsplash request failed");
  const data = await res.json();
  return data.results.map((photo) => ({
    id: photo.id,
    provider: "unsplash",
    title: photo.alt_description || query,
    description: photo.description || photo.alt_description || "Unsplash photo",
    imageUrl: photo.urls.regular,
    thumbUrl: photo.urls.small,
    pageUrl: photo.links.html,
    downloadUrl: photo.links.download,
    author: photo.user?.name,
    width: photo.width,
    height: photo.height
  }));
}

export async function searchPexels({ query, count }) {
  if (!env.pexelsApiKey) return [];
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(count));
  url.searchParams.set("orientation", "landscape");
  const res = await fetch(url, {
    headers: { Authorization: env.pexelsApiKey },
    next: { revalidate: 900 }
  });
  if (!res.ok) throw new Error("Pexels request failed");
  const data = await res.json();
  return data.photos.map((photo) => ({
    id: String(photo.id),
    provider: "pexels",
    title: photo.alt || query,
    description: photo.alt || "Pexels photo",
    imageUrl: photo.src.large2x || photo.src.large,
    thumbUrl: photo.src.medium,
    pageUrl: photo.url,
    downloadUrl: photo.src.original,
    author: photo.photographer,
    width: photo.width,
    height: photo.height
  }));
}

export async function searchPixabay({ query, count, category }) {
  if (!env.pixabayApiKey) return [];
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", env.pixabayApiKey);
  url.searchParams.set("q", query);
  url.searchParams.set("per_page", String(count));
  url.searchParams.set("safesearch", "true");
  if (category === "illustration" || category === "vector") {
    url.searchParams.set("image_type", category);
  } else if (category === "dark") {
    url.searchParams.set("colors", "black");
  } else {
    url.searchParams.set("image_type", "photo");
  }
  const res = await fetch(url, { next: { revalidate: 900 } });
  if (!res.ok) throw new Error("Pixabay request failed");
  const data = await res.json();
  return data.hits.map((photo) => ({
    id: String(photo.id),
    provider: "pixabay",
    title: query,
    description: `${category === "vector" ? "Vector" : category === "illustration" ? "Illustration" : "Photo"} by ${photo.user || "Pixabay creator"}`,
    imageUrl: photo.largeImageURL,
    thumbUrl: photo.webformatURL,
    pageUrl: photo.pageURL,
    downloadUrl: photo.largeImageURL,
    author: photo.user,
    width: photo.imageWidth,
    height: photo.imageHeight
  }));
}
