"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { ProtectedRoute } from "../protected";
import PageLayout from "../components/pageLayout";
import type { Transaction } from "@/types";
import { api } from "@/lib/redux/services/auth-service";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import NewTransactionModal from "../components/transactions/newTransactionModal";
import AddMonthlyBudgetModal from "../components/addMonthlyBudgetModal";
import { PlusIcon, ListIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();
  const now = new Date();
  const currentMonthYear = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncomeAllTime, setTotalIncomeAllTime] = useState(0);
  const [totalExpensesAllTime, setTotalExpensesAllTime] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [addIncomeModalOpen, setAddIncomeModalOpen] = useState(false);
  const [addMonthlyBudgetModalOpen, setAddMonthlyBudgetModalOpen] =
    useState(false);
  const [selectedMonthYear, setSelectedMonthYear] = useState(currentMonthYear);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [currentBudget, setCurrentBudget] = useState(0);

  const balance = currentBudget - totalExpenses;

  const handleViewHistory = () => {
    router.push("/transactions");
  };

  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#60A5FA",
          "#FBBF24",
          "#A78BFA",
          "#34D399",
          "#F472B6",
        ],
        hoverBackgroundColor: [
          "#3B82F6",
          "#F59E0B",
          "#8B5CF6",
          "#10B981",
          "#EC4899",
        ],
      },
    ],
  });

  const [barData, setBarData] = useState({
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount",
        data: [0, 0],
        backgroundColor: ["#14B8A6", "#F87171"],
      },
    ],
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchTotalIncomeAndExpenses = async () => {
      try {
        // Fetching total income (without applying filters)
        const incomeQuery = new URLSearchParams();
        incomeQuery.append("type", "Income"); // Only fetch income
        const incomeRes = await api.get(
          `/transactions/?${incomeQuery.toString()}`
        );

        // Calculate total income
        const totalIncome = incomeRes.data.transactions.reduce(
          (sum: number, tx: any) => sum + Number(tx.amount),
          0
        );
        setTotalIncomeAllTime(totalIncome);

        // Fetching total expenses (without applying filters)
        const expenseQuery = new URLSearchParams();
        expenseQuery.append("type", "Expense");
        const expenseRes = await api.get(
          `/transactions/?${expenseQuery.toString()}`
        );

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

    if (!isLoading && isAuthenticated) {
      fetchTotalIncomeAndExpenses();
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    const fetchBudgetAndExpenses = async () => {
      try {
        const budgetRes = await api.get(
          `/transactions/budgets/?month=${selectedMonthYear}-01`
        );

        const monthlyBudget = Number(budgetRes.data.amount);
        setCurrentBudget(monthlyBudget);

        const query = new URLSearchParams();
        query.append("type", "Expense");

        query.append("month", selectedMonthYear);

        const expenseRes = await api.get(`/transactions/?${query.toString()}`);

        const expenses = expenseRes.data.transactions;
        console.log("Expenses:", expenses);
        setTransactions(expenses);

        let totalExpense = 0;
        const categoryTotals: { [key: string]: number } = {};

        expenses.forEach((tx: Transaction) => {
          const amt = Number(tx.amount);
          totalExpense += amt;
          categoryTotals[tx.category] =
            (categoryTotals[tx.category] || 0) + amt;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        setTotalExpenses(totalExpense);

        setPieData((prev: any) => ({
          ...prev,
          labels,
          datasets: [
            {
              ...prev.datasets[0],
              data,
            },
          ],
        }));

        setBarData({
          labels: ["Budget", "Expenses"],
          datasets: [
            {
              label: "Amount",
              data: [monthlyBudget, totalExpense],
              backgroundColor: ["#14B8A6", "#F87171"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching budget or expenses:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchBudgetAndExpenses();
    }
  }, [isLoading, isAuthenticated, selectedMonthYear]);

  useEffect(() => {
    const fetchAvailableMonths = async () => {
      try {
        const res = await api.get("/transactions/budgets/all/");

        setAvailableMonths(res.data);
      } catch (error) {
        console.error("Failed to fetch available months:", error);
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchAvailableMonths();
    }
  }, [isLoading, isAuthenticated]);

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Helper function to format currency
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  function getBalanceColor(balance: number) {
    if (balance > 0) return "text-green-600";
    if (balance < 0) return "text-red-600";
    return "text-gray-600";
  }

  return (
    <ProtectedRoute>
      <PageLayout activePage="dashboard">
        <div className="flex bg-gray-50 min-h-screen">
          <main className="flex-1 overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4A102A] to-[#6B1A3A] text-white px-4 sm:px-6 py-2 shadow-md">
              <h1 className="text-xl sm:text-2xl font-bold text-center">
                Financial Dashboard
              </h1>
            </div>

            <div className="p-3 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Overview
                </h2>
                <div className="flex justify-start sm:justify-end">
                  <select
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 sm:px-3 sm:py-2 text-sm w-full sm:w-auto"
                  >
                    {availableMonths.map((month) => (
                      <option key={month} value={month}>
                        {new Date(`${month}-01`).toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                {/* Dashboard Cards */}
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                  {/* Categorical Expenses */}
                  <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 transition-all hover:shadow-lg">
                    <div className="p-2 sm:p-3 border-b border-gray-100">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Expense Categories
                      </h3>
                    </div>
                    <div className="p-2 sm:p-3 relative">
                      <div className="aspect-square max-w-[200px] mx-auto relative">
                        <Pie data={pieData} />
                        {totalExpenses === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 font-medium">
                            No expenses yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Budget vs Expenses */}
                  <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 transition-all hover:shadow-lg">
                    <div className="p-2 sm:p-3 border-b border-gray-100">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Budget vs Expenses
                      </h3>
                    </div>
                    <div className="p-2 sm:p-3">
                      <div className="aspect-square max-w-[200px] mx-auto relative">
                        <Bar data={barData} options={barOptions} />
                      </div>
                    </div>
                  </div>

                  {/* Budget Summary */}
                  <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 transition-all hover:shadow-lg">
                    <div className="p-2 sm:p-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Budget Summary
                      </h3>
                      <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {selectedMonthYear === currentMonthYear
                          ? "This month"
                          : new Date(selectedMonthYear + "-01").toLocaleString(
                              "default",
                              {
                                month: "long",
                                year: "numeric",
                              }
                            )}
                      </span>
                    </div>
                    <div className="p-2 sm:p-3 space-y-3 sm:space-y-5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-600">
                          Budget:
                        </span>
                        <span className="font-mono font-medium text-sm sm:text-base text-gray-800">
                          {formatCurrency(currentBudget)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-600">
                          Total Expense:
                        </span>
                        <span className="font-mono font-medium text-sm sm:text-base text-red-600">
                          - {formatCurrency(totalExpenses)}
                        </span>
                      </div>

                      <div className="border-t pt-3 sm:pt-5 flex justify-between items-center">
                        <span className="font-semibold text-sm sm:text-base text-gray-800">
                          Remaining Budget:
                        </span>
                        <span
                          className={`font-mono font-bold text-base sm:text-lg ${getBalanceColor(
                            balance
                          )}`}
                        >
                          {formatCurrency(balance)}
                        </span>
                      </div>

                      <div className="pt-2">
                        {totalExpenses > currentBudget && (
                          <div className="flex items-center text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg">
                            <svg
                              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <p className="text-xs sm:text-sm font-medium">
                              Warning: You've exceeded your budget!
                            </p>
                          </div>
                        )}

                        {totalExpenses === currentBudget && (
                          <div className="flex items-center text-yellow-600 bg-yellow-50 p-2 sm:p-3 rounded-lg">
                            <svg
                              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-xs sm:text-sm font-medium">
                              Heads up: You've hit your monthly budget!
                            </p>
                          </div>
                        )}

                        {totalExpenses < currentBudget && (
                          <div className="flex items-center text-green-600 bg-green-50 p-2 sm:p-3 rounded-lg">
                            <svg
                              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-xs sm:text-sm font-medium">
                              Great! You're under your monthly budget!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Quick Access */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 transition-all hover:shadow-lg">
                    <div className="p-2 sm:p-3 border-b border-gray-100">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Quick Actions
                      </h3>
                    </div>
                    <div className="p-3 sm:p-5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <button
                          className="bg-gradient-to-br cursor-pointer from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 
                          transition-all duration-300 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center gap-2 sm:gap-3 
                          shadow-sm hover:shadow border border-red-200 group"
                          onClick={() => setAddExpenseModalOpen(true)}
                        >
                          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                            <PlusIcon className="h-4 w-4 sm:h-6 sm:w-6 text-red-500" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-800 text-center">
                            Add Expense
                          </span>
                        </button>

                        <button
                          className="bg-gradient-to-b cursor-pointer from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 
                          transition-all duration-300 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center gap-2 sm:gap-3 
                          shadow-sm hover:shadow border border-green-200 group"
                          onClick={() => setAddIncomeModalOpen(true)}
                        >
                          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                            <PlusIcon className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-800 text-center">
                            Add Income
                          </span>
                        </button>

                        <button
                          className="bg-gradient-to-br cursor-pointer from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 
                          transition-all duration-300 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center gap-2 sm:gap-3 
                          shadow-sm hover:shadow border border-purple-200 group"
                          onClick={() => setAddMonthlyBudgetModalOpen(true)}
                        >
                          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                            <PlusIcon className="h-4 w-4 sm:h-6 sm:w-6 text-purple-500" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-800 text-center">
                            Set Budget
                          </span>
                        </button>

                        <button
                          className="bg-gradient-to-br cursor-pointer from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 
                          transition-all duration-300 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center gap-2 sm:gap-3 
                          shadow-sm hover:shadow border border-gray-200 group"
                          onClick={handleViewHistory}
                        >
                          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                            <ListIcon className="h-4 w-4 sm:h-6 sm:w-6 text-gray-500" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-800 text-center">
                            View History
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 transition-all hover:shadow-lg">
                    <div className="p-2 sm:p-3 border-b border-gray-100">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Remaining Balance
                      </h3>
                    </div>

                    <div className="flex h-[120px] sm:h-[150px] justify-center items-center">
                      <p
                        className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${
                          totalIncomeAllTime - totalExpensesAllTime > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } items-center font-mono tracking-tight`}
                      >
                        {formatCurrency(
                          totalIncomeAllTime - totalExpensesAllTime
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Modals */}
        {addExpenseModalOpen && (
          <NewTransactionModal
            onClose={() => setAddExpenseModalOpen(false)}
            onSuccess={() => setAddExpenseModalOpen(false)}
            defaultType="Expense"
            allowedMonths={availableMonths}
          />
        )}
        {addIncomeModalOpen && (
          <NewTransactionModal
            onClose={() => setAddIncomeModalOpen(false)}
            onSuccess={() => setAddIncomeModalOpen(false)}
            defaultType="Income"
            allowedMonths={availableMonths}
          />
        )}
        {addMonthlyBudgetModalOpen && (
          <AddMonthlyBudgetModal
            isOpen={addMonthlyBudgetModalOpen}
            onClose={() => setAddMonthlyBudgetModalOpen(false)}
            onSuccess={() => {
              setAddMonthlyBudgetModalOpen(false);
            }}
          />
        )}
      </PageLayout>
    </ProtectedRoute>
  );
}
