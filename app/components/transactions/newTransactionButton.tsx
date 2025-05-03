"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import NewTransactionModal from "./newTransactionModal";
import { NewTransactionButtonProps } from "@/types";

export default function NewTransactionButton({
  onCreated,
}: NewTransactionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex h-10 items-center justify-center gap-1 px-2 sm:px-3 py-1.5 bg-[#85193C] border border-[#85193C] text-white rounded-lg hover:bg-[#6e142f] transition-colors cursor-pointer"
        aria-label="Add new transaction"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden xs:inline sm:inline  whitespace-nowrap">
          New Transaction
        </span>
        <span className="xs:hidden sm:hidden">New</span>
      </button>

      {isModalOpen && (
        <NewTransactionModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            onCreated();
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
