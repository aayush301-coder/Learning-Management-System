import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { BookOpen, PlayCircle, GraduationCap } from "lucide-react";

import { useAuth } from "../../../auth/hooks/useAuth";
import { useEnrollments } from "../../../enrollments/hooks/useEnrollments";
import { getStudentProgressRequest } from "../../../progress/api/progressApi";

import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Loader from "../../../../components/common/Loader";
import ErrorState from "../../../../components/common/ErrorState";
import EmptyState from "../../../../components/common/EmptyState";

function StudentDashboardPage() {
  const { user } = useAuth();
  const { enrollments, loading, error, fetchMyEnrollments } = useEnrollments();
  const [progressByCourse, setProgressByCourse] = useState({});

  useEffect(() => {
    fetchMyEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const courses = useMemo(
    () => enrollments.map((e) => (typeof e.course === "object" ? e.course : null)).filter(Boolean),
    [enrollments]
  );

  const loadProgress = useCallback(async (courseList) => {
    const results = await Promise.allSettled(courseList.map((c) => getStudentProgressRequest(c._id)));

    const map = {};
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        map[courseList[index]._id] = result.value.data?.data;
      }
    });
    setProgressByCourse(map);
  }, []);

  useEffect(() => {
    if (courses.length > 0) loadProgress(courses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses.length]);

  const completedCount = Object.values(progressByCourse).filter((p) => p?.completionStatus === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
        <p className="mt-1 text-ink-soft">Here's a quick look at your learning so far.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-inkblue-light p-3 text-inkblue">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{courses.length}</p>
            <p className="text-sm text-ink-soft">Enrolled courses</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-sage-soft p-3 text-sage">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-sm text-ink-soft">Completed</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-highlighter-soft p-3 text-ink">
            <PlayCircle size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{Math.max(courses.length - completedCount, 0)}</p>
            <p className="text-sm text-ink-soft">In progress</p>
          </div>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Continue learning</h2>
          <Link to="/student/my-courses" className="text-sm font-medium text-inkblue hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading your courses..." />
        ) : error ? (
          <ErrorState description={error} />
        ) : courses.length === 0 ? (
          <EmptyState title="No enrolled courses yet" description="Browse the catalog and enroll in a course to get started." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course) => {
              const progress = progressByCourse[course._id];
              return (
                <Card key={course._id} className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{course.description}</p>
                    {progress && (
                      <div className="mt-3">
                        <div className="h-2 w-full rounded-full bg-paper-dim">
                          <div className="h-2 rounded-full bg-highlighter" style={{ width: `${progress.completionPercentage || 0}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-ink-soft">{progress.completionPercentage || 0}% complete</p>
                      </div>
                    )}
                  </div>
                  <Link to={`/student/learning/${course._id}`} className="mt-4">
                    <Button className="w-full" size="sm">
                      Continue
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">Looking for something new to learn?</p>
        <Link to="/student/courses">
          <Button variant="outline" size="sm">
            Browse courses
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default StudentDashboardPage;
