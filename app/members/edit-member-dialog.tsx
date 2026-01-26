"use client";

import { useState, useEffect } from "react";
import { Anggota } from "@/lib/types";
import { updateMember } from "@/app/actions/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface EditMemberDialogProps {
  member: Anggota | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
  onSuccess,
}: EditMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nomor_identitas: "",
    nama_lengkap: "",
    no_telepon: "",
    alamat: "",
  });

  useEffect(() => {
    if (member) {
      setFormData({
        nomor_identitas: member.nomor_identitas || "",
        nama_lengkap: member.nama_lengkap || "",
        no_telepon: member.no_telepon || "",
        alamat: member.alamat || "",
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    if (!formData.nama_lengkap.trim() || !formData.nomor_identitas.trim()) {
      setError("Nama lengkap dan nomor identitas wajib diisi");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await updateMember(member.id_anggota, {
        nomor_identitas: formData.nomor_identitas.trim(),
        nama_lengkap: formData.nama_lengkap.trim(),
        no_telepon: formData.no_telepon.trim() || undefined,
        alamat: formData.alamat.trim() || undefined,
      });

      if (result.success) {
        onSuccess();
        onOpenChange(false);
      } else {
        setError(result.error || "Gagal mengupdate anggota");
      }
    } catch {
      setError("Terjadi kesalahan saat mengupdate anggota");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Anggota</DialogTitle>
          <DialogDescription>
            Ubah data anggota perpustakaan
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nomor Identitas *</label>
              <Input
                placeholder="Contoh: 1234567890"
                value={formData.nomor_identitas}
                onChange={(e) =>
                  setFormData({ ...formData, nomor_identitas: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap *</label>
              <Input
                placeholder="Nama lengkap anggota"
                value={formData.nama_lengkap}
                onChange={(e) =>
                  setFormData({ ...formData, nama_lengkap: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">No. Telepon</label>
              <Input
                placeholder="Contoh: 081234567890"
                value={formData.no_telepon}
                onChange={(e) =>
                  setFormData({ ...formData, no_telepon: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alamat</label>
              <Input
                placeholder="Alamat lengkap"
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
