export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type ScienceDomain = 'botany' | 'optics' | 'ecology' | 'circuits' | 'astronomy';

export type VisualManipulativeType = 'counters' | 'fraction_bars' | 'grid_array' | 'balance_scale' | 'angle_dial';

export interface MathChallenge {
  id: string;
  grade: GradeLevel;
  domain: ScienceDomain;
  title: string;
  storyContext: string;
  mathPrompt: string;
  visualType: VisualManipulativeType;
  problemData: {
    target: number;
    operands: number[];
    unitName: string;
    choices: number[];
    initialManipulativesCount?: number;
  };
  explanation: string;
  hintScaffold: string[];
  scienceReward: {
    resourceName: string;
    amount: number;
    resourceType: 'seeds' | 'prisms' | 'water' | 'energy' | 'stardust';
    labParameterKey: string;
    factText: string;
    journalEntryId: string;
  };
}

export interface SensoryPreferences {
  dyslexiaFont: boolean;
  textSize: 'normal' | 'large' | 'extra-large';
  lineSpotlight: boolean;
  soundEnabled: boolean;
  volume: number; // 0 to 1
  ambientSoundscape: 'none' | 'gentle_rain' | 'forest_breeze' | 'singing_bowl';
  speechRate: number; // 0.8 to 1.2
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface JournalEntry {
  id: string;
  domain: ScienceDomain;
  title: string;
  discoveryDate: string;
  mathConcept: string;
  scienceSummary: string;
  funFact: string;
  iconType: string;
  unlocked: boolean;
}

export interface LearnerProgress {
  selectedGrade: GradeLevel;
  autoAdaptive: boolean;
  consecutiveSuccesses: number;
  completedChallengeIds: string[];
  inventory: {
    seeds: number;
    prisms: number;
    water: number;
    energy: number;
    stardust: number;
  };
  activeLabParams: {
    greenhouseWater: number;
    greenhouseSun: number;
    greenhouseStage: number; // 0 to 4
    opticsAngle: number;
    opticsTargetHit: boolean;
    wetlandAlgae: number;
    wetlandFish: number;
    wetlandEquilibrium: boolean;
    circuitVoltage: number;
    circuitBulbLit: boolean;
    orbitRadius: number;
    orbitSpeed: number;
  };
}
