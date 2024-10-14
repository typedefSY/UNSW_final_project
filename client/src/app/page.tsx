"use client";

import React from "react";

import MainDashboard from "./dashboard/page";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Login from "./login/page";

export default function Home() {
  const user = useCurrentUser();

  if (!user) {
    return <Login />;
  }

  return <MainDashboard />;
}
