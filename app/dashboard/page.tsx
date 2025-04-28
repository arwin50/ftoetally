"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { ProtectedRoute } from "../protected";
import { Sidebar } from "../components/sidebar";
import PageLayout from "../components/pageLayout";

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
  const [minimized, setMinimized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // --- Chart Data ---
  const pieData = {
    labels: ["Food", "Rent", "Entertainment"],
    datasets: [
      {
        data: [300, 500, 200],
        backgroundColor: ["#60A5FA", "#FBBF24", "#A78BFA"],
        hoverBackgroundColor: ["#3B82F6", "#F59E0B", "#8B5CF6"],
      },
    ],
  };

  const barData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount",
        data: [1000, 700],
        backgroundColor: ["#14B8A6", "#F87171"],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const toggleSidebar = () => {
    setMinimized(!minimized);
  };

  return (
    <ProtectedRoute>
      <PageLayout activePage="dashboard">
        <div className="flex h-screen bg-gray-100">
          <main className="flex-1 overflow-auto transition-all duration-300">
            <div className="bg-burgundy text-white p-4">
              <h1 className="text-2xl font-bold ml-2">Dashboard</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <span className="font-mono">1,000,000,000</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Expense:</span>
                    <span className="font-mono">-999,999,999</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Remaining Balance:</span>
                    <span className="font-mono">1</span>
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
