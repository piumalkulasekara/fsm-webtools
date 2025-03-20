// src/app/dashboard/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { UserForm } from "@/components/user-form";

export default function DashboardPage() {
  const router = useRouter();
  
  // Redirect to /dashboard/user-accounts
  useEffect(() => {
    // We don't redirect in development mode to make it easier to work on this page
    if (process.env.NODE_ENV !== "development") {
      router.push("/dashboard/user-accounts");
    }
  }, [router]);
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">User Account Creation</h1>
        </div>
        <UserForm />
      </div>
    </div>
  );
}
