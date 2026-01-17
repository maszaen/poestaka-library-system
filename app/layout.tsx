import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Poestaka - Library Management System",
  description: "Sistem Manajemen Perpustakaan Modern",
  keywords: ["library", "management", "books", "perpustakaan"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <div className="flex min-h-screen">
          {/* Fixed Sidebar */}
          <Sidebar />
          
          {/* Main Content Area */}
          <main className="ml-64 flex-1 overflow-auto bg-[#F9FAFB]">
            <div className="min-h-screen p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
