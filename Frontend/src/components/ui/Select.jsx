import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Select = forwardRef(({ label, error, children, className, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-ink-soft">{label}</label>}

      <select
        ref={ref}
        className={cn(
          "w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-inkblue focus:ring-2 focus:ring-inkblue/15",
          error && "border-clay focus:border-clay focus:ring-clay/15",
          className
        )}
        {...props}
      >
        {children}
      </select>

      {error && <p className="text-sm text-clay">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
