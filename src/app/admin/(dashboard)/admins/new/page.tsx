import { createAdmin } from "@/actions/admins";
import { AdminUserForm } from "@/components/admin/AdminUserForm";

export default function NewAdminPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-heading text-xl font-bold uppercase sm:text-2xl">Add admin</h1>
      <AdminUserForm action={createAdmin} />
    </div>
  );
}
