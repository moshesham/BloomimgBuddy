import React, { useState } from 'react';
import { MathChallenge, GradeLevel, ScienceDomain } from '../types';
import { MATH_CHALLENGES } from '../data/challenges';
import { ManipulativeTray } from './ManipulativeTray';
import { calmSound } from '../utils/soundEngine';
import { speechReader } from '../utils/speechReader';
import { Volume2, HelpCircle, Check, ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';

interface MathBenchProps {
  selectedGrade: GradeLevel;
  activeDomain: ScienceDomain;
  setActiveDomain: (domain: ScienceDomain) => void;
  onChallengeSuccess: (challenge: MathChallenge) => void;
  onGoToLab: (domain: ScienceDomain) => void;
  speechRate: number;
}

export const MathBench: React.FC<MathBenchProps> = ({
  selectedGrade,
  activeDomain,
  setActiveDomain,
  onChallengeSuccess,
  onGoToLab,
  speechRate,
}) => {
  // Filter challenges for this grade and domain, or fallback to any in this grade
  const gradeChallenges = MATH_CHALLENGES.filter((c) => c.grade === selectedGrade);
  const domainChallenges = gradeChallenges.filter((c) => c.domain === activeDomain);
  const availableChallenges = domainChallenges.length > 0 ? domainChallenges : gradeChallenges;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const activeChallenge = availableChallenges[currentIndex % availableChallenges.length];

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showManipulatives, setShowManipulatives] = useState<boolean>(true);
  const [unlockedHints, setUnlockedHints] = useState<number>(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Switch challenge
  const handleSelectChallenge = (idx: number) => {
    calmSound.playSoftTap();
    setCurrentIndex(idx);
    setSelectedChoice(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setUnlockedHints(0);
  };

  // Switch domain
  const handleDomainFilter = (domain: ScienceDomain) => {
    calmSound.playSoftTap();
    setActiveDomain(domain);
    setCurrentIndex(0);
    setSelectedChoice(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setUnlockedHints(0);
  };

  // Text-To-Speech read aloud
  const handleReadAloud = () => {
    if (isSpeaking) {
      speechReader.stop();
      setIsSpeaking(false);
      return;
    }
    const fullText = `${activeChallenge.title}. ${activeChallenge.storyContext}. Question: ${activeChallenge.mathPrompt}`;
    setIsSpeaking(true);
    speechReader.speak(fullText, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  // Submit Answer
  const handleCheckAnswer = () => {
    if (selectedChoice === null) return;
    setIsAnswerSubmitted(true);
    if (selectedChoice === activeChallenge.problemData.target) {
      setIsCorrect(true);
      calmSound.playHarmonicChime(2);
      onChallengeSuccess(activeChallenge);
    } else {
      setIsCorrect(false);
      calmSound.playSoftTap();
      // Gently open Hint 1 so student has immediate scaffold
      if (unlockedHints === 0) {
        setUnlockedHints(1);
      }
    }
  };

  // Advance to next challenge
  const handleNextChallenge = () => {
    calmSound.playSoftTap();
    const nextIdx = (currentIndex + 1) % availableChallenges.length;
    setCurrentIndex(nextIdx);
    setSelectedChoice(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setUnlockedHints(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Domain Navigation Tabs (clean functional segmented control) */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] overflow-x-auto">
        {(['botany', 'optics', 'ecology', 'circuits', 'astronomy'] as ScienceDomain[]).map(
          (d) => (
            <button
              key={d}
              onClick={() => handleDomainFilter(d)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize whitespace-nowrap shrink-0 ${
                activeDomain === d
                  ? 'bg-white text-[#1F2E23] shadow-xs'
                  : 'text-[#465A4B] hover:text-[#1F2E23]'
              }`}
            >
              {d === 'botany' && 'Greenhouse Botany'}
              {d === 'optics' && 'Optics Cavern'}
              {d === 'ecology' && 'Wetland Ecology'}
              {d === 'circuits' && 'Kinetic Circuits'}
              {d === 'astronomy' && 'Orbitarium'}
            </button>
          )
        )}
      </div>

      {/* Main Math Card */}
      <div className="bg-[#FAF8F5] border border-[#CCD8CF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5E7564]">
          <div className="flex items-center gap-2">
            <span className="capitalize font-semibold text-[#3F784C]">{activeChallenge.domain}</span>
            <span aria-hidden="true">·</span>
            <span>Grade {activeChallenge.grade}</span>
            <span aria-hidden="true">·</span>
            <span>Inquiry Challenge {currentIndex + 1} of {availableChallenges.length}</span>
          </div>

          {/* Read Aloud Button */}
          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              isSpeaking
                ? 'bg-[#3F784C] text-white border-[#3F784C]'
                : 'bg-white text-[#1F2E23] border-[#CCD8CF] hover:bg-[#EAEFEA]'
            }`}
            title="Read story and problem aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? 'Pause Voice' : 'Listen Aloud'}</span>
          </button>
        </div>

        {/* Challenge Header & Context */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2E23] tracking-tight">
            {activeChallenge.title}
          </h2>
          <p className="text-sm sm:text-base text-[#394D3F] leading-relaxed">
            {activeChallenge.storyContext}
          </p>
        </div>

        {/* Focused Question Callout Box */}
        <div className="p-4 sm:p-5 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3F784C]">
            Inquiry Question:
          </span>
          <p className="text-base sm:text-lg font-semibold text-[#1F2E23]">
            {activeChallenge.mathPrompt}
          </p>
        </div>

        {/* Toggle Manipulatives Drawer */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              calmSound.playSoftTap();
              setShowManipulatives(!showManipulatives);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-[#3F784C] hover:text-[#2D5A37] transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>{showManipulatives ? 'Hide Visual Manipulatives' : 'Open Hands-On Manipulatives'}</span>
          </button>
        </div>

        {/* Manipulative Tray */}
        {showManipulatives && (
          <ManipulativeTray
            type={activeChallenge.visualType}
            initialCount={activeChallenge.problemData.initialManipulativesCount || 0}
            target={activeChallenge.problemData.target}
            operands={activeChallenge.problemData.operands}
            unitName={activeChallenge.problemData.unitName}
          />
        )}

        {/* Answer Selection (Large accessible touch buttons) */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-[#465A4B] block">
            Select your answer:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeChallenge.problemData.choices.map((choice) => {
              const isSelected = selectedChoice === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => {
                    calmSound.playSoftTap();
                    setSelectedChoice(choice);
                    setIsAnswerSubmitted(false);
                  }}
                  className={`min-h-[52px] px-4 py-3 rounded-xl border text-base font-mono font-semibold transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#3F784C] border-[#34653F] text-white shadow-sm ring-2 ring-[#3F784C]/20'
                      : 'bg-white border-[#CCD8CF] text-[#1F2E23] hover:bg-[#EAEFEA] hover:border-[#8EAA94]'
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls & Hint Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                calmSound.playSoftTap();
                setUnlockedHints(Math.min(unlockedHints + 1, activeChallenge.hintScaffold.length));
              }}
              disabled={unlockedHints >= activeChallenge.hintScaffold.length}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#465A4B] bg-white hover:bg-[#EAEFEA] border border-[#CCD8CF] rounded-lg transition-colors disabled:opacity-50"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#3F784C]" />
              <span>
                {unlockedHints === 0
                  ? 'Gentle Hint'
                  : `Hint (${unlockedHints}/${activeChallenge.hintScaffold.length})`}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCheckAnswer}
              disabled={selectedChoice === null || isCorrect}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#3F784C] hover:bg-[#34653F] disabled:opacity-40 rounded-lg transition-colors shadow-xs"
            >
              Confirm Observation
            </button>
          </div>
        </div>

        {/* Hint Accordion Cards */}
        {unlockedHints > 0 && (
          <div className="space-y-2 p-4 bg-[#F4EFEA] border border-[#E3E8E4] rounded-xl text-xs text-[#1F2E23] animate-fade-in">
            <div className="font-semibold text-[#3F784C] flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Field Guide Scaffold:</span>
            </div>
            {activeChallenge.hintScaffold.slice(0, unlockedHints).map((hint, idx) => (
              <div key={idx} className="p-2.5 bg-white/80 rounded-lg border border-[#CCD8CF]/60">
                <span className="font-semibold text-[#5E7564] mr-1">Step {idx + 1}:</span>
                {hint}
              </div>
            ))}
          </div>
        )}

        {/* Feedback Banner */}
        {isAnswerSubmitted && (
          <div
            className={`p-5 rounded-xl border transition-all ${
              isCorrect
                ? 'bg-[#EBF3ED] border-[#A8CEB3] text-[#1F2E23]'
                : 'bg-[#F8F4EE] border-[#DECEB6] text-[#1F2E23]'
            }`}
          >
            {isCorrect ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#2D5A37]">
                  <Check className="w-4 h-4 text-[#3F784C]" />
                  <span>Discovery Confirmed!</span>
                </div>
                <p className="text-xs sm:text-sm text-[#2D5A37]">
                  {activeChallenge.explanation}
                </p>

                {/* Science unlock reward info */}
                <div className="p-3 bg-white/80 rounded-lg border border-[#A8CEB3] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-[#3F784C]">Resource Unlocked: </span>
                    <span>+{activeChallenge.scienceReward.amount} {activeChallenge.scienceReward.resourceName}</span>
                    <p className="text-[#5E7564] mt-0.5">{activeChallenge.scienceReward.factText}</p>
                  </div>
                  <button
                    onClick={() => onGoToLab(activeChallenge.domain)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#3F784C] hover:bg-[#34653F] rounded-lg transition-colors shrink-0 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Science Experiment</span>
                  </button>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleNextChallenge}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#3F784C] hover:text-[#2D5A37]"
                  >
                    <span>Next Inquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#73511F]">
                  That is a thoughtful estimate!
                </div>
                <p className="text-xs text-[#5E4016]">
                  Let us use the visual manipulatives above to count together step-by-step. There are no penalties or time limits.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Available Challenges for Grade Carousel */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-[#5E7564] uppercase tracking-wider">
          More Grade {selectedGrade} Inquiries in {activeDomain}:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {availableChallenges.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                currentIndex === idx
                  ? 'bg-[#EAEFEA] border-[#3F784C] shadow-xs'
                  : 'bg-white border-[#CCD8CF] hover:border-[#8EAA94]'
              }`}
            >
              <span className="text-[11px] font-semibold text-[#3F784C] block uppercase tracking-wide">
                Inquiry {idx + 1}
              </span>
              <span className="text-xs font-bold text-[#1F2E23] line-clamp-1">
                {ch.title}
              </span>
              <span className="text-[11px] text-[#5E7564] block mt-1 line-clamp-1">
                {ch.mathPrompt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
