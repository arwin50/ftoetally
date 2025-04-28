"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { useAppSelector } from "@/lib/redux/hooks";

interface PageLayoutProps {
  children: ReactNode;
  activePage?: "dashboard" | "transactions";
}

export default function PageLayout({ children, activePage }: PageLayoutProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [minimized, setMinimized] = useState(false);

  const toggleSidebar = () => {
    setMinimized(!minimized);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activePage={activePage} // Optional: pass active page dynamically if you want
        userName={user?.username || "Username"}
        userEmail={user?.email}
        minimized={minimized}
        onToggle={toggleSidebar}
      />
      <main className="flex-1 overflow-auto transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
