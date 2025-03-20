"use client";

import { Sidebar } from "@/components/sidebar";

export default function TeamEditorPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Team Editor</h1>
        </div>
        <div className="bg-muted/30 p-8 rounded-md text-center">
          <p className="text-lg">Team Editor functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
} 