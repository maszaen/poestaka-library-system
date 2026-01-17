import { getLoanHistory } from "@/app/actions/circulation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History as HistoryIcon } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const history = await getLoanHistory();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pinjam":
        return <Badge variant="info">Dipinjam</Badge>;
      case "Kembali":
        return <Badge variant="success">Dikembalikan</Badge>;
      case "Hilang":
        return <Badge variant="danger">Hilang</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <PageHeader
        title="Riwayat Transaksi"
        description="Histori peminjaman dan pengembalian buku"
      />

      <Card>
        <CardContent className="p-0">
          {history.length === 0 ? (
            <div className="py-16 text-center">
              <HistoryIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm text-[#4B5563]">
                Belum ada riwayat transaksi
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Peminjaman</TableHead>
                  <TableHead>Anggota</TableHead>
                  <TableHead>Judul Buku</TableHead>
                  <TableHead>ID Item</TableHead>
                  <TableHead>Batas Kembali</TableHead>
                  <TableHead>Tgl. Kembali</TableHead>
                  <TableHead>Denda</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id_detail}>
                    <TableCell className="font-mono text-sm">
                      {item.no_peminjaman}
                    </TableCell>
                    <TableCell>{item.nama_lengkap}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.judul}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.id_item}
                    </TableCell>
                    <TableCell>{formatDate(item.batas_kembali)}</TableCell>
                    <TableCell>
                      {item.tanggal_kembali_aktual
                        ? formatDate(item.tanggal_kembali_aktual)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.denda > 0 ? (
                        <span className="font-medium text-red-600">
                          {formatCurrency(item.denda)}
                        </span>
                      ) : (
                        <span className="text-[#4B5563]">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status_kembali)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 text-sm text-[#4B5563]">
        Menampilkan {history.length} transaksi terakhir
      </div>
    </>
  );
}
