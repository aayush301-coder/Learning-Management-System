function ErrorState({ title = "Something went wrong", description = "Please try again later." }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-clay/25 bg-clay-soft p-10 text-center">
      <h3 className="font-display text-lg font-semibold text-clay">{title}</h3>
      <p className="mt-2 text-sm text-clay/80">{description}</p>
    </div>
  );
}

export default ErrorState;
