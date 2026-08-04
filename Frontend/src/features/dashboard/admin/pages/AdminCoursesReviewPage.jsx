import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Eye, CheckCircle2, EyeOff, Archive, RotateCcw } from "lucide-react";

import { useCourses } from "../../../courses/hooks/useCourses";

import Select from "../../../../components/ui/Select";
import Button from "../../../../components/ui/Button";
import Badge from "../../../../components/ui/Badge";
import Modal from "../../../../components/ui/Modal";
import Loader from "../../../../components/common/Loader";
import ErrorState from "../../../../components/common/ErrorState";
import EmptyState from "../../../../components/common/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/Table";
import { formatCurrency } from "../../../../utils/formatters";
import { COURSE_STATUSES, COURSE_STATUS_BADGES, formatConstantLabel } from "../../../../constants/courseConstants";

function AdminCoursesReviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Default to "All Statuses" so admins immediately see existing
  // data rather than an empty pending-only view.
  const [status, setStatus] = useState(searchParams.get("status") || "");

  const {
    courses,
    loading,
    error,
    fetchCourses,
    publishCourse,
    unpublishCourse,
    archiveCourse,
    restoreCourse,
  } = useCourses();

  const [previewCourse, setPreviewCourse] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    fetchCourses(status ? { status } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    load();
    setSearchParams(status ? { status } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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

  const handlePublish = withBusy(publishCourse, "Course published.");
  const handleUnpublish = withBusy(unpublishCourse, "Course unpublished.");
  const handleArchive = withBusy(archiveCourse, "Course archived.");
  const handleRestore = withBusy(restoreCourse, "Course restored.");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Course Review</h1>
          <p className="mt-1 text-sm text-ink-soft">Review, publish, and manage course visibility.</p>
        </div>

        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-56">
          <option value="">All Statuses</option>
          {COURSE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatConstantLabel(s)}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <Loader text="Loading courses..." />
      ) : error ? (
        <ErrorState
          title="Failed to load courses"
          description={error}
        />
      ) : courses.length === 0 ? (
        <EmptyState title="No courses found" description="Try a different status filter." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => {
              const badge = COURSE_STATUS_BADGES[course.status] || { label: course.status, variant: "default" };
              const isBusy = busyId === course._id;

              return (
                <TableRow key={course._id}>
                  <TableCell className="max-w-xs truncate font-medium">{course.title}</TableCell>
                  <TableCell>{course.instructor?.name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(course.price)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setPreviewCourse(course)}
                        className="rounded p-1.5 text-ink-soft hover:bg-ink/[0.06]"
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>

                      {course.status !== "published" && (
                        <Button size="sm" disabled={isBusy} onClick={() => handlePublish(course._id)}>
                          <CheckCircle2 size={14} className="mr-1 inline" />
                          Publish
                        </Button>
                      )}

                      {course.status === "published" && (
                        <Button size="sm" variant="secondary" disabled={isBusy} onClick={() => handleUnpublish(course._id)}>
                          <EyeOff size={14} className="mr-1 inline" />
                          Unpublish
                        </Button>
                      )}

                      {course.status !== "archived" && (
                        <Button size="sm" variant="danger" disabled={isBusy} onClick={() => handleArchive(course._id)}>
                          <Archive size={14} className="mr-1 inline" />
                          Archive
                        </Button>
                      )}

                      {course.status === "archived" && (
                        <Button size="sm" variant="outline" disabled={isBusy} onClick={() => handleRestore(course._id)}>
                          <RotateCcw size={14} className="mr-1 inline" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Modal open={!!previewCourse} onClose={() => setPreviewCourse(null)} title={previewCourse?.title} size="lg">
        {previewCourse && (
          <div className="space-y-3">
            {previewCourse.thumbnail && (
              <img src={previewCourse.thumbnail} alt="" className="aspect-video w-full rounded-md object-cover" />
            )}
            <p className="text-sm text-ink-soft">{previewCourse.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{formatConstantLabel(previewCourse.category)}</Badge>
              <Badge variant="default">{formatConstantLabel(previewCourse.level)}</Badge>
              <Badge variant="default">{formatCurrency(previewCourse.price)}</Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminCoursesReviewPage;
