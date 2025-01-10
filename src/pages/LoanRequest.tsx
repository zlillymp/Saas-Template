import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavHeader from "@/components/NavHeader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft } from "lucide-react";

const loanPurposeOptions = [
  'Purchase',
  'Purchase based upon Projections',
  'Special Purpose Purchase based upon Projections',
  'Rate and Term Refinance',
  'R/T Refinance – Projections',
  'Special Purpose R/T Refinance',
  'Spec. Purp. R/T Refi – Projections',
  'Cash-out Refinance',
  'Cash-out Refi – Projections',
  'Limited Cash-out Refinance',
  'Limited Cash-out Refi – Projections',
  'Refi Partner Buyout',
  'Refi Partner Buyout – Projections',
  'Delayed Purchase',
  'Delayed Purchase – Projections',
  'Second Trust Deed'
] as const;

const propertyTypeOptions = [
  'Multi-purpose',
  'Special purpose'
] as const;

const formSchema = z.object({
  wsj_prime: z.number().min(0).max(100),
  spread: z.number().min(0).max(100),
  initial_rate: z.number().min(0).max(100),
  term: z.number().min(1).max(360),
  monthly_payment: z.number().min(0),
  interest_only: z.boolean(),
  loan_purpose: z.enum(loanPurposeOptions),
  property_type: z.enum(propertyTypeOptions),
  ltv: z.number().min(0).max(100),
  collateral_coverage: z.number().min(0).max(1000),
});

const LoanRequest = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from("loan_requests")
        .upsert({
          deal_id: dealId,
          ...values,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Loan request saved successfully",
      });
    } catch (error) {
      console.error("Error saving loan request:", error);
      toast({
        title: "Error",
        description: "Failed to save loan request",
        variant: "destructive",
      });
    }
  };

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

        <div className="max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="wsj_prime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WSJ Prime Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="spread"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spread (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initial_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term (months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthly_payment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Payment</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loan_purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Purpose</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loanPurposeOptions.map((purpose) => (
                          <SelectItem key={purpose} value={purpose}>
                            {purpose}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {propertyTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ltv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LTV (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collateral_coverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collateral Coverage (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Loan Request
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoanRequest;