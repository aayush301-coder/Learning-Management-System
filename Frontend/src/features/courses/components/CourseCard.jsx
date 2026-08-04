import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";

import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import RatingStars from "../../../components/common/RatingStars";
import { formatCurrency } from "../../../utils/formatters";
import { formatConstantLabel } from "../../../constants/courseConstants";

function CourseCard({ course, linkTo }) {
  return (
    <Link to={linkTo || `/student/courses/${course._id}`}>
      <Card accent="highlighter" className="flex h-full flex-col p-0 pl-0">
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-paper-dim">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-2xl text-ink/20">
              {course.title?.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="info">{formatConstantLabel(course.level)}</Badge>
            <Badge variant="default">{formatConstantLabel(course.category)}</Badge>
          </div>

          <h3 className="font-display line-clamp-2 font-semibold text-ink">{course.title}</h3>

          <p className="line-clamp-2 text-sm text-ink-soft">{course.description}</p>

          <div className="mt-auto flex items-center justify-between pt-2">
            <RatingStars rating={course.ratingAverage} size={14} />
            <span className="font-mono text-sm font-semibold text-ink">{formatCurrency(course.price)}</span>
          </div>

          {course.instructor?.name && (
            <div className="flex items-center gap-1.5 text-xs text-ink-soft">
              <User size={12} />
              {course.instructor.name}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default CourseCard;
