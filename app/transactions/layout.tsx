import type React from "react";
import { ProtectedRoute } from "../protected";
import PageLayout from "../components/pageLayout";

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <PageLayout activePage="transactions">
        <div className="min-h-screen w-full bg-[#D9D9D9]">
          <div className="bg-[#4A102A] text-white px-4 py-2">
            <h1 className="text-2xl font-bold text-center">Transactions</h1>
          </div>

          <div className="m-2 sm:m-4 md:m-6 lg:m-10 h-full">{children}</div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
