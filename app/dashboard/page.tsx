"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { ProtectedRoute } from "../protected";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

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
      <div className="flex min-h-screen flex-col bg-gray-50 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="rounded-md bg-white shadow-md p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
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
    </ProtectedRoute>
  );
}
