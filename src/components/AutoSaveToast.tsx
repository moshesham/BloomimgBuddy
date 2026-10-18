import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface AutoSaveToastProps {
  visible: boolean;
  onDismiss: () => void;
  onOpenDialog: () => void;
  timeString: string;
}

export const AutoSaveToast: React.FC<AutoSaveToastProps> = ({
  visible,
  onDismiss,
  onOpenDialog,
  timeString,
}) => {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border border-[#A8CEB3] text-[#1F2E23] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 animate-fade-in max-w-sm"
    >
      <div className="w-7 h-7 rounded-full bg-[#E2EBE4] text-[#3F784C] flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4 h-4" />
      </div>

      <div className="text-xs space-y-0.5 pr-1">
        <div className="font-semibold text-[#2D5A37] flex items-center gap-1.5">
          <span>Session Auto-Saved</span>
          <span className="text-[10px] text-[#5E7564] font-normal">({timeString})</span>
        </div>
        <p className="text-[#465A4B] text-[11px] leading-tight">
          Your progress &amp; discoveries are safely stored.
        </p>
      </div>

      <button
        onClick={onOpenDialog}
        className="px-2 py-1 text-[11px] font-semibold text-[#3F784C] hover:text-[#2D5A37] hover:bg-[#EAEFEA] rounded-md transition-colors whitespace-nowrap"
      >
        View
      </button>

      <button
        onClick={onDismiss}
        className="p-1 text-[#839789] hover:text-[#1F2E23] rounded-md transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
