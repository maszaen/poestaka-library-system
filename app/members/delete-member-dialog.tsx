"use client";

import { useState } from "react";
import { Anggota } from "@/lib/types";
import { deleteMember } from "@/app/actions/members";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteMemberDialogProps {
  member: Anggota | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteMemberDialog({
  member,
  open,
  onOpenChange,
  onSuccess,
}: DeleteMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!member) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await deleteMember(member.id_anggota);

      if (result.success) {
        onSuccess();
        onOpenChange(false);
      } else {
        setError(result.error || "Gagal menghapus anggota");
      }
    } catch {
      setError("Terjadi kesalahan saat menghapus anggota");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Hapus Anggota
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak
            dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {member && (
            <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <p className="font-medium">{member.nama_lengkap}</p>
              <p className="text-sm text-[#4B5563]">
                {member.nomor_identitas}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
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
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
