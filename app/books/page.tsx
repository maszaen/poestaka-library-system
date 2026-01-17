import { getBooks, getCategories } from "@/app/actions/books";
import { PageHeader } from "@/components/layout/page-header";
import { BooksTable } from "./books-table";
import { AddBookDialog } from "./add-book-dialog";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const [books, categories] = await Promise.all([
    getBooks(),
    getCategories(),
  ]);

  return (
    <>
      <PageHeader
        title="Koleksi Buku"
        description="Kelola daftar judul buku dan eksemplar perpustakaan"
      >
        <AddBookDialog categories={categories} />
      </PageHeader>

      <BooksTable books={books} />
    </>
  );
}
