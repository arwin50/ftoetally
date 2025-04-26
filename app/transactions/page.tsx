import { Trash2 } from "lucide-react";
import TransactionFilters from "@/components/transactions/transactionFilters";
import TransactionTable from "@/components/transactions/transactionTable";
import NewTransactionButton from "@/components/transactions/newTransactionButton";

export default function TransactionsPage() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <TransactionFilters />
        <div className="flex gap-2">
          <NewTransactionButton />
          <button className="p-2 bg-white border border-[#85193C] rounded-md hover:bg-[#ba7c91]">
            <Trash2 className="h-5 w-5 text-[#85193C]" />
          </button>
        </div>
      </div>
      <TransactionTable />
    </div>
  );
}
