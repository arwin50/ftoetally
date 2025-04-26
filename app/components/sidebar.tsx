"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/redux/slices/authSlice";

export const Sidebar = () => {
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

      <aside
        className={`fixed md:relative h-screen bg-burgundy text-yellow-300 transition-all duration-300 ease-in-out z-30 
                  ${isOpen ? "w-64" : "w-0 md:w-16"} overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logout */}
          <div className="p-4">
            <button
              className="flex items-center text-yellow-300 hover:text-yellow-100 transition-colors"
              onClick={handleLogout}
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {isOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>

          {/* Logo */}
          <div className="p-4 flex items-center">
            <div className="h-8 w-8 bg-yellow-300 rounded-full flex items-center justify-center text-burgundy font-bold">
              T
            </div>
            {isOpen && <span className="ml-3 text-2xl font-bold">Tally</span>}
          </div>
        </div>
      </aside>

      {/* Toggle Button - Outside the sidebar */}
      <button
        className="fixed md:absolute top-4 left-4 md:left-64 z-40 bg-burgundy text-yellow-300 p-2 rounded-md shadow-md transition-all duration-300 ease-in-out"
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
