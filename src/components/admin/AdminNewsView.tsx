import Link from "next/link";
import { formatShortDate } from "@/lib/format-kickoff";
import { KIND_LABEL, type NewsKind } from "@/components/news/types";
import { DeleteNewsButton } from "./DeleteNewsButton";
import { ADMIN_BUTTON_PRIMARY, ADMIN_EYEBROW, ADMIN_H1, ADMIN_ROW_ACTION, ADMIN_TABLE_HEAD_CELL } from "./admin-ui";

export type AdminNewsRow = {
  id: string;
  slug: string;
  title: string;
  kind: NewsKind;
  published: boolean;
  publishedAt: Date;
};

export function AdminNewsView({ articles }: { articles: AdminNewsRow[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <span className={ADMIN_EYEBROW}>CLUB NEWS · MATCH REPORTS</span>
          <h1 className={ADMIN_H1}>News</h1>
        </div>
        <Link href="/admin/news/new" className={ADMIN_BUTTON_PRIMARY}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add article
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-fg/10 bg-surface-2 shadow-resting">
        <div className="hidden grid-cols-[120px_140px_minmax(0,1fr)_110px_150px] items-center gap-4 border-b border-fg/10 px-5 py-2.5 lg:grid">
          <span className={ADMIN_TABLE_HEAD_CELL}>Date</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Kind</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Title</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Status</span>
          <span className={`${ADMIN_TABLE_HEAD_CELL} text-right`}>Actions</span>
        </div>

        {articles.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No articles yet.</p>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col gap-2 border-b border-fg/6 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[oklch(0.24_0.015_260)] lg:grid lg:grid-cols-[120px_140px_minmax(0,1fr)_110px_150px] lg:items-center lg:gap-4 lg:py-0 lg:min-h-14"
            >
              <span className="font-heading text-sm font-semibold tabular-nums">{formatShortDate(article.publishedAt)}</span>
              <span className="font-heading text-xs font-medium tracking-[0.1em] text-muted uppercase">{KIND_LABEL[article.kind]}</span>
              <span className="truncate text-[15px]">{article.title}</span>
              <span className="flex items-center gap-1.5 text-[13px] text-muted">
                <span className={`h-[7px] w-[7px] rounded-full border-[1.5px] ${article.published ? "border-accent bg-accent" : "border-muted bg-transparent"}`} />
                {article.published ? "Published" : "Draft"}
              </span>
              <span className="flex gap-2 lg:justify-end">
                <Link href={`/admin/news/${article.id}/edit`} className={ADMIN_ROW_ACTION}>
                  Edit
                </Link>
                <DeleteNewsButton id={article.id} title={article.title} />
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
