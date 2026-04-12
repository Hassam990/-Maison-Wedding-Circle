import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Maison Wedding Circle | Luxury Event Management",
  description: "A trusted wedding network for the South Asian community in the US.",
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} antialiased text-foreground flex flex-col min-h-screen relative`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
