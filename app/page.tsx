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
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#85193C] p-4">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-medium text-white mb-4">Welcome to</h2>
          <div className="flex items-center">
            <div className="mr-4 h-24 w-24 relative">
              <Image
                src="/assets/tally-logo.png"
                alt="Tally Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-8xl font-bold text-white">Tally</h1>
          </div>
        </div>

        <div className="flex flex-col w-[60%] mx-20 space-y-4">
          <Link
            href="/login"
            className="flex items-center justify-center space-x-2 bg-[#4E112C] hover:bg-[#4A102A] text-yellow-300 py-3 px-4 rounded-md transition-colors"
          >
            <LogIn size={30} />
            <span className="text-xl font-medium">Sign In</span>
          </Link>

          <Link
            href="/register"
            className="flex items-center justify-center space-x-2 bg-[#4A102A] hover:bg-[#340A1D] text-yellow-300 py-3 px-4 rounded-md transition-colors"
          >
            <PenSquare size={30} />
            <span className="text-xl font-medium">Register</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
