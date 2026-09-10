import Link from "next/link";
import { listAdmins } from "@/actions/admins";
import { DeleteAdminButton } from "@/components/admin/DeleteAdminButton";

export default async function AdminAdminsPage() {
  const admins = await listAdmins();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold uppercase sm:text-2xl">Admins</h1>
        <Link
          href="/admin/admins/new"
          className="rounded-md bg-accent px-3.5 py-2 font-heading text-xs font-bold tracking-wide text-surface uppercase no-underline sm:text-sm"
        >
          Add admin
        </Link>
      </div>

      {admins.length === 0 ? (
        <p className="text-sm text-muted">No admins yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {admins.map((admin) => (
            <li
              key={admin.id}
              className="flex items-center justify-between gap-3 rounded-md border border-fg/10 bg-surface-2 px-3.5 py-2.5 text-sm sm:text-base"
            >
              <span className="flex flex-col">
                <span className="font-semibold">{admin.name}</span>
                <span className="text-xs text-muted">{admin.email}</span>
              </span>
              <DeleteAdminButton id={admin.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
