import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ListTree } from "lucide-react";

import { useCourses } from "../hooks/useCourses";
import CourseForm from "../components/CourseForm";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Loader from "../../../components/common/Loader";
import { COURSE_STATUS_BADGES } from "../../../constants/courseConstants";

function EditCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { course, loading, fetchCourseById, updateCourse } = useCourses();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourseById(courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await updateCourse(courseId, data);
      toast.success("Course updated successfully.");
      navigate("/instructor/courses");
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to update course.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !course) {
    return <Loader text="Loading course..." />;
  }

  const badge = COURSE_STATUS_BADGES[course.status] || { label: course.status, variant: "default" };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-ink">Edit Course</h1>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-soft">Update your course details below.</p>
        </div>

        <Link to={`/instructor/courses/${courseId}/sections`}>
          <Button variant="outline" size="sm">
            <ListTree size={16} className="mr-1.5 inline" />
            Manage Content
          </Button>
        </Link>
      </div>

      <Card>
        <CourseForm defaultValues={course} onSubmit={handleSubmit} submitLabel="Save Changes" loading={saving} />
      </Card>
    </div>
  );
}

export default EditCoursePage;
