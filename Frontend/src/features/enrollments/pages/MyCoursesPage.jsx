import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PlayCircle, XCircle } from "lucide-react";

import { useEnrollments } from "../hooks/useEnrollments";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Loader from "../../../components/common/Loader";
import ErrorState from "../../../components/common/ErrorState";
import EmptyState from "../../../components/common/EmptyState";

function MyCoursesPage() {
  const { enrollments, loading, error, fetchMyEnrollments, cancelEnrollment } = useEnrollments();
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    fetchMyEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelConfirmed = async () => {
    try {
      await cancelEnrollment(cancelTarget.course._id);
      toast.success("Enrollment cancelled.");
      setCancelTarget(null);
      await fetchMyEnrollments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel enrollment.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">My Courses</h1>
        <p className="mt-1 text-sm text-ink-soft">Courses you're currently enrolled in.</p>
      </div>

      {loading ? (
        <Loader text="Loading your courses..." />
      ) : error ? (
        <ErrorState description={error} />
      ) : enrollments.length === 0 ? (
        <EmptyState title="No enrolled courses" description="Browse the catalog to find something to learn." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            if (!course) return null;

            return (
              <Card key={enrollment._id} className="flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{course.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{course.description}</p>
                </div>

                <div className="mt-4 flex gap-2 border-t border-ink/10 pt-3">
                  <Link to={`/student/learning/${course._id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      <PlayCircle size={14} className="mr-1.5 inline" />
                      Continue
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setCancelTarget(enrollment)}>
                    <XCircle size={14} />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel enrollment?" size="sm">
        <p className="text-sm text-ink-soft">
          Are you sure you want to cancel your enrollment in "{cancelTarget?.course?.title}"? Your progress will be lost.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setCancelTarget(null)}>
            Keep Enrollment
          </Button>
          <Button variant="danger" size="sm" onClick={handleCancelConfirmed}>
            Cancel Enrollment
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default MyCoursesPage;
