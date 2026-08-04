import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";

import { reviewSchema } from "../schemas/reviewSchemas";
import Textarea from "../../../components/ui/Textarea";
import Button from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";

function ReviewForm({ defaultValues = {}, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: defaultValues.rating || 0,
      comment: defaultValues.comment || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="rating"
        render={({ field }) => (
          <div>
            <label className="text-sm font-medium text-ink-soft">Your Rating *</label>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button type="button" key={star} onClick={() => field.onChange(star)}>
                  <Star
                    size={26}
                    className={cn(star <= field.value ? "fill-highlighter text-highlighter" : "fill-transparent text-ink/20")}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="mt-1 text-sm text-clay">{errors.rating.message}</p>}
          </div>
        )}
      />

      <Textarea
        label="Your Review"
        rows={4}
        placeholder="Share your experience with this course..."
        {...register("comment")}
        error={errors.comment?.message}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}

export default ReviewForm;
