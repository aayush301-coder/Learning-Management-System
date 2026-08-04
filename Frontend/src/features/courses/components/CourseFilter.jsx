import { Search } from "lucide-react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { COURSE_CATEGORIES, COURSE_LEVELS, formatConstantLabel } from "../../../constants/courseConstants";

function CourseFilter({ search, onSearchChange, category, onCategoryChange, level, onLevelChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="relative sm:col-span-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <Input
          placeholder="Search courses..."
          className="pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All Categories</option>
        {COURSE_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {formatConstantLabel(c)}
          </option>
        ))}
      </Select>

      <Select value={level} onChange={(e) => onLevelChange(e.target.value)}>
        <option value="">All Levels</option>
        {COURSE_LEVELS.map((l) => (
          <option key={l} value={l}>
            {formatConstantLabel(l)}
          </option>
        ))}
      </Select>
    </div>
  );
}

export default CourseFilter;
