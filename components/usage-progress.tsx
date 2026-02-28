"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

interface UsageProgressProps {
  initialUsedGenerations: number;
  initialAvailableGenerations: number;
}

export function UsageProgress({
  initialUsedGenerations,
  initialAvailableGenerations,
}: UsageProgressProps) {
  const proModal = useProModal();

  const [available, setAvailable] = React.useState(initialAvailableGenerations);
  const [used, setUsed] = React.useState(initialUsedGenerations);

  // Fetch fresh credits from server on mount to always reflect real DB value
  React.useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/user/credits");
        if (!res.ok) return;
        const data = await res.json();
        setAvailable(data.available);
        setUsed(data.used);
      } catch {
        // silently keep initial values on network failure
      }
    };
    fetchCredits();
  }, []);

  const remaining = Math.max(0, available - used);
  const isLow = remaining > 0 && remaining <= 10;
  const isEmpty = remaining === 0;

  return (
    <button
      type="button"
      onClick={proModal.onOpen}
      aria-label={`${remaining} credits remaining. Click to buy more.`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
      style={{
        borderColor: isEmpty ? "#ef4444" : isLow ? "#f59e0b" : "#d1fae5",
        backgroundColor: isEmpty ? "#fef2f2" : isLow ? "#fffbeb" : "#f0fdf4",
      }}
    >
      <Zap
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ color: isEmpty ? "#ef4444" : isLow ? "#f59e0b" : "#10b981" }}
      />
      <span
        className="text-xs font-bold tabular-nums"
        style={{ color: isEmpty ? "#ef4444" : isLow ? "#d97706" : "#065f46" }}
      >
        {remaining}
      </span>
      <span
        className="text-xs font-medium hidden sm:inline"
        style={{ color: isEmpty ? "#ef4444" : isLow ? "#d97706" : "#065f46" }}
      >
        credits
      </span>
    </button>
  );
}
