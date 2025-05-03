"use client";

import { Trash2, Download } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TransactionFilters from "../components/transactions/transactionFilters";
import TransactionTable from "../components/transactions/transactionTable";
import NewTransactionButton from "../components/transactions/newTransactionButton";
import { api } from "@/lib/redux/services/auth-service";
import { ConfirmationModal } from "../components/transactions/confimModal";
import AddMonthlyBudgetModal from "../components/addMonthlyBudgetModal";

import { json2csv } from "json-2-csv";

import { Transaction } from "@/types";

export default function TransactionsPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBudget, setCurrentBudget] = useState<number | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState("All");

  const handleBudgetClick = () => {
    setIsBudgetModalOpen(true);
  };

  const getMonthDisplayText = () => {
    if (month === "All") {
      return "All time";
    } else {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
      });
      return `${currentMonth} ${currentYear}`;
    }
  };

  useEffect(() => {
    async function fetchCurrentBudget() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const monthStr = `${year}-${month}-01`;

        const response = await api.get(`/transactions/budgets/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data && response.data.amount) {
          setCurrentBudget(response.data.amount);
        } else {
          setCurrentBudget(0);
        }
      } catch (error) {
        console.error("Failed to fetch budget:", error);
        setCurrentBudget(0);
      }
    }

    fetchCurrentBudget();
  }, [refreshFlag]);

  const handleUpdateBudget = async (newBudget: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("You need to be logged in.");
        return;
      }

      const response = await api.put(
        "/transactions/budgets/",
        { amount: newBudget },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Budget updated successfully!");
        setCurrentBudget(newBudget);
        setRefreshFlag((prev) => !prev);
      } else {
        toast.error("Failed to update the budget.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const query = new URLSearchParams();
        if (type !== "All") query.append("type", type);
        if (category !== "All") query.append("category", category);
        if (month !== "All") query.append("month", month);

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
  }, [refreshFlag, type, category, month]);

  const handleCreated = () => {
    console.log("Trigger refresh");
    setRefreshFlag((prev) => !prev);
  };

  const handleTransactionUpdate = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("No transactions selected for deletion.");
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

  const exportToCsv = () => {
    try {
      const csv = json2csv(transactions);
      console.log(csv);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "asdsad.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("failed to export", error);
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-white rounded-lg shadow-sm">
      {/* Month display header */}
      <div className="mb-6 pl-2 text-left">
        <h2 className="text-3xl font-semibold text-[#85193C]">
          {getMonthDisplayText()}
        </h2>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap justify-between gap-3 mb-4 items-center">
        <TransactionFilters
          type={type}
          setType={setType}
          category={category}
          setCategory={setCategory}
          month={month}
          setMonth={setMonth}
        />

        <div className="flex gap-2 w-full sm:w-auto justify-end mt-3 sm:mt-0">
          <span
            className="bg-[#614d7c] text-white px-4 py-2 rounded-lg hover:bg-[#4d3d62] transition duration-300 cursor-pointer flex gap-x-2 items-center "
            onClick={handleBudgetClick}
            title="Click to edit budget"
          >
            Monthly Budget: ₱{currentBudget ?? "..."}
          </span>
          <button
            onClick={exportToCsv}
            className="bg-[#85193C] text-white px-4 py-2 rounded-lg hover:bg-[#6e142f] transition duration-300 cursor-pointer flex gap-x-2 items-center "
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <NewTransactionButton onCreated={handleCreated} />
          <button
            onClick={handleDelete}
            className="p-2 bg-white border border-[#85193C] rounded-md hover:bg-[#ba7c91] disabled:opacity-50 flex items-center justify-center cursor-pointer"
            aria-label="Delete selected transactions"
          >
            <Trash2 className="h-5 w-5 text-[#85193C]" />
          </button>

          <AddMonthlyBudgetModal
            isOpen={isBudgetModalOpen}
            onClose={() => setIsBudgetModalOpen(false)}
            onSuccess={() => {
              setIsBudgetModalOpen(false);
              setRefreshFlag((prev) => !prev);
            }}
          />
        </div>
      </div>
      <div className="mt-4">
        <TransactionTable
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          refreshFlag={refreshFlag}
          onTransactionUpdated={handleTransactionUpdate}
          transactions={transactions}
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
