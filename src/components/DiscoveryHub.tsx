import React from 'react';
import { ScienceDomain, LearnerProgress, GradeLevel } from '../types';
import { calmSound } from '../utils/soundEngine';
import { Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface DiscoveryHubProps {
  progress: LearnerProgress;
  onSelectDomain: (domain: ScienceDomain) => void;
  onGoToMath: (domain: ScienceDomain) => void;
  onGoToLab: (domain: ScienceDomain) => void;
  onSelectGrade: (grade: GradeLevel) => void;
}

const DOMAIN_CARDS: {
  domain: ScienceDomain;
  title: string;
  tagline: string;
  mathSkill: string;
  scienceFocus: string;
  image: string;
}[] = [
  {
    domain: 'botany',
    title: 'The Botanical Greenhouse',
    tagline: 'Sprout seeds, balance water-sunlight ratios, and nurture blossoming flora.',
    mathSkill: 'Addition bonds, Arrays, & Nutrient fractions',
    scienceFocus: 'Vascular plant biology & photosynthesis',
    image: '/src/assets/images/botanical_greenhouse_lab_1791957486320.jpg',
  },
  {
    domain: 'optics',
    title: 'Crystal Optics Cavern',
    tagline: 'Align prism mirrors to refract beams of sunlight into radiant rainbow spectrums.',
    mathSkill: 'Protractor angles, Symmetry, & Index ratios',
    scienceFocus: 'Law of reflection & crystal refraction',
    image: '/src/assets/images/crystal_optics_cavern_1791957487104.jpg',
  },
  {
    domain: 'ecology',
    title: 'Wetland Sanctuary',
    tagline: 'Balance water filtration, plant reeds, and minnow food chains in harmony.',
    mathSkill: 'Subtraction, Equal parts, & Biomass weights',
    scienceFocus: 'Natural water filtration & ecosystems',
    image: '/src/assets/images/wetland_ecology_sanctuary_1791957488384.jpg',
  },
  {
    domain: 'circuits',
    title: 'Kinetic Circuit Workshop',
    tagline: 'Connect batteries in series and toggle switches to illuminate warm amber lanterns.',
    mathSkill: 'Sums to 50, Parallel resistance, & Multiplication',
    scienceFocus: 'Closed electric loops & energy flow',
    image: '/src/assets/images/crystal_optics_cavern_1791957487104.jpg',
  },
  {
    domain: 'astronomy',
    title: 'Planetary Orbitarium',
    tagline: 'Calculate orbital altitude and velocity to send a gentle lunar glider around planets.',
    mathSkill: 'Distance scaling, Velocity rates, & Proportions',
    scienceFocus: 'Gravity orbits & Keplerian harmony',
    image: '/src/assets/images/planetary_orbitarium_lab_1791957487122.jpg',
  },
];

export const DiscoveryHub: React.FC<DiscoveryHubProps> = ({
  progress,
  onSelectDomain,
  onGoToMath,
  onGoToLab,
  onSelectGrade,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="bg-[#FAF8F5] border border-[#CCD8CF] rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#3F784C] block">
              Sensory-Attuned STEM Discovery
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1F2E23]">
              Welcome to Your Discovery Laboratory
            </h1>
          </div>

          {/* Grade Selector Quick Strip */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8]">
            {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => {
                  calmSound.playSoftTap();
                  onSelectGrade(g);
                }}
                className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors ${
                  progress.selectedGrade === g
                    ? 'bg-white text-[#1F2E23] shadow-xs'
                    : 'text-[#465A4B] hover:text-[#1F2E23]'
                }`}
              >
                G{g}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#394D3F] max-w-2xl leading-relaxed">
          Mathematics is the language of nature. Solve calm, visual math inquiries at your own comfortable pace to unlock real-time physical science experiments in our 5 discovery chambers.
        </p>

        {/* Sensory Safety Promise */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#5E7564] pt-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#3F784C]" />
            <span>Zero penalty timers</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#3F784C]" />
            <span>Tactile visual manipulatives</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#3F784C]" />
            <span>AuDHD low-stimulus design</span>
          </div>
        </div>
      </div>

      {/* Laboratory Chambers Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1F2E23] tracking-tight">
            Active Science Chambers
          </h2>
          <span className="text-xs text-[#5E7564]">
            5 Hands-on Exploration Labs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAIN_CARDS.map((card) => (
            <div
              key={card.domain}
              className="bg-[#FAF8F5] border border-[#CCD8CF] rounded-2xl overflow-hidden shadow-xs hover:border-[#8EAA94] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Visual Image Header */}
                <div className="h-40 w-full overflow-hidden bg-[#E2EBE4] relative">
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E23]/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] font-semibold text-white tracking-wide">
                      {card.scienceFocus}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[#1F2E23] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#465A4B] leading-relaxed">
                    {card.tagline}
                  </p>

                  <div className="text-[11px] text-[#3F784C] font-medium pt-1">
                    Math Key: {card.mathSkill}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-[#E3E8E4] flex items-center justify-between gap-3 mt-3">
                <button
                  onClick={() => {
                    calmSound.playSoftTap();
                    onGoToLab(card.domain);
                  }}
                  className="text-xs font-medium text-[#465A4B] hover:text-[#1F2E23] transition-colors"
                >
                  Explore Lab
                </button>
                <button
                  onClick={() => {
                    calmSound.playSoftTap();
                    onGoToMath(card.domain);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#3F784C] hover:bg-[#34653F] rounded-lg transition-colors shadow-xs"
                >
                  <span>Solve Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
