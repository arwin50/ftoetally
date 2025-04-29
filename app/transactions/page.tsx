"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import TransactionFilters from "../components/transactions/transactionFilters";
import TransactionTable from "../components/transactions/transactionTable";
import NewTransactionButton from "../components/transactions/newTransactionButton";
import { api } from "@/lib/redux/services/auth-service";
import PageLayout from "../components/pageLayout";
import { ProtectedRoute } from "../protected";

export default function TransactionsPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");

  const handleCreated = () => {
    console.log("Trigger refresh");
    setRefreshFlag((prev) => !prev);
  };

  const handleTransactionUpdate = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("No transactions selected for deletion.");
      return;
    }

    const confirmDelete = confirm(
      `Are you sure you want to delete ${selectedIds.length} transactions?`
    );
    if (!confirmDelete) return;

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("You need to be logged in.");
        return;
      }

      for (const id of selectedIds) {
        const response = await api.delete(`/transactions/delete/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status !== 200) {
          console.error(`Failed to delete transaction with ID ${id}`);
          alert(`Failed to delete transaction with ID ${id}`);
        }
      }

      alert("Selected transactions deleted successfully!");
      setSelectedIds([]);
      setRefreshFlag(!refreshFlag);
    } catch (error) {
      console.error("Error deleting transactions:", error);
      alert("An error occurred while deleting transactions. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <TransactionFilters
          type={type}
          setType={setType}
          category={category}
          setCategory={setCategory}
        />
        <div className="flex gap-2">
          <NewTransactionButton onCreated={handleCreated} />
          <button
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
            className="p-2 bg-white border border-[#85193C] rounded-md hover:bg-[#ba7c91] disabled:opacity-50"
          >
            <Trash2 className="h-5 w-5 text-[#85193C]" />
          </button>
        </div>
      </div>
      <TransactionTable
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        refreshFlag={refreshFlag}
        onTransactionUpdated={handleTransactionUpdate}
        type={type}
        category={category}
      />
    </div>
  );
}
