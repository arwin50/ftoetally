"use client";

import { useEffect, useState } from "react";
import UpdateTransactionModal from "./updateTransactionModal";
import { api } from "@/lib/redux/services/auth-service";
import { Transaction, TransactionTableProps } from "@/types";

export default function TransactionTable({
  selectedIds,
  setSelectedIds,
  refreshFlag,
  onTransactionUpdated,
  type,
  category,
}: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransactionId, setEditingTransactionId] = useState<
    number | null
  >(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const query = new URLSearchParams();
        if (type !== "All") query.append("type", type);
        if (category !== "All") query.append("category", category);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("You need to be logged in.");
          return;
        }

        const response = await api.get(`/transactions/?${query.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = response.data;
        console.log("Fetched Transactions:", data);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Something went wrong. Please try again later.");
      }
    }

    fetchTransactions();
  }, [refreshFlag, type, category]);

  const handleRowClick = (id: number) => {
    setEditingTransactionId(id);
  };

  const handleCheckboxChange = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleModalClose = () => {
    setEditingTransactionId(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    onTransactionUpdated();
  };

  // Mobile card view for each transaction
  const MobileTransactionCard = ({
    transaction,
  }: {
    transaction: Transaction;
  }) => (
    <div
      className={`p-3 mb-2 rounded-lg ${
        transaction.type === "Expense" ? "bg-red-100" : "bg-green-100"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.includes(transaction.id)}
            onChange={(e) => {
              e.stopPropagation();
              handleCheckboxChange(transaction.id);
            }}
            className="w-5 h-5 appearance-none border-2 border-gray-400 rounded bg-white checked:bg-[#C5172E] checked:border-[#C5172E] focus:outline-none"
          />
          <span
            className="font-medium text-black underline cursor-pointer"
            onClick={() => handleRowClick(transaction.id)}
          >
            {transaction.subject}
          </span>
        </div>
        <span className="text-sm font-medium">
          {transaction.type === "Expense" ? "-" : "+"} PHP{" "}
          {Math.abs(transaction.amount)}
        </span>
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>{transaction.date}</span>
        <span>{transaction.category}</span>
      </div>
    </div>
  );

  return (
    <div>
      {/* Mobile view (card layout) */}
      <div className="sm:hidden">
        {transactions.map((transaction) => (
          <MobileTransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>

      {/* Desktop view (table layout) */}
      <div className="hidden sm:block overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500"></th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={
                  transaction.type === "Expense" ? "bg-red-100" : "bg-green-100"
                }
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(transaction.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(transaction.id);
                    }}
                    className="w-5 h-5 appearance-none border-2 border-gray-400 rounded bg-white checked:bg-[#C5172E] checked:border-[#C5172E] focus:outline-none"
                  />
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(transaction.id);
                  }}
                >
                  {transaction.subject}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {transaction.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {transaction.type === "Expense" ? "-" : "+"} PHP{" "}
                  {Math.abs(transaction.amount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {transaction.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTransactionId && (
        <UpdateTransactionModal
          transactionId={editingTransactionId}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
