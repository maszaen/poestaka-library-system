"use client";

import { useState, useCallback } from "react";
import { useBorrowForm } from "@/contexts/borrow-form-context";
import { processLoan } from "@/app/actions/circulation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MemberSearchDropdown } from "@/components/member-search-dropdown";
import { ItemSearchDropdown } from "@/components/item-search-dropdown";
import {
  User,
  Barcode,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function BorrowTab() {
  const { formState, setMember, addBarcode, removeBarcode, resetForm } = useBorrowForm();
  const { member, itemBarcodes } = formState;

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!member || itemBarcodes.length === 0) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await processLoan(member.id_anggota, itemBarcodes);
      
      if (response.success) {
        setResult({
          success: true,
          message: `Peminjaman berhasil! No: ${response.data?.no_peminjaman}`,
        });
        // Reset form after success
        resetForm();
      } else {
        setResult({
          success: false,
          message: response.error || "Gagal memproses peminjaman",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Terjadi kesalahan saat memproses peminjaman",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    resetForm();
    setResult(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Form */}
      <div className="space-y-6">
        {/* Member Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Informasi Anggota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MemberSearchDropdown
              value={member}
              onChange={setMember}
              disabled={isProcessing}
            />
          </CardContent>
        </Card>

        {/* Item Barcodes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Barcode className="h-4 w-4" />
              Item Buku (Barcode)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ItemSearchDropdown 
              onSelect={addBarcode} 
              excludeIds={itemBarcodes}
              disabled={isProcessing}
            />

            {itemBarcodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {itemBarcodes.map((barcode) => (
                  <Badge
                    key={barcode}
                    variant="secondary"
                    className="gap-1 py-1.5 pl-3 pr-2"
                  >
                    <span className="font-mono">{barcode}</span>
                    <button
                      onClick={() => removeBarcode(barcode)}
                      className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                      disabled={isProcessing}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {itemBarcodes.length === 0 && (
              <p className="text-sm text-[#4B5563]">
                Belum ada item yang ditambahkan
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Summary & Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Peminjaman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#4B5563]">Anggota</span>
                <span className="font-medium">
                  {member?.nama_lengkap || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4B5563]">Jumlah Item</span>
                <span className="font-medium">{itemBarcodes.length} buku</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4B5563]">Durasi Pinjam</span>
                <span className="font-medium">14 hari</span>
              </div>
            </div>

            {result && (
              <div
                className={`rounded-md p-4 ${
                  result.success
                    ? "border border-green-200 bg-green-50"
                    : "border border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={
                      result.success ? "text-green-800" : "text-red-800"
                    }
                  >
                    {result.message}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleReset}
                disabled={isProcessing}
              >
                Reset
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={!member || itemBarcodes.length === 0 || isProcessing}
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Konfirmasi Pinjam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
