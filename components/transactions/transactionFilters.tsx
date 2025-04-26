"use client";

import { useState } from "react";

export default function TransactionFilters() {
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");

  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="type" className="text-lg font-medium text-black">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-10 border border-gray-300 rounded-lg px-3 py-1.5 text-md text-black"
        >
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
          <option value="All">All</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="category" className="text-lg font-medium text-black">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 border border-gray-300 rounded-lg px-3 py-1.5 text-md text-black"
        >
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
}
