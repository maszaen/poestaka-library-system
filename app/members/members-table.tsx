"use client";

import { useState } from "react";
import { Anggota } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Search } from "lucide-react";

interface MembersTableProps {
  members: Anggota[];
}

export function MembersTable({ members }: MembersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = members.filter(
    (member) =>
      member.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.nomor_identitas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.no_telepon?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari nama, nomor identitas, atau telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          {filteredMembers.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm text-[#4B5563]">
                {searchQuery
                  ? "Tidak ada anggota yang cocok dengan pencarian"
                  : "Belum ada anggota terdaftar"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Identitas</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Tgl. Daftar</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id_anggota}>
                    <TableCell className="font-mono">
                      {member.nomor_identitas}
                    </TableCell>
                    <TableCell className="font-medium">
                      {member.nama_lengkap}
                    </TableCell>
                    <TableCell>{member.no_telepon || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {member.alamat || "-"}
                    </TableCell>
                    <TableCell>{formatDate(member.tanggal_daftar)}</TableCell>
                    <TableCell>
                      <Badge variant="success">Aktif</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="mt-4 text-sm text-[#4B5563]">
        Menampilkan {filteredMembers.length} dari {members.length} anggota
      </div>
    </>
  );
}
