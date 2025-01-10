import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavHeader from "@/components/NavHeader";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        navigate("/account");
        return;
      }

      // Get profiles data - this will work with RLS policies
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setUsers(profiles || []);
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <NavHeader />
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email Verified</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{user.email_verified ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.updated_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;