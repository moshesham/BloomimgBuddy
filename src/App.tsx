import React, { useState, useEffect } from 'react';
import { GradeLevel, ScienceDomain, SensoryPreferences, LearnerProgress, JournalEntry, MathChallenge } from './types';
import { INITIAL_JOURNAL_ENTRIES } from './data/challenges';
import { TopBar } from './components/TopBar';
import { LineSpotlight } from './components/LineSpotlight';
import { SensoryPauseModal } from './components/SensoryPauseModal';
import { DiscoveryHub } from './components/DiscoveryHub';
import { MathBench } from './components/MathBench';
import { ScienceLabView } from './components/ScienceLabView';
import { DiscoveryJournal } from './components/DiscoveryJournal';
import { SensoryBar } from './components/SensoryBar';
import { SessionSaveDialog } from './components/SessionSaveDialog';
import { AutoSaveToast } from './components/AutoSaveToast';
import { calmSound } from './utils/soundEngine';

const STORAGE_KEY_PROGRESS = 'bloomlab_learner_progress_v1';
const STORAGE_KEY_PREFS = 'bloomlab_sensory_prefs_v1';

const DEFAULT_PREFERENCES: SensoryPreferences = {
  dyslexiaFont: false,
  textSize: 'normal',
  lineSpotlight: false,
  soundEnabled: true,
  volume: 0.4,
  ambientSoundscape: 'none',
  speechRate: 0.9,
  reducedMotion: false,
  highContrast: false,
};

