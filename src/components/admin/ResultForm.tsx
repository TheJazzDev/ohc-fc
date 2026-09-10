"use client";

import { useActionState } from "react";

type ResultFormValues = {
  status?: string;
  ourScore?: number | null;
  theirScore?: number | null;
  scorers?: string | null;
};

const INPUT_CLASS =
  "rounded-lg border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base";

export function ResultForm({
  action,
  initialValues,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  initialValues?: ResultFormValues;
}) {
  const [error, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        Status
        <select name="status" defaultValue={initialValues?.status ?? "SCHEDULED"} className={INPUT_CLASS}>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PLAYED">Played</option>
          <option value="POSTPONED">Postponed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </label>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          OHC FC
          <input
            name="ourScore"
            type="number"
            min={0}
            defaultValue={initialValues?.ourScore ?? ""}
            className={INPUT_CLASS}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          Opponent
          <input
            name="theirScore"
            type="number"
            min={0}
            defaultValue={initialValues?.theirScore ?? ""}
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        Scorers <span className="text-xs text-muted">(optional)</span>
        <input
          name="scorers"
          defaultValue={initialValues?.scorers ?? ""}
          placeholder="Adeyemi 23', 71'"
          className={INPUT_CLASS}
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-accent px-4 py-2.5 font-heading text-sm font-bold tracking-wide text-surface uppercase disabled:opacity-50 sm:text-base"
      >
        {pending ? "Saving..." : "Save result"}
      </button>
    </form>
  );
}
