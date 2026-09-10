import { listAdminNews } from "@/actions/news";
import { AdminNewsView } from "@/components/admin/AdminNewsView";

export default async function AdminNewsPage() {
  const articles = await listAdminNews();

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminNewsView articles={articles} />
    </div>
  );
}
