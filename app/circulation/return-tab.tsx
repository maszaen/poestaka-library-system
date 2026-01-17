"use client";

import { useState, useCallback } from "react";
import { getLoanInfoByBarcode, processReturn } from "@/app/actions/circulation";
import { LoanInfo } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Barcode,
  Loader2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  User,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export function ReturnTab() {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loanInfo, setLoanInfo] = useState<LoanInfo | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    fine?: number;
  } | null>(null);

  const handleSearch = useCallback(async () => {
    if (!barcodeInput.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setLoanInfo(null);
    setResult(null);

    try {
      const response = await getLoanInfoByBarcode(barcodeInput.trim());
      if (response.success && response.data) {
        setLoanInfo(response.data);
      } else {
        setSearchError(response.error || "Item tidak ditemukan");
      }
    } catch {
      setSearchError("Gagal mencari informasi peminjaman");
    } finally {
      setIsSearching(false);
    }
  }, [barcodeInput]);

  const handleSubmit = async () => {
    if (!loanInfo) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await processReturn(barcodeInput.trim());
      
      if (response.success) {
        setResult({
          success: true,
          message: "Pengembalian berhasil!",
          fine: response.data?.fine,
        });
        // Reset form
        setLoanInfo(null);
        setBarcodeInput("");
      } else {
        setResult({
          success: false,
          message: response.error || "Gagal memproses pengembalian",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Terjadi kesalahan saat memproses pengembalian",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setBarcodeInput("");
    setLoanInfo(null);
    setSearchError(null);
    setResult(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Scan Input */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Barcode className="h-4 w-4" />
              Scan Item Kembali
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Scan atau masukkan barcode item"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                disabled={isSearching || !!loanInfo}
              />
              <Button
                variant="outline"
                onClick={handleSearch}
                disabled={isSearching || !barcodeInput.trim() || !!loanInfo}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Cari"
                )}
              </Button>
            </div>

            {searchError && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="h-4 w-4" />
                {searchError}
              </div>
            )}

            {loanInfo && (
              <div className="space-y-4 rounded-md border border-[#E5E7EB] p-4">
                {/* Book Info */}
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-blue-100 p-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#4B5563]">Judul Buku</p>
                    <p className="font-medium">{loanInfo.judul}</p>
                  </div>
                </div>

                {/* Member Info */}
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-purple-100 p-2">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#4B5563]">Peminjam</p>
                    <p className="font-medium">{loanInfo.nama_lengkap}</p>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-amber-100 p-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#4B5563]">Batas Kembali</p>
                    <p className="font-medium">
                      {formatDate(loanInfo.batas_kembali)}
                    </p>
                  </div>
                </div>

                {/* Late Warning */}
                {loanInfo.daysLate > 0 && (
                  <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">
                        Terlambat {loanInfo.daysLate} hari
                      </p>
                      <p className="text-sm text-red-600">
                        Denda: {formatCurrency(loanInfo.fine)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Summary & Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Pengembalian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#4B5563]">No. Peminjaman</span>
                <span className="font-mono font-medium">
                  {loanInfo?.no_peminjaman || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4B5563]">Status</span>
                {loanInfo ? (
                  loanInfo.daysLate > 0 ? (
                    <Badge variant="danger">Terlambat</Badge>
                  ) : (
                    <Badge variant="success">Tepat Waktu</Badge>
                  )
                ) : (
                  <span>-</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4B5563]">Total Denda</span>
                <span className="font-bold text-red-600">
                  {loanInfo ? formatCurrency(loanInfo.fine) : "-"}
                </span>
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
                {result.success && result.fine !== undefined && result.fine > 0 && (
                  <p className="mt-2 text-sm text-green-700">
                    Denda yang harus dibayar: {formatCurrency(result.fine)}
                  </p>
                )}
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
                disabled={!loanInfo || isProcessing}
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Konfirmasi Kembali
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