const DEFAULT_PROGRESS: LearnerProgress = {
  selectedGrade: 1,
  autoAdaptive: true,
  consecutiveSuccesses: 0,
  completedChallengeIds: [],
  inventory: {
    seeds: 4,
    prisms: 2,
    water: 5,
    energy: 8,
    stardust: 3,
  },
  activeLabParams: {
    greenhouseWater: 60,
    greenhouseSun: 7,
    greenhouseStage: 2,
    opticsAngle: 45,
    opticsTargetHit: true,
    wetlandAlgae: 4,
    wetlandFish: 3,
    wetlandEquilibrium: true,
    circuitVoltage: 12,
    circuitBulbLit: true,
    orbitRadius: 85,
    orbitSpeed: 1.2,
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'hub' | 'math' | 'labs' | 'journal' | 'sensory'>('hub');
  const [activeDomain, setActiveDomain] = useState<ScienceDomain>('botany');
  const [isSensoryPauseOpen, setIsSensoryPauseOpen] = useState<boolean>(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const [autoSaveToastVisible, setAutoSaveToastVisible] = useState<boolean>(false);

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [lastSavedTime, setLastSavedTime] = useState<string>(getFormattedTime());

  // Load Preferences from localStorage or fallback
  const [preferences, setPreferences] = useState<SensoryPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFS);
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Load Progress from localStorage or fallback
  const [progress, setProgress] = useState<LearnerProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? { ...DEFAULT_PROGRESS, ...JSON.parse(saved) } : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);

  // Persist Preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(preferences));
      setLastSavedTime(getFormattedTime());
    } catch {
      // Storage error safeguard
    }
  }, [preferences]);

  // Persist Progress & trigger subtle peace-of-mind confirmation
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
      const formatted = getFormattedTime();
      setLastSavedTime(formatted);
      // Softly notify the student that progress is safeguarded
      setAutoSaveToastVisible(true);
      const timer = setTimeout(() => {
        setAutoSaveToastVisible(false);
      }, 4500);
      return () => clearTimeout(timer);
    } catch {
      // Storage error safeguard
    }
  }, [progress]);

  // Periodic 3-minute study session peace-of-mind reminder
  useEffect(() => {
    const periodicInterval = setInterval(() => {
      setLastSavedTime(getFormattedTime());
      setAutoSaveToastVisible(true);
      setTimeout(() => {
        setAutoSaveToastVisible(false);
      }, 4000);
    }, 180000); // every 3 minutes

    return () => clearInterval(periodicInterval);
  }, []);

  const handleManualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(preferences));
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
      setLastSavedTime(getFormattedTime());
    } catch {
      // Storage error safeguard
    }
  };

  // Update sensory preferences
  const handleUpdatePreferences = (updated: Partial<SensoryPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  // Switch grade level
  const handleSelectGrade = (grade: GradeLevel) => {
    setProgress((prev) => ({ ...prev, selectedGrade: grade, consecutiveSuccesses: 0 }));
  };

  // Toggle auto-adaptive pacing
  const handleToggleAutoAdaptive = () => {
    setProgress((prev) => ({ ...prev, autoAdaptive: !prev.autoAdaptive }));
  };

  // Update sandbox parameters
  const handleUpdateLabParams = (params: Partial<LearnerProgress['activeLabParams']>) => {
    setProgress((prev) => ({
      ...prev,
      activeLabParams: { ...prev.activeLabParams, ...params },
    }));
  };

  // Handle successful completion of a math inquiry
  const handleChallengeSuccess = (challenge: MathChallenge) => {
    setProgress((prev) => {
      const newInventory = { ...prev.inventory };
      const resourceType = challenge.scienceReward.resourceType;
      newInventory[resourceType] = (newInventory[resourceType] || 0) + challenge.scienceReward.amount;

      const newParams = { ...prev.activeLabParams };
      if (challenge.domain === 'botany') {
        newParams.greenhouseStage = Math.min(4, newParams.greenhouseStage + 1);
      } else if (challenge.domain === 'optics') {
        newParams.opticsTargetHit = true;
      } else if (challenge.domain === 'circuits') {
        newParams.circuitBulbLit = true;
      } else if (challenge.domain === 'astronomy') {
        newParams.orbitSpeed = 1.4;
      }

      return {
        ...prev,
        inventory: newInventory,
        activeLabParams: newParams,
        consecutiveSuccesses: prev.consecutiveSuccesses + 1,
        completedChallengeIds: Array.from(new Set([...prev.completedChallengeIds, challenge.id])),
      };
    });

    // Unlock matching Journal Entry
    setJournalEntries((prev) =>
      prev.map((entry) =>
        entry.id === challenge.scienceReward.journalEntryId || entry.domain === challenge.domain
          ? { ...entry, unlocked: true }
          : entry
      )
    );
  };

  const handleGoToMath = (domain: ScienceDomain) => {
    setActiveDomain(domain);
    setActiveTab('math');
  };

  const handleGoToLab = (domain: ScienceDomain) => {
    setActiveDomain(domain);
    setActiveTab('labs');
  };

  // Text size classes
  const textSizeClass =
    preferences.textSize === 'large'
      ? 'text-lg'
      : preferences.textSize === 'extra-large'
      ? 'text-xl'
      : 'text-base';

  return (
    <div
      className={`min-h-screen bg-[#FAF8F5] text-[#1F2E23] transition-colors selection:bg-[#CCD8CF] ${
        preferences.dyslexiaFont ? 'dyslexia-font' : ''
      } ${textSizeClass}`}
    >
      {/* Line Reading Guide Spotlight */}
      <LineSpotlight enabled={preferences.lineSpotlight} />

      {/* Top Navigation Bar adhering to Top Bar contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSensoryPause={() => {
          calmSound.playSoftTap();
          setIsSensoryPauseOpen(true);
        }}
        onOpenSaveDialog={() => {
          calmSound.playSoftTap();
          setIsSaveDialogOpen(true);
        }}
        selectedGrade={progress.selectedGrade}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'hub' && (
          <DiscoveryHub
            progress={progress}
            onSelectDomain={setActiveDomain}
            onGoToMath={handleGoToMath}
            onGoToLab={handleGoToLab}
            onSelectGrade={handleSelectGrade}
          />
        )}

        {activeTab === 'math' && (
          <MathBench
            selectedGrade={progress.selectedGrade}
            activeDomain={activeDomain}
            setActiveDomain={setActiveDomain}
            onChallengeSuccess={handleChallengeSuccess}
            onGoToLab={handleGoToLab}
            speechRate={preferences.speechRate}
          />
        )}

        {activeTab === 'labs' && (
          <ScienceLabView
            activeDomain={activeDomain}
            setActiveDomain={setActiveDomain}
            progress={progress}
            onUpdateLabParams={handleUpdateLabParams}
            onGoToMath={handleGoToMath}
            speechRate={preferences.speechRate}
          />
        )}

        {activeTab === 'journal' && (
          <DiscoveryJournal
            entries={journalEntries}
            onLaunchExperiment={handleGoToLab}
            speechRate={preferences.speechRate}
          />
        )}

        {activeTab === 'sensory' && (
          <SensoryBar
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            selectedGrade={progress.selectedGrade}
            onSelectGrade={handleSelectGrade}
            autoAdaptive={progress.autoAdaptive}
            onToggleAutoAdaptive={handleToggleAutoAdaptive}
          />
        )}
      </main>

      {/* Sensory Pause & Breathing Room Modal */}
      <SensoryPauseModal
        isOpen={isSensoryPauseOpen}
        onClose={() => setIsSensoryPauseOpen(false)}
        ambientSound={preferences.ambientSoundscape}
        setAmbientSound={(snd) => handleUpdatePreferences({ ambientSoundscape: snd })}
      />

      {/* Session Save & Peace of Mind Confirmation Dialog */}
      <SessionSaveDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        progress={progress}
        journalEntries={journalEntries}
        lastSavedTime={lastSavedTime}
        onManualSave={handleManualSave}
        speechRate={preferences.speechRate}
      />

      {/* Gentle Auto-Save Floating Notification */}
      <AutoSaveToast
        visible={autoSaveToastVisible}
        onDismiss={() => setAutoSaveToastVisible(false)}
        onOpenDialog={() => {
          calmSound.playSoftTap();
          setAutoSaveToastVisible(false);
          setIsSaveDialogOpen(true);
        }}
        timeString={lastSavedTime}
      />

      {/* Quiet Footer */}
      <footer className="mt-16 border-t border-[#E3E8E4] py-8 text-center text-xs text-[#5E7564]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1F2E23]">BloomLab</span>
            <span aria-hidden="true">·</span>
            <span>Gentle Elementary Math &amp; Science</span>
          </div>
          <div className="flex items-center gap-4 text-[#5E7564]">
            <span>Low-Stimulus AuDHD Learning</span>
            <span aria-hidden="true">·</span>
            <span>WCAG AA Accessible</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
