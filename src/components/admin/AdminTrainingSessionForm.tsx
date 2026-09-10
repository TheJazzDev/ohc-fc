"use client";

import { useActionState } from "react";
import Link from "next/link";
import { toLondonDateTimeLocal } from "@/lib/format-kickoff";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD, ADMIN_H1, ADMIN_INPUT, ADMIN_LABEL } from "./admin-ui";

type AdminTrainingFormValues = {
  title?: string | null;
  location?: string | null;
  notes?: string | null;
  startsAt?: Date;
  recurrence?: string;
};

export function AdminTrainingSessionForm({
  action,
  initialValues,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  initialValues?: AdminTrainingFormValues;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const formId = "admin-training-session-form";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <Link href="/admin/trainings" className="flex items-center gap-1.5 font-heading text-[11px] font-medium tracking-[0.12em] text-muted uppercase no-underline hover:text-fg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back to trainings
          </Link>
          <h1 className={ADMIN_H1}>Add training session</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/trainings" className={ADMIN_BUTTON_SECONDARY}>
            Cancel
          </Link>
          <button type="submit" form={formId} disabled={pending} className={ADMIN_BUTTON_PRIMARY}>
            {pending ? "Saving..." : "Save session"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <form id={formId} action={formAction} className={`${ADMIN_CARD} mx-auto flex w-full max-w-md flex-col gap-4 lg:mx-0`}>
        <label className="flex flex-col gap-1.5">
          <span className={ADMIN_LABEL}>
            Title <span className="text-muted/80 normal-case">· optional</span>
          </span>
          <input name="title" defaultValue={initialValues?.title ?? ""} placeholder="Tuesday training" className={ADMIN_INPUT} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ADMIN_LABEL}>Date &amp; time</span>
          <input
            type="datetime-local"
            name="startsAtLocal"
            defaultValue={initialValues?.startsAt ? toLondonDateTimeLocal(initialValues.startsAt) : ""}
            required
            className={`${ADMIN_INPUT} font-heading font-medium`}
            style={{ colorScheme: "dark" }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ADMIN_LABEL}>
            Location <span className="text-muted/80 normal-case">· optional</span>
          </span>
          <input name="location" defaultValue={initialValues?.location ?? ""} placeholder="Pearson Park" className={ADMIN_INPUT} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ADMIN_LABEL}>Recurrence</span>
          <select name="recurrence" defaultValue={initialValues?.recurrence ?? "ONE_OFF"} className={`${ADMIN_INPUT} cursor-pointer`}>
            <option value="ONE_OFF">One-off</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ADMIN_LABEL}>
            Notes <span className="text-muted/80 normal-case">· optional</span>
          </span>
          <textarea
            name="notes"
            rows={3}
            defaultValue={initialValues?.notes ?? ""}
            placeholder="Shooting drills, set pieces for Saturday."
            className={`${ADMIN_INPUT} h-auto resize-y py-2.5 leading-relaxed`}
          />
        </label>
      </form>
    </div>
  );
}
