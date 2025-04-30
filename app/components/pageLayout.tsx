"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { useAppSelector } from "@/lib/redux/hooks";
import { Menu } from "lucide-react";
import { PageLayoutProps } from "@/types";

export default function PageLayout({ children, activePage }: PageLayoutProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [minimized, setMinimized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile when component mounts and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setMinimized(!minimized);
    }
  };

  // Close mobile sidebar when clicking outside
  const handleMainClick = () => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Mobile menu button - only visible on mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-[#85193C] text-[#F7E84B]"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      <Sidebar
        activePage={activePage}
        userName={user?.username || "Username"}
        userEmail={user?.email}
        minimized={minimized}
        onToggle={toggleSidebar}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
      />

      {/* Overlay for mobile - only appears when sidebar is open on mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={handleMainClick}
        />
      )}

      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isMobile && mobileOpen ? "brightness-75" : ""
        }`}
        onClick={handleMainClick}
      >
        {children}
      </main>
    </div>
  );
}
