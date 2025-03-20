"use client";

import { Sidebar } from "@/components/sidebar";

export default function PlaceDetailsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Place Details Editor</h1>
        </div>
        <div className="bg-muted/30 p-8 rounded-md text-center">
          <p className="text-lg">Place Details Editor functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
} 