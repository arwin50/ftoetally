"use client";

import type React from "react";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";

import { useEffect } from "react";
import {
  getCurrentUser,
  setLoading,
  refreshToken,
} from "@/lib/redux/slices/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

// Redux provider
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

// Auth initialization component
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have tokens in localStorage
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          dispatch(setLoading(false));
          return;
        }

        // Try to get user data with the stored token
        await dispatch(getCurrentUser()).unwrap();
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Auth initialization error:", error);
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}

// Combined providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </ReduxProvider>
  );
}
