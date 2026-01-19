import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "6 to 6",
  description: "What if sunrise was always at 6:00 and sunset always at 18:00? It used to be.",
  openGraph: {
    title: "6 to 6",
    description: "What if sunrise was always at 6:00 and sunset always at 18:00? It used to be.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "6 to 6",
    description: "What if sunrise was always at 6:00 and sunset always at 18:00? It used to be.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
