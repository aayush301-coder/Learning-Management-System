import { useEffect, useState } from "react";

import { useCourses } from "../hooks/useCourses";
import CourseCard from "../components/CourseCard";
import CourseFilter from "../components/CourseFilter";
import Loader from "../../../components/common/Loader";
import ErrorState from "../../../components/common/ErrorState";
import EmptyState from "../../../components/common/EmptyState";

function StudentCoursesPage() {
  const { courses, loading, error, fetchCourses } = useCourses();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCourses({ search, category, level, status: "published" });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, category, level, fetchCourses]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-ink via-ink to-inkblue p-8 text-white shadow-xl shadow-ink/20">
        <div className="max-w-2xl space-y-2">
          <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            Explore Catalog
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Upgrade Your Skills Today
          </h1>
          <p className="text-sm leading-relaxed text-paper/70 sm:text-base">
            Discover courses created by instructors on Okla. Learn at your own pace with lesson-by-lesson progress
            tracking.
          </p>
        </div>
      </div>

      <CourseFilter
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        level={level}
        onLevelChange={setLevel}
      />

      {loading ? (
        <Loader text="Loading courses..." />
      ) : error ? (
        <ErrorState description={error} />
      ) : courses.length === 0 ? (
        <EmptyState title="No courses found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCoursesPage;
