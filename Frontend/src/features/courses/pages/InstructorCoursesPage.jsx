import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Send, EyeOff } from "lucide-react";

import { useCourses } from "../hooks/useCourses";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Loader from "../../../components/common/Loader";
import ErrorState from "../../../components/common/ErrorState";
import EmptyState from "../../../components/common/EmptyState";
import { formatCurrency } from "../../../utils/formatters";
import { COURSE_STATUS_BADGES } from "../../../constants/courseConstants";

function InstructorCoursesPage() {
  const {
    courses,
    loading,
    error,
    fetchMyCourses,
    deleteCourse,
    submitForReview,
    unpublishCourse,
  } = useCourses();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => fetchMyCourses();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withBusy = (fn, successMessage) => async (courseId) => {
    setBusyId(courseId);
    try {
      await fn(courseId);
      toast.success(successMessage);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmitForReview = withBusy(submitForReview, "Course submitted for review.");
  const handleUnpublish = withBusy(unpublishCourse, "Course unpublished.");

  const handleDeleteConfirmed = async () => {
    try {
      await deleteCourse(deleteTarget._id);
      toast.success("Course deleted.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete course.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">My Courses</h1>
          <p className="mt-1 text-sm text-ink-soft">Create, manage, and track the status of your courses.</p>
        </div>
        <Link to="/instructor/courses/create">
          <Button size="sm">
            <Plus size={16} className="mr-1.5 inline" />
            New Course
          </Button>
        </Link>
      </div>

      {loading ? (
        <Loader text="Loading your courses..." />
      ) : error ? (
        <ErrorState description={error} />
      ) : courses.length === 0 ? (
        <EmptyState title="No courses yet" description="Create your first course to start teaching." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const badge = COURSE_STATUS_BADGES[course.status] || { label: course.status, variant: "default" };
            const isBusy = busyId === course._id;

            return (
              <Card key={course._id} className="flex flex-col justify-between">
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ink">{course.title}</h3>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-ink-soft">{course.description}</p>
                  <p className="mt-2 font-mono text-sm font-semibold text-ink">{formatCurrency(course.price)}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-3">
                  <Link to={`/instructor/courses/${course._id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil size={14} className="mr-1 inline" />
                      Edit
                    </Button>
                  </Link>

                  {course.status === "draft" && (
                    <Button variant="secondary" size="sm" disabled={isBusy} onClick={() => handleSubmitForReview(course._id)}>
                      <Send size={14} className="mr-1 inline" />
                      Submit for Review
                    </Button>
                  )}

                  {course.status === "published" && (
                    <Button variant="secondary" size="sm" disabled={isBusy} onClick={() => handleUnpublish(course._id)}>
                      <EyeOff size={14} className="mr-1 inline" />
                      Unpublish
                    </Button>
                  )}

                  {course.status !== "published" && (
                    <Button variant="danger" size="sm" onClick={() => setDeleteTarget(course)}>
                      <Trash2 size={14} className="mr-1 inline" />
                      Delete
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete course?" size="sm">
        <p className="text-sm text-ink-soft">
          Are you sure you want to delete "{deleteTarget?.title}"? This cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default InstructorCoursesPage;
