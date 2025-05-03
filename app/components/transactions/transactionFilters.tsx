"use client";
import { TransactionFiltersProps } from "@/types";

export default function TransactionFilters({
  type,
  setType,
  category,
  setCategory,
  month,
  setMonth,
}: TransactionFiltersProps) {
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {/* Type Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
        <label
          htmlFor="type"
          className="text-base sm:text-lg font-medium text-black"
        >
          Type
        </label>
        <div className="relative w-full sm:w-auto">
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="appearance-none h-10 border border-gray-300 rounded-lg ps-4 pe-7 py-1.5 text-sm sm:text-md text-black w-full"
          >
            <option value="All">All</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
        <label
          htmlFor="category"
          className="text-base sm:text-lg font-medium text-black"
        >
          Category
        </label>
        <div className="relative w-full sm:w-auto">
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none h-10 border border-gray-300 rounded-lg ps-4 pe-7 py-1.5 text-sm sm:text-md text-black w-full"
          >
            <option value="All">All</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>

            <option value="Other">Other</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Month Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
        <label
          htmlFor="month"
          className="text-base sm:text-lg font-medium text-black"
        >
          Month
        </label>
        <div className="relative w-full sm:w-auto">
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="appearance-none h-10 border border-gray-300 rounded-lg ps-4 pe-7 py-1.5 text-sm sm:text-md text-black w-full sm:w-auto"
          >
            <option value="All">All</option>
            <option value="Current">{currentMonth}</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
}
