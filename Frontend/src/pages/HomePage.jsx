import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
        Okla, kept simple
      </p>

      <h1 className="font-display max-w-2xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        Every course is a
        <span className="highlight-mark"> path</span>, not a page.
      </h1>

      <p className="max-w-md text-ink-soft">
        Browse courses, track your progress lesson by lesson, and pick up exactly where you left off.
      </p>

      <Link
        to="/login"
        className="mt-2 inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
      >
        Get started
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default HomePage;
