"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import NewTransactionModal from "./newTransactionModal";

interface NewTransactionButtonProps {
  onCreated: () => void;
}

export default function NewTransactionButton({
  onCreated,
}: NewTransactionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex h-10 items-center gap-1 px-3 py-1.5 bg-[#85193C] border border-[#85193C] text-white rounded-lg hover:bg-[#ba7c91] transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>New Transaction</span>
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
