"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Anggota } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { checkMemberHasActiveLoans } from "@/app/actions/members";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditMemberDialog } from "./edit-member-dialog";
import { DeleteMemberDialog } from "./delete-member-dialog";
import { Users, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface MembersTableProps {
  members: Anggota[];
}

interface MemberWithLoanStatus extends Anggota {
  hasActiveLoans?: boolean;
}

export function MembersTable({ members }: MembersTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [membersWithStatus, setMembersWithStatus] = useState<MemberWithLoanStatus[]>([]);
  
  // Dialog states
  const [editMember, setEditMember] = useState<Anggota | null>(null);
  const [deleteMember, setDeleteMember] = useState<Anggota | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Check active loans for each member
  useEffect(() => {
    async function checkAllMembersLoans() {
      const membersStatus = await Promise.all(
        members.map(async (member) => {
          const hasActiveLoans = await checkMemberHasActiveLoans(member.id_anggota);
          return { ...member, hasActiveLoans };
        })
      );
      setMembersWithStatus(membersStatus);
    }
    checkAllMembersLoans();
  }, [members]);

  const filteredMembers = membersWithStatus.filter(
    (member) =>
      member.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.nomor_identitas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.no_telepon?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (member: Anggota) => {
    setEditMember(member);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (member: Anggota) => {
    setDeleteMember(member);
    setDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    router.refresh();
  };

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
                  <TableHead className="w-[60px]">Aksi</TableHead>
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
                      {member.hasActiveLoans ? (
                        <Badge variant="warning">Meminjam</Badge>
                      ) : (
                        <Badge variant="success">Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(member)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {!member.hasActiveLoans && (
                            <DropdownMenuItem
                              variant="danger"
                              onClick={() => handleDeleteClick(member)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      {/* Edit Dialog */}
      <EditMemberDialog
        member={editMember}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleSuccess}
      />

      {/* Delete Dialog */}
      <DeleteMemberDialog
        member={deleteMember}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
