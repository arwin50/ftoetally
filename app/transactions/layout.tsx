import type React from "react";
export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#D9D9D9]">
      <div className="w-full h-10 bg-[#4A102A] p-2 flex items-center">
        <h1 className="text-2xl font-bold text-white ml-10">Transactions</h1>
      </div>

      <div className="m-10">{children}</div>
    </div>
  );
}
