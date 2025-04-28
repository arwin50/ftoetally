"use client";
import Link from "next/link";
import {
  Home,
  WalletCards,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
  activePage?: "dashboard" | "transactions";
  userName?: string;
  userEmail?: string;
  minimized?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  activePage,
  userName,
  userEmail,
  minimized = false,
  onToggle,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      <div
        className={`bg-[#85193C] text-white flex flex-col h-screen transition-all duration-300 ${
          minimized ? "w-[80px]" : "w-[304px]"
        }`}
      >
        {/* User Profile */}
        <div
          className={`flex flex-col items-center justify-center ${
            minimized ? "mt-6 mb-6" : "mt-16 mb-12"
          } mx-auto`}
        >
          <IoPersonCircleOutline
            className="text-[#F7E84B]"
            size={minimized ? 40 : 132}
          />
          {!minimized && (
            <>
              <h2 className="mt-2 text-xl font-medium text-[#F7E84B]">
                {userName}
              </h2>
              <h3 className="text-[#F7E84B]">{userEmail}</h3>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <Link
            href="/dashboard"
            className={`flex items-center ${
              minimized ? "justify-center" : ""
            } ${
              minimized ? "w-[90%] mx-auto" : "w-[90%] ml-3"
            } px-3 py-3 rounded-md hover:bg-[#4A102A] transition-colors duration-200${
              activePage === "dashboard" ? " rounded-md bg-[#4A102A]" : ""
            }`}
          >
            <Home
              className={`${minimized ? "" : "mr-3"} text-[#F7E84B]`}
              size={24}
            />
            {!minimized && <span className="text-lg">Dashboard</span>}
          </Link>
          <Link
            href="/transactions"
            className={`flex items-center ${
              minimized ? "justify-center" : ""
            } ${
              minimized ? "w-[90%] mx-auto" : "w-[90%] ml-3"
            } px-3 py-3 mt-2 rounded-md hover:bg-[#4A102A] transition-colors duration-200${
              activePage === "transactions" ? " rounded-md bg-[#6D1530]" : ""
            }`}
          >
            <WalletCards
              className={`${minimized ? "" : "mr-3"} text-[#F7E84B]`}
              size={24}
            />
            {!minimized && <span className="text-lg">Transactions</span>}
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center ${minimized ? "justify-center" : ""} ${
            minimized ? "w-[90%] mx-auto" : "w-[90%] ml-3"
          } px-3 py-3 mt-2 rounded-md hover:bg-[#4A102A] transition-colors duration-200 text-left`}
        >
          <LogOut
            className={`${minimized ? "" : "mr-3"} text-[#F7E84B]`}
            size={24}
          />
          {!minimized && <span className="text-lg">Logout</span>}
        </button>

        {/* Tally Logo */}
        <div
          className={`flex items-center ${
            minimized ? "justify-center" : ""
          } px-3 py-4 mb-4`}
        >
          {/* Display the logo from the public folder */}
          <div className="rounded-full flex items-center justify-center">
            <Image
              src="/assets/tally-logo.png"
              alt="Tally Logo"
              width={minimized ? 40 : 50}
              height={minimized ? 40 : 50}
            />
          </div>
          {!minimized && (
            <span className="text-3xl font-bold text-[#F7E84B] ml-3">
              Tally
            </span>
          )}
        </div>
      </div>

      {/* Toggle Button Container */}
      <div className="relative">
        <button
          onClick={onToggle}
          className="absolute top-4 -left-4 rounded-full w-8 h-8 flex items-center justify-center bg-[#8B1A3A] text-[#F7E84B] border border-[#F7E84B] hover:bg-[#6D1530] transition-colors duration-200"
          aria-label={minimized ? "Expand sidebar" : "Collapse sidebar"}
        >
          {minimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );
}
