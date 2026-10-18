# BloomLab: AuDHD-Friendly Elementary Math & Science Discovery

A calm, sensory-attuned educational platform for elementary learners (Grades 1–5) that connects mathematics mastery to interactive science discovery experiments using a soft biophilic design, adaptive pacing, and zero-sensory-overload accessibility tools.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following core product directions have been confirmed and incorporated from Phase 1 clarifications:

- **Confirmed Target Band**: Multi-grade adaptive tier covering Grades 1 through 5, with grade-matched math concepts and corresponding natural/physical science explorations.
- **Confirmed Visual Aesthetic**: Soft Biophilic Nature design with calming sage greens (`#5F7A61`, `#EBF0EC`), warm cream backgrounds (`#FAF8F5`, `#F4EFEA`), soft earth accents, and strict zero-pill/anti-slop visual discipline.
- **Confirmed Progression Engine**: "Science Discovery Lab" where solving bite-sized math challenges generates resources, tools, and observations to unlock and conduct 5 interactive hands-on lab experiments.
- **Sensory & Executive Function Safety**: No sudden timers, zero punitive fail states ("lives" or streak breaks), instant calm-down sensory breaks, and integrated text-to-speech audio guidance.

---

## 1. Overview & Core Concept

### What It Does
**BloomLab** transforms elementary mathematics practice from a stressful drill into a soothing, curiosity-driven laboratory expedition. Students choose their grade band (1 to 5) or let the adaptive engine dynamically match their comfort level. By solving visual math problems (e.g., number bonds, fractional seed divisions, balance-scale weights, or geometric angle alignments), learners collect botanical seeds, mineral prisms, solar charges, and water currents. These resources unlock interactive virtual experiments:
1. **The Botanical Greenhouse**: Sprouting and cross-pollinating flora using ratios and growth timers.
2. **The Crystal Optics Cavern**: Aligning prism angles and mirror reflections to illuminate cavern geodes.
3. **The Wetland Sanctuary**: Balancing ecosystem food chain biomass and water flow equations.
4. **The Kinetic Circuit Workshop**: Connecting battery cells and resistor lamps to power calm lanterns.
5. **The Planetary Orbitarium**: Calculating orbital radius and gravity thrust to launch gentle probe gliders.

### Target Audience & Persona
- **Primary Learners**: Elementary students (ages 6–11) with Autism and/or ADHD (AuDHD) who experience math anxiety, executive dysfunction, or sensory overstimulation from typical flashing, hyper-gamified edtech apps.
- **Secondary Stakeholders**: Parents, neurodivergent tutors, and elementary resource teachers seeking low-pressure, standards-aligned STEM practice tools with granular accessibility controls.

### Key Value
- **Dopamine without Overwhelm**: Replaces high-intensity flashing alerts, siren error buzzers, and ticking countdowns with intrinsic, rewarding visual physics, calming nature micro-animations, and tangible curiosity unlocks.
- **Cognitive Load Reduction**: Clean single-task views, visual manipulatives (counters, fraction bars, grid arrays), dyslexia-friendly typographic formatting, and optional focus spotlight overlays.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                          1. WELCOME & SENSORY CHECK                    │
│   Select Grade Tier (Grades 1-5) • Toggle Audio/TTS/Sensory Preset     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        2. THE DISCOVERY HUB                            │
│   Explore 5 Laboratory Domains • Select a Math Inquiry Challenge       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     3. CALM MATH LAB BENCH                             │
│   • Single-task interactive prompt with visual counters & manipulators │
│   • Dyslexia read-aloud (TTS) • Hint/Scaffold drawer (never penalized) │
│   • Instant "Sensory Pause / Breathe" pebble available at any moment   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Success / Mastery)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  4. HANDS-ON SCIENCE EXPERIMENT SANDBOX                │
│   Use math discoveries to trigger real-time physics & nature visualizer│
│   • Water flow, light reflection, crystal growth, or planetary orbit   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      5. BOTANICAL FIELD JOURNAL                        │
│   Curated catalog of unlocked specimens, physical laws & achievements  │
└────────────────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme (Soft Biophilic Nature)
- **Palette Discipline (60-30-10)**:
  - **60% Dominant Canvas**: Warm organic cream (`#FAF8F5`) and muted soft parchment (`#F3EFEA`).
  - **30% Structural Surfaces**: Gentle sage green panels (`#EBF0EC`), slate-tinted borders (`#D8DFD9`), and restful deep forest ink (`#1E2E23`).
  - **10% Semantic Accents**: Golden honey pollen (`#D9822B`), calm pond azure (`#3B82A6`), and botanical leaf emerald (`#3F784C`).
