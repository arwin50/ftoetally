"use client";
import Link from "next/link";
import {
  Home,
  WalletCards,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { ConfirmationModal } from "./transactions/confimModal";
import { SidebarProps } from "@/types";
import { json2csv } from "json-2-csv";

export function Sidebar({
  activePage,
  userName,
  userEmail,
  minimized = false,
  onToggle,
  isMobile = false,
  mobileOpen = false,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };


  return (
    <div className={`flex h-screen ${isMobile ? "fixed z-20" : ""}`}>
      <div
        className={`bg-[#85193C] text-white flex flex-col h-screen transition-all duration-300 
          ${minimized && !isMobile ? "w-[80px]" : "w-[304px]"}
          ${isMobile ? "fixed left-0 top-0 bottom-0" : ""}
          ${isMobile && !mobileOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onToggle}
            className="absolute top-4 right-4 text-[#F7E84B] p-1"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        )}

        {/* User Profile */}
        <div
          className={`flex flex-col items-center justify-center ${
            minimized && !isMobile ? "mt-6 mb-6" : "mt-16 mb-12"
          } mx-auto`}
        >
          <IoPersonCircleOutline
            className="text-[#F7E84B]"
            size={minimized && !isMobile ? 40 : 132}
          />
          {(!minimized || isMobile) && (
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
          <button
            onClick={() => {
              if (pathname === "/dashboard") {
                router.replace(pathname); // Force reload
              } else {
                router.push("/dashboard");
              }
            }}
            className={`flex items-center ${
              minimized && !isMobile ? "justify-center" : ""
            } ${
              minimized && !isMobile ? "w-[90%] mx-auto" : "w-[90%] ml-3"
            } px-3 py-3 rounded-md hover:bg-[#4A102A] transition-colors duration-200${
              activePage === "dashboard" ? " rounded-md bg-[#4A102A]" : ""
            }`}
          >
            <Home
              className={`${
                minimized && !isMobile ? "" : "mr-3"
              } text-[#F7E84B]`}
              size={24}
            />
            {(!minimized || isMobile) && (
              <span className="text-lg">Dashboard</span>
            )}
          </button>
          <button
            onClick={() => {
              if (pathname === "/transactions") {
                router.replace(pathname); // Force reload
              } else {
                router.push("/transactions");
              }
            }}
            className={`flex items-center ${
              minimized && !isMobile ? "justify-center" : ""
            } ${
              minimized && !isMobile ? "w-[90%] mx-auto" : "w-[90%] ml-3"
            } px-3 py-3 mt-2 rounded-md hover:bg-[#4A102A] transition-colors duration-200${
              activePage === "transactions" ? " rounded-md bg-[#6D1530]" : ""
            }`}
          >
            <WalletCards
              className={`${
                minimized && !isMobile ? "" : "mr-3"
              } text-[#F7E84B]`}
              size={24}
            />
            {(!minimized || isMobile) && (
              <span className="text-lg">Transactions</span>
            )}
          </button>
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center ${
            minimized && !isMobile ? "justify-center" : ""
          } ${
            minimized && !isMobile ? "w-[90%] mx-auto" : "w-[90%] ml-3"
          } px-3 py-3 mt-2 rounded-md hover:bg-[#4A102A] transition-colors duration-200 text-left cursor-pointer`}
        >
          <LogOut
            className={`${minimized && !isMobile ? "" : "mr-3"} text-[#F7E84B]`}
            size={24}
          />
          {(!minimized || isMobile) && <span className="text-lg">Logout</span>}
        </button>

        {/* Tally Logo */}
        <div
          className={`flex items-center ${
            minimized && !isMobile ? "justify-center" : ""
          } px-3 py-4 mb-4`}
        >
          {/* Display the logo from the public folder */}
          <div className="rounded-full flex items-center justify-center">
            <Image
              src="/assets/tally-logo.png"
              alt="Tally Logo"
              width={minimized && !isMobile ? 40 : 50}
              height={minimized && !isMobile ? 40 : 50}
            />
          </div>
          {(!minimized || isMobile) && (
            <span className="text-3xl font-bold text-[#F7E84B] ml-3">
              Tally
            </span>
          )}
        </div>
      </div>

      {/* Toggle Button Container - Only visible on desktop */}
      {!isMobile && (
        <div className="relative">
          <button
            onClick={onToggle}
            className="absolute top-4 -left-4 rounded-full w-8 h-8 flex items-center justify-center bg-[#8B1A3A] text-[#F7E84B] border border-[#F7E84B] hover:bg-[#6D1530] transition-colors duration-200 cursor-pointer"
            aria-label={minimized ? "Expand sidebar" : "Collapse sidebar"}
          >
            {minimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={showModal}
        onClose={handleCancelLogout}
        onConfirm={handleLogout}
        title="Confirming Logout"
        message="Are you sure you want to log out of your account?"
      />
    </div>
  );
}
