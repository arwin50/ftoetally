import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#4A102A] border-dashed rounded-full animate-spin">
          <Image
            src={"/assets/tally-logo.png"}
            alt="Tally Logo"
            fill
            className="object-contain"
          />
        </div>
        <p className="mt-4 text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}   
