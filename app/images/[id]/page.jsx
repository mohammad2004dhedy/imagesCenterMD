import ImageDetailsClient from "@/components/images/ImageDetailsClient";
import { Suspense } from "react";

export const metadata = {
  title: "Image Details | MDImages"
};

export default function ImageDetailsPage() {
  return (
    <Suspense>
      <ImageDetailsClient />
    </Suspense>
  );
}
