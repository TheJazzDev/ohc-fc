import { listAdminFixtures } from "@/actions/fixtures";
import { AdminFixturesView } from "@/components/admin/AdminFixturesView";

export default async function AdminFixturesPage() {
  const fixtures = await listAdminFixtures();
  const playedCount = fixtures.filter((f) => f.status === "PLAYED").length;
  const upcomingCount = fixtures.filter((f) => f.status !== "PLAYED").length;

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminFixturesView fixtures={fixtures} playedCount={playedCount} upcomingCount={upcomingCount} />
    </div>
  );
}
