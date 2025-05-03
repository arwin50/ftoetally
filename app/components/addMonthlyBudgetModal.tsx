"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/redux/services/auth-service";
import { MonthlyBudget, AddMonthlyBudgetModalProps } from "@/types";

export default function AddMonthlyBudgetModal({
  isOpen,
  onClose,
  onSuccess,
  remainingBalance = 0,
}: AddMonthlyBudgetModalProps) {
  const [budgetData, setBudgetData] = useState<MonthlyBudget>({
    amount: "",
    month: new Date().toISOString().slice(0, 7), // e.g., "2025-05"
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const now = new Date();
        const currentMonthYear = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;

        const response = await api.get(
          `/transactions/budgets/?month=${currentMonthYear}-01`
        );
        console.log("Fetched Budget Response:", response.data.month);

        if (response.status === 200) {
          setBudgetData({
            amount: response.data.amount,
            month: response.data.month,
          });
          setIsEditing(true);
        }
      } catch (error) {
        console.log("Error fetching current month's budget:", error);
      }
    };

    fetchBudget();
  }, []);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setBudgetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(budgetData.amount) > remainingBalance) {
      toast.error("Budget exceeds your current balance! Please add an income.");
      return;
    }

    if (Number(budgetData.amount) < 0) {
      toast.error("Negative budget amount is not allowed.");
      return;
    }

    const updatedBudgetData = {
      ...budgetData,
      month: `${budgetData.month}`,
    };

    try {
      console.log(updatedBudgetData);

      const response = await api.post(
        "transactions/budgets/new/",
        updatedBudgetData
      );
      console.log("Response after submitting budget:", response);

      if (response.status === 200) {
        toast.success("Budget updated successfully!");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to create or update the budget. Please try again.");
      console.error("Error submitting budget:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-black text-xl font-bold">
            {isEditing ? "Update Monthly Budget" : "Add Monthly Budget"}
          </h2>
          <button
            onClick={onClose}
            className="text-white bg-[#85193C] hover:bg-[#ba7c91] rounded-md cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <hr className="border-t border-gray-300 mb-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
              <p className="text-sm text-gray-700 font-semibold">
                Remaining Balance:{" "}
                <span className="text-[#4A102A] font-bold">
                  ₱{remainingBalance}
                </span>
              </p>
            </div>
            <label
              htmlFor="amount"
              className="text-sm font-medium text-black mb-1"
            >
              Budget Amount (PHP)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              min={0}
              value={budgetData.amount}
              onChange={handleChange}
              className="h-9 border border-gray-300 rounded px-3 py-2 text-black text-sm"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="month"
              className="text-sm font-medium text-black mb-1"
            >
              Month
            </label>
            <input
              type="month"
              id="month"
              name="month"
              value={budgetData.month.slice(0, 7)}
              onChange={handleChange}
              className="h-9 border border-gray-300 rounded px-3 py-2 text-black text-sm"
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4A102A] text-white rounded-md hover:bg-[#35091D] text-sm cursor-pointer"
            >
              {isEditing ? "Update Budget" : "Save Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
