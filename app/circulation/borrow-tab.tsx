"use client";

import { useState, useCallback } from "react";
import { searchMemberByIdentity } from "@/app/actions/members";
import { processLoan } from "@/app/actions/circulation";
import { Anggota } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [memberIdInput, setMemberIdInput] = useState("");
  const [member, setMember] = useState<Anggota | null>(null);
  const [isSearchingMember, setIsSearchingMember] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  const [barcodeInput, setBarcodeInput] = useState("");
  const [itemBarcodes, setItemBarcodes] = useState<string[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSearchMember = useCallback(async () => {
    if (!memberIdInput.trim()) return;
    
    setIsSearchingMember(true);
    setMemberError(null);
    setMember(null);

    try {
      const found = await searchMemberByIdentity(memberIdInput.trim());
      if (found) {
        setMember(found);
      } else {
        setMemberError("Anggota tidak ditemukan");
      }
    } catch {
      setMemberError("Gagal mencari anggota");
    } finally {
      setIsSearchingMember(false);
    }
  }, [memberIdInput]);

  const handleAddBarcode = useCallback(() => {
    const barcode = barcodeInput.trim();
    if (!barcode) return;

    if (itemBarcodes.includes(barcode)) {
      return; // Already added
    }

    setItemBarcodes((prev) => [...prev, barcode]);
    setBarcodeInput("");
  }, [barcodeInput, itemBarcodes]);

  const handleRemoveBarcode = useCallback((barcode: string) => {
    setItemBarcodes((prev) => prev.filter((b) => b !== barcode));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddBarcode();
      }
    },
    [handleAddBarcode]
  );

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
        // Reset form
        setMember(null);
        setMemberIdInput("");
        setItemBarcodes([]);
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
    setMember(null);
    setMemberIdInput("");
    setItemBarcodes([]);
    setResult(null);
    setMemberError(null);
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
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Masukkan Nomor Identitas"
                value={memberIdInput}
                onChange={(e) => setMemberIdInput(e.target.value)}
                onBlur={handleSearchMember}
                onKeyDown={(e) => e.key === "Enter" && handleSearchMember()}
                disabled={isSearchingMember || !!member}
              />
              {member && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setMember(null);
                    setMemberIdInput("");
                    setMemberError(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isSearchingMember && (
              <div className="flex items-center gap-2 text-sm text-[#4B5563]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Mencari anggota...
              </div>
            )}

            {memberError && (
              <p className="text-sm text-red-600">{memberError}</p>
            )}

            {member && (
              <div className="rounded-md border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">
                    Anggota Ditemukan
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-[#4B5563]">Nama:</span>{" "}
                    <span className="font-medium">{member.nama_lengkap}</span>
                  </p>
                  <p>
                    <span className="text-[#4B5563]">No. Identitas:</span>{" "}
                    <span className="font-mono">{member.nomor_identitas}</span>
                  </p>
                </div>
              </div>
            )}
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
            <div className="flex gap-2">
              <Input
                placeholder="Scan atau masukkan barcode item"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline" onClick={handleAddBarcode}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

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
                      onClick={() => handleRemoveBarcode(barcode)}
                      className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
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
