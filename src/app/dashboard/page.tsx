// src/app/dashboard/page.tsx

"use client";

import { useEffect, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

// Lazy load the heavy UserForm component
const UserForm = lazy(() => import("@/components/user-form").then(mod => ({ 
  default: mod.UserForm 
})));

// Loading fallback for the form
const FormSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

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
        <Suspense fallback={<FormSkeleton />}>
          <UserForm />
        </Suspense>
      </div>
    </div>
  );
}
