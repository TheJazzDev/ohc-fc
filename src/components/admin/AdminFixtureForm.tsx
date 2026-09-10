"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { COMPETITIONS } from "@/lib/competitions";
import { toLondonDateTimeLocal } from "@/lib/format-kickoff";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD, ADMIN_H1, ADMIN_INPUT, ADMIN_LABEL } from "./admin-ui";

type AdminFixtureFormValues = {
  id?: string;
  opponent?: string;
  competition?: string;
  round?: string | null;
  kickoff?: Date;
  venue?: string;
  ground?: string | null;
};

export function AdminFixtureForm({
  action,
  initialValues,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  initialValues?: AdminFixtureFormValues;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const [opponent, setOpponent] = useState(initialValues?.opponent ?? "");
  const [competition, setCompetition] = useState(initialValues?.competition ?? COMPETITIONS[0]);
  const [round, setRound] = useState(initialValues?.round ?? "");
  const [kickoffLocal, setKickoffLocal] = useState(initialValues?.kickoff ? toLondonDateTimeLocal(initialValues.kickoff) : "");
  const [venue, setVenue] = useState(initialValues?.venue ?? "HOME");
  const [ground, setGround] = useState(initialValues?.ground ?? "");

  const isEdit = Boolean(initialValues?.id);
  const formId = "admin-fixture-form";

  const kickDate = kickoffLocal ? new Date(kickoffLocal) : null;
  const kickSummary =
    kickDate && !isNaN(kickDate.getTime())
      ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" }).format(kickDate) +
        " · " +
        new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true }).format(kickDate)
      : "Kickoff to be confirmed";
  const fxSummary = `${kickSummary} · ${competition}${round ? `, ${round.toLowerCase()}` : ""} · ${venue === "HOME" ? ground || "Pearson Park" : ground || "Away"}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <Link href="/admin/fixtures" className="flex items-center gap-1.5 font-heading text-[11px] font-medium tracking-[0.12em] text-muted uppercase no-underline hover:text-fg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back to fixtures
          </Link>
          <h1 className={ADMIN_H1}>{isEdit ? "Edit fixture" : "Add fixture"}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/fixtures" className={ADMIN_BUTTON_SECONDARY}>
            Cancel
          </Link>
          <button type="submit" form={formId} disabled={pending} className={ADMIN_BUTTON_PRIMARY}>
            {pending ? "Saving..." : "Save fixture"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <form id={formId} action={formAction} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className={`${ADMIN_CARD} flex flex-col gap-5`}>
          <span className={ADMIN_LABEL}>Match details</span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Opponent</span>
              <input name="opponent" value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="e.g. Thornbridge Athletic" required className={ADMIN_INPUT} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Competition</span>
              <select name="competition" value={competition} onChange={(e) => setCompetition(e.target.value)} className={`${ADMIN_INPUT} cursor-pointer`}>
                {COMPETITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>
                Round <span className="text-muted/80 normal-case">· optional</span>
              </span>
              <input name="round" value={round} onChange={(e) => setRound(e.target.value)} placeholder="e.g. Second round" className={ADMIN_INPUT} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Kickoff</span>
              <input
                type="datetime-local"
                name="kickoffLocal"
                value={kickoffLocal}
                onChange={(e) => setKickoffLocal(e.target.value)}
                required
                className={`${ADMIN_INPUT} font-heading font-medium`}
                style={{ colorScheme: "dark" }}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Venue</span>
              <select name="venue" value={venue} onChange={(e) => setVenue(e.target.value)} className={`${ADMIN_INPUT} cursor-pointer`}>
                <option value="HOME">Home</option>
                <option value="AWAY">Away</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>
                Ground <span className="text-muted/80 normal-case">· optional</span>
              </span>
              <input name="ground" value={ground} onChange={(e) => setGround(e.target.value)} placeholder="Defaults to Pearson Park" className={ADMIN_INPUT} />
            </label>
          </div>
        </div>

        <div className={`${ADMIN_CARD} flex flex-col gap-4`}>
          <span className={ADMIN_LABEL}>How it will appear</span>
          <div className="flex flex-col gap-2 rounded-md border border-fg/10 bg-surface p-[18px]">
            <span className="font-heading text-[11px] font-semibold tracking-[0.14em] text-accent">NEXT MATCH</span>
            <span className="font-heading text-xl leading-tight font-semibold">vs {opponent || "Opponent"}</span>
            <span className="text-sm leading-relaxed text-muted">{fxSummary}</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className={ADMIN_LABEL}>Next steps</span>
            <p className="m-0 text-sm leading-relaxed text-muted">
              Saving creates the fixture{isEdit ? "" : " and an empty lineup"}. Build the XI from the fixtures list when the team is picked.
            </p>
            <button
              type="submit"
              form={formId}
              name="intent"
              value="lineup"
              disabled={pending}
              className="h-[38px] cursor-pointer rounded-md border border-accent bg-transparent font-heading text-[13px] font-semibold tracking-[0.08em] text-accent uppercase transition-colors hover:bg-accent/12 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save and build lineup
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
