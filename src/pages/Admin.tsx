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
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndLoadUsers = async () => {
      try {
        // First check if user is logged in
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        if (!user) {
          navigate("/auth");
          return;
        }

        // Then check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.role !== "admin") {
          toast({
            title: "Access Denied",
            description: "You must be an admin to view this page.",
            variant: "destructive",
          });
          navigate("/account");
          return;
        }

        // If user is admin, fetch all profiles with proper error handling
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (profilesError) throw profilesError;

        console.log("Fetched profiles:", profiles);
        
        if (!profiles || profiles.length === 0) {
          toast({
            title: "No Users Found",
            description: "There are currently no registered users in the system.",
          });
        }

        setUsers(profiles || []);
      } catch (error: any) {
        console.error("Error in admin page:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load users. Please try again.",
          variant: "destructive",
        });
        if (error.message?.includes("auth")) {
          navigate("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadUsers();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
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
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No users found</p>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;