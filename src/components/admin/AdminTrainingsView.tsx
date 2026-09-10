import Link from "next/link";
import { formatShortDate, formatTime } from "@/lib/format-kickoff";
import { ADMIN_BUTTON_PRIMARY, ADMIN_EYEBROW, ADMIN_H1, ADMIN_ROW_ACTION, ADMIN_TABLE_HEAD_CELL } from "./admin-ui";

export type AdminTrainingRow = {
  id: string;
  title: string | null;
  location: string | null;
  startsAt: Date;
  recurrence: "ONE_OFF" | "WEEKLY";
  presentCount: number;
  markedCount: number;
  past: boolean;
};

export function AdminTrainingsView({ sessions, rosterSize }: { sessions: AdminTrainingRow[]; rosterSize: number }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <span className={ADMIN_EYEBROW}>ADMIN ONLY · NOT PUBLISHED</span>
          <h1 className={ADMIN_H1}>Trainings</h1>
        </div>
        <Link href="/admin/trainings/new" className={ADMIN_BUTTON_PRIMARY}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add session
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-fg/10 bg-surface-2 shadow-resting">
        <div className="hidden grid-cols-[140px_90px_minmax(0,1.4fr)_minmax(0,1.2fr)_180px_200px] items-center gap-4 border-b border-fg/10 px-5 py-2.5 lg:grid">
          <span className={ADMIN_TABLE_HEAD_CELL}>Date</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Time</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Session</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Location</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Attendance</span>
          <span className={`${ADMIN_TABLE_HEAD_CELL} text-right`}>Actions</span>
        </div>

        {sessions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No training sessions yet.</p>
        ) : (
          sessions.map((session) => {
            const pct = session.past && rosterSize > 0 ? Math.round((session.presentCount / rosterSize) * 100) : 0;
            return (
              <div
                key={session.id}
                className="flex flex-col gap-2 border-b border-fg/6 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[oklch(0.24_0.015_260)] lg:grid lg:grid-cols-[140px_90px_minmax(0,1.4fr)_minmax(0,1.2fr)_180px_200px] lg:items-center lg:gap-4 lg:py-0 lg:min-h-14"
              >
                <span className={`font-heading text-[15px] font-semibold tabular-nums ${session.past ? "text-fg" : "text-accent"}`}>{formatShortDate(session.startsAt)}</span>
                <span className="font-heading text-sm font-medium tabular-nums text-muted">{formatTime(session.startsAt)}</span>
                <span className="truncate text-[15px]">
                  {session.title || "Training"}
                  {session.recurrence === "WEEKLY" && <span className="ml-1.5 text-xs text-muted uppercase">Weekly</span>}
                </span>
                <span className="truncate text-sm text-muted">{session.location || "—"}</span>
                <span className="flex items-center gap-2.5">
                  {session.past ? (
                    <>
                      <span className="relative h-1.5 w-18 flex-none overflow-hidden rounded-full bg-fg/12">
                        <span className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="font-heading text-[13px] font-semibold tabular-nums">
                        {session.presentCount} / {rosterSize}
                      </span>
                    </>
                  ) : (
                    <span className="font-heading text-[13px] font-semibold text-muted uppercase">Not taken</span>
                  )}
                </span>
                <span className="flex gap-2 lg:justify-end">
                  <Link href={`/admin/trainings/${session.id}/attendance`} className={ADMIN_ROW_ACTION}>
                    Attendance
                  </Link>
                  <Link href={`/admin/trainings/${session.id}/attendance`} className={ADMIN_ROW_ACTION}>
                    Edit
                  </Link>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
