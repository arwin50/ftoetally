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
}: AddMonthlyBudgetModalProps) {
  const [budgetData, setBudgetData] = useState<MonthlyBudget>({
    amount: "",
    month: new Date().toISOString().slice(0, 7), // e.g., "2025-05"
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get("/transactions/budgets/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("Fetched Budget Response:", response);
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

    const updatedBudgetData = {
      ...budgetData,
      month: `${budgetData.month}-01`,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log(updatedBudgetData);

      const response = await api.post(
        "transactions/budgets/new/",
        updatedBudgetData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
            className="text-white bg-[#85193C] hover:bg-[#ba7c91] rounded-md"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <hr className="border-t border-gray-300 mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
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
              value={budgetData.month}
              onChange={handleChange}
              className="h-9 border border-gray-300 rounded px-3 py-2 text-black text-sm"
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4A102A] text-white rounded-md hover:bg-[#35091D] text-sm"
            >
              {isEditing ? "Update Budget" : "Save Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
