import React from 'react';
import { SensoryPreferences, GradeLevel } from '../types';
import { calmSound } from '../utils/soundEngine';
import { speechReader } from '../utils/speechReader';
import { Volume2, VolumeX, Eye, Sparkles, BookOpen, Sliders, Type } from 'lucide-react';

interface SensoryBarProps {
  preferences: SensoryPreferences;
  onUpdatePreferences: (prefs: Partial<SensoryPreferences>) => void;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  autoAdaptive: boolean;
  onToggleAutoAdaptive: () => void;
}

export const SensoryBar: React.FC<SensoryBarProps> = ({
  preferences,
  onUpdatePreferences,
  selectedGrade,
  onSelectGrade,
  autoAdaptive,
  onToggleAutoAdaptive,
}) => {
  const handleTestSpeech = () => {
    calmSound.playSoftTap();
    speechReader.speak(
      'Welcome to BloomLab. You are doing wonderful work exploring the world at your own natural pace.',
      preferences.speechRate
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-[#1F2E23]">
          Sensory &amp; Accessibility Preferences
        </h2>
        <p className="text-sm text-[#465A4B]">
          Tailor BloomLab to your exact sensory profile. There are no sudden noises, flashing alerts, or stress triggers.
        </p>
      </div>

      {/* 1. Grade Band & Adaptive Pacing */}
      <div className="bg-[#FAF8F5] border border-[#CCD8CF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3F784C]" />
          <h3 className="text-base font-bold text-[#1F2E23]">
            Curriculum Grade Band (Grades 1 to 5)
          </h3>
        </div>

        <p className="text-xs text-[#5E7564]">
          Select the active elementary tier. You can change grades at any moment without losing your discovered specimens.
        </p>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {([1, 2, 3, 4, 5] as GradeLevel[]).map((grade) => (
            <button
              key={grade}
              onClick={() => {
                calmSound.playSoftTap();
                onSelectGrade(grade);
              }}
              className={`py-3 px-2 rounded-xl border text-sm font-bold font-mono transition-all flex flex-col items-center justify-center ${
                selectedGrade === grade
                  ? 'bg-[#3F784C] border-[#34653F] text-white shadow-xs'
                  : 'bg-white border-[#CCD8CF] text-[#1F2E23] hover:bg-[#EAEFEA]'
              }`}
            >
              <span>Grade {grade}</span>
              <span className="text-[10px] font-normal opacity-85 mt-0.5">
                {grade === 1 && 'Counting & Nature'}
                {grade === 2 && 'Arrays & Circuits'}
                {grade === 3 && 'Fractions & Optics'}
                {grade === 4 && 'Equations & Space'}
                {grade === 5 && 'Volumes & Physics'}
              </span>
            </button>
          ))}
        </div>

        {/* Auto-Adaptive toggle */}
        <div className="pt-2 flex items-center justify-between border-t border-[#E3E8E4]">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[#1F2E23] block">
              Auto-Adaptive Comfort Pacing
            </span>
            <span className="text-[11px] text-[#5E7564] block">
              Automatically recommends step-by-step scaffolding if you pause, without negative marks.
            </span>
          </div>
          <button
            onClick={() => {
              calmSound.playSoftTap();
              onToggleAutoAdaptive();
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              autoAdaptive
                ? 'bg-[#3F784C] text-white border-[#34653F]'
                : 'bg-white text-[#465A4B] border-[#CCD8CF]'
            }`}
          >
            {autoAdaptive ? 'Enabled' : 'Manual'}
          </button>
        </div>
      </div>

      {/* 2. Visual Comfort & Reading Guides */}
      <div className="bg-[#FAF8F5] border border-[#CCD8CF] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#3F784C]" />
          <h3 className="text-base font-bold text-[#1F2E23]">
            Visual Comfort &amp; Reading Guides
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dyslexia-friendly font toggle */}
          <div className="p-4 bg-white rounded-xl border border-[#CCD8CF] flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-semibold text-[#1F2E23] block">Dyslexia-Friendly Spacing</span>
              <span className="text-[11px] text-[#5E7564] block">
                Expands letter spacing and open line-height to reduce visual crowding.
              </span>
            </div>
            <button
              onClick={() => {
                calmSound.playSoftTap();
                onUpdatePreferences({ dyslexiaFont: !preferences.dyslexiaFont });
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors shrink-0 ${
                preferences.dyslexiaFont
                  ? 'bg-[#3F784C] text-white border-[#34653F]'
                  : 'bg-[#FAF8F5] text-[#465A4B] border-[#CCD8CF]'
              }`}
            >
              {preferences.dyslexiaFont ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Line Spotlight reading guide */}
          <div className="p-4 bg-white rounded-xl border border-[#CCD8CF] flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-semibold text-[#1F2E23] block">Line Reader Spotlight</span>
              <span className="text-[11px] text-[#5E7564] block">
                Highlights the current line under your cursor while softly dimming the rest.
              </span>
            </div>
            <button
              onClick={() => {
                calmSound.playSoftTap();
                onUpdatePreferences({ lineSpotlight: !preferences.lineSpotlight });
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors shrink-0 ${
                preferences.lineSpotlight
                  ? 'bg-[#3F784C] text-white border-[#34653F]'
                  : 'bg-[#FAF8F5] text-[#465A4B] border-[#CCD8CF]'
              }`}
            >
              {preferences.lineSpotlight ? 'Active' : 'Off'}
            </button>
          </div>
        </div>

        {/* Text Size Scale */}
        <div className="p-4 bg-white rounded-xl border border-[#CCD8CF] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#5E7564]" />
            <span className="text-xs font-semibold text-[#1F2E23]">Interface Text Scale:</span>
          </div>
          <div className="flex gap-2">
            {(['normal', 'large', 'extra-large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => {
                  calmSound.playSoftTap();
                  onUpdatePreferences({ textSize: size });
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border capitalize transition-colors ${
                  preferences.textSize === size
                    ? 'bg-[#3F784C] text-white border-[#34653F]'
                    : 'bg-[#FAF8F5] text-[#465A4B] border-[#CCD8CF]'
                }`}
              >
                {size.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Audio & Procedural Soundscapes */}
      <div className="bg-[#FAF8F5] border border-[#CCD8CF] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#3F784C]" />
          <h3 className="text-base font-bold text-[#1F2E23]">
            Acoustic &amp; Audio Environment
          </h3>
        </div>

        {/* Soundscape Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#465A4B] block">
            Continuous Soothing Background Ambience (Web Audio Procedural):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'none', label: 'None (Silent)' },
              { id: 'gentle_rain', label: 'Gentle Rain' },
              { id: 'forest_breeze', label: 'Forest Breeze' },
              { id: 'singing_bowl', label: 'Singing Bowl' },
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => {
                  calmSound.playSoftTap();
                  const target = snd.id as SensoryPreferences['ambientSoundscape'];
                  onUpdatePreferences({ ambientSoundscape: target });
                  calmSound.setAmbientSoundscape(target);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  preferences.ambientSoundscape === snd.id
                    ? 'bg-[#3F784C] text-white border-[#34653F] shadow-xs'
                    : 'bg-white text-[#465A4B] border-[#CCD8CF] hover:bg-[#EAEFEA]'
                }`}
              >
                {snd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Master Sound Volume */}
          <div className="p-4 bg-white rounded-xl border border-[#CCD8CF] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#1F2E23]">Audio Volume:</span>
              <span className="font-mono text-[#3F784C]">
                {Math.round(preferences.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={preferences.volume}
              onChange={(e) => {
                const vol = Number(e.target.value);
                onUpdatePreferences({ volume: vol });
                calmSound.setVolume(vol);
              }}
              className="w-full accent-[#3F784C] cursor-pointer"
            />
          </div>

          {/* Text-To-Speech Speech Rate */}
          <div className="p-4 bg-white rounded-xl border border-[#CCD8CF] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#1F2E23]">Read-Aloud Voice Speed:</span>
              <span className="font-mono text-[#3F784C]">
                {preferences.speechRate}x
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.2"
              step="0.05"
              value={preferences.speechRate}
              onChange={(e) => {
                onUpdatePreferences({ speechRate: Number(e.target.value) });
              }}
              className="w-full accent-[#3F784C] cursor-pointer"
            />
            <div className="flex justify-end pt-1">
              <button
                onClick={handleTestSpeech}
                className="text-xs font-semibold text-[#3F784C] hover:text-[#2D5A37]"
              >
                Test Voice Sample
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
