import { useEffect, useState } from "react";
import { Search, Shield } from "lucide-react";

import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import ErrorState from "../../../components/common/ErrorState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/Table";
import { formatDate, formatRoleName } from "../../../utils/formatters";
import { getAllUsersRequest } from "../api/profileApi";
import { useDebounce } from "../../../hooks/useDebounce";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await getAllUsersRequest(debouncedSearch ? { search: debouncedSearch } : {});

        if (!cancelled) {
          setUsers(data?.data?.users || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load users.");
          setUsers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Manage Users</h1>
        <p className="mt-1 text-sm text-ink-soft">Browse all registered students, instructors, and admins.</p>
      </div>

      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </Card>

      {loading ? (
        <Loader text="Loading users..." />
      ) : error ? (
        <ErrorState title="Failed to load users" description={error} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting your search, or check back once more users have registered." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell className="flex items-center gap-2 font-medium">
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-ink to-inkblue text-xs font-bold text-white">
                    {u.avatar ? <img src={u.avatar} alt="" className="h-full w-full object-cover" /> : (u.name || "?").charAt(0).toUpperCase()}
                  </div>
                  {u.name}
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === "admin" ? "danger" : u.role === "instructor" ? "warning" : "default"}>
                    <Shield className="mr-1 h-3 w-3 inline" />
                    {formatRoleName(u.role)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(u.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default AdminUsersPage;
