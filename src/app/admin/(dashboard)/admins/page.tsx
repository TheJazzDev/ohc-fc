import { listAdmins } from "@/actions/admins";
import { AdminAdminsView } from "@/components/admin/AdminAdminsView";

export default async function AdminAdminsPage() {
  const admins = await listAdmins();

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminAdminsView admins={admins} />
    </div>
  );
}
