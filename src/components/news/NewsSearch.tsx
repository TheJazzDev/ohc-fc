export function NewsSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex h-11 w-full items-center gap-2.5 rounded-md border border-fg/12 bg-surface-2 px-3.5 text-muted shadow-resting sm:w-80">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search reports"
        className="min-w-0 flex-1 bg-transparent font-body text-[15px] text-fg outline-none placeholder:text-muted"
      />
    </div>
  );
}
