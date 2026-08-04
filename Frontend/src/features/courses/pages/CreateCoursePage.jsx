import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useCourses } from "../hooks/useCourses";
import CourseForm from "../components/CourseForm";
import Card from "../../../components/ui/Card";

function CreateCoursePage() {
  const navigate = useNavigate();
  const { createCourse } = useCourses();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const course = await createCourse(data);
      toast.success("Course created as a draft.");
      navigate(`/instructor/courses/${course._id}/edit`);
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Create a New Course</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Start with the basics. You'll be able to add sections and lessons after saving.
        </p>
      </div>

      <Card>
        <CourseForm onSubmit={handleSubmit} submitLabel="Create Course" loading={loading} />
      </Card>
    </div>
  );
}

export default CreateCoursePage;
