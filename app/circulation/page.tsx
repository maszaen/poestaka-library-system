import { PageHeader } from "@/components/layout/page-header";
import { CirculationTabs } from "./circulation-tabs";

export const dynamic = "force-dynamic";

export default function CirculationPage() {
  return (
    <>
      <PageHeader
        title="Sirkulasi"
        description="Kelola peminjaman dan pengembalian buku"
      />

      <CirculationTabs />
    </>
  );
}
