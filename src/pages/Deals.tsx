import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Deals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [borrowerName, setBorrowerName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");

  const { data: deals, refetch } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase.from("deals").insert({
        borrower_name: borrowerName,
        loan_amount: parseFloat(loanAmount),
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deal created successfully",
      });

      setBorrowerName("");
      setLoanAmount("");
      setIsOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating deal:", error);
      toast({
        title: "Error",
        description: "Failed to create deal",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <NavHeader />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Deals Dashboard</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>New Deal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="borrowerName">Borrower Name</Label>
                  <Input
                    id="borrowerName"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Deal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower Name</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals?.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>{deal.borrower_name}</TableCell>
                  <TableCell>
                    ${deal.loan_amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">{deal.status}</TableCell>
                  <TableCell>
                    {new Date(deal.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/deals/${deal.id}/loan-request`)}
                    >
                      Loan Request
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Deals;