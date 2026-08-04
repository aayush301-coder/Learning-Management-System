import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PlayCircle, Lock, Clock, BookOpen } from "lucide-react";

import { useAuth } from "../../auth/hooks/useAuth";
import { useCourses } from "../hooks/useCourses";
import { useSections } from "../../sections/hooks/useSections";
import { useLessons } from "../../lessons/hooks/useLessons";
import { useEnrollments } from "../../enrollments/hooks/useEnrollments";
import { useReviews } from "../../reviews/hooks/useReviews";

import ReviewList from "../../reviews/components/ReviewList";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Loader from "../../../components/common/Loader";
import ErrorState from "../../../components/common/ErrorState";
import RatingStars from "../../../components/common/RatingStars";
import { formatCurrency, formatDuration } from "../../../utils/formatters";
import { formatConstantLabel } from "../../../constants/courseConstants";

function StudentCourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { course, loading, error, fetchCourseById } = useCourses();
  const { sections, fetchSectionsByCourse } = useSections();
  const { fetchLessonsBySection } = useLessons();
  const { enrollInCourse } = useEnrollments();
  const { reviews, fetchReviewsByCourse } = useReviews();

  const [sectionsWithLessons, setSectionsWithLessons] = useState([]);
  const [enrolling, setEnrolling] = useState(false);

  const loadCourseContent = useCallback(async () => {
    await fetchCourseById(courseId);
    const sectionList = await fetchSectionsByCourse(courseId);
    await fetchReviewsByCourse(courseId);

    const withLessons = await Promise.all(
      sectionList.map(async (section) => ({
        ...section,
        lessons: await fetchLessonsBySection(section._id),
      }))
    );

    setSectionsWithLessons(withLessons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    loadCourseContent();
  }, [loadCourseContent]);

  const totalLessons = sectionsWithLessons.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      await enrollInCourse(courseId);
      toast.success("Enrolled successfully! Redirecting to your course...");
      navigate(`/student/learning/${courseId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enroll.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading && !course) {
    return <Loader text="Loading course..." />;
  }

  if (error) {
    return <ErrorState description={error} />;
  }

  if (!course) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="info">{formatConstantLabel(course.level)}</Badge>
            <Badge variant="default">{formatConstantLabel(course.category)}</Badge>
          </div>

          <h1 className="font-display text-3xl font-semibold text-ink">{course.title}</h1>
          <p className="mt-3 text-ink-soft">{course.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
            <RatingStars rating={course.ratingAverage} />
            <span>{course.ratingCount || 0} reviews</span>
            <span className="flex items-center gap-1">
              <BookOpen size={14} /> {totalLessons} lessons
            </span>
            {course.instructor?.name && <span>By {course.instructor.name}</span>}
          </div>
        </div>

        <Card>
          <h2 className="font-display mb-4 text-lg font-semibold text-ink">Course Content</h2>

          <div className="space-y-3">
            {sectionsWithLessons.map((section) => (
              <div key={section._id} className="rounded-md border border-ink/10">
                <div className="bg-paper-dim px-4 py-2 text-sm font-semibold text-ink">{section.title}</div>
                <div className="divide-y divide-ink/10">
                  {section.lessons.map((lesson) => (
                    <div key={lesson._id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <div className="flex items-center gap-2 text-ink-soft">
                        {lesson.isPreview ? <PlayCircle size={16} className="text-inkblue" /> : <Lock size={14} />}
                        {lesson.title}
                      </div>
                      <span className="flex items-center gap-1 text-xs text-ink-soft">
                        <Clock size={12} /> {formatDuration(lesson.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display mb-4 text-lg font-semibold text-ink">Student Reviews</h2>
          <ReviewList reviews={reviews} />
        </Card>
      </div>

      <div>
        <Card accent="highlighter" className="sticky top-20">
          <div className="aspect-video w-full overflow-hidden rounded-md bg-paper-dim">
            {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />}
          </div>

          <p className="mt-4 font-mono text-3xl font-semibold text-ink">{formatCurrency(course.price)}</p>

          <Button onClick={handleEnroll} disabled={enrolling} className="mt-4 w-full">
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default StudentCourseDetailPage;
