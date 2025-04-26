"use client";
import Link from "next/link";
import { Home, WalletCards, LogOut, User } from "lucide-react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
  activePage?: "dashboard" | "transactions";
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ activePage, userName, userEmail }: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="bg-[#85193C] text-white flex flex-col h-screen">
      {/* User Profile */}
      <div className="flex flex-col items-center justify-center mt-16 mb-12 mx-auto">
        <IoPersonCircleOutline className="text-[#F7E84B]" size={132} />
        <h2 className="mt-2 text-xl font-medium text-[#F7E84B]">{userName}</h2>
        <h3 className="text-[#F7E84B]">{userEmail}</h3>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <Link
          href="/dashboard"
          className={`flex items-center w-[90%] px-6 py-3 text-left ml-3 rounded-md hover:bg-[#4A102A] transition-colors duration-200${
            activePage === "dashboard" ? " ml-3 rounded-md bg-[#4A102A]" : ""
          }`}
        >
          <Home className="mr-3 text-[#F7E84B]" size={24} />
          <span className="text-lg">Dashboard</span>
        </Link>
        <Link
          href="/transactions"
          className={`flex items-center w-[90%] px-6 py-3 mt-2 text-left ml-3 rounded-md hover:bg-[#4A102A] transition-colors duration-200${
            activePage === "transactions" ? " ml-3 rounded-md bg-[#6D1530]" : ""
          }`}
        >
          <WalletCards className="mr-3 text-[#F7E84B]" size={24} />
          <span className="text-lg">Transactions</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center w-[90%] px-6 py-3 mt-2 ml-3 rounded-md hover:bg-[#4A102A] transition-colors duration-200 text-left"
      >
        <LogOut className="mr-3 text-[#F7E84B]" size={24} />
        <span className="text-lg">Logout</span>
      </button>

      {/* Tally Logo */}
      <div className="flex items-center px-6 py-4 mb-4">
        {/* Display the logo from the public folder */}
        <div className="rounded-full flex items-center justify-center mr-3">
          <Image
            src="/assets/tally-logo.png"
            alt="Tally Logo"
            width={50}
            height={50}
          />
        </div>
        <span className="text-3xl font-bold text-[#F7E84B]">Tally</span>
      </div>
    </div>
  );
}
