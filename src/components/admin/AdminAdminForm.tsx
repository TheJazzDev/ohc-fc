"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD, ADMIN_H1, ADMIN_INPUT, ADMIN_LABEL } from "./admin-ui";

export function AdminAdminForm({
  action,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const formId = "admin-admin-form";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <Link href="/admin/admins" className="flex items-center gap-1.5 font-heading text-[11px] font-medium tracking-[0.12em] text-muted uppercase no-underline hover:text-fg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back to admins
          </Link>
          <h1 className={ADMIN_H1}>Add admin</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/admins" className={ADMIN_BUTTON_SECONDARY}>
            Cancel
          </Link>
          <button type="submit" form={formId} disabled={pending} className={ADMIN_BUTTON_PRIMARY}>
            {pending ? "Saving..." : "Add admin"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <form id={formId} action={formAction} className={`${ADMIN_CARD} mx-auto flex w-full max-w-md flex-col gap-4 lg:mx-0`}>
        <label className="flex flex-col gap-1.5">
          <span className={ADMIN_LABEL}>Name</span>
          <input name="name" required className={ADMIN_INPUT} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ADMIN_LABEL}>Email</span>
          <input name="email" type="email" required className={ADMIN_INPUT} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ADMIN_LABEL}>
            Password <span className="text-muted/80 normal-case">· at least 8 characters</span>
          </span>
          <input name="password" type="password" minLength={8} required className={ADMIN_INPUT} />
        </label>
      </form>
    </div>
  );
}
