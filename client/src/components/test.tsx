"use client";

import { useEffect } from "react";

export const Test = () => {
  useEffect(() => {
    console.log("Client side home runs");
  }, []);

  return <div>Test</div>;
};
