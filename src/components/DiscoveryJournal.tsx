import React, { useState } from 'react';
import { JournalEntry, ScienceDomain } from '../types';
import { calmSound } from '../utils/soundEngine';
import { speechReader } from '../utils/speechReader';
import { Volume2, BookOpen, Sparkles, Lock, ArrowUpRight } from 'lucide-react';

interface DiscoveryJournalProps {
  entries: JournalEntry[];
  onLaunchExperiment: (domain: ScienceDomain) => void;
  speechRate: number;
}

export const DiscoveryJournal: React.FC<DiscoveryJournalProps> = ({
  entries,
  onLaunchExperiment,
  speechRate,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [readingId, setReadingId] = useState<string | null>(null);

  const filteredEntries =
    selectedDomain === 'all'
      ? entries
      : entries.filter((e) => e.domain === selectedDomain);

  const handleReadEntry = (entry: JournalEntry) => {
    if (readingId === entry.id) {
      speechReader.stop();
      setReadingId(null);
      return;
    }
    const text = `${entry.title}. Math concept: ${entry.mathConcept}. Science fact: ${entry.scienceSummary}. Fun fact: ${entry.funFact}`;
    setReadingId(entry.id);
    speechReader.speak(text, speechRate, () => {
      setReadingId(null);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-[#1F2E23]">
          Naturalist &amp; Physical Field Journal
        </h2>
        <p className="text-sm text-[#465A4B]">
          Every math inquiry you solve documents a permanent specimen, physical law, or natural phenomenon in your field notebook.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] overflow-x-auto">
        {['all', 'botany', 'optics', 'ecology', 'circuits', 'astronomy'].map((filterKey) => (
          <button
            key={filterKey}
            onClick={() => {
              calmSound.playSoftTap();
              setSelectedDomain(filterKey);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize whitespace-nowrap shrink-0 ${
              selectedDomain === filterKey
                ? 'bg-white text-[#1F2E23] shadow-xs'
                : 'text-[#465A4B] hover:text-[#1F2E23]'
            }`}
          >
            {filterKey === 'all' ? 'All Curiosities' : filterKey}
          </button>
        ))}
      </div>

      {/* Grid of Journal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEntries.map((entry) => {
          const isReading = readingId === entry.id;
          return (
            <div
              key={entry.id}
              className={`p-6 rounded-2xl border transition-all ${
                entry.unlocked
                  ? 'bg-[#FAF8F5] border-[#CCD8CF] shadow-xs'
                  : 'bg-[#F4EFEA]/60 border-[#D5E2D8] opacity-65'
              }`}
            >
              {/* Unboxed metadata line */}
              <div className="flex items-center justify-between text-xs text-[#5E7564] mb-3">
                <div className="flex items-center gap-1.5 capitalize">
                  <span className="font-semibold text-[#3F784C]">{entry.domain}</span>
                  <span aria-hidden="true">·</span>
                  <span>{entry.discoveryDate}</span>
                </div>

                {entry.unlocked ? (
                  <button
                    onClick={() => handleReadEntry(entry)}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors ${
                      isReading
                        ? 'bg-[#3F784C] text-white border-[#3F784C]'
                        : 'bg-white text-[#465A4B] border-[#CCD8CF] hover:bg-[#EAEFEA]'
                    }`}
                    title="Read entry aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isReading ? 'Pause' : 'Listen'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-[#839789] text-[11px]">
                    <Lock className="w-3 h-3" />
                    <span>Locked Specimen</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#1F2E23] tracking-tight mb-2">
                {entry.title}
              </h3>

              {/* Math link */}
              <div className="text-xs text-[#3F784C] font-medium mb-3">
                Mastered: {entry.mathConcept}
              </div>

              {/* Content */}
              {entry.unlocked ? (
                <div className="space-y-3 text-xs text-[#394D3F]">
                  <p className="leading-relaxed">{entry.scienceSummary}</p>
                  <div className="p-3 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] text-[#2D5A37]">
                    <strong className="block text-[#1F2E23] mb-0.5 font-semibold">
                      Curiosity Fact:
                    </strong>
                    {entry.funFact}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        calmSound.playSoftTap();
                        onLaunchExperiment(entry.domain);
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-[#3F784C] hover:text-[#2D5A37]"
                    >
                      <span>Simulate in Science Lab</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-xs text-[#5E7564] italic">
                  Solve corresponding mathematics inquiries in the Math Bench to unlock this scientific observation.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
