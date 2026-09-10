import { createTrainingSession } from "@/actions/trainings";
import { AdminTrainingSessionForm } from "@/components/admin/AdminTrainingSessionForm";

export default function NewTrainingSessionPage() {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminTrainingSessionForm action={createTrainingSession} />
    </div>
  );
}
