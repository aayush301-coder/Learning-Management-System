import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, FileEdit, Plus } from "lucide-react";

import { useAuth } from "../../../auth/hooks/useAuth";
import { useCourses } from "../../../courses/hooks/useCourses";

import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Badge from "../../../../components/ui/Badge";
import Loader from "../../../../components/common/Loader";
import ErrorState from "../../../../components/common/ErrorState";
import EmptyState from "../../../../components/common/EmptyState";
import { COURSE_STATUS_BADGES } from "../../../../constants/courseConstants";

function InstructorDashboardPage() {
  const { user } = useAuth();
  const { courses, loading, error, fetchMyCourses } = useCourses();

  useEffect(() => {
    fetchMyCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const published = courses.filter((c) => c.status === "published").length;
    const drafts = courses.filter((c) => c.status === "draft").length;
    return { total: courses.length, published, drafts };
  }, [courses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
          <p className="mt-1 text-ink-soft">Here's an overview of the courses you teach.</p>
        </div>
        <Link to="/instructor/courses/create">
          <Button size="sm">
            <Plus size={16} className="mr-1 inline" />
            New course
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-inkblue-light p-3 text-inkblue">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-ink-soft">Total courses</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-sage-soft p-3 text-sage">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.published}</p>
            <p className="text-sm text-ink-soft">Published</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-highlighter-soft p-3 text-ink">
            <FileEdit size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.drafts}</p>
            <p className="text-sm text-ink-soft">Drafts</p>
          </div>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your courses</h2>
          <Link to="/instructor/courses" className="text-sm font-medium text-inkblue hover:underline">
            Manage all
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading your courses..." />
        ) : error ? (
          <ErrorState description={error} />
        ) : courses.length === 0 ? (
          <EmptyState title="No courses yet" description="Create your first course to start teaching students." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course) => {
              const badge = COURSE_STATUS_BADGES[course.status] || { label: course.status, variant: "default" };
              return (
                <Card key={course._id} className="flex flex-col justify-between">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{course.title}</h3>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-ink-soft">{course.description}</p>
                  </div>
                  <Link to={`/instructor/courses/${course._id}/edit`} className="mt-4">
                    <Button variant="outline" className="w-full" size="sm">
                      Manage
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorDashboardPage;
