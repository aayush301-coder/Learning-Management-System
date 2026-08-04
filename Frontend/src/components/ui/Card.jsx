import { cn } from "../../utils/cn";

function Card({ children, className, accent = "ink" }) {
  const accents = {
    ink: "before:bg-ink/10",
    highlighter: "before:bg-highlighter",
    sage: "before:bg-sage",
    clay: "before:bg-clay",
    inkblue: "before:bg-inkblue",
    none: "before:bg-transparent",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-ink/10 bg-white p-5 pl-6 shadow-sm",
        "before:absolute before:inset-y-0 before:left-0 before:w-1",
        accents[accent] || accents.ink,
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
