"use client";

import { useState } from "react";
import { resetDatabase, seedDatabase } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Database, RefreshCcw, HardDrive } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function DataManagementCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<"reset" | "seed" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAction = async () => {
    if (!actionType) return;
    setIsLoading(true);
    setShowConfirm(false);
    
    try {
      if (actionType === "reset") {
        await resetDatabase();
      } else if (actionType === "seed") {
        await resetDatabase();
        await seedDatabase();
      }
      router.refresh();
    } catch {
      // Silent
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  const confirmAction = (type: "reset" | "seed") => {
    setActionType(type);
    setShowConfirm(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Manajemen Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => confirmAction("reset")}
              disabled={isLoading}
            >
              {isLoading && actionType === "reset" ? (
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Hapus Semua Data
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => confirmAction("seed")}
              disabled={isLoading}
            >
              {isLoading && actionType === "seed" ? (
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Isi Data Simulasi
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Isi data simulasi akan menghapus data lama dan menggantinya dengan data contoh.
          </p>
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
            <DialogDescription>
              {actionType === "reset" 
                ? "Semua data akan dihapus. Lanjutkan?" 
                : "Data lama akan dihapus dan diganti dengan data simulasi. Lanjutkan?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isLoading}>
              Batal
            </Button>
            <Button 
              variant="destructive"
              onClick={handleAction}
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Ya'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
