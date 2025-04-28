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
          <div className="bg-burgundy text-white p-4">
            <h1 className="text-2xl font-bold ml-2">Transactions</h1>
          </div>

          <div className="m-10">{children}</div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
