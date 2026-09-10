import { createFixture } from "@/actions/fixtures";
import { FixtureForm } from "@/components/admin/FixtureForm";

export default function NewFixturePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-heading text-xl font-bold uppercase sm:text-2xl">Add fixture</h1>
      <FixtureForm action={createFixture} />
    </div>
  );
}
