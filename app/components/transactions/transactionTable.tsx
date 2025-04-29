import { useEffect, useState } from "react";
import UpdateTransactionModal from "./updateTransactionModal";

interface Transaction {
  id: number;
  subject: string;
  date: string;
  amount: number;
  category: string;
  type: "Income" | "Expense";
}

interface TransactionTableProps {
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  refreshFlag: boolean;
  onTransactionUpdated: () => void;
  type: string;
  category: string;
}

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

        const response = await fetch(
          `http://localhost:8000/transactions/?${query.toString()}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
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

  return (
    <div className="overflow-hidden border border-gray-200 rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500"></th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(transaction.id);
                }}
              >
                {transaction.subject}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.type === "Expense" ? "-" : "+"} PHP{" "}
                {Math.abs(transaction.amount)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.category}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
