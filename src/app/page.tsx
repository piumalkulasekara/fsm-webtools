// src/app/page.tsx

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import LandingPage from "./landing-page";

export default async function Home() {
  const { userId } = await auth()

  // If a user is logged in, redirect them to the dashboard
  if (userId) {
    redirect("/dashboard");
  }

  // Otherwise, render the landing page
  return <LandingPage />;
}
