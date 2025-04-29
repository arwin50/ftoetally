"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import TransactionFilters from "../components/transactions/transactionFilters";
import TransactionTable from "../components/transactions/transactionTable";
import NewTransactionButton from "../components/transactions/newTransactionButton";
import { ConfirmationModal } from "../components/transactions/confimModal";
import PageLayout from "../components/pageLayout";
import { ProtectedRoute } from "../protected";

export default function TransactionsPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");

  const handleCreated = () => {
    toast.success("Transaction added successfully!");
    console.log("Trigger refresh");
    setRefreshFlag((prev) => !prev);
  };

  const handleTransactionUpdate = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert("No transactions selected for deletion.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      for (const id of selectedIds) {
        const response = await fetch(
          `http://localhost:8000/transactions/delete/${id}/`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error(`Failed to delete transaction with ID ${id}`);
        }
      }

      toast.success("Transaction/s deleted successfully!");
      setSelectedIds([]);
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error("Error deleting transactions:", error);
      toast.error("Failed to delete transactions.");
    } finally {
      setIsModalOpen(false);
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
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Transactions"
        message={`Are you sure you want to delete ${selectedIds.length} transaction(s)? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
