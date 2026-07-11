import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KASHDA - Property Rate Revenue Collection",
  description:
    "Manage your property rate payments easily with KASHDA. Pay via MTN, Telecel, or AT Mobile Money in Ghana.",
  icons: {
    icon: "/kashda_logo.svg",
    apple: "/kashda_logo.svg",
  },
  openGraph: {
    title: "KASHDA - Simplify Revenue Collection in Ghana",
    description:
      "Manage your property rate with ease. Secure, fast, and reliable mobile money payments.",
    images: [
      {
        url: "/assets/landing/hero-city.jpg",
        width: 1920,
        height: 1080,
        alt: "KASHDA",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#6a0dad" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-kashda-bg text-kashda-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
