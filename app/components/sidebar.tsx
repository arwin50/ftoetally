"use client";
import Link from "next/link";
import { Home, WalletCards, LogOut } from "lucide-react";

interface SidebarProps {
  activePage?: "dashboard" | "transactions";
  userName?: string;
}

export function Sidebar({
  activePage = "dashboard",
  userName = "John Doe",
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* User Profile */}
      <div className="flex flex-col items-center mt-16 mb-12">
        <div className="w-32 h-32 rounded-full bg-[#F7E84B] flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-[#8B1A3A]"></div>
        </div>
        <h2 className="mt-4 text-xl font-medium text-[#F7E84B]">{userName}</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <Link
          href="/dashboard"
          className={`flex items-center w-full px-6 py-3 text-left ${
            activePage === "dashboard" ? "bg-[#6D1530]" : ""
          }`}
        >
          <Home className="mr-3 text-[#F7E84B]" size={24} />
          <span className="text-lg">Dashboard</span>
        </Link>
        <Link
          href="/transactions"
          className={`flex items-center w-full px-6 py-3 text-left ${
            activePage === "transactions" ? "bg-[#6D1530]" : ""
          }`}
        >
          <WalletCards className="mr-3 text-[#F7E84B]" size={24} />
          <span className="text-lg">Transactions</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <Link href="/logout" className="flex items-center px-6 py-3 text-left">
        <LogOut className="mr-3 text-[#F7E84B]" size={24} />
        <span className="text-lg">Logout</span>
      </Link>

      {/* Tally Logo */}
      <div className="flex items-center px-6 py-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#F7E84B] flex items-center justify-center text-[#8B1A3A] font-bold mr-3">
          <span>₹</span>
        </div>
        <span className="text-3xl font-bold text-[#F7E84B]">Tally</span>
      </div>
    </div>
  );
}
