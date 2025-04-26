"use client"

import { useState } from "react"

interface Transaction {
  id: string
  subject: string
  date: string
  amount: number
  category: string
  type: "Income" | "Expense"
}

export default function TransactionTable() {
  // This would typically come from an API or database
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      subject: "Subject",
      date: "MM/DD/YYYY",
      amount: -500,
      category: "Category",
      type: "Expense",
    },
    {
      id: "2",
      subject: "Subject",
      date: "MM/DD/YYYY",
      amount: 1000,
      category: "Category",
      type: "Income",
    },
    {
      id: "3",
      subject: "Subject",
      date: "MM/DD/YYYY",
      amount: -750,
      category: "Category",
      type: "Expense",
    },
  ])

  return (
    <div className="overflow-hidden border border-gray-200 rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Subject
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Category
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className={transaction.amount < 0 ? "bg-red-100" : "bg-green-100"}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    transaction.amount < 0 ? "bg-red-500" : "bg-green-500"
                  }`}
                ></span>
                {transaction.subject}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.amount < 0 ? "-" : "+"} PHP {Math.abs(transaction.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
