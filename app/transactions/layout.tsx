import type React from "react"
export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      {children}
    </div>
  )
}
