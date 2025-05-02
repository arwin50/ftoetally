"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { Menu } from "lucide-react";
import { PageLayoutProps } from "@/types";
import { logout } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "./transactions/confimModal";

export default function PageLayout({ children, activePage }: PageLayoutProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [minimized, setMinimized] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setMinimized(!minimized);
    }
  };

  const handleMainClick = () => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative ">
      {/* Mobile menu button - only visible on mobile */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-[#85193C] text-[#F7E84B] ${
          mobileOpen ? "hidden" : "block"
        }`}
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
        setShowModal={setShowModal}
      />

      {/* Overlay for mobile - only appears when sidebar is open on mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={handleMainClick}
        />
      )}

      <main
        className={`flex-1 overflow-auto transition-all duration-300 md:ml-20 ${
          isMobile && mobileOpen ? "brightness-75" : ""
        }`}
        onClick={handleMainClick}
      >
        {children}
      </main>

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