- **Typography & Hierarchy**:
  - *Display / Headings*: **Plus Jakarta Sans** (SemiBold 600, rounded geometry, approachable yet mature).
  - *Body Prose*: **DM Sans** (Regular 400, generous x-height, clear differentiation of `1`, `l`, and `I`).
  - *Data & Math*: **JetBrains Mono / Tabular Numerals** (`tabular-nums`) with clear mathematical operators.
  - *Dyslexia Mode*: Option to increase letter spacing (`tracking-wide`), line-height (`leading-relaxed`), and switch to open font geometry.
- **Accessibility & Sensory Controls Bar**:
  - **Sensory Cooldown / Focus Overlay**: Dims background ambient art; focuses exclusively on the active math item.
  - **Reading Guide (Line Spotlight)**: Shaded horizontal reading band that follows cursor/touch to minimize visual tracking fatigue.
  - **Soundscape Synthesizer (Web Audio API)**: Zero audio assets needed; synthesizes soft procedural forest rain, gentle wind, or melodic singing-bowl chimes on completion (with instant 1-click global mute).
  - **Speech Synthesis (TTS)**: Built-in voice playback for every question, instruction, and scientific fun fact.
  - **Zero-Pressure Pacing**: Timers can be completely turned off; if used, they render as a calm dissolving leaf or sand glass rather than an anxious digital countdown clock.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Science Experiment Sandbox vs. Passive Trophy Shelf
- **Chosen Approach**: Math problem completion generates physical parameters (e.g. angle degrees, volume liters, nutrient parts) that feed directly into 5 interactive real-time interactive canvas/SVG simulations.
- **Why**: AuDHD minds thrive on cause-and-effect agency and contextual meaning ("I am calculating fractions to balance the ecosystem's algae and fish levels") rather than arbitrary point counters or abstract XP badges.
- **Trade-off**: Requires dedicated interactive visual simulation models for each science domain, but delivers vastly superior engagement and learning retention.

### Decision 2: Zero-Penalty Adaptive Engine
- **Chosen Approach**: If a learner misses an answer, there are no red crosses, negative buzzers, or broken streaks. The app responds with gentle scaffolding: "Let's break this into smaller pieces" and opens an interactive physical counter / fraction block tray.
- **Why**: Rejection Sensitivity Dysphoria (RSD) is prevalent among AuDHD learners. Harsh fail sounds or lost lives trigger fight-or-flight shutdowns.
- **Alternatives Considered**: Three-strikes systems or timed speed drills (both rejected as hostile to sensory-sensitive learning).

### Decision 3: Procedural Sound via Web Audio API vs. External MP3s
- **Chosen Approach**: Native browser Web Audio API oscillator synthesis for peaceful melodic chimes (pentatonic scale harmonics) and soothing pink-noise rain soundscapes.
- **Why**: 100% reliable, zero network latency, no broken external asset URLs, and full parametric control over volume and frequency cutoffs.

### Decision 4: Tiered Multi-Grade Curriculum Model
- **Chosen Approach**: 5 distinct grade modules (Grade 1 through 5) with easy in-app grade switching, plus an "Auto-Adaptive" setting that adjusts problem complexity based on consecutive successes or hint requests.

---

## 4. Technical Architecture & Data Strategy

