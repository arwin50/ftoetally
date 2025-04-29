"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";

interface NewTransactionModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NewTransactionModal({
  onClose,
  onSuccess,
}: NewTransactionModalProps) {
  const [formData, setFormData] = useState({
    type: "Expense",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:8000/transactions/new/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          user: 1,
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        console.error("Error:", data);
        alert("Failed to save transaction. Please check input.");
        return;
      }
  
      alert("Transaction saved successfully!");
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Network error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-black text-xl font-bold">New Transaction</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-[#ba7c91] bg-[#85193C] rounded-md"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        <hr className="border-t border-gray-300 mb-6" />

        <form onSubmit={handleSubmit} className="">
          <div className="flex items-center gap-2 mb-4">
            <label
              htmlFor="modal-type"
              className="w-28 text-base font-medium text-black"
            >
              Type
            </label>
            <select
              id="modal-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`flex-1 rounded px-3 py-2 text-black
                    ${
                      formData.type === "Expense"
                        ? "bg-rose-100"
                        : formData.type === "Income"
                        ? "bg-green-100"
                        : "bg-white"
                    }`}
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label
              htmlFor="subject"
              className="w-28 text-base font-medium text-black"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="flex-1 h-9 border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label
              htmlFor="amount"
              className="w-28 text-base font-medium text-black"
            >
              Amount (PHP)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="flex-1 h-9 border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label
              htmlFor="date"
              className="w-28 text-base font-medium text-black"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="flex-1 h-9 border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label
              htmlFor="modal-category"
              className="w-28 text-base font-medium text-black"
            >
              Category
            </label>
            <select
              id="modal-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="flex-1 h-9 border border-gray-300 rounded px-3 py-2 text-black"
            >
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <label
              htmlFor="Notes"
              className="w-28 text-base font-medium text-black pt-2"
            >
              Notes
            </label>
            <textarea
              id="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={1}
              className="flex-1 min-h-[40px] border border-gray-300 rounded px-3 py-2 text-black resize-none overflow-hidden"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4A102A] text-white rounded-md hover:bg-[#35091D]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
