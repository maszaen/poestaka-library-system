"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Kategori } from "@/lib/types";
import { createBook } from "@/app/actions/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";

interface AddBookDialogProps {
  categories: Kategori[];
}

export function AddBookDialog({ categories }: AddBookDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      judul: formData.get("judul") as string,
      penulis: formData.get("penulis") as string || undefined,
      penerbit: formData.get("penerbit") as string || undefined,
      tahun_terbit: formData.get("tahun_terbit") 
        ? parseInt(formData.get("tahun_terbit") as string) 
        : undefined,
      isbn: formData.get("isbn") as string || undefined,
      id_kategori: formData.get("id_kategori") 
        ? parseInt(formData.get("id_kategori") as string) 
        : undefined,
    };

    try {
      const result = await createBook(data);
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Gagal menambahkan buku");
      }
    } catch {
      setError("Terjadi kesalahan saat menambahkan buku");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Buku
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Buku Baru</DialogTitle>
          <DialogDescription>
            Masukkan informasi buku yang akan ditambahkan ke koleksi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Judul Buku <span className="text-red-500">*</span>
            </label>
            <Input
              name="judul"
              placeholder="Masukkan judul buku"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Penulis
            </label>
            <Input
              name="penulis"
              placeholder="Nama penulis"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Penerbit
              </label>
              <Input
                name="penerbit"
                placeholder="Nama penerbit"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Tahun Terbit
              </label>
              <Input
                name="tahun_terbit"
                type="number"
                min="1900"
                max="2099"
                placeholder="YYYY"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              ISBN
            </label>
            <Input
              name="isbn"
              placeholder="ISBN"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Kategori
            </label>
            <select
              name="id_kategori"
              className="flex h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id_kategori} value={cat.id_kategori}>
                  {cat.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
