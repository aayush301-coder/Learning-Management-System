import { NavLink } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  User,
  Users,
  Bell,
  CheckSquare,
  PlusCircle,
} from "lucide-react";

import { useAuth } from "../../features/auth/hooks/useAuth";

function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  const links = {
    student: [
      { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
      { name: "Browse Courses", path: "/student/courses", icon: BookOpen },
      { name: "My Courses", path: "/student/my-courses", icon: CheckSquare },
      { name: "Notifications", path: "/student/notifications", icon: Bell },
      { name: "My Profile", path: "/student/profile", icon: User },
    ],

    instructor: [
      { name: "Dashboard", path: "/instructor/dashboard", icon: LayoutDashboard },
      { name: "My Courses", path: "/instructor/courses", icon: BookOpen },
      { name: "Create Course", path: "/instructor/courses/create", icon: PlusCircle },
      { name: "Notifications", path: "/instructor/notifications", icon: Bell },
      { name: "Profile", path: "/instructor/profile", icon: User },
    ],

    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Course Review", path: "/admin/courses/review", icon: CheckSquare },
      { name: "Manage Users", path: "/admin/users", icon: Users },
      { name: "Profile", path: "/admin/profile", icon: User },
    ],
  };

  const roleLinks = links[user?.role] || [];

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden" />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-ink/10 bg-ink text-paper transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-paper/10 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-highlighter font-display text-lg font-semibold text-ink">
            O
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-paper">Okla</span>
        </div>

        <nav className="space-y-1 p-4">
          <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-wider text-paper/40">Navigation</p>

          {roleLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    isActive ? "bg-highlighter text-ink" : "text-paper/70 hover:bg-paper/10 hover:text-paper"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
