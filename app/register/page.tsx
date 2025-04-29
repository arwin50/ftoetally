"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { register, clearError } from "@/lib/redux/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (formData.password !== formData.password_confirmation) {
      setValidationError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      router.push("/login?registered=true");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#85193C] p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="text-gray-600">
            Enter your details to create a new account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className="mb-4 rounded-md border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
              {validationError || error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-50 px-3 py-2 text-sm border border-gray-200 focus:border-[#8b1a3d] focus:outline-none focus:ring focus:ring-[#8b1a3d]/20"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email@address.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-50 px-3 py-2 text-sm border border-gray-200 focus:border-[#8b1a3d] focus:outline-none focus:ring focus:ring-[#8b1a3d]/20"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-50 px-3 py-2 text-sm border border-gray-200 focus:border-[#8b1a3d] focus:outline-none focus:ring focus:ring-[#8b1a3d]/20"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password_confirmation"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-50 px-3 py-2 text-sm border border-gray-200 focus:border-[#8b1a3d] focus:outline-none focus:ring focus:ring-[#8b1a3d]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md border border-[#6a142e] bg-[#6a142e] py-3 text-[#F7E84B] hover:bg-[#5a0f26] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-[#0a3977] hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
