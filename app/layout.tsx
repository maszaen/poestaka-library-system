"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar, MobileHeader } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <title>Poestaka - Library Management System</title>
        <meta name="description" content="Sistem Manajemen Perpustakaan Modern" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <div className="flex min-h-screen">
          {/* Mobile Header */}
          <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            isCollapsed={isCollapsed}
            onCollapse={() => setIsCollapsed(!isCollapsed)}
          />
          
          {/* Main Content Area */}
          <main
            className={cn(
              "flex-1 overflow-auto bg-[#F9FAFB] transition-all duration-300",
              // Mobile: full width with top padding for header
              "pt-14 lg:pt-0",
              // Desktop: margin for sidebar
              isCollapsed ? "lg:ml-16" : "lg:ml-[320px]"
            )}
          >
            <div className="min-h-screen p-4 lg:p-8 max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
