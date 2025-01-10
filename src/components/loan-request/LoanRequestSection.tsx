import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoanRequestSectionProps {
  title: string;
  children: React.ReactNode;
}

export const LoanRequestSection = ({ title, children }: LoanRequestSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};