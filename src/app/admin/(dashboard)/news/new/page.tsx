import { createNewsArticle } from "@/actions/news";
import { AdminNewsForm } from "@/components/admin/AdminNewsForm";

export default function NewNewsArticlePage() {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminNewsForm action={createNewsArticle} />
    </div>
  );
}
