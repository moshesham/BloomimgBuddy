import React, { useState, useEffect } from 'react';
import { ScienceDomain } from '../types';
import { calmSound } from '../utils/soundEngine';
import { speechReader } from '../utils/speechReader';
import { Sparkles, Lightbulb, Volume2, CheckCircle2, ChevronRight, Clock, X } from 'lucide-react';

interface NudgeContent {
  observationPrompt: string;
  scientificClue: string;
  autoTuneLabel: string;
}

const NUDGE_CONTENT: Record<ScienceDomain, NudgeContent> = {
  botany: {
    observationPrompt: 'Notice how the seedling thrives when water and sunlight are in gentle harmony? If it has too little water, the stem stays modest.',
    scientificClue: 'Try adjusting Water Intake to around 55% and Sunlight to 7 hours, then select the "Bloom" stage to see the golden flower unfold!',
    autoTuneLabel: 'Nurture with Ideal Water & Sunlight',
  },
  optics: {
    observationPrompt: 'Notice where the quartz crystal is resting in the upper-right cavern? The laser beam bounces off the mirror at the exact same angle it entered.',
    scientificClue: 'According to the Law of Reflection, tilting the mirror close to 45° directs the beam right into the quartz crystal to disperse the rainbow spectrum!',
    autoTuneLabel: 'Align Mirror Angle to 45°',
  },
  ecology: {
    observationPrompt: 'The pond water sparkles clearest when there are enough green reeds to filter the stream and shelter the swimming minnows.',
    scientificClue: 'Try keeping 6 to 8 bundles of reeds and 3 to 5 swimming minnows to achieve a thriving biological equilibrium!',
    autoTuneLabel: 'Balance Wetland Reeds & Minnows',
  },
  circuits: {
    observationPrompt: 'Electricity can only travel when the circuit makes an unbroken loop from one side of the battery all the way back to the other.',
    scientificClue: 'Make sure the knife switch is set to "CLOSED" and you have at least 2 battery cells (12V) connected to light up the warm vintage filament!',
    autoTuneLabel: 'Close Loop with 2 Battery Cells',
  },
  astronomy: {
    observationPrompt: 'If a probe travels too fast, it flies away from the planet. If it travels too slow, gravity pulls it closer.',
    scientificClue: 'Try setting the Orbit Radius around 85 km with a cruising velocity of 1.2x to lock into a serene, stable elliptical orbit!',
    autoTuneLabel: 'Set Harmonious 85 km Orbit',
  },
};

interface AdaptiveLabNudgeProps {
  domain: ScienceDomain;
  isGoalAchieved: boolean;
  elapsedSeconds: number;
  onApplyAssistance: () => void;
  onSnooze: () => void;
  speechRate?: number;
}

export const AdaptiveLabNudge: React.FC<AdaptiveLabNudgeProps> = ({
  domain,
  isGoalAchieved,
  elapsedSeconds,
  onApplyAssistance,
  onSnooze,
  speechRate = 0.9,
}) => {
  const [clueExpanded, setClueExpanded] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const content = NUDGE_CONTENT[domain];

  // Reset expanded clue state when domain changes
  useEffect(() => {
    setClueExpanded(false);
    setIsSpeaking(false);
  }, [domain]);

  const handleReadAloud = (text: string) => {
    if (isSpeaking) {
      speechReader.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speechReader.speak(text, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  // If goal is achieved, show celebratory harmony card
  if (isGoalAchieved) {
    return (
      <div className="p-4 bg-[#EBF3ED] border border-[#A8CEB3] rounded-xl text-xs text-[#1F2E23] flex items-center justify-between gap-4 animate-fade-in shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#3F784C] text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#2D5A37] block">
              Discovery Milestone Achieved!
            </span>
            <span className="text-[#394D3F]">
              {domain === 'botany' && 'Golden blossom blooming with balanced osmosis & sunlight!'}
              {domain === 'optics' && 'Rainbow spectrum dispersion active through the quartz crystal!'}
              {domain === 'ecology' && 'Wetland biodiversity thriving in perfect natural balance!'}
              {domain === 'circuits' && 'Closed loop completed; vintage amber filament is glowing!'}
              {domain === 'astronomy' && 'Stable Keplerian gravitational orbit maintained!'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Only show nudge if student has explored for at least 15 seconds without hitting milestone
  if (elapsedSeconds < 15) {
    return null;
  }

  const showDeeperClue = elapsedSeconds >= 35 || clueExpanded;

  return (
    <div className="p-4 sm:p-5 bg-[#FAF4ED] border border-[#E0D2C1] rounded-xl text-xs text-[#1F2E23] space-y-3 shadow-xs animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#73511F]">
          <span className="w-6 h-6 rounded-md bg-[#F2E5D5] flex items-center justify-center text-[#73511F]">
            <Lightbulb className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold text-xs uppercase tracking-wide">
            Field Note &amp; Gentle Nudge
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Read aloud */}
          <button
            onClick={() =>
              handleReadAloud(
                showDeeperClue
                  ? `${content.observationPrompt} Here is a scientific clue: ${content.scientificClue}`
                  : content.observationPrompt
              )
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
              isSpeaking
                ? 'bg-[#73511F] text-white border-[#73511F]'
                : 'bg-white text-[#73511F] border-[#E0D2C1] hover:bg-[#F2E5D5]'
            }`}
            title="Read gentle nudge aloud"
          >
            <Volume2 className="w-3 h-3" />
            <span>{isSpeaking ? 'Pause' : 'Listen'}</span>
          </button>

          {/* Snooze / close */}
          <button
            onClick={() => {
              calmSound.playSoftTap();
              onSnooze();
            }}
            className="p-1 text-[#8C6D45] hover:text-[#5E4016] rounded-md transition-colors"
            title="I want to explore freely on my own"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Observation prompt */}
      <p className="text-[#5E4016] leading-relaxed">
        {content.observationPrompt}
      </p>

      {/* Progressive Deeper Clue */}
      {showDeeperClue ? (
        <div className="p-3 bg-white/80 rounded-lg border border-[#E0D2C1] text-[#4A3728] space-y-2">
          <div className="font-semibold text-[#73511F] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Helpful Clue:</span>
          </div>
          <p className="leading-relaxed">{content.scientificClue}</p>

          {/* Assistance button */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => {
                calmSound.playHarmonicChime(1);
                onApplyAssistance();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#73511F] hover:bg-[#5E4016] transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content.autoTuneLabel}</span>
            </button>

            <span className="text-[10px] text-[#8C6D45]">
              Takes care of tricky adjustments so you can observe the effect
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              calmSound.playSoftTap();
              setClueExpanded(true);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-[#73511F] hover:text-[#5E4016]"
          >
            <span>Would you like a direct scientific clue?</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] text-[#8C6D45]">
            Take all the time you need
          </span>
        </div>
      )}
    </div>
  );
};
