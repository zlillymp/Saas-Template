import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavHeader from "@/components/NavHeader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { LoanDetailsSection } from "@/components/loan-request/LoanDetailsSection";
import { formSchema } from "@/components/loan-request/schema";
import type { z } from "zod";

const LoanRequest = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deal } = useQuery({
    queryKey: ["deal", dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", dealId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: loanRequest } = useQuery({
    queryKey: ["loan_request", dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_requests")
        .select("*")
        .eq("deal_id", dealId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const updateLoanRequest = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase
        .from("loan_requests")
        .upsert({
          deal_id: dealId,
          ...values,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan_request", dealId] });
      toast({
        title: "Success",
        description: "Loan request saved successfully",
      });
    },
    onError: (error) => {
      console.error("Error saving loan request:", error);
      toast({
        title: "Error",
        description: "Failed to save loan request",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wsj_prime: loanRequest?.wsj_prime || 0,
      spread: loanRequest?.spread || 0,
      initial_rate: loanRequest?.initial_rate || 0,
      term: loanRequest?.term || 0,
      monthly_payment: loanRequest?.monthly_payment || 0,
      interest_only: loanRequest?.interest_only || false,
      loan_purpose: (loanRequest?.loan_purpose as any) || 'Purchase',
      property_type: (loanRequest?.property_type as any) || 'Multi-purpose',
      ltv: loanRequest?.ltv || 0,
      collateral_coverage: loanRequest?.collateral_coverage || 0,
    },
  });

  // Watch wsj_prime and spread for automatic calculations
  const wsj_prime = useWatch({
    control: form.control,
    name: "wsj_prime",
  });

  const spread = useWatch({
    control: form.control,
    name: "spread",
  });

  // Update initial_rate when wsj_prime or spread changes
  useEffect(() => {
    const newInitialRate = Number(wsj_prime || 0) + Number(spread || 0);
    form.setValue("initial_rate", newInitialRate);
    
    // Save to database whenever values change
    const values = form.getValues();
    updateLoanRequest.mutate(values);
  }, [wsj_prime, spread]);

  return (
    <div>
      <NavHeader />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/deals")}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Deals
          </Button>
          <h1 className="text-2xl font-bold">
            Loan Request for {deal?.borrower_name}
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(updateLoanRequest.mutate)} className="space-y-6">
            <LoanDetailsSection form={form} />
            <Button type="submit" className="w-full">
              Save Loan Request
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoanRequest;