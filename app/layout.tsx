import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Dohn Michael Varquez | Developer and UI/UX Designer",
  description: "Portfolio of Dohn Michael Varquez, a full-stack developer, UI/UX designer, and Computer Science student at Visayas State University.",
  openGraph: {
    title: "Dohn Michael Varquez",
    description: "Developer and UI/UX designer building useful software for real communities.",
    type: "website",
    images: [{ url: "/images/dohn-portrait.png", width: 1200, height: 1200, alt: "Dohn Michael Varquez" }],
  },
};

const themeScript = `
  try {
    const requested = new URLSearchParams(location.search).get('theme');
    const saved = localStorage.getItem('dohn-theme');
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.dataset.theme = requested === 'light' || requested === 'dark' ? requested : saved || preferred;
  } catch (_) {
    document.documentElement.dataset.theme = 'dark';
  }
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
