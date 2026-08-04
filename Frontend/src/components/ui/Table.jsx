import { cn } from "../../utils/cn";

export function Table({ children, className }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-ink/10">
      <table className={cn("w-full text-left text-sm", className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }) {
  return <thead className="bg-paper-dim">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-ink/10">{children}</tbody>;
}

export function TableRow({ children, className }) {
  return <tr className={cn("hover:bg-ink/[0.02]", className)}>{children}</tr>;
}

export function TableHead({ children, className }) {
  return (
    <th className={cn("px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-soft", className)}>
      {children}
    </th>
  );
}

export function TableCell({ children, className }) {
  return <td className={cn("px-4 py-3 text-ink", className)}>{children}</td>;
}
