import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, User } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../features/auth/hooks/useAuth";

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink/10 bg-paper/95 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-md p-2 hover:bg-ink/[0.06] lg:hidden">
          <Menu size={22} />
        </button>

        <Link to="/" className="font-display text-xl font-semibold text-ink lg:hidden">
          Okla
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-inkblue-light text-inkblue">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <User size={18} />
                )}
              </div>

              <div>
                <p className="text-sm font-medium leading-tight text-ink">{user.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-clay hover:bg-clay-soft"
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
