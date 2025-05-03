"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/redux/services/auth-service";
import toast from "react-hot-toast";
import { NewTransactionModalProps } from "@/types";

export default function NewTransactionModal({
  onClose,
  onSuccess,
  defaultType = "Expense",
  allowedMonths,
}: NewTransactionModalProps) {
  const [formData, setFormData] = useState({
    type: defaultType,
    category: "Food",
    subject: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // If the type changes to "Income", set category to "Other"
      if (name === "type" && value === "Income") {
        return { ...prev, type: value, category: "Other" };
      }

      // Otherwise, just update the field normally
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(formData.amount) < 0) {
      toast.error("Amount cannot be negative.");
      return;
    }
    try {
      const response = await api.post("/transactions/new/", formData);
      toast.success("Transaction added successfully!");
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Something went wrong.", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 md:p-0">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-black text-lg sm:text-xl font-bold">
            New Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-[#ba7c91] bg-[#85193C] rounded-md flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        </div>

        <hr className="border-t border-gray-300 mb-4 sm:mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4">
            <label
              htmlFor="modal-type"
              className="text-sm sm:text-base font-medium text-black sm:w-28 mb-1 sm:mb-0"
            >
              Type
            </label>
            <select
              id="modal-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full sm:flex-1 rounded px-3 py-2 text-black text-sm sm:text-base
                    ${
                      formData.type === "Expense"
                        ? "bg-rose-100"
                        : formData.type === "Income"
                        ? "bg-green-100"
                        : "bg-white"
                    }`}
            >
              <option value="Expense" className="bg-white">
                Expense
              </option>
              <option value="Income" className="bg-white">
                Income
              </option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4">
            <label
              htmlFor="subject"
              className="text-sm sm:text-base font-medium text-black sm:w-28 mb-1 sm:mb-0"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full sm:flex-1 h-9 border border-gray-300 rounded px-3 py-2 text-black text-sm sm:text-base"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4">
            <label
              htmlFor="amount"
              className="text-sm sm:text-base font-medium text-black sm:w-28 mb-1 sm:mb-0"
            >
              Amount (PHP)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              min={0}
              value={formData.amount}
              onChange={handleChange}
              className="w-full sm:flex-1 h-9 border border-gray-300 rounded px-3 py-2 text-black text-sm sm:text-base"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4">
            <label
              htmlFor="date"
              className="text-sm sm:text-base font-medium text-black sm:w-28 mb-1 sm:mb-0"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full sm:flex-1 h-9 border border-gray-300 rounded px-3 py-2 text-black text-sm sm:text-base"
              required
            />
          </div>

          {formData.type === "Expense" && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4">
              <label
                htmlFor="modal-category"
                className="text-sm sm:text-base font-medium text-black sm:w-28 mb-1 sm:mb-0"
              >
                Category
              </label>
              <select
                id="modal-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full sm:flex-1 h-9 border border-gray-300 rounded px-3 py-2 text-black text-sm sm:text-base"
              >
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2 mb-4">
            <label
              htmlFor="Notes"
              className="text-sm sm:text-base font-medium text-black sm:w-28 mb-1 sm:mb-0 sm:pt-2"
            >
              Notes
            </label>
            <textarea
              id="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full sm:flex-1 min-h-[40px] border border-gray-300 rounded px-3 py-2 text-black text-sm sm:text-base resize-none"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4A102A] text-white rounded-md hover:bg-[#35091D] text-sm sm:text-base"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
