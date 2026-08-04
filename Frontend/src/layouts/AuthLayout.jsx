import { Outlet, Link } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-10 text-paper lg:flex">
        <Link to="/" className="font-display text-2xl font-semibold">
          Okla
        </Link>

        <div className="max-w-sm">
          <p className="font-display text-3xl leading-snug">
            Every course is a
            <span className="highlight-mark text-highlighter"> path</span>, not a page.
          </p>
          <p className="mt-4 text-sm text-paper/60">
            Track sections, lessons and progress in one place — built for students, instructors and admins alike.
          </p>
        </div>

        <div className="space-y-3 font-mono text-xs text-paper/40">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-paper/20" />
            <span>01 — enroll</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-paper/20" />
            <span>02 — learn at your pace</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-paper/20" />
            <span>03 — track completion</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper px-4 py-12">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
