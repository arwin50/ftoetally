"use client";
import { ConfirmationModalProps } from "@/types";

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-400/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-3 sm:mb-4">
          {title}
        </h2>
        <p className="text-center text-gray-700 text-sm sm:text-base mb-4 sm:mb-6">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 w-full sm:w-24 rounded bg-gray-200 hover:bg-gray-300 text-black text-sm sm:text-base cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 w-full sm:w-24 rounded bg-[#85193C] hover:bg-[#4A102A] text-white text-sm sm:text-base cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
