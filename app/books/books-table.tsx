"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BukuWithKategori, ItemBuku, Kategori } from "@/lib/types";
import { getBookItems } from "@/app/actions/books";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CategorySearchDropdown } from "@/components/category-search-dropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Eye, Search, Package } from "lucide-react";

interface BooksTableProps {
  books: BukuWithKategori[];
  categories: Kategori[];
}

export function BooksTable({ books, categories }: BooksTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  // Update local state when URL params change (e.g. navigation back/forward)
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  const [selectedBook, setSelectedBook] = useState<BukuWithKategori | null>(null);
  const [bookItems, setBookItems] = useState<ItemBuku[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Custom Debounce for Search
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      
      // Keep category if exists
      if (selectedCategory && selectedCategory !== 'all') {
        params.set("category", selectedCategory);
      }
      
      router.push(`/books?${params.toString()}`, { scroll: false });
    }, 500);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId && categoryId !== "all") {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    
    // Keep search query if exists
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    
    router.push(`/books?${params.toString()}`, { scroll: false });
  };
  
  // Use books directly (server filtered)
  const filteredBooks = books;

  const handleViewStock = async (book: BukuWithKategori) => {
    setSelectedBook(book);
    setIsLoadingItems(true);
    setIsDialogOpen(true);
    
    try {
      const items = await getBookItems(book.id_buku);
      setBookItems(items);
    } catch (error) {
      console.error("Error fetching book items:", error);
      setBookItems([]);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const getStatusBadge = (status: ItemBuku["status"]) => {
    switch (status) {
      case "Tersedia":
        return <Badge variant="success">Tersedia</Badge>;
      case "Dipinjam":
        return <Badge variant="info">Dipinjam</Badge>;
      case "Perbaikan":
        return <Badge variant="warning">Perbaikan</Badge>;
      case "Hilang":
        return <Badge variant="danger">Hilang</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getConditionBadge = (kondisi: ItemBuku["kondisi"]) => {
    switch (kondisi) {
      case "Baik":
        return <Badge variant="success">Baik</Badge>;
      case "Rusak":
        return <Badge variant="danger">Rusak</Badge>;
      case "Hilang":
        return <Badge variant="danger">Hilang</Badge>;
      default:
        return <Badge variant="secondary">{kondisi}</Badge>;
    }
  };

  return (
    <>
      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari judul, penulis, atau ISBN..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative w-full sm:w-auto">
             <CategorySearchDropdown 
                categories={categories}
                selectedId={selectedCategory}
                onSelect={handleCategoryChange}
             />
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card>
        <CardContent className="p-0">
          {filteredBooks.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm text-[#4B5563]">
                {searchQuery
                  ? "Tidak ada buku yang cocok dengan pencarian"
                  : "Belum ada buku dalam koleksi"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Penerbit</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Rak</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id_buku}>
                    <TableCell className="font-medium">{book.judul}</TableCell>
                    <TableCell>{book.penulis || "-"}</TableCell>
                    <TableCell>{book.penerbit || "-"}</TableCell>
                    <TableCell>{book.tahun_terbit || "-"}</TableCell>
                    <TableCell>
                      {book.nama_kategori ? (
                        <Badge variant="secondary">{book.nama_kategori}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{book.rak_lokasi || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewStock(book)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Stok
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Book Items Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Stok Eksemplar</DialogTitle>
            <DialogDescription>
              {selectedBook?.judul}
            </DialogDescription>
          </DialogHeader>

          {isLoadingItems ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#1A73E8] border-t-transparent" />
              <p className="mt-4 text-sm text-[#4B5563]">Memuat data...</p>
            </div>
          ) : bookItems.length === 0 ? (
            <div className="py-8 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm text-[#4B5563]">
                Belum ada eksemplar untuk buku ini
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Item (Barcode)</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookItems.map((item) => (
                  <TableRow key={item.id_item}>
                    <TableCell className="font-mono">{item.id_item}</TableCell>
                    <TableCell>{getConditionBadge(item.kondisi)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Summary */}
          {bookItems.length > 0 && (
            <div className="mt-4 flex gap-4 border-t pt-4">
              <div className="text-sm">
                <span className="text-[#4B5563]">Total: </span>
                <span className="font-semibold">{bookItems.length}</span>
              </div>
              <div className="text-sm">
                <span className="text-[#4B5563]">Tersedia: </span>
                <span className="font-semibold text-green-600">
                  {bookItems.filter((i) => i.status === "Tersedia").length}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-[#4B5563]">Dipinjam: </span>
                <span className="font-semibold text-blue-600">
                  {bookItems.filter((i) => i.status === "Dipinjam").length}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
