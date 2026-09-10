import { listTrainingSessions } from "@/actions/trainings";
import { AdminTrainingsView } from "@/components/admin/AdminTrainingsView";

export default async function AdminTrainingsPage() {
  const { sessions, rosterSize } = await listTrainingSessions();

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminTrainingsView sessions={sessions} rosterSize={rosterSize} />
    </div>
  );
}
