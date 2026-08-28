import type { Metadata } from "next";
import { GraphicGallery } from "@/components/graphic-gallery";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Graphic Design | Dohn Michael Varquez",
  description:
    "Selected publication materials and visual systems by Dohn Michael Varquez for campus communities.",
  openGraph: {
    title: "Graphic Design | Dohn Michael Varquez",
    description: "Publication materials and visual systems made for campus communities.",
    images: [
      {
        url: "/images/graphic-design/cofilang/cofilang-15.jpg",
        width: 1638,
        height: 2048,
        alt: "Cofilang Game Day publication material",
      },
    ],
  },
};

export default function GraphicDesignPage() {
  return (
    <main className="graphic-page">
      <SiteHeader />
      <GraphicGallery />
    </main>
  );
}
