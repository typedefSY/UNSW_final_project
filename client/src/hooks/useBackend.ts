"use client";

import { brainwavesAPI } from "@/backend";

export const useBackend = () => {
  return brainwavesAPI;
};

declare global {
  interface Window {
    useBackend: typeof useBackend;
  }
}

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  window.useBackend = useBackend;
}
