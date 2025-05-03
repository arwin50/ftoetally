"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogIn, PenSquare } from "lucide-react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#85193C] p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8 sm:space-y-12 text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-2 sm:mb-4">
            Welcome to
          </h2>
          <div className="flex items-center">
            <div className="mr-2 sm:mr-4 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 relative">
              <Image
                src="/assets/tally-logo.png"
                alt="Tally Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white">
              Tally
            </h1>
          </div>
        </div>

        <div className="flex flex-col w-full sm:w-4/5 md:w-3/4 mx-auto space-y-3 sm:space-y-4 px-4 sm:px-0">
          <Link
            href="/login"
            className="flex items-center justify-center space-x-2 bg-[#4E112C] hover:bg-[#4A102A] text-yellow-300 py-2 sm:py-3 px-3 sm:px-4 rounded-md transition-colors"
          >
            <LogIn size={24} />
            <span className="text-lg sm:text-xl font-medium">Log In</span>
          </Link>

          <Link
            href="/register"
            className="flex items-center justify-center space-x-2 bg-[#4A102A] hover:bg-[#340A1D] text-yellow-300 py-2 sm:py-3 px-3 sm:px-4 rounded-md transition-colors"
          >
            <PenSquare size={24} />
            <span className="text-lg sm:text-xl font-medium">Register</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
