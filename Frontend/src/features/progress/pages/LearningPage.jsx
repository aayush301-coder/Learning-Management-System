import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, Circle, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { useCourses } from "../../courses/hooks/useCourses";
import { useSections } from "../../sections/hooks/useSections";
import { useLessons } from "../../lessons/hooks/useLessons";
import { useProgress } from "../hooks/useProgress";
import VideoPlayer from "../../lessons/components/VideoPlayer";

import Button from "../../../components/ui/Button";
import Loader from "../../../components/common/Loader";
import { formatDuration } from "../../../utils/formatters";
import { cn } from "../../../utils/cn";

function LearningPage() {
  const { courseId } = useParams();

  const { course, fetchCourseById } = useCourses();
  const { sections, fetchSectionsByCourse } = useSections();
  const { fetchLessonsBySection } = useLessons();
  const { progress, fetchProgress, completeLesson, updateLastAccessed } = useProgress();

  const [sectionsWithLessons, setSectionsWithLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await fetchCourseById(courseId);
      const sectionList = await fetchSectionsByCourse(courseId);
      const progressData = await fetchProgress(courseId);

      const withLessons = await Promise.all(
        sectionList.map(async (section) => ({
          ...section,
          lessons: await fetchLessonsBySection(section._id),
        }))
      );

      setSectionsWithLessons(withLessons);

      const allLessons = withLessons.flatMap((s) => s.lessons);
      const lastAccessedId =
        typeof progressData?.lastAccessedLesson === "object"
          ? progressData?.lastAccessedLesson?._id
          : progressData?.lastAccessedLesson;

      const initialLesson = allLessons.find((l) => l._id === lastAccessedId) || allLessons[0] || null;
      setActiveLesson(initialLesson);
    } catch {
      toast.error("You may not be enrolled in this course.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  const allLessons = useMemo(() => sectionsWithLessons.flatMap((s) => s.lessons), [sectionsWithLessons]);

  const completedLessonIds = useMemo(() => {
    if (!progress?.completedLessons) return new Set();
    return new Set(progress.completedLessons.map((l) => (typeof l === "object" ? l._id : l)));
  }, [progress]);

  const completionPercentage = progress?.completionPercentage ?? 0;

  const currentIndex = allLessons.findIndex((l) => l._id === activeLesson?._id);

  const handleSelectLesson = async (lesson) => {
    setActiveLesson(lesson);
    try {
      await updateLastAccessed(courseId, lesson._id);
    } catch {
      // non-critical — don't interrupt the learning flow
    }
  };

  const handleMarkComplete = async () => {
    if (!activeLesson) return;

    setCompleting(true);
    try {
      await completeLesson(courseId, activeLesson._id);
      toast.success("Lesson marked as complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update progress.");
    } finally {
      setCompleting(false);
    }
  };

  const goToLesson = (index) => {
    if (index >= 0 && index < allLessons.length) {
      handleSelectLesson(allLessons[index]);
    }
  };

  if (loading) {
    return <Loader text="Loading course..." />;
  }

  if (!activeLesson) {
    return (
      <div className="py-10 text-center text-sm text-ink-soft">
        This course doesn't have any lessons yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="space-y-4 lg:col-span-3">
        <Link to="/student/my-courses" className="inline-flex items-center gap-1.5 text-sm text-inkblue hover:underline">
          <ArrowLeft size={14} />
          Back to my courses
        </Link>

        <VideoPlayer videoUrl={activeLesson.videoUrl} />

        <div>
          <h1 className="font-display text-xl font-semibold text-ink">{activeLesson.title}</h1>
          {activeLesson.description && <p className="mt-2 text-sm text-ink-soft">{activeLesson.description}</p>}
        </div>

        <div className="flex items-center justify-between border-t border-ink/10 pt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => goToLesson(currentIndex - 1)} disabled={currentIndex <= 0}>
              <ChevronLeft size={16} className="mr-1 inline" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToLesson(currentIndex + 1)}
              disabled={currentIndex >= allLessons.length - 1}
            >
              Next
              <ChevronRight size={16} className="ml-1 inline" />
            </Button>
          </div>

          <Button
            size="sm"
            variant={completedLessonIds.has(activeLesson._id) ? "secondary" : "primary"}
            onClick={handleMarkComplete}
            disabled={completing}
          >
            <CheckCircle2 size={16} className="mr-1.5 inline" />
            {completedLessonIds.has(activeLesson._id) ? "Completed" : "Mark as Complete"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-ink">Progress</span>
            <span className="font-mono text-inkblue">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-paper-dim">
            <div className="h-2 rounded-full bg-highlighter transition-all" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto rounded-lg border border-ink/10">
          {sectionsWithLessons.map((section) => (
            <div key={section._id}>
              <div className="bg-paper-dim px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {section.title}
              </div>
              {section.lessons.map((lesson) => {
                const isActive = lesson._id === activeLesson._id;
                const isCompleted = completedLessonIds.has(lesson._id);

                return (
                  <button
                    key={lesson._id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={cn(
                      "flex w-full items-center gap-2 border-b border-ink/10 px-3 py-2.5 text-left text-sm transition-colors",
                      isActive ? "bg-inkblue-light text-inkblue" : "text-ink hover:bg-ink/[0.03]"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="shrink-0 text-sage" />
                    ) : (
                      <Circle size={16} className="shrink-0 text-ink/25" />
                    )}
                    <span className="flex-1 truncate">{lesson.title}</span>
                    <span className={cn("shrink-0 text-[10px]", isActive ? "text-inkblue" : "text-ink-soft")}>
                      {formatDuration(lesson.duration)}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LearningPage;
