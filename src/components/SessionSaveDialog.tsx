import React, { useState } from 'react';
import { LearnerProgress, JournalEntry } from '../types';
import { calmSound } from '../utils/soundEngine';
import { speechReader } from '../utils/speechReader';
import { ShieldCheck, Check, Clock, Volume2, X, Sparkles, Heart } from 'lucide-react';

interface SessionSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  progress: LearnerProgress;
  journalEntries: JournalEntry[];
  lastSavedTime: string;
  onManualSave: () => void;
  speechRate?: number;
}

export const SessionSaveDialog: React.FC<SessionSaveDialogProps> = ({
  isOpen,
  onClose,
  progress,
  journalEntries,
  lastSavedTime,
  onManualSave,
  speechRate = 0.9,
}) => {
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  if (!isOpen) return null;

  const unlockedCount = journalEntries.filter((e) => e.unlocked).length;

  const handleManualSave = () => {
    calmSound.playHarmonicChime(0);
    onManualSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const reassuranceText =
    "Your learning session is completely safe. Everything you explore in BloomLab is automatically preserved on your computer. You can take a break, close the window, or return whenever you are ready. All your seeds, crystals, and field notes will be waiting right where you left them.";

  const handleReadAloud = () => {
    if (isSpeaking) {
      speechReader.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speechReader.speak(reassuranceText, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2E23]/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#FAF8F5] border border-[#CCD8CF] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E8E4]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#E2EBE4] text-[#3F784C] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#1F2E23]">
                Your Session is Safe &amp; Preserved
              </h2>
              <span className="text-[11px] text-[#5E7564]">
                Continuous Auto-Save Active · Device Storage
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E7564] hover:text-[#1F2E23] hover:bg-[#EAEFEA] transition-colors"
            aria-label="Close save dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Reassurance Callout Card */}
          <div className="p-4 bg-[#EBF3ED] border border-[#A8CEB3] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2D5A37] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#3F784C]" />
                Peace of Mind Guarantee
              </span>
              <button
                onClick={handleReadAloud}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                  isSpeaking
                    ? 'bg-[#3F784C] text-white border-[#3F784C]'
                    : 'bg-white text-[#2D5A37] border-[#A8CEB3] hover:bg-[#E2EBE4]'
                }`}
              >
                <Volume2 className="w-3 h-3" />
                <span>{isSpeaking ? 'Pause' : 'Listen'}</span>
              </button>
            </div>
            <p className="text-xs text-[#2D5A37] leading-relaxed">
              {reassuranceText}
            </p>
          </div>

          {/* Current Saved Portfolio Grid */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#465A4B] block">
              Currently Preserved in Your Field Journal:
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#CCD8CF] space-y-1">
                <span className="text-[11px] text-[#5E7564] block">Curriculum Tier</span>
                <span className="font-bold text-[#1F2E23] text-sm font-mono">
                  Grade {progress.selectedGrade}
                </span>
                <span className="text-[10px] text-[#3F784C] block">
                  {progress.completedChallengeIds.length} Inquiries Solved
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#CCD8CF] space-y-1">
                <span className="text-[11px] text-[#5E7564] block">Field Discoveries</span>
                <span className="font-bold text-[#1F2E23] text-sm font-mono">
                  {unlockedCount} / {journalEntries.length} Unlocked
                </span>
                <span className="text-[10px] text-[#3F784C] block">
                  Specimens &amp; Natural Laws
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#CCD8CF] space-y-1 col-span-2">
                <span className="text-[11px] text-[#5E7564] block">Collected Science Resources</span>
                <div className="flex flex-wrap gap-3 font-mono font-semibold text-xs text-[#1F2E23] pt-0.5">
                  <span>🌱 {progress.inventory.seeds} Seeds</span>
                  <span>💎 {progress.inventory.prisms} Prisms</span>
                  <span>💧 {progress.inventory.water} Drops</span>
                  <span>⚡ {progress.inventory.energy} Cells</span>
                  <span>✨ {progress.inventory.stardust} Stardust</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#5E7564]">
            <Clock className="w-3.5 h-3.5 text-[#3F784C]" />
            <span>Last auto-saved: </span>
            <span className="font-semibold text-[#1F2E23]">{lastSavedTime}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F4EFEA] border-t border-[#E3E8E4] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleManualSave}
            disabled={justSaved}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              justSaved
                ? 'bg-[#EBF3ED] text-[#2D5A37] border-[#A8CEB3]'
                : 'bg-white text-[#1F2E23] border-[#CCD8CF] hover:bg-[#EAEFEA]'
            }`}
          >
            {justSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3F784C]" />
                <span>Safely Preserved!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#3F784C]" />
                <span>Save Snapshot Now</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#3F784C] hover:bg-[#34653F] rounded-lg transition-colors shadow-xs"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};
