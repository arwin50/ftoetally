"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, WalletCards, LogOut } from "lucide-react";
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

export const Sidebar = ({ activePage, userName, userEmail }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (using <aside>) */}
      <aside
        className={`fixed md:relative h-screen bg-[#85193C] text-white transition-all duration-300 ease-in-out z-30 
                  ${isOpen ? "w-64" : "w-0 md:w-16"} overflow-hidden`}
      >
        {/* User Profile */}
        <div className="flex flex-col items-center justify-center mt-16 mb-12 mx-auto">
          <IoPersonCircleOutline className="text-[#F7E84B]" size={132} />
          <h2 className="mt-2 text-xl font-medium text-[#F7E84B]">
            {userName}
          </h2>
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
              activePage === "transactions"
                ? " ml-3 rounded-md bg-[#6D1530]"
                : ""
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
      </aside>

      {/* Toggle Button for mobile */}
      <button
        className="fixed md:absolute top-4 left-4 md:left-64 z-40 bg-[#85193C] text-[#F7E84B] p-2 rounded-md shadow-md transition-all duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(0)",
          left: isOpen ? (isMobile ? "16rem" : "16rem") : "1rem",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        )}
      </button>
    </>
  );
};
