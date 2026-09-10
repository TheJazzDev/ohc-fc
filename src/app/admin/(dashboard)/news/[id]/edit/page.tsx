import { notFound } from "next/navigation";
import { getAdminArticle, updateNewsArticle } from "@/actions/news";
import { AdminNewsForm } from "@/components/admin/AdminNewsForm";

export default async function EditNewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getAdminArticle(id);
  if (!article) notFound();

  const boundUpdate = updateNewsArticle.bind(null, id);

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminNewsForm action={boundUpdate} initialValues={article} />
    </div>
  );
}
