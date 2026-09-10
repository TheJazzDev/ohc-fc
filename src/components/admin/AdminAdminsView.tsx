import Link from "next/link";
import { DeleteAdminButton } from "./DeleteAdminButton";
import { ADMIN_BUTTON_PRIMARY, ADMIN_EYEBROW, ADMIN_H1, ADMIN_TABLE_HEAD_CELL } from "./admin-ui";

export type AdminAdminRow = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export function AdminAdminsView({ admins }: { admins: AdminAdminRow[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <span className={ADMIN_EYEBROW}>ACCESS CONTROL</span>
          <h1 className={ADMIN_H1}>Admins</h1>
        </div>
        <Link href="/admin/admins/new" className={ADMIN_BUTTON_PRIMARY}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add admin
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-fg/10 bg-surface-2">
        <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_140px_100px] items-center gap-4 border-b border-fg/10 px-5 py-2.5 lg:grid">
          <span className={ADMIN_TABLE_HEAD_CELL}>Name</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Email</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Added</span>
          <span className={`${ADMIN_TABLE_HEAD_CELL} text-right`}>Actions</span>
        </div>

        {admins.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No admins yet.</p>
        ) : (
          admins.map((admin) => (
            <div
              key={admin.id}
              className="flex flex-col gap-2 border-b border-fg/6 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[oklch(0.24_0.015_260)] lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_140px_100px] lg:items-center lg:gap-4 lg:py-0 lg:min-h-14"
            >
              <span className="font-heading text-base font-semibold">{admin.name}</span>
              <span className="truncate text-sm text-muted">{admin.email}</span>
              <span className="text-sm text-muted">
                {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(admin.createdAt)}
              </span>
              <span className="flex lg:justify-end">
                <DeleteAdminButton id={admin.id} />
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
