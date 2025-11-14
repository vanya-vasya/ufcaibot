"use client";

import * as React from "react";
import { useProModal } from "@/hooks/use-pro-modal";

interface UsageProgressProps {
  initialUsedGenerations: number;
  initialAvailableGenerations: number;
}

export function UsageProgress({
  initialUsedGenerations,
  initialAvailableGenerations,
}: UsageProgressProps) {
  const [usedGenerations, setUsedGenerations] = React.useState<number>(
    initialUsedGenerations
  );
  const [availableGenerations, setAvailableGenerations] =
    React.useState<number>(initialAvailableGenerations);

  const proModal = useProModal();

  return (
    <div
      className="relative overflow-hidden px-3 py-2 cursor-pointer border-0 bg-white/5 backdrop-blur-sm rounded-xl transition-all duration-200 hover:bg-white/10"
      onClick={proModal.onOpen}
      title="Click to upgrade"
    >
      <div className="relative z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-black">
          <span className="font-medium">Credits:</span>
          <span className="font-bold">
            {usedGenerations}/{availableGenerations}
          </span>
        </div>
      </div>
    </div>
  );
}
