"use client";

import { useActionState } from "react";
import { COMPETITIONS } from "@/lib/competitions";
import { toLondonDateTimeLocal } from "@/lib/format-kickoff";

type FixtureFormValues = {
  opponent?: string;
  competition?: string;
  round?: string | null;
  kickoff?: Date;
  venue?: string;
  ground?: string | null;
};

const INPUT_CLASS =
  "rounded-md border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base";

export function FixtureForm({
  action,
  initialValues,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  initialValues?: FixtureFormValues;
}) {
  const [error, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        Opponent
        <input name="opponent" defaultValue={initialValues?.opponent} required className={INPUT_CLASS} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Competition
        <select name="competition" defaultValue={initialValues?.competition ?? COMPETITIONS[0]} className={INPUT_CLASS}>
          {COMPETITIONS.map((competition) => (
            <option key={competition} value={competition}>
              {competition}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Round <span className="text-xs text-muted">(optional)</span>
        <input name="round" defaultValue={initialValues?.round ?? ""} placeholder="Second Round" className={INPUT_CLASS} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Kickoff
        <input
          type="datetime-local"
          name="kickoffLocal"
          defaultValue={initialValues?.kickoff ? toLondonDateTimeLocal(initialValues.kickoff) : ""}
          required
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Venue
        <select name="venue" defaultValue={initialValues?.venue ?? "HOME"} className={INPUT_CLASS}>
          <option value="HOME">Home</option>
          <option value="AWAY">Away</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Ground <span className="text-xs text-muted">(optional — defaults to Pearson Park at home)</span>
        <input name="ground" defaultValue={initialValues?.ground ?? ""} className={INPUT_CLASS} />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 cursor-pointer rounded-md bg-accent px-4 py-2.5 font-heading text-sm font-bold tracking-wide text-surface uppercase disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
      >
        {pending ? "Saving..." : "Save fixture"}
      </button>
    </form>
  );
}
