"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { ProtectedRoute } from "../protected";
import PageLayout from "../components/pageLayout";
import { Transaction } from "@/types";
import { api } from "@/lib/redux/services/auth-service";
import { Pie, Bar } from "react-chartjs-2";
import { ConfirmationModal } from "../components/transactions/confimModal";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import LoadingScreen from "../components/loadingScreen";
import NewTransactionModal from "../components/transactions/newTransactionModal";
import AddMonthlyBudgetModal from "../components/addMonthlyBudgetModal";
import { PlusIcon, ListIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [addIncomeModalOpen, setAddIncomeModalOpen] = useState(false);
  const [addMonthlyBudgetModalOpen, setAddMonthlyBudgetModalOpen] =
    useState(false);

  const [currentBudget, setCurrentBudget] = useState(0);

  const balance = totalIncome - totalExpenses;

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
    async function fetchCurrentBudget() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

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
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let totalIncome = 0;
        let totalExpense = 0;

        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get("/transactions/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const fetched = response.data;
        setTransactions(fetched);
        console.log("Fetched Transactions:", fetched);

        const categoryTotals: { [key: string]: number } = {};

        fetched.forEach((tx: Transaction) => {
          const amt = Number(tx.amount);

          if (tx.type === "Expense") {
            totalExpense += amt;
            categoryTotals[tx.category] =
              (categoryTotals[tx.category] || 0) + amt;
          }

          if (tx.type === "Income") {
            totalIncome += amt;
          }
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        setTotalExpenses(totalExpense);
        setTotalIncome(totalIncome);

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
          labels: ["Income", "Expenses"],
          datasets: [
            {
              label: "Amount",
              data: [totalIncome, totalExpense],
              backgroundColor: ["#14B8A6", "#F87171"],
            },
          ],
        });
      } catch {
        alert("Something went wrong. Please try again later.");
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchTransactions();
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <LoadingScreen />;
  }

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
        <div className="flex  bg-gray-50">
          <main className="flex-1 overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4A102A] to-[#6B1A3A] text-white px-6 py-4 shadow-md">
              <h1 className="text-2xl font-bold text-center">
                Financial Dashboard
              </h1>
            </div>

            <div className="p-4 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  Monthly Overview
                </h2>
                <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
                  May 2025
                </div>
              </div>

              {/* Dashboard Cards */}
              <div className="flex gap-6 mb-4">
                {/* Categorical Expenses */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Expense Categories
                    </h3>
                  </div>
                  <div className="p-3">
                    <div className="aspect-square max-w-[200px] mx-auto">
                      <Pie data={pieData} />
                    </div>
                  </div>
                </div>

                {/* Income vs Expenses */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Income vs Expenses
                    </h3>
                  </div>
                  <div className="p-3">
                    <div className="aspect-square max-w-[200px] mx-auto relative">
                      <Bar data={barData} options={barOptions} />
                    </div>
                  </div>
                </div>

                {/* Balance Summary */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Balance Summary
                    </h3>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      This month
                    </span>
                  </div>
                  <div className="p-3 space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Income:</span>
                      <span className="font-mono font-medium text-gray-800">
                        {formatCurrency(totalIncome)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Expense:</span>
                      <span className="font-mono font-medium text-red-600">
                        - {formatCurrency(totalExpenses)}
                      </span>
                    </div>

                    <div className="border-t pt-5 flex justify-between items-center">
                      <span className="font-semibold text-gray-800">
                        Remaining Balance:
                      </span>
                      <span
                        className={`font-mono font-bold text-lg ${getBalanceColor(
                          balance
                        )}`}
                      >
                        {formatCurrency(balance)}
                      </span>
                    </div>

                    <div className="pt-2">
                      {totalExpenses > currentBudget && (
                        <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                          <svg
                            className="h-5 w-5 mr-2"
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
                          <p className="text-sm font-medium">
                            Warning: You've exceeded your budget of{" "}
                            {formatCurrency(currentBudget)}!
                          </p>
                        </div>
                      )}

                      {totalExpenses === currentBudget && (
                        <div className="flex items-center text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                          <svg
                            className="h-5 w-5 mr-2"
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
                          <p className="text-sm font-medium">
                            Heads up: You've hit your monthly budget exactly{" "}
                            {formatCurrency(currentBudget)}!
                          </p>
                        </div>
                      )}

                      {totalExpenses < currentBudget && (
                        <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                          <svg
                            className="h-5 w-5 mr-2"
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
                          <p className="text-sm font-medium">
                            Great! You're under your monthly budget of{" "}
                            {formatCurrency(currentBudget)}!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Access */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Quick Actions
                  </h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      className="bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 
                      transition-all duration-300 p-4 rounded-lg flex flex-col items-center justify-center gap-3 
                      shadow-sm hover:shadow border border-red-200 group"
                      onClick={() => setAddExpenseModalOpen(true)}
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                        <PlusIcon className="h-6 w-6 text-red-500" />
                      </div>
                      <span className="font-medium text-gray-800">
                        Add Expense
                      </span>
                    </button>

                    <button
                      className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 
                      transition-all duration-300 p-4 rounded-lg flex flex-col items-center justify-center gap-3 
                      shadow-sm hover:shadow border border-green-200 group"
                      onClick={() => setAddIncomeModalOpen(true)}
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                        <PlusIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <span className="font-medium text-gray-800">
                        Add Income
                      </span>
                    </button>

                    <button
                      className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 
                      transition-all duration-300 p-4 rounded-lg flex flex-col items-center justify-center gap-3 
                      shadow-sm hover:shadow border border-purple-200 group"
                      onClick={() => setAddMonthlyBudgetModalOpen(true)}
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                        <PlusIcon className="h-6 w-6 text-purple-500" />
                      </div>
                      <span className="font-medium text-gray-800">
                        Set Budget
                      </span>
                    </button>

                    <button
                      className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 
                      transition-all duration-300 p-4 rounded-lg flex flex-col items-center justify-center gap-3 
                      shadow-sm hover:shadow border border-gray-200 group"
                      onClick={handleViewHistory}
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                        <ListIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-800">
                        View History
                      </span>
                    </button>
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
          />
        )}
        {addIncomeModalOpen && (
          <NewTransactionModal
            onClose={() => setAddIncomeModalOpen(false)}
            onSuccess={() => setAddIncomeModalOpen(false)}
            defaultType="Income"
          />
        )}
        {addMonthlyBudgetModalOpen && (
          <AddMonthlyBudgetModal
            isOpen={addMonthlyBudgetModalOpen}
            onClose={() => setAddMonthlyBudgetModalOpen(false)}
            onSuccess={() => setAddMonthlyBudgetModalOpen(false)}
          />
        )}
      </PageLayout>
    </ProtectedRoute>
  );
}
