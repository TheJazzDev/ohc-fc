import Link from "next/link";
import { listAdminFixtures } from "@/actions/fixtures";
import { AdminFixtureRow } from "@/components/admin/AdminFixtureRow";

export default async function AdminFixturesPage() {
  const fixtures = await listAdminFixtures();
  const now = new Date();
  const upcoming = fixtures.filter((fixture) => fixture.kickoff >= now).reverse();
  const past = fixtures.filter((fixture) => fixture.kickoff < now);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold uppercase sm:text-2xl">Fixtures</h1>
        <Link
          href="/admin/fixtures/new"
          className="rounded-lg bg-accent px-3.5 py-2 font-heading text-xs font-bold tracking-wide text-surface uppercase no-underline sm:text-sm"
        >
          Add fixture
        </Link>
      </div>

      {fixtures.length === 0 ? (
        <p className="text-sm text-muted">No fixtures yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-medium tracking-[0.1em] text-muted uppercase">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted">Nothing scheduled.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {upcoming.map((fixture) => (
                  <AdminFixtureRow key={fixture.id} fixture={fixture} />
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-medium tracking-[0.1em] text-muted uppercase">Past</h2>
            {past.length === 0 ? (
              <p className="text-sm text-muted">No past fixtures.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {past.map((fixture) => (
                  <AdminFixtureRow key={fixture.id} fixture={fixture} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
