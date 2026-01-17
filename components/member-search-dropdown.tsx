"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { searchMembers } from "@/app/actions/members";
import { Anggota } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { User, Loader2, Search, X } from "lucide-react";

interface MemberSearchDropdownProps {
  value: Anggota | null;
  onChange: (member: Anggota | null) => void;
  disabled?: boolean;
}

export function MemberSearchDropdown({
  value,
  onChange,
  disabled = false,
}: MemberSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<Anggota[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch members with debounce
  const fetchMembers = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        console.log("Fetching members with query:", searchQuery);
        const results = await searchMembers(searchQuery, 20);
        console.log("Fetch results:", results);
        setMembers(results);
      } catch (error) {
        console.error("Error fetching members:", error);
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  // Fetch on open and query change
  useEffect(() => {
    if (isOpen) {
      fetchMembers(query);
    }
  }, [isOpen, query, fetchMembers]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (member: Anggota) => {
    onChange(member);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
  };

  const handleInputFocus = () => {
    if (!value && !disabled) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // If member is selected, show different UI
  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-green-300 bg-green-50 px-3 py-2.5">
        <User className="h-4 w-4 text-green-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-800 truncate">
            {value.nama_lengkap}
          </p>
          <p className="text-xs text-green-600 font-mono truncate">
            {value.nomor_identitas}
          </p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded-full p-1 text-green-600 hover:bg-green-200 transition-colors"
          >
            <span className="sr-only">Hapus</span>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder="Cari nama atau nomor identitas..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          className="pl-10"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[#E5E7EB] bg-white shadow-lg max-h-64 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-[#1A73E8]" />
              <span className="ml-2 text-sm text-[#4B5563]">Memuat...</span>
            </div>
          ) : members.length === 0 ? (
            <div className="py-6 text-center">
              <User className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-[#4B5563]">
                {query ? "Tidak ada anggota ditemukan" : "Belum ada anggota"}
              </p>
            </div>
          ) : (
            <ul className="py-1">
              {members.map((member) => (
                <li key={member.id_anggota}>
                  <button
                    type="button"
                    onClick={() => handleSelect(member)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left hover:bg-[#F9FAFB] transition-colors",
                      "flex items-center gap-3"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6]">
                      <User className="h-4 w-4 text-[#4B5563]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#111827] truncate">
                        {member.nama_lengkap}
                      </p>
                      <p className="text-xs text-[#4B5563] font-mono truncate">
                        {member.nomor_identitas}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
