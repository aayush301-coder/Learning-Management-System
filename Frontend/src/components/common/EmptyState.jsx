function EmptyState({ title = "No data found", description = "There is nothing to display here." }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink/15 bg-paper-dim/40 p-10 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
    </div>
  );
}

export default EmptyState;
