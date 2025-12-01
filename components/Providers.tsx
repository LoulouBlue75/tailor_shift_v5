// Global Providers Wrapper - Tailor Shift V5

"use client";

import { ToastProvider } from "@/components/ui/Toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
