"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { ProtectedRoute } from "../protected";

import { Sidebar } from "../components/sidebar";
import { List } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-row bg-gray-50">
        {/* Sidebar */}
        <div
          className={`bg-[#8B1A3A] text-white flex flex-col h-screen transition-all duration-300 ${
            showSidebar ? "w-[304px]" : "w-0 overflow-hidden"
          }`}
        >
          <Sidebar activePage="dashboard" />
        </div>

        {/* Main content */}
        <div className={`flex flex-col flex-1 transition-all duration-300`}>
          {/* Topbar */}
          <div className="flex justify-between items-center p-4 shadow bg-white">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="rounded-lg border border-gray-300 p-2 text-gray-800 bg-[#8B1A3A] hover:bg-[#6D1530] transition"
            >
              <List className="text-[#F7E84B]" size={25} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>

          {/* Page content */}
          <div className="container mx-auto max-w-4xl py-8 px-4">
            <div className="rounded-md bg-white shadow-md p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Welcome to your account dashboard
                </p>
              </div>
              {user && (
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>User ID:</strong> {user.id}
                  </p>
                </div>
              )}
              <div className="mt-6">
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
