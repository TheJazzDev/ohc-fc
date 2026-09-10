import { createFixture } from "@/actions/fixtures";
import { AdminFixtureForm } from "@/components/admin/AdminFixtureForm";

export default function NewFixturePage() {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminFixtureForm action={createFixture} />
    </div>
  );
}
