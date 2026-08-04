import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";

import { useSections } from "../hooks/useSections";
import { useLessons } from "../../lessons/hooks/useLessons";
import SectionForm from "../components/SectionForm";
import LessonForm from "../../lessons/components/LessonForm";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import { formatDuration } from "../../../utils/formatters";

function ManageSectionsLessonsPage() {
  const { courseId } = useParams();

  const { sections, loading, fetchSectionsByCourse, createSection, updateSection, deleteSection } = useSections();
  const { createLesson, updateLesson, deleteLesson, fetchLessonsBySection } = useLessons();

  const [sectionsWithLessons, setSectionsWithLessons] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [lessonContext, setLessonContext] = useState(null); // { sectionId, lesson }

  const [deleteTarget, setDeleteTarget] = useState(null); // { type, id, label }
  const [saving, setSaving] = useState(false);

  const loadAll = useCallback(async () => {
    const sectionList = await fetchSectionsByCourse(courseId);

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
    loadAll();
  }, [loadAll]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleSectionSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingSection) {
        await updateSection(editingSection._id, data);
        toast.success("Section updated.");
      } else {
        await createSection(courseId, data);
        toast.success("Section created.");
      }
      setSectionModalOpen(false);
      setEditingSection(null);
      await loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save section.");
    } finally {
      setSaving(false);
    }
  };

  const handleLessonSubmit = async (data) => {
    setSaving(true);
    try {
      if (lessonContext.lesson) {
        await updateLesson(lessonContext.lesson._id, data);
        toast.success("Lesson updated.");
      } else {
        await createLesson(lessonContext.sectionId, data);
        toast.success("Lesson created.");
      }
      setLessonModalOpen(false);
      setLessonContext(null);
      await loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save lesson.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (deleteTarget.type === "section") {
        await deleteSection(deleteTarget.id);
        toast.success("Section deleted.");
      } else {
        await deleteLesson(deleteTarget.id);
        toast.success("Lesson deleted.");
      }
      setDeleteTarget(null);
      await loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link to={`/instructor/courses/${courseId}/edit`} className="mb-2 inline-flex items-center gap-1.5 text-sm text-inkblue hover:underline">
            <ArrowLeft size={14} />
            Back to course
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink">Manage Content</h1>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingSection(null);
            setSectionModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-1.5 inline" />
          Add Section
        </Button>
      </div>

      {loading ? (
        <Loader text="Loading content..." />
      ) : sectionsWithLessons.length === 0 ? (
        <EmptyState title="No sections yet" description="Add your first section to start building the course." />
      ) : (
        <div className="space-y-4">
          {sectionsWithLessons.map((section) => (
            <Card key={section._id} accent="inkblue">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleSection(section._id)}
                  className="flex items-center gap-2 text-left font-semibold text-ink"
                >
                  {expandedSections[section._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  {section.title}
                  <span className="font-mono text-xs font-normal text-ink-soft">
                    ({section.lessons.length} lessons)
                  </span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingSection(section);
                      setSectionModalOpen(true);
                    }}
                    className="rounded p-1.5 text-ink-soft hover:bg-ink/[0.06]"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: "section", id: section._id, label: section.title })}
                    className="rounded p-1.5 text-clay hover:bg-clay-soft"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {expandedSections[section._id] && (
                <div className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                  {section.lessons.map((lesson) => (
                    <div key={lesson._id} className="flex items-center justify-between rounded-md bg-paper-dim/60 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-ink">{lesson.title}</p>
                        <p className="text-xs text-ink-soft">{formatDuration(lesson.duration)}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setLessonContext({ sectionId: section._id, lesson });
                            setLessonModalOpen(true);
                          }}
                          className="rounded p-1.5 text-ink-soft hover:bg-ink/[0.08]"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: "lesson", id: lesson._id, label: lesson.title })}
                          className="rounded p-1.5 text-clay hover:bg-clay-soft"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLessonContext({ sectionId: section._id, lesson: null });
                      setLessonModalOpen(true);
                    }}
                  >
                    <Plus size={14} className="mr-1 inline" />
                    Add Lesson
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={sectionModalOpen}
        onClose={() => {
          setSectionModalOpen(false);
          setEditingSection(null);
        }}
        title={editingSection ? "Edit Section" : "Add Section"}
      >
        <SectionForm defaultValues={editingSection || {}} onSubmit={handleSectionSubmit} loading={saving} />
      </Modal>

      <Modal
        open={lessonModalOpen}
        onClose={() => {
          setLessonModalOpen(false);
          setLessonContext(null);
        }}
        title={lessonContext?.lesson ? "Edit Lesson" : "Add Lesson"}
        size="lg"
      >
        <LessonForm defaultValues={lessonContext?.lesson || {}} onSubmit={handleLessonSubmit} loading={saving} />
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-ink-soft">
          Are you sure you want to delete "{deleteTarget?.label}"? This cannot be undone.
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

export default ManageSectionsLessonsPage;
