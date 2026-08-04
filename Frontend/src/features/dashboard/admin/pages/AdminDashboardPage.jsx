import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, BookOpen, GraduationCap, DollarSign, ClipboardList } from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard";

import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Loader from "../../../../components/common/Loader";
import ErrorState from "../../../../components/common/ErrorState";

function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`rounded-lg p-3 ${colorClass}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value ?? 0}</p>
        <p className="text-sm text-ink-soft">{label}</p>
      </div>
    </Card>
  );
}

function AdminDashboardPage() {
  const { stats, loading, error, fetchDashboardData } = useDashboard();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-1 text-ink-soft">Platform-wide overview.</p>
        </div>
        <Link to="/admin/courses/review">
          <Button size="sm">
            <ClipboardList size={16} className="mr-1 inline" />
            Review courses
          </Button>
        </Link>
      </div>

      {loading ? (
        <Loader text="Loading platform stats..." />
      ) : error ? (
        <ErrorState description={error} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Total users" value={stats?.users?.total} colorClass="bg-inkblue-light text-inkblue" />
          <StatCard icon={BookOpen} label="Total courses" value={stats?.courses?.total} colorClass="bg-highlighter-soft text-ink" />
          <StatCard icon={GraduationCap} label="Total enrollments" value={stats?.enrollments?.total} colorClass="bg-sage-soft text-sage" />
          <StatCard icon={DollarSign} label="Total revenue" value={`$${stats?.revenue?.total ?? 0}`} colorClass="bg-clay-soft text-clay" />
        </div>
      )}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="mb-3 font-semibold">Users</h3>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li className="flex justify-between">
                <span>Students</span>
                <span className="font-medium text-ink">{stats.users?.students ?? 0}</span>
              </li>
              <li className="flex justify-between">
                <span>Instructors</span>
                <span className="font-medium text-ink">{stats.users?.instructors ?? 0}</span>
              </li>
            </ul>
          </Card>

          <Card>
            <h3 className="mb-3 font-semibold">Courses</h3>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li className="flex justify-between">
                <span>Published</span>
                <span className="font-medium text-ink">{stats.courses?.published ?? 0}</span>
              </li>
              <li className="flex justify-between">
                <span>Pending review</span>
                <span className="font-medium text-ink">{stats.courses?.pendingReview ?? 0}</span>
              </li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
