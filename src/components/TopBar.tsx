import React from 'react';
import { Sparkles, Heart, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  activeTab: 'hub' | 'math' | 'labs' | 'journal' | 'sensory';
  setActiveTab: (tab: 'hub' | 'math' | 'labs' | 'journal' | 'sensory') => void;
  onOpenSensoryPause: () => void;
  onOpenSaveDialog: () => void;
  selectedGrade: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSensoryPause,
  onOpenSaveDialog,
  selectedGrade,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E3E8E4] px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
        <button
          onClick={() => setActiveTab('hub')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-[#1F2E23] hover:text-[#3F784C] transition-colors whitespace-nowrap shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-[#E2EBE4] text-[#3F784C] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>BloomLab</span>
        </button>

        {/* Zone 2: Clean 4–5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#465A4B]">
          <button
            onClick={() => setActiveTab('hub')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1F2E23] ${
              activeTab === 'hub' ? 'text-[#1F2E23] font-semibold border-b-2 border-[#3F784C] pb-0.5' : ''
            }`}
          >
            Discovery Hub
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1F2E23] ${
              activeTab === 'math' ? 'text-[#1F2E23] font-semibold border-b-2 border-[#3F784C] pb-0.5' : ''
            }`}
          >
            Math Bench
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1F2E23] ${
              activeTab === 'labs' ? 'text-[#1F2E23] font-semibold border-b-2 border-[#3F784C] pb-0.5' : ''
            }`}
          >
            Science Labs
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1F2E23] ${
              activeTab === 'journal' ? 'text-[#1F2E23] font-semibold border-b-2 border-[#3F784C] pb-0.5' : ''
            }`}
          >
            Field Journal
          </button>
          <button
            onClick={() => setActiveTab('sensory')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1F2E23] ${
              activeTab === 'sensory' ? 'text-[#1F2E23] font-semibold border-b-2 border-[#3F784C] pb-0.5' : ''
            }`}
          >
            Sensory Tools
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action: Sensory Pause (calm down / breathing pebble) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center text-xs text-[#5E7564] font-medium mr-0.5">
            <span>Grade {selectedGrade}</span>
          </div>

          <button
            onClick={onOpenSaveDialog}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#3F784C] hover:text-[#2D5A37] hover:bg-[#EAEFEA] rounded-lg border border-transparent hover:border-[#CCD8CF] transition-colors"
            title="Auto-saved. Click to view preserved progress."
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Saved</span>
          </button>

          <button
            onClick={onOpenSensoryPause}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#1F2E23] bg-[#E2EBE4] hover:bg-[#D5E2D8] border border-[#CCD8CF] rounded-lg transition-colors whitespace-nowrap shadow-xs"
            title="Take a calm sensory breathing pause"
          >
            <Heart className="w-3.5 h-3.5 text-[#3F784C]" />
            <span>Sensory Pause</span>
          </button>
        </div>
      </div>
    </header>
  );
};
