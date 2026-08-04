import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { lessonSchema } from "../schemas/lessonSchemas";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Button from "../../../components/ui/Button";

function LessonForm({ defaultValues = {}, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: defaultValues.title || "",
      description: defaultValues.description || "",
      videoUrl: defaultValues.videoUrl || "",
      duration: defaultValues.duration ?? 0,
      order: defaultValues.order ?? 0,
      isPreview: defaultValues.isPreview ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Lesson Title *" placeholder="e.g. Introduction to Hooks" {...register("title")} error={errors.title?.message} />

      <Textarea
        label="Description"
        rows={3}
        placeholder="What will students learn in this lesson?"
        {...register("description")}
        error={errors.description?.message}
      />

      <Input
        label="YouTube Video URL"
        placeholder="https://www.youtube.com/watch?v=..."
        {...register("videoUrl")}
        error={errors.videoUrl?.message}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Duration (minutes)" type="number" min="0" {...register("duration")} error={errors.duration?.message} />
        <Input label="Order" type="number" min="0" {...register("order")} error={errors.order?.message} />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" className="h-4 w-4 rounded border-ink/20" {...register("isPreview")} />
        Allow free preview (visible without enrolling)
      </label>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Lesson"}
        </Button>
      </div>
    </form>
  );
}

export default LessonForm;
