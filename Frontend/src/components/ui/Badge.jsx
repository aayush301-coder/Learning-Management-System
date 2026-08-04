import { cn } from "../../utils/cn";

function Badge({ children, variant = "default", className }) {
  const styles = {
    default: "bg-paper-dim text-ink-soft",
    secondary: "bg-paper-dim text-ink-soft",
    neutral: "bg-paper-dim text-ink-soft",
    success: "bg-sage-soft text-sage",
    warning: "bg-highlighter-soft text-ink",
    danger: "bg-clay-soft text-clay",
    info: "bg-inkblue-light text-inkblue",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
