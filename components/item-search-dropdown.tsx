"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { searchAvailableItems } from "@/app/actions/books";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BookOpen, Loader2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemSearchDropdownProps {
  onSelect: (itemId: string) => void;
  excludeIds?: string[];
  disabled?: boolean;
}

interface AvailableItem {
  id_item: string;
  judul: string;
  penulis: string | null;
}

export function ItemSearchDropdown({
  onSelect,
  excludeIds = [],
  disabled = false,
}: ItemSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<AvailableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch items with debounce
  const fetchItems = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        console.log("Fetching items with query:", searchQuery);
        const results = await searchAvailableItems(searchQuery, 20);
        console.log("Fetch items results:", results);
        // Filter out already selected items
        const filtered = results.filter(item => !excludeIds.includes(item.id_item));
        setItems(filtered);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [excludeIds]);

  // Fetch on open and query change
  useEffect(() => {
    if (isOpen) {
      fetchItems(query);
    }
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [isOpen, query, fetchItems]);

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

  const handleSelect = (item: AvailableItem) => {
    onSelect(item.id_item);
    setQuery("");
    setIsOpen(false);
    // Refetch to update available items
    fetchItems("");
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleAddManual = () => {
    if (query.trim() && !excludeIds.includes(query.trim())) {
      onSelect(query.trim());
      setQuery("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddManual();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            ref={inputRef}
            placeholder="Cari judul atau scan barcode..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="pl-10"
          />
        </div>
        <Button 
          type="button"
          variant="outline" 
          className={`${disabled ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={handleAddManual}
          disabled={disabled || !query.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[#E5E7EB] bg-white shadow-lg max-h-64 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-[#1A73E8]" />
              <span className="ml-2 text-sm text-[#4B5563]">Memuat...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-6 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-[#4B5563]">
                {query ? "Item tidak ditemukan" : "Tidak ada item tersedia"}
              </p>
              {query && (
                <button
                  type="button"
                  onClick={handleAddManual}
                  className="mt-2 text-sm text-[#1A73E8] hover:underline"
                >
                  Tambahkan "{query}" secara manual
                </button>
              )}
            </div>
          ) : (
            <ul className="py-1">
              {items.map((item) => (
                <li key={item.id_item}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left hover:bg-[#F9FAFB] transition-colors",
                      "flex items-center gap-3"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6]">
                      <BookOpen className="h-4 w-4 text-[#4B5563]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#111827] truncate">
                        {item.judul}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#4B5563] font-mono">
                          {item.id_item}
                        </span>
                        {item.penulis && (
                          <span className="text-xs text-[#9CA3AF] truncate">
                            • {item.penulis}
                          </span>
                        )}
                      </div>
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
