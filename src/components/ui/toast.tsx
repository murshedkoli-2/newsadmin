"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Toast } from "@/hooks/use-toast";

export function ToastUI({ toast }: { toast: Toast }) {
  return (
    <div className="fixed top-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-2">
      <Alert variant={toast.variant}>
        <AlertTitle>{toast.title}</AlertTitle>
        {toast.description ? (
          <AlertDescription>{toast.description}</AlertDescription>
        ) : null}
      </Alert>
    </div>
  );
}
