import { notFound } from "next/navigation";
import { getTrainingAttendance, saveAttendance, updateTrainingSession } from "@/actions/trainings";
import { AdminTrainingDetail } from "@/components/admin/AdminTrainingDetail";

export default async function TrainingAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getTrainingAttendance(id);
  if (!data) notFound();

  const boundSaveAttendance = saveAttendance.bind(null, id);
  const boundUpdateSession = updateTrainingSession.bind(null, id);

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminTrainingDetail
        session={data.session}
        roster={data.roster}
        saveAttendanceAction={boundSaveAttendance}
        updateSessionAction={boundUpdateSession}
      />
    </div>
  );
}
