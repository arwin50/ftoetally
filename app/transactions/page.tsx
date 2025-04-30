"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import TransactionFilters from "../components/transactions/transactionFilters";
import TransactionTable from "../components/transactions/transactionTable";
import NewTransactionButton from "../components/transactions/newTransactionButton";
import { api } from "@/lib/redux/services/auth-service";
import { ConfirmationModal } from "../components/transactions/confimModal";

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
    <div className="p-2 sm:p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <TransactionFilters
          type={type}
          setType={setType}
          category={category}
          setCategory={setCategory}
        />
        <div className="flex gap-2 w-full sm:w-auto justify-end mt-3 sm:mt-0">
          <NewTransactionButton onCreated={handleCreated} />
          <button
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
            className="p-2 bg-white border border-[#85193C] rounded-md hover:bg-[#ba7c91] disabled:opacity-50 flex items-center justify-center cursor-pointer"
            aria-label="Delete selected transactions"
          >
            <Trash2 className="h-5 w-5 text-[#85193C]" />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <TransactionTable
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          refreshFlag={refreshFlag}
          onTransactionUpdated={handleTransactionUpdate}
          type={type}
          category={category}
        />
      </div>
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
