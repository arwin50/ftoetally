"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { ProtectedRoute } from "../protected";
import PageLayout from "../components/pageLayout";
import { Transaction } from "@/types";
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
import LoadingScreen from "../components/loadingScreen";
import NewTransactionModal from "../components/transactions/newTransactionModal";

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
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();
  const [pieData, setPieData] = useState<{
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  }>({
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

        // Calculate expense totals per category
        const categoryTotals: { [key: string]: number } = {};
        fetched.forEach((tx: Transaction) => {
          if (tx.type === "Expense") {
            const cat = tx.category;
            const amt = Number(tx.amount);
            totalExpense += Number(tx.amount);

            categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
          }
          if (tx.type === "Income") {
            totalIncome += Number(tx.amount);
          }
        });
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        setTotalExpenses(totalExpense);
        setTotalIncome(totalIncome);
        setPieData((prev) => ({
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
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <ProtectedRoute>
      <PageLayout activePage="dashboard">
        <div className="flex h-screen bg-gray-100">
          <main className="flex-1 overflow-auto transition-all duration-300">
            <div className="bg-[#4A102A] text-white px-4 py-2">
              <h1 className="text-2xl font-bold text-center">Dashboard</h1>
            </div>

            <div className="p-6">
              <h2 className="text-3xl font-bold mb-6">Monthly Reports</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Categorical Expenses */}
                <div className="bg-white p-4 rounded-md shadow">
                  <h3 className="text-lg font-semibold mb-3">
                    Categorical Expenses
                  </h3>
                  <div className="aspect-square max-w-xs mx-auto">
                    <Pie data={pieData} />
                  </div>
                </div>

                {/* Income vs Expenses */}
                <div className="bg-white p-4 rounded-md shadow">
                  <h3 className="text-lg font-semibold mb-3">
                    Income vs Expenses
                  </h3>
                  <div className="aspect-square max-w-xs mx-auto relative">
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
              </div>

              {/* Quick Access */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-xl font-semibold mb-4">Quick Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button className="bg-red-200 hover:bg-red-300 transition-colors p-4 rounded flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add new expense
                  </button>

                  <button className="bg-green-200 hover:bg-green-300 transition-colors p-4 rounded flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add new income
                  </button>

                  <button className="bg-[#dcbafe] hover:bg-[#cb97fd] transition-colors p-4 rounded flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add monthly budget
                  </button>

                  <button className="bg-gray-200 hover:bg-gray-300 transition-colors p-4 rounded flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                    View History
                  </button>
                </div>
              </div>

              {/* Balance Summary */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Balance Summary</h3>
                  <span className="text-gray-500">This month</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Income:</span>
                    <span className="font-mono">{totalIncome}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Expense:</span>
                    <span className="font-mono text-red-600">
                      - {totalExpenses}
                    </span>
                  </div>

                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Remaining Balance:</span>
                    <span
                      className={`font-mono ${
                        totalIncome - totalExpenses > 0
                          ? "text-green-600"
                          : totalIncome - totalExpenses < 0
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {totalIncome - totalExpenses}
                    </span>
                  </div>

                  {/* Indicator Message */}
                  <div className="pt-2">
                    {totalIncome - totalExpenses < 0 && (
                      <p className="text-sm text-red-600 font-medium">
                        Warning: You're over budget this month!
                      </p>
                    )}
                    {totalIncome - totalExpenses === 0 && (
                      <p className="text-sm text-gray-500">
                        You’ve broken even this month.
                      </p>
                    )}
                    {totalIncome - totalExpenses > 0 && (
                      <p className="text-sm text-green-600">
                        Great! You’re under budget.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
