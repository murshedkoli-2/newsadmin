"use client";

import { useEffect, useState } from "react";

type Toast = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(props: Toast) {
    setToast(props);
  }

  return { toast, notify };
}

export { type Toast };
