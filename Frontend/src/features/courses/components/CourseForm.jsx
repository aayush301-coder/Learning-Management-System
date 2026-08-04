import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { courseSchema } from "../schemas/courseSchemas";
import { COURSE_CATEGORIES, COURSE_LEVELS, COURSE_LANGUAGES, formatConstantLabel } from "../../../constants/courseConstants";

import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

function CourseForm({ defaultValues = {}, onSubmit, submitLabel = "Save Course", loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: defaultValues.title || "",
      description: defaultValues.description || "",
      thumbnail: defaultValues.thumbnail || "",
      category: defaultValues.category || "",
      level: defaultValues.level || "",
      language: defaultValues.language || "english",
      price: defaultValues.price ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Course Title *"
        placeholder="e.g. Complete React & Node.js Masterclass"
        {...register("title")}
        error={errors.title?.message}
      />

      <Textarea
        label="Course Description *"
        rows={5}
        placeholder="Provide a comprehensive summary of what students will learn in this course..."
        {...register("description")}
        error={errors.description?.message}
      />

      <Input
        label="Thumbnail URL"
        placeholder="https://example.com/thumbnail.jpg"
        {...register("thumbnail")}
        error={errors.thumbnail?.message}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Select label="Category *" {...register("category")} error={errors.category?.message}>
          <option value="">Select category</option>
          {COURSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {formatConstantLabel(c)}
            </option>
          ))}
        </Select>

        <Select label="Level *" {...register("level")} error={errors.level?.message}>
          <option value="">Select level</option>
          {COURSE_LEVELS.map((l) => (
            <option key={l} value={l}>
              {formatConstantLabel(l)}
            </option>
          ))}
        </Select>

        <Select label="Language" {...register("language")} error={errors.language?.message}>
          {COURSE_LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {formatConstantLabel(l)}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Price (USD)"
        type="number"
        step="0.01"
        min="0"
        placeholder="0 for a free course"
        {...register("price")}
        error={errors.price?.message}
      />

      <div className="flex justify-end border-t border-ink/10 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default CourseForm;
