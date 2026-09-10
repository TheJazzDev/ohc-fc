import { notFound } from "next/navigation";
import Link from "next/link";
import { getFixture, saveResult, updateFixture } from "@/actions/fixtures";
import { FixtureForm } from "@/components/admin/FixtureForm";
import { ResultForm } from "@/components/admin/ResultForm";
import { DeleteFixtureButton } from "@/components/admin/DeleteFixtureButton";

export default async function EditFixturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fixture = await getFixture(id);
  if (!fixture) notFound();

  const boundUpdate = updateFixture.bind(null, id);
  const boundResult = saveResult.bind(null, id);

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-heading text-xl font-bold uppercase sm:text-2xl">Edit fixture</h1>
      <FixtureForm action={boundUpdate} initialValues={fixture} />

      <h2 className="mt-10 mb-4 font-heading text-lg font-bold uppercase">Result</h2>
      <ResultForm action={boundResult} initialValues={fixture} />

      <div className="mt-10 flex items-center justify-between border-t border-fg/10 pt-6">
        <Link href={`/admin/fixtures/${id}/lineup`} className="text-sm text-muted no-underline hover:text-accent">
          Manage lineup
        </Link>
        <DeleteFixtureButton id={id} />
      </div>
    </div>
  );
}
