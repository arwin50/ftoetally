"use client";

import { Trash2, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import toast from "react-hot-toast";
import TransactionFilters from "../components/transactions/transactionFilters";
import TransactionTable from "../components/transactions/transactionTable";
import NewTransactionButton from "../components/transactions/newTransactionButton";
import { api } from "@/lib/redux/services/auth-service";
import { ConfirmationModal } from "../components/transactions/confimModal";
import AddMonthlyBudgetModal from "../components/addMonthlyBudgetModal";
import { json2csv } from "json-2-csv";
import type { Transaction } from "@/types";

export default function TransactionsPage() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBudget, setCurrentBudget] = useState(0);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [totalIncomeAllTime, setTotalIncomeAllTime] = useState(0);
  const [totalExpensesAllTime, setTotalExpensesAllTime] = useState<number>(0);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

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
    const fetchTotalIncomeAndExpenses = async () => {
      try {
        const incomeQuery = new URLSearchParams();
        incomeQuery.append("type", "Income");
        const incomeRes = await api.get(
          `/transactions/?${incomeQuery.toString()}`
        );

        console.log("Income Response:", incomeRes.data.transactions);

        const totalIncome = incomeRes.data.transactions.reduce(
          (sum: number, tx: any) => sum + Number(tx.amount),
          0
        );
        setTotalIncomeAllTime(totalIncome);

        // Fetching total expenses (without applying filters)
        const expenseQuery = new URLSearchParams();
        expenseQuery.append("type", "Expense"); // Only fetch expenses
        const expenseRes = await api.get(
          `/transactions/?${expenseQuery.toString()}`
        );

        // Calculate total expenses
        const totalExpenses = expenseRes.data.transactions.reduce(
          (sum: number, tx: any) => sum + Number(tx.amount),
          0
        );
        console.log("Expense Response:", expenseRes.data);
        setTotalExpensesAllTime(totalExpenses);
      } catch (err) {
        console.error("Error fetching income or expenses:", err);
      }
    };

    // Fetch total income and expenses when not loading and authenticated
    if (!isLoading && isAuthenticated) {
      fetchTotalIncomeAndExpenses();
    }
  }, [isLoading, isAuthenticated, refreshFlag]);

  useEffect(() => {
    async function fetchCurrentBudget() {
      try {
        const now = new Date();
        const currentMonthYear = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;

        const response = await api.get(
          `/transactions/budgets/?month=${currentMonthYear}-01`
        );

        setCurrentBudget(response.data.amount);
      } catch (error) {
        console.error("Failed to fetch budget:", error);
      }
    }

    fetchCurrentBudget();
  }, [refreshFlag]);

  const handleUpdateBudget = async (newBudget: number) => {
    try {
      const response = await api.put("/transactions/budgets/", {
        amount: newBudget,
      });

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

        const response = await api.get(`/transactions/?${query.toString()}`);

        const { transactions, available_months } = response.data;
        setTransactions(transactions);
        setAvailableMonths(available_months || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Something went wrong. Please try again later.");
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
      for (const id of selectedIds) {
        const response = await api.delete(`/transactions/delete/${id}/`);

        if (response.status !== 200) {
          console.error(`Failed to delete transaction with ID ${id}`);
          toast.error(`Failed to delete transaction with ID ${id}`);
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
      link.download = `${month}Transactions.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to export transactions");
      console.error("failed to export", error);
    }
  };

  const displayMonthName = (month: string) => {
    if (month === "All") return "Set Budget";

    const [year, monthNum] = month.split("-");
    const date = new Date(Number(year), Number(monthNum) - 1); // JS months are 0-based
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
    <div className="p-2 sm:p-4 bg-white rounded-lg shadow-sm">
      {/* Month display header */}
      <div className="mb-4 sm:mb-6 pl-2 text-left">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#85193C]">
          {getMonthDisplayText()}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4 items-start sm:items-center">
        <div className="w-full sm:max-w-[70%]">
          <TransactionFilters
            type={type}
            setType={setType}
            category={category}
            setCategory={setCategory}
            month={month}
            setMonth={setMonth}
            availableMonths={availableMonths}
          />
        </div>

        <div className="flex  gap-2 w-full sm:w-auto  justify-end mt-3 sm:mt-0">
          <span
            className="bg-[#614d7c] text-white px-3 py-2 text-sm sm:text-base rounded-lg hover:bg-[#4d3d62] transition duration-300 cursor-pointer flex gap-x-2 items-center whitespace-nowrap"
            onClick={handleBudgetClick}
            title="Click to edit budget"
          >
            {displayMonthName(month)}
            {month === "All" ? "" : `: ₱${currentBudget}`}
          </span>
          <div className="flex gap-2">
            <NewTransactionButton onCreated={handleCreated} />
            <button
              onClick={handleDelete}
              className="p-2 bg-white border border-[#85193C] rounded-md hover:bg-[#ba7c91] disabled:opacity-50 flex items-center justify-center cursor-pointer"
              aria-label="Delete selected transactions"
            >
              <Trash2 className="h-5 w-5 text-[#85193C]" />
            </button>
          </div>

          <AddMonthlyBudgetModal
            isOpen={isBudgetModalOpen}
            onClose={() => setIsBudgetModalOpen(false)}
            onSuccess={() => {
              setIsBudgetModalOpen(false);
              setRefreshFlag((prev) => !prev);
            }}
            remainingBalance={totalIncomeAllTime - totalExpensesAllTime}
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <TransactionTable
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          refreshFlag={refreshFlag}
          onTransactionUpdated={handleTransactionUpdate}
          transactions={transactions}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={exportToCsv}
          className=" bg-white border border-[#85193C] text-[#85193C] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-[#ba7c91] transition duration-300 cursor-pointer flex gap-x-2 items-center text-sm sm:text-base"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          Export
        </button>
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
