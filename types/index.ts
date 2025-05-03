import { ReactNode } from "react";

export interface PageLayoutProps {
  children: ReactNode;
  activePage?: "dashboard" | "transactions";
}

export interface SidebarProps {
  activePage?: "dashboard" | "transactions";
  userName?: string;
  userEmail?: string;
  minimized?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  mobileOpen?: boolean;
  setShowModal: (value: boolean) => void;
}

export interface Transaction {
  id: number;
  subject: string;
  date: string;
  amount: number;
  category: string;
  type: "Income" | "Expense";
}

export interface NewTransactionModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  defaultType?: "Income" | "Expense";
  allowedMonths?: string[];
}

export interface NewTransactionButtonProps {
  onCreated: () => void;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface TransactionFiltersProps {
  type: string;
  setType: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  month: string;
  setMonth: (value: string) => void;
  availableMonths: string[];
}

export interface TransactionTableProps {
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  refreshFlag: boolean;
  onTransactionUpdated: () => void;
  transactions: Transaction[];
}

export interface UpdateTransactionModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  transactionId: number;
}

export interface MonthlyBudget {
  amount: string;
  month: string;
}

export interface AddMonthlyBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  remainingBalance: number;
}
