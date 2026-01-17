import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database, Server, DollarSign, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Pengaturan"
        description="Konfigurasi sistem perpustakaan"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Koneksi Database
            </CardTitle>
            <CardDescription>
              Konfigurasi koneksi ke database MySQL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Host
              </label>
              <Input defaultValue="localhost" disabled />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Database
              </label>
              <Input defaultValue="poestaka" disabled />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                User
              </label>
              <Input defaultValue="root" disabled />
            </div>
            <p className="text-xs text-[#4B5563]">
              Konfigurasi database diatur melalui file .env.local
            </p>
          </CardContent>
        </Card>

        {/* Loan Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pengaturan Peminjaman
            </CardTitle>
            <CardDescription>
              Konfigurasi durasi pinjam dan denda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Durasi Pinjam Default (hari)
              </label>
              <Input type="number" defaultValue="14" disabled />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Denda per Hari (Rp)
              </label>
              <Input type="number" defaultValue="2000" disabled />
            </div>
            <p className="text-xs text-[#4B5563]">
              Pengaturan ini dapat diubah melalui environment variable
            </p>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Informasi Sistem
            </CardTitle>
            <CardDescription>
              Detail sistem Poestaka Library Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-md border border-[#E5E7EB] p-4">
                <p className="text-xs text-[#4B5563]">Versi Aplikasi</p>
                <p className="mt-1 text-lg font-semibold">v1.0.0</p>
              </div>
              <div className="rounded-md border border-[#E5E7EB] p-4">
                <p className="text-xs text-[#4B5563]">Framework</p>
                <p className="mt-1 text-lg font-semibold">Next.js 16</p>
              </div>
              <div className="rounded-md border border-[#E5E7EB] p-4">
                <p className="text-xs text-[#4B5563]">Database</p>
                <p className="mt-1 text-lg font-semibold">MySQL</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
