import { notFound } from "next/navigation";
import Link from "next/link";
import { getFixture, saveResult, updateFixture } from "@/actions/fixtures";
import { AdminFixtureForm } from "@/components/admin/AdminFixtureForm";
import { ResultForm } from "@/components/admin/ResultForm";
import { DeleteFixtureButton } from "@/components/admin/DeleteFixtureButton";
import { ADMIN_CARD, ADMIN_LABEL } from "@/components/admin/admin-ui";

export default async function EditFixturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fixture = await getFixture(id);
  if (!fixture) notFound();

  const boundUpdate = updateFixture.bind(null, id);
  const boundResult = saveResult.bind(null, id);

  return (
    <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminFixtureForm action={boundUpdate} initialValues={fixture} />

      <div className={`${ADMIN_CARD} mx-auto w-full max-w-md flex flex-col gap-5 lg:mx-0`}>
        <span className={ADMIN_LABEL}>Result</span>
        <ResultForm action={boundResult} initialValues={fixture} />
      </div>

      <div className="mx-auto flex w-full max-w-md items-center justify-between border-t border-fg/10 pt-6 lg:mx-0">
        <Link href={`/admin/fixtures/${id}/lineup`} className="text-sm text-muted no-underline hover:text-accent">
          Manage lineup
        </Link>
        <DeleteFixtureButton id={id} />
      </div>
    </div>
  );
}
