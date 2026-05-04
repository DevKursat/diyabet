import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diyabet Risk Analizi",
  description: "Sağlık verilerinizi girin, diyabet risk düzeyinizi öğrenin.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full antialiased">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
