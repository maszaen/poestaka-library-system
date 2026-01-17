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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
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
          // Mobile: slide in/out, always expanded view, 65vw width
          isOpen ? "translate-x-0" : "-translate-x-full",
          "w-[65vw]",
          // Desktop: always visible, collapse support, wider size
          "lg:translate-x-0",
          isCollapsed ? "lg:w-16" : "lg:w-[320px]",
          "overflow-hidden"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "flex h-16 items-center pt-7 mb-3",
          // Mobile: always show expanded (justify-between)
          "justify-between px-4",
          // Desktop: follow collapsed state
          isCollapsed && "lg:justify-center lg:px-2"
        )}>
          {/* Logo - always visible on mobile, hidden on desktop when collapsed */}
          <div className={cn(
            "flex items-center gap-3 min-w-0 flex-1",
            isCollapsed && "lg:hidden"
          )}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-600">
              <Library className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold tracking-tight truncate">Poestaka</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 truncate">
                Library System
              </span>
            </div>
          </div>

          {/* Expand button when collapsed - desktop only */}
          {isCollapsed && (
            <button
              onClick={onCollapse}
              className="hidden lg:flex h-10 w-10 items-center justify-center rounded-md hover:bg-[#1557B0] transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="h-5 w-5 shrink-0" />
            </button>
          )}
          
          {/* Close button for mobile */}
          <button
            onClick={onToggle}
            className="rounded-md p-2 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5 shrink-0" />
          </button>

          {/* Collapse button for desktop - only when expanded */}
          {!isCollapsed && (
            <button
              onClick={onCollapse}
              className="hidden rounded-md p-2 hover:bg-white/10 lg:flex items-center justify-center"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5 shrink-0" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex flex-col gap-1 p-4",
          isCollapsed && "lg:p-3"
        )}>
          {/* Menu label - always visible on mobile, hidden on desktop when collapsed */}
          <p className={cn(
            "mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 truncate",
            isCollapsed && "text-transparent"
          )}>
            Menu Utama
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close mobile sidebar on navigation
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={cn(
                  "flex items-center rounded-md text-sm font-medium transition-all gap-3 px-3 py-2.5",
                  isCollapsed && "lg:h-10 lg:w-full lg:justify-start lg:px-2.5 lg:gap-0 lg:py-0",
                  isActive
                    ? "bg-[#1A73E8] text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={cn("truncate", isCollapsed && "lg:hidden")}>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 border-t border-white/10 p-4",
          isCollapsed && "lg:p-2"
        )}>
          <Link
            href="/settings"
            className={cn(
              "flex items-center rounded-md text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white gap-3 px-3 py-2.5",
              isCollapsed && "lg:h-10 lg:w-full lg:justify-start lg:px-3 lg:gap-0 lg:py-0"
            )}
            title={isCollapsed ? "Pengaturan" : undefined}
          >
            <Settings className="h-5 w-5 shrink-0" />
            <span className={cn("truncate", isCollapsed && "lg:hidden")}>Pengaturan</span>
          </Link>
          <div className={cn(
            "mt-4 px-3 text-[10px] text-gray-600 truncate",
            isCollapsed && "lg:hidden"
          )}>
            © 2026 Poestaka v1.0
          </div>
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
