"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#121217",
          color: "#fafafa",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
    />
  );
}
