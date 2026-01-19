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
  description: "What if sunrise was always at 6:00 AM and sunset always at 6:00 PM? See how long your Roman hours would be today.",
  openGraph: {
    title: "6 to 6",
    description: "What if sunrise was always at 6:00 AM and sunset always at 6:00 PM? See how long your Roman hours would be today.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "6 to 6",
    description: "What if sunrise was always at 6:00 AM and sunset always at 6:00 PM? See how long your Roman hours would be today.",
  },
  other: {
    "theme-color": "#fef3c7",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
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
