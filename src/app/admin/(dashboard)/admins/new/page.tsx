import { createAdmin } from "@/actions/admins";
import { AdminAdminForm } from "@/components/admin/AdminAdminForm";

export default function NewAdminPage() {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminAdminForm action={createAdmin} />
    </div>
  );
}
