"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { toLondonDateTimeLocal, formatShortDate, formatTime } from "@/lib/format-kickoff";
import { DeleteTrainingButton } from "./DeleteTrainingButton";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD, ADMIN_INPUT, ADMIN_LABEL } from "./admin-ui";

export type AttendanceStatus = "PENDING" | "PRESENT" | "ABSENT";

export type AttendanceRosterEntry = {
  id: string;
  name: string;
  number: number;
  position: string;
  status: AttendanceStatus;
  history: AttendanceStatus[];
};

type SessionValues = {
  id: string;
  title: string | null;
  location: string | null;
  notes: string | null;
  startsAt: Date;
  recurrence: "ONE_OFF" | "WEEKLY";
};

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "PENDING", label: "Pending" },
];

function historyColor(status: AttendanceStatus) {
  if (status === "PRESENT") return "bg-accent";
  if (status === "ABSENT") return "bg-fg/14";
  return "bg-fg/[0.08]";
}

export function AdminTrainingDetail({
  session,
  roster,
  saveAttendanceAction,
  updateSessionAction,
}: {
  session: SessionValues;
  roster: AttendanceRosterEntry[];
  saveAttendanceAction: (prevState: string | null, formData: FormData) => Promise<string | null>;
  updateSessionAction: (prevState: string | null, formData: FormData) => Promise<string | null>;
}) {
  const [attError, attFormAction, attPending] = useActionState(saveAttendanceAction, null);
  const [detailsError, detailsFormAction, detailsPending] = useActionState(updateSessionAction, null);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() =>
    Object.fromEntries(roster.map((p) => [p.id, p.status])),
  );

  const attFormId = "admin-training-attendance-form";
  const detailsFormId = "admin-training-details-form";

  const summary = useMemo(() => {
    const values = Object.values(attendance);
    return {
      present: values.filter((s) => s === "PRESENT").length,
      absent: values.filter((s) => s === "ABSENT").length,
      pending: values.filter((s) => s === "PENDING").length,
    };
  }, [attendance]);

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
          <h1 className="m-0 font-heading text-2xl leading-none font-bold tracking-[-0.005em] uppercase sm:text-[34px]">
            {session.title || "Training"} · {formatShortDate(session.startsAt)}
          </h1>
          <span className="text-sm text-muted">
            {formatTime(session.startsAt)}
            {session.location ? ` · ${session.location}` : ""} · {roster.length} players on the list
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAttendance(Object.fromEntries(roster.map((p) => [p.id, "PRESENT" as AttendanceStatus])))}
            className={ADMIN_BUTTON_SECONDARY}
          >
            Mark all present
          </button>
          <button type="submit" form={attFormId} disabled={attPending} className={ADMIN_BUTTON_PRIMARY}>
            {attPending ? "Saving..." : "Save attendance"}
          </button>
        </div>
      </div>

      {attError && <p className="text-sm text-red-400">{attError}</p>}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form id={attFormId} action={attFormAction} className="overflow-hidden rounded-md border border-fg/10 bg-surface-2">
          {roster.map((player) => (
            <input key={player.id} type="hidden" name={`status-${player.id}`} value={attendance[player.id]} />
          ))}
          <div className="hidden grid-cols-[52px_minmax(0,1.6fr)_80px_minmax(0,1fr)_270px] items-center gap-4 border-b border-fg/10 px-5 py-2.5 lg:grid">
            <span className={ADMIN_LABEL}>No.</span>
            <span className={ADMIN_LABEL}>Player</span>
            <span className={ADMIN_LABEL}>Pos</span>
            <span className={ADMIN_LABEL}>Last 4</span>
            <span className={`${ADMIN_LABEL} text-right`}>Attendance</span>
          </div>
          {roster.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted">No active players to mark yet.</p>
          ) : (
            roster.map((player) => (
              <div
                key={player.id}
                className="flex flex-col gap-3 border-b border-fg/6 px-5 py-3 transition-colors last:border-b-0 hover:bg-[oklch(0.24_0.015_260)] lg:grid lg:grid-cols-[52px_minmax(0,1.6fr)_80px_minmax(0,1fr)_270px] lg:items-center lg:gap-4 lg:py-0 lg:min-h-13"
              >
                <span className="font-heading text-sm font-bold tabular-nums tracking-tight text-accent" style={{ transform: "skewX(-7deg)" }}>
                  {player.number}
                </span>
                <span className="font-heading text-[15px] leading-tight font-semibold">{player.name}</span>
                <span className="font-heading text-xs font-medium tracking-[0.1em] text-muted">{player.position}</span>
                <span className="flex gap-1">
                  {player.history.map((status, i) => (
                    <span key={i} className={`h-1.5 w-4 rounded-full ${historyColor(status)}`} />
                  ))}
                </span>
                <span className="grid w-full grid-cols-3 gap-0.5 rounded-md border border-fg/12 bg-surface p-[3px] lg:w-[270px] lg:justify-self-end">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAttendance((prev) => ({ ...prev, [player.id]: option.value }))}
                      className={`h-[30px] cursor-pointer rounded-md font-heading text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors ${
                        attendance[player.id] === option.value
                          ? option.value === "PRESENT"
                            ? "bg-accent text-surface"
                            : "bg-fg text-surface"
                          : "text-muted hover:text-fg"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </span>
              </div>
            ))
          )}
        </form>

        <div className="flex flex-col gap-4">
          <div className={`${ADMIN_CARD} flex flex-col gap-4`}>
            <span className={ADMIN_LABEL}>This session</span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "PRESENT", value: summary.present, accent: true },
                { label: "ABSENT", value: summary.absent, accent: false },
                { label: "PENDING", value: summary.pending, muted: true },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1 rounded-md border border-fg/10 bg-surface p-3">
                  <span className={`font-heading text-2xl leading-none font-bold tabular-nums ${stat.accent ? "text-accent" : stat.muted ? "text-muted" : "text-fg"}`}>
                    {stat.value}
                  </span>
                  <span className="font-heading text-[10px] font-medium tracking-[0.12em] text-muted uppercase">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <form id={detailsFormId} action={detailsFormAction} className={`${ADMIN_CARD} flex flex-col gap-4`}>
            <span className={ADMIN_LABEL}>Session details</span>
            {detailsError && <p className="text-sm text-red-400">{detailsError}</p>}
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>
                Label <span className="text-muted/80 normal-case">· optional</span>
              </span>
              <input name="title" defaultValue={session.title ?? ""} placeholder="Tuesday training" className={ADMIN_INPUT} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Date &amp; time</span>
              <input
                type="datetime-local"
                name="startsAtLocal"
                defaultValue={toLondonDateTimeLocal(session.startsAt)}
                required
                className={`${ADMIN_INPUT} font-heading font-medium`}
                style={{ colorScheme: "dark" }}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>
                Location <span className="text-muted/80 normal-case">· optional</span>
              </span>
              <input name="location" defaultValue={session.location ?? ""} placeholder="Pearson Park" className={ADMIN_INPUT} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Recurrence</span>
              <select name="recurrence" defaultValue={session.recurrence} className={`${ADMIN_INPUT} cursor-pointer`}>
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
                defaultValue={session.notes ?? ""}
                placeholder="Shooting drills, set pieces for Saturday."
                className={`${ADMIN_INPUT} h-auto resize-y py-2.5 leading-relaxed`}
              />
            </label>
            <div className="flex gap-2">
              <DeleteTrainingButton id={session.id} />
              <button type="submit" disabled={detailsPending} className={`${ADMIN_BUTTON_SECONDARY} flex-1 justify-center border-accent text-accent hover:bg-accent/12`}>
                {detailsPending ? "Saving..." : "Save details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
