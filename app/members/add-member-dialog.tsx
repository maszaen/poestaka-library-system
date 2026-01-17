"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMember } from "@/app/actions/members";
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

export function AddMemberDialog() {
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
      nomor_identitas: formData.get("nomor_identitas") as string,
      nama_lengkap: formData.get("nama_lengkap") as string,
      no_telepon: formData.get("no_telepon") as string || undefined,
      alamat: formData.get("alamat") as string || undefined,
    };

    try {
      const result = await createMember(data);
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Gagal menambahkan anggota");
      }
    } catch {
      setError("Terjadi kesalahan saat menambahkan anggota");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Anggota
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Anggota Baru</DialogTitle>
          <DialogDescription>
            Daftarkan anggota baru ke perpustakaan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Nomor Identitas <span className="text-red-500">*</span>
            </label>
            <Input
              name="nomor_identitas"
              placeholder="NIM/NIK/No. KTP"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <Input
              name="nama_lengkap"
              placeholder="Nama lengkap anggota"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              No. Telepon
            </label>
            <Input
              name="no_telepon"
              placeholder="08xxxxxxxxxx"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Alamat
            </label>
            <textarea
              name="alamat"
              placeholder="Alamat lengkap"
              disabled={isLoading}
              rows={3}
              className="flex w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
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
