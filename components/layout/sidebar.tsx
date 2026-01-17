"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  History,
  Settings,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Koleksi Buku",
    href: "/books",
    icon: BookOpen,
  },
  {
    title: "Anggota",
    href: "/members",
    icon: Users,
  },
  {
    title: "Sirkulasi",
    href: "/circulation",
    icon: ArrowLeftRight,
  },
  {
    title: "Riwayat",
    href: "/history",
    icon: History,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0F0F0F] text-white">
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1A73E8]">
          <Library className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight">Poestaka</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400">
            Library System
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Menu Utama
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[#1A73E8] text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white"
        >
          <Settings className="h-4 w-4" />
          Pengaturan
        </Link>
        <div className="mt-4 px-3 text-[10px] text-gray-600">
          © 2026 Poestaka v1.0
        </div>
      </div>
    </aside>
  );
}
