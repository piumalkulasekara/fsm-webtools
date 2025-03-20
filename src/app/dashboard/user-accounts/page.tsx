"use client";

import { Sidebar } from "@/components/sidebar";
import { UserForm } from "@/components/user-form";

export default function UserAccountsPage() {
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