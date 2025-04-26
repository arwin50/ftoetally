import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
          <p className="mt-2 text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/login">Login</Link>

          <Link href="/register">Register</Link>
        </div>
      </div>
    </main>
  );
}
