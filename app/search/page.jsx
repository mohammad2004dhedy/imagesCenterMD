import HomeClient from "@/components/HomeClient";
import { Suspense } from "react";

export const metadata = {
  title: "Search | imagesCenter"
};

export default function SearchPage() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
