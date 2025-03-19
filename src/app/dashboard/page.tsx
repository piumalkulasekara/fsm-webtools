// src/app/dashboard/page.tsx

"use client";

import { Sidebar } from "@/components/sidebar";
import { UserForm } from "@/components/user-form";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <UserForm />
      </div>
    </div>
  );
}
