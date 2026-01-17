"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { calculateLateDays } from "@/lib/utils";

interface ActiveLoan {
  id_detail: number;
  no_peminjaman: string | null;
  nama_lengkap: string | null;
  judul: string | null;
  batas_kembali: Date | null;
}

interface ActiveLoansListProps {
  initialLoans: ActiveLoan[];
}

const ITEMS_PER_PAGE = 10;

export function ActiveLoansList({ initialLoans }: ActiveLoansListProps) {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const hasMore = displayCount < initialLoans.length;
  const displayedLoans = initialLoans.slice(0, displayCount);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, initialLoans.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, initialLoans.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (initialLoans.length === 0) {
    return (
      <div className="py-12 text-center">
        <ArrowLeftRight className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-4 text-sm text-[#4B5563]">
          Tidak ada peminjaman aktif saat ini
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white">
          <TableRow>
            <TableHead>Anggota</TableHead>
            <TableHead>Judul Buku</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedLoans.map((loan) => {
            const daysLate = loan.batas_kembali
              ? calculateLateDays(loan.batas_kembali)
              : 0;
            const isOverdue = daysLate > 0;

            return (
              <TableRow key={loan.id_detail}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{loan.nama_lengkap}</span>
                    <span className="text-xs text-gray-500 font-mono">{loan.no_peminjaman}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {loan.judul}
                </TableCell>
                <TableCell>
                  {isOverdue ? (
                    <Badge variant="danger" className="whitespace-nowrap">
                      Telat {daysLate} hari
                    </Badge>
                  ) : (
                    <Badge variant="info">Dipinjam</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {hasMore && (
        <div ref={loaderRef} className="py-4 text-center">
          {isLoading ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <span className="text-sm text-gray-400">Scroll untuk muat lebih</span>
          )}
        </div>
      )}
    </div>
  );
}
