import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { sectionSchema } from "../schemas/sectionSchemas";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

function SectionForm({ defaultValues = {}, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: defaultValues.title || "",
      order: defaultValues.order ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Section Title *" placeholder="e.g. Getting Started" {...register("title")} error={errors.title?.message} />

      <Input label="Order" type="number" min="0" {...register("order")} error={errors.order?.message} />

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Section"}
        </Button>
      </div>
    </form>
  );
}

export default SectionForm;
