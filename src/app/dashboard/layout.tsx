import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Dashboard | FSM Webtools",
  description: "FSM Webtools dashboard for managing users, places, and teams",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
} 