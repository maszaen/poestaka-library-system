import { getDashboardStats } from "@/app/actions/dashboard";
import { getActiveLoans } from "@/app/actions/circulation";
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
import { BookOpen, Package, ArrowLeftRight, Users, AlertCircle } from "lucide-react";
import { formatDate, calculateLateDays, formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const activeLoans = await getActiveLoans();

  const statCards = [
    {
      title: "Total Judul Buku",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "text-[#1A73E8]",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Eksemplar",
      value: stats.totalItems,
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Peminjaman Aktif",
      value: stats.activeLoans,
      icon: ArrowLeftRight,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Total Anggota",
      value: stats.totalMembers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  // Identify overdue loans
  const overdueLoans = activeLoans.filter(
    (loan) => loan.batas_kembali && calculateLateDays(loan.batas_kembali) > 0
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan aktivitas perpustakaan"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4B5563]">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-[#111827]">
                    {stat.value.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overdue Loans Section */}
      {overdueLoans.length > 0 && (
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h2 className="font-semibold text-red-800">
                {overdueLoans.length} Peminjaman Terlambat
              </h2>
            </div>
            <p className="mt-1 text-sm text-red-600">
              Terdapat buku yang belum dikembalikan melewati batas waktu.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Active Loans Table */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">
            Peminjaman Aktif
          </h2>
          
          {activeLoans.length === 0 ? (
            <div className="py-12 text-center">
              <ArrowLeftRight className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm text-[#4B5563]">
                Tidak ada peminjaman aktif saat ini
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeLoans.slice(0, 10).map((loan) => {
                  const daysLate = loan.batas_kembali
                    ? calculateLateDays(loan.batas_kembali)
                    : 0;
                  const isOverdue = daysLate > 0;

                  return (
                    <TableRow key={loan.id_detail}>
                      <TableCell className="font-mono text-sm">
                        {loan.no_peminjaman}
                      </TableCell>
                      <TableCell>{loan.nama_lengkap}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {loan.judul}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {loan.id_item}
                      </TableCell>
                      <TableCell>
                        {formatDate(loan.batas_kembali)}
                      </TableCell>
                      <TableCell>
                        {isOverdue ? (
                          <Badge variant="danger">
                            Terlambat {daysLate} hari
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
          )}
          
          {activeLoans.length > 10 && (
            <p className="mt-4 text-center text-sm text-[#4B5563]">
              Menampilkan 10 dari {activeLoans.length} peminjaman aktif
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
