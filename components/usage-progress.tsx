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

  const fetchCredits = React.useCallback(async () => {
    try {
      const res = await fetch("/api/user/credits");
      if (!res.ok) return;
      const data = await res.json();
      setAvailable(data.available);
      setUsed(data.used);
    } catch {
      // keep initial values on network failure
    }
  }, []);

  React.useEffect(() => {
    fetchCredits();

    // Re-fetch whenever a fight analysis deducts credits
    window.addEventListener("credits:updated", fetchCredits);
    return () => window.removeEventListener("credits:updated", fetchCredits);
  }, [fetchCredits]);

  const remaining = Math.max(0, available - used);

  return (
    <button
      type="button"
      onClick={proModal.onOpen}
      aria-label={`${remaining} credits remaining. Click to buy more.`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black bg-black transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 hover:bg-gray-900"
    >
      <Zap className="w-3.5 h-3.5 flex-shrink-0 text-white" />
      <span className="text-xs font-bold tabular-nums text-white">
        {remaining}
      </span>
      <span className="text-xs font-medium hidden sm:inline text-white">
        credits
      </span>
    </button>
  );
}
