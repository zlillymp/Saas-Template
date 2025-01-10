import * as z from "zod";

export const loanPurposeOptions = [
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

export const propertyTypeOptions = [
  'Multi-purpose',
  'Special purpose'
] as const;

export const formSchema = z.object({
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