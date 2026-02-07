import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Afin - Portfolio",
  description: "A showcase of my work and projects.",
  openGraph: {
    title: "Afin - Portfolio",
    description: "A showcase of my work and projects.",
    images: ["/booklet/images/thumbnail.png"],
  },
  twitter: {
    images: ["/booklet/images/thumbnail.png"],
  },
  icons: {
    icon: "/booklet/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`} style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
