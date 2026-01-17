import { getMembers } from "@/app/actions/members";
import { PageHeader } from "@/components/layout/page-header";
import { MembersTable } from "./members-table";
import { AddMemberDialog } from "./add-member-dialog";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <>
      <PageHeader
        title="Anggota Perpustakaan"
        description="Kelola data anggota perpustakaan"
      >
        <AddMemberDialog />
      </PageHeader>

      <MembersTable members={members} />
    </>
  );
}
