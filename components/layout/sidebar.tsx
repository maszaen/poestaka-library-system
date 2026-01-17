"use client";

import { useState, useEffect } from "react";
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
  Menu,
  X,
  ChevronLeft,
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

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}

export function Sidebar({ isOpen, onToggle, isCollapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-[#0F0F0F] text-white transition-all duration-300",
          // Mobile: slide in/out
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible, collapse support
          "lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className={cn("flex items-center gap-3", isCollapsed && "lg:justify-center")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1A73E8]">
              <Library className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col lg:block">
                <span className="text-lg font-bold tracking-tight">Poestaka</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 hidden lg:block">
                  Library System
                </span>
              </div>
            )}
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onToggle}
            className="rounded-md p-2 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Collapse button for desktop */}
          <button
            onClick={onCollapse}
            className={cn(
              "hidden rounded-md p-2 hover:bg-white/10 lg:block",
              isCollapsed && "lg:hidden"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {!isCollapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Menu Utama
            </p>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close mobile sidebar on navigation
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                  isCollapsed && "lg:justify-center lg:px-2",
                  isActive
                    ? "bg-[#1A73E8] text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white",
              isCollapsed && "lg:justify-center lg:px-2"
            )}
            title={isCollapsed ? "Pengaturan" : undefined}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Pengaturan</span>}
          </Link>
          {!isCollapsed && (
            <div className="mt-4 px-3 text-[10px] text-gray-600">
              © 2026 Poestaka v1.0
            </div>
          )}
          
          {/* Expand button when collapsed */}
          {isCollapsed && (
            <button
              onClick={onCollapse}
              className="mt-4 flex w-full items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

// Mobile Header Component
export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 lg:hidden">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 hover:bg-gray-100"
      >
        <Menu className="h-5 w-5 text-[#111827]" />
      </button>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1A73E8]">
          <Library className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-[#111827]">Poestaka</span>
      </div>
      <div className="w-9" /> {/* Spacer for centering */}
    </header>
  );
}