### System & Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 APP ROOT                                    │
│   • Accessibility Provider (Dyslexia font, High contrast, Motion, Volume)   │
│   • Audio Synthesis Engine (Procedural Ambient Soundscape & Melodic Chimes) │
│   • Student Progress & Learner Profile State (Grades 1-5, Journal, Badges)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│   ACCESSIBILITY DOCK   │  │    MAIN NAVIGATION     │  │ SENSORY PAUSE OVERLAY  │
│ • TTS Speech Trigger   │  │ • 1-row Top Bar        │  │ • 4-7-8 Breathing Gem  │
│ • Line Spotlight Guide │  │ • Grade Selector (1-5) │  │ • Kinetic Ripple Pond  │
│ • Soundscape Controller│  │ • Lab / Journal Views  │  │ • Calming Ambient Glow │
└────────────────────────┘  └───────────┬────────────┘  └────────────────────────┘
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│        MATH LAB WORKBENCH            │  │      SCIENCE DISCOVERY LABS          │
│ • Grade-Specific Problem Generator   │  │ 1. Greenhouse (Botany / Ratios)      │
│ • Interactive Manipulatives Tray     │  │ 2. Optics Cavern (Angles / Geometry) │
│   (Beads, Fraction Bars, Grid Units) │  │ 3. Wetland Pond (Ecology / Biomass)  │
│ • Gentle Hint & Step Breakdown       │  │ 4. Circuit Shop (Electricity / Sums) │
│ • Multi-Step Visual Progress         │  │ 5. Orbitarium (Gravity / Scaling)    │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FIELD JOURNAL & ARCHIVE                            │
│ • 15+ Discovered Flora, Fauna, Mineral Crystals, and Cosmic Curiosities     │
│ • Replayable Unlocked Experiments in Free Sandbox Mode                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Models & State Contracts

```typescript
// Core Learner & Curriculum Types
export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type ScienceDomain = 
  | 'botany'      // Greenhouse: Seed biology, plant vascular growth, ratios
  | 'optics'      // Light cavern: Angles, reflection, prisms, symmetry
  | 'ecology'     // Wetland sanctuary: Biomass, food webs, addition/fractions
  | 'circuits'    // Workshop: Volts, resistors, parallel/series sums
  | 'astronomy';  // Orbitarium: Distance, radius, planetary orbital speeds

export interface MathChallenge {
  id: string;
  grade: GradeLevel;
  domain: ScienceDomain;
  title: string;
  storyContext: string;
  mathPrompt: string;
  visualType: 'counters' | 'fraction_bars' | 'grid_array' | 'balance_scale' | 'angle_protractor';
  problemData: {
    target: number;
    operands: number[];
    unitName: string;
    choices?: number[];
  };
  explanation: string;
  hintScaffold: string[];
  scienceReward: {
    resourceName: string;
    amount: number;
    labParameterKey: string;
    factText: string;
  };
}

export interface SensoryPreferences {
  dyslexiaFont: boolean;
  textSize: 'normal' | 'large' | 'extra-large';
  lineSpotlight: boolean;
  soundEnabled: boolean;
  ambientSoundscape: 'none' | 'gentle_rain' | 'forest_breeze' | 'warm_creek';
  speechRate: number; // 0.8 to 1.2
  reducedMotion: boolean;
  highContrast: boolean;
}
```

### Verification & Testing Plan
- **Accessibility Verification**: Test keyboard navigation (`Tab`, `Space`, `Enter`), ensure all interactive touch targets exceed 44px, and verify contrast ratios meet WCAG AA on the soft biophilic palette.
- **Audio Reliability**: Verify Web Audio API gracefully handles user audio-context unlock without blocking app initialization.
- **Responsive Layout**: Test desktop (1440px wide baseline) down to tablet and mobile viewports with zero text truncation or broken cards.
- **Build & Compilation**: Run `compile_applet` and `lint_applet` to confirm zero TypeScript compilation errors.
