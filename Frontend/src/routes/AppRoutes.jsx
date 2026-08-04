import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

import HomePage from "../pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

import StudentCoursesPage from "../features/courses/pages/StudentCoursesPage";
import StudentCourseDetailPage from "../features/courses/pages/StudentCourseDetailPage";
import InstructorCoursesPage from "../features/courses/pages/InstructorCoursesPage";
import CreateCoursePage from "../features/courses/pages/CreateCoursePage";
import EditCoursePage from "../features/courses/pages/EditCoursePage";

import ManageSectionsLessonsPage from "../features/sections/pages/ManageSectionsLessonsPage";

import MyCoursesPage from "../features/enrollments/pages/MyCoursesPage";
import LearningPage from "../features/progress/pages/LearningPage";

import NotificationsPage from "../features/notifications/pages/NotificationsPage";

import StudentDashboardPage from "../features/dashboard/student/pages/StudentDashboardPage";
import InstructorDashboardPage from "../features/dashboard/instructor/pages/InstructorDashboardPage";
import AdminDashboardPage from "../features/dashboard/admin/pages/AdminDashboardPage";
import AdminCoursesReviewPage from "../features/dashboard/admin/pages/AdminCoursesReviewPage";

import StudentProfilePage from "../features/profile/pages/StudentProfilePage";
import AdminUsersPage from "../features/profile/pages/AdminUsersPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Authenticated */}
      <Route element={<ProtectedRoute />}>
        {/* Student */}
        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/courses" element={<StudentCoursesPage />} />
            <Route path="/student/courses/:courseId" element={<StudentCourseDetailPage />} />
            <Route path="/student/my-courses" element={<MyCoursesPage />} />
            <Route path="/student/learning/:courseId" element={<LearningPage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>
        </Route>

        {/* Instructor */}
        <Route element={<RoleRoute allowedRoles={["instructor"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
            <Route path="/instructor/courses" element={<InstructorCoursesPage />} />
            <Route path="/instructor/courses/create" element={<CreateCoursePage />} />
            <Route path="/instructor/courses/:courseId/edit" element={<EditCoursePage />} />
            <Route path="/instructor/courses/:courseId/sections" element={<ManageSectionsLessonsPage />} />
            <Route path="/instructor/notifications" element={<NotificationsPage />} />
            <Route path="/instructor/profile" element={<StudentProfilePage />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/courses/review" element={<AdminCoursesReviewPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/profile" element={<StudentProfilePage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
