"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kategori } from "@/lib/types";

interface CategorySearchDropdownProps {
  categories: Kategori[];
  selectedId?: string;
  onSelect: (categoryId: string) => void;
}

export function CategorySearchDropdown({ 
  categories, 
  selectedId = "all", // Default to "all" if undefined
  onSelect 
}: CategorySearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCategories = categories.filter(cat => 
    cat.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = categories.find(c => String(c.id_kategori) === selectedId);

  return (
    <div className="relative w-full sm:w-[250px]" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedId !== "all" && selectedCategory
          ? selectedCategory.nama_kategori
          : "Semua Kategori"}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      
      {isOpen && (
        <div className="absolute z-50 mt-4 max-h-[300px] w-full min-w-[250px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg ring-opacity-5">
          <div className="flex items-center border-b border-gray-200 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={inputRef}
              className="!bg-transparent !py-3 !text-sm !border-0 !shadow-none !outline-none !ring-0 !ring-offset-0 !appearance-none
                        focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0
                        placeholder:!text-gray-400"
              placeholder="Cari kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />


          </div>
          
          <div className="max-h-[220px] overflow-y-auto py-1">
             <div
                className={cn(
                  "relative flex cursor-default select-none items-center px-4 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  selectedId === "all" && "bg-accent/50"
                )}
                onClick={() => {
                  onSelect("all");
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedId === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                Semua Kategori
              </div>
            {filteredCategories.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">
                Kategori tidak ditemukan.
              </p>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category.id_kategori}
                  className={cn(
                    "relative flex cursor-default select-none items-center px-4 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    String(category.id_kategori) === selectedId && "bg-accent/50"
                  )}
                  onClick={() => {
                    onSelect(String(category.id_kategori));
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      String(category.id_kategori) === selectedId
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {category.nama_kategori}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
