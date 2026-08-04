import RatingStars from "../../../components/common/RatingStars";
import EmptyState from "../../../components/common/EmptyState";
import { formatDate } from "../../../utils/formatters";

function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <EmptyState title="No reviews yet" description="Be the first to share your experience with this course." />;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="border-b border-ink/10 pb-4 last:border-none">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-ink to-inkblue text-sm font-bold text-white">
              {review.student?.avatar ? (
                <img src={review.student.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                (review.student?.name || "?").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{review.student?.name || "Anonymous"}</p>
              <p className="text-xs text-ink-soft">{formatDate(review.createdAt)}</p>
            </div>
          </div>

          <div className="mt-2">
            <RatingStars rating={review.rating} size={14} showValue={false} />
          </div>

          {review.comment && <p className="mt-2 text-sm text-ink-soft">{review.comment}</p>}
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
