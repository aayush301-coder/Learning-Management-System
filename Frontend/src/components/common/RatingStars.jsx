import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

function RatingStars({ rating = 0, size = 16, showValue = true }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            star <= Math.round(rating) ? "fill-highlighter text-highlighter" : "fill-transparent text-ink/20"
          )}
        />
      ))}

      {showValue && <span className="ml-1 text-sm text-ink-soft">{rating ? rating.toFixed(1) : "New"}</span>}
    </div>
  );
}

export default RatingStars;
