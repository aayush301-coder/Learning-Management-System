import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Textarea = forwardRef(({ label, error, className, rows = 4, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-ink-soft">{label}</label>}

      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-inkblue focus:ring-2 focus:ring-inkblue/15",
          error && "border-clay focus:border-clay focus:ring-clay/15",
          className
        )}
        {...props}
      />

      {error && <p className="text-sm text-clay">{error}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
