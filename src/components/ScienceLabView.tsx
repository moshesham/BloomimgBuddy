import React, { useState, useEffect, useRef } from 'react';
import { ScienceDomain, LearnerProgress } from '../types';
import { calmSound } from '../utils/soundEngine';
import { Sparkles, Sun, Droplets, Zap, Eye, Compass, RotateCcw, CheckCircle2 } from 'lucide-react';
import { AdaptiveLabNudge } from './AdaptiveLabNudge';

// Generated high-fidelity soft biophilic images
const LAB_IMAGES: Record<ScienceDomain, string> = {
  botany: '/src/assets/images/botanical_greenhouse_lab_1791957486320.jpg',
  optics: '/src/assets/images/crystal_optics_cavern_1791957487104.jpg',
  ecology: '/src/assets/images/wetland_ecology_sanctuary_1791957488384.jpg',
  astronomy: '/src/assets/images/planetary_orbitarium_lab_1791957487122.jpg',
  circuits: '/src/assets/images/crystal_optics_cavern_1791957487104.jpg', // fallback pairing
};

interface ScienceLabViewProps {
  activeDomain: ScienceDomain;
  setActiveDomain: (domain: ScienceDomain) => void;
  progress: LearnerProgress;
  onUpdateLabParams: (params: Partial<LearnerProgress['activeLabParams']>) => void;
  onGoToMath: (domain: ScienceDomain) => void;
  speechRate?: number;
}

export const ScienceLabView: React.FC<ScienceLabViewProps> = ({
  activeDomain,
  setActiveDomain,
  progress,
  onUpdateLabParams,
  onGoToMath,
  speechRate = 0.9,
}) => {
  // Canvas refs for dynamic visual simulations
  const plantCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const opticsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const orbitCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Local sandbox parameters
  const [waterAmount, setWaterAmount] = useState<number>(progress.activeLabParams.greenhouseWater || 50);
  const [sunHours, setSunHours] = useState<number>(progress.activeLabParams.greenhouseSun || 6);
  const [plantStage, setPlantStage] = useState<number>(progress.activeLabParams.greenhouseStage || 2);

  // Optics parameters
  const [mirrorAngle, setMirrorAngle] = useState<number>(progress.activeLabParams.opticsAngle || 45);
  const [dispersionMode, setDispersionMode] = useState<boolean>(true);

  // Wetland parameters
  const [wetlandReeds, setWetlandReeds] = useState<number>(6);
  const [wetlandFishCount, setWetlandFishCount] = useState<number>(4);

  // Circuit parameters
  const [batteryCells, setBatteryCells] = useState<number>(2);
  const [switchClosed, setSwitchClosed] = useState<boolean>(true);

  // Astronomy parameters
  const [orbitRadius, setOrbitRadius] = useState<number>(progress.activeLabParams.orbitRadius || 80);
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1.2);

  // Adaptive Hint & Discovery Tracking State
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSnoozed, setIsSnoozed] = useState<boolean>(false);
  const prevGoalRef = useRef<boolean>(false);

  // Goal achievement conditions per domain
  const isGoalAchieved = (() => {
    if (activeDomain === 'botany') {
      return plantStage >= 3 && waterAmount >= 40 && waterAmount <= 70 && sunHours >= 5 && sunHours <= 9;
    }
    if (activeDomain === 'optics') {
      return Math.abs(mirrorAngle - 45) <= 5 && dispersionMode;
    }
    if (activeDomain === 'ecology') {
      return wetlandReeds >= 5 && wetlandReeds <= 8 && wetlandFishCount >= 3 && wetlandFishCount <= 6;
    }
    if (activeDomain === 'circuits') {
      return switchClosed && batteryCells >= 2;
    }
    if (activeDomain === 'astronomy') {
      return orbitRadius >= 70 && orbitRadius <= 100 && orbitSpeed >= 1.0 && orbitSpeed <= 1.5;
    }
    return false;
  })();

  // Reset timer on domain change or when newly starting
  useEffect(() => {
    setElapsedSeconds(0);
    setIsSnoozed(false);
    prevGoalRef.current = false;
  }, [activeDomain]);

  // Interval timer for tracking student's time spent exploring without progress
  useEffect(() => {
    if (isGoalAchieved || isSnoozed) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGoalAchieved, isSnoozed]);

  // Celebrate discovery when goal is achieved for the first time
  useEffect(() => {
    if (isGoalAchieved && !prevGoalRef.current) {
      calmSound.playHarmonicChime(3);
      prevGoalRef.current = true;
    }
  }, [isGoalAchieved]);

  // Handler for adaptive auto-tune assistance
  const handleApplyAssistance = () => {
    if (activeDomain === 'botany') {
      setWaterAmount(55);
      setSunHours(7);
      setPlantStage(4);
      onUpdateLabParams({ greenhouseWater: 55, greenhouseSun: 7, greenhouseStage: 4 });
    } else if (activeDomain === 'optics') {
      setMirrorAngle(45);
      setDispersionMode(true);
      onUpdateLabParams({ opticsAngle: 45, opticsTargetHit: true });
    } else if (activeDomain === 'ecology') {
      setWetlandReeds(6);
      setWetlandFishCount(4);
    } else if (activeDomain === 'circuits') {
      setSwitchClosed(true);
      setBatteryCells(2);
      onUpdateLabParams({ circuitBulbLit: true });
    } else if (activeDomain === 'astronomy') {
      setOrbitRadius(85);
      setOrbitSpeed(1.2);
      onUpdateLabParams({ orbitRadius: 85, orbitSpeed: 1.2 });
    }
  };

  const handleSnooze = () => {
    setIsSnoozed(true);
    // Pause nudge for 45 seconds, then allow gentle hints again if still exploring
    setTimeout(() => {
      setIsSnoozed(false);
      setElapsedSeconds(0);
    }, 45000);
  };

  // 1. Interactive Plant Growth Canvas Rendering
  useEffect(() => {
    if (activeDomain !== 'botany') return;
    const canvas = plantCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Warm greenhouse background
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, '#F2F7F3');
    bg.addColorStop(1, '#E4EDE6');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Terracotta pot
    const potX = canvas.width / 2 - 45;
    const potY = canvas.height - 65;
    ctx.fillStyle = '#C87D55';
    ctx.beginPath();
    ctx.moveTo(potX, potY);
    ctx.lineTo(potX + 90, potY);
    ctx.lineTo(potX + 75, potY + 55);
    ctx.lineTo(potX + 15, potY + 55);
    ctx.closePath();
    ctx.fill();

    // Pot rim
    ctx.fillStyle = '#B46A44';
    ctx.fillRect(potX - 5, potY - 10, 100, 10);

    // Rich dark soil
    ctx.fillStyle = '#4A3728';
    ctx.fillRect(potX + 2, potY - 2, 86, 6);

    // Stem height scales with plantStage and water/sun balance
    const healthFactor = Math.min(1.2, (waterAmount / 50 + sunHours / 6) / 2);
    const stemHeight = (plantStage * 32 + 25) * healthFactor;

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, potY);
    ctx.quadraticCurveTo(
      canvas.width / 2 - 10,
      potY - stemHeight * 0.5,
      canvas.width / 2,
      potY - stemHeight
    );
    ctx.strokeStyle = '#3F784C';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Leaves
    const leafPairs = Math.min(plantStage + 1, 4);
    for (let i = 1; i <= leafPairs; i++) {
      const ly = potY - (stemHeight / (leafPairs + 1)) * i;
      // Left leaf
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2 - 25, ly - 5, 20, 8, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#5A9467';
      ctx.fill();
      ctx.strokeStyle = '#3F784C';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Right leaf
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2 + 25, ly - 5, 20, 8, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#5A9467';
      ctx.fill();
      ctx.strokeStyle = '#3F784C';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Flower blossom if stage >= 3 and healthy
    if (plantStage >= 3 && healthFactor > 0.6) {
      const flowerY = potY - stemHeight - 6;
      const petals = 6;
      for (let p = 0; p < petals; p++) {
        const ang = (p * 2 * Math.PI) / petals;
        const px = canvas.width / 2 + Math.cos(ang) * 16;
        const py = flowerY + Math.sin(ang) * 16;
        ctx.beginPath();
        ctx.arc(px, py, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#F4BF4F'; // Golden marigold petal
        ctx.fill();
        ctx.strokeStyle = '#DE9E2C';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      // Flower core
      ctx.beginPath();
      ctx.arc(canvas.width / 2, flowerY, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#8C5229';
      ctx.fill();
    }
  }, [activeDomain, waterAmount, sunHours, plantStage]);

  // 2. Interactive Optics Cavern Laser Simulation
  useEffect(() => {
    if (activeDomain !== 'optics') return;
    const canvas = opticsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Muted cavern dark backdrop
    ctx.fillStyle = '#1B2420';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cavern rock silhouettes
    ctx.fillStyle = '#28342D';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(80, 40);
    ctx.lineTo(140, 20);
    ctx.lineTo(240, 45);
    ctx.lineTo(canvas.width, 10);
    ctx.lineTo(canvas.width, 0);
    ctx.closePath();
    ctx.fill();

    // Laser Emitter at (30, canvas.height / 2)
    const emitterX = 30;
    const emitterY = canvas.height / 2;
    ctx.fillStyle = '#5F7A61';
    ctx.fillRect(emitterX - 15, emitterY - 12, 20, 24);

    // Mirror position at (canvas.width / 2 - 40, canvas.height / 2)
    const mirrorX = canvas.width / 2 - 40;
    const mirrorY = canvas.height / 2;

    // Quartz Crystal Target at (canvas.width - 70, 70)
    const crystalX = canvas.width - 70;
    const crystalY = 70;

    // Draw Quartz Crystal
    ctx.beginPath();
    ctx.moveTo(crystalX, crystalY - 30);
    ctx.lineTo(crystalX + 22, crystalY);
    ctx.lineTo(crystalX + 16, crystalY + 30);
    ctx.lineTo(crystalX - 16, crystalY + 30);
    ctx.lineTo(crystalX - 22, crystalY);
    ctx.closePath();
    ctx.fillStyle = '#D9E6E0';
    ctx.fill();
    ctx.strokeStyle = '#A4C3B5';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Rotating Mirror
    ctx.save();
    ctx.translate(mirrorX, mirrorY);
    ctx.rotate((mirrorAngle * Math.PI) / 180);
    ctx.fillStyle = '#B4D2C3';
    ctx.fillRect(-4, -30, 8, 60);
    ctx.restore();

    // Incoming Light Beam: Emitter -> Mirror
    ctx.beginPath();
    ctx.moveTo(emitterX, emitterY);
    ctx.lineTo(mirrorX, mirrorY);
    ctx.strokeStyle = '#F7DF94';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Calculate Bounced Ray Angle: Law of Reflection (2 * mirrorAngle)
    const reflectRad = (mirrorAngle * 2 * Math.PI) / 180;
    const bounceDist = 220;
    const endX = mirrorX + Math.cos(reflectRad) * bounceDist;
    const endY = mirrorY - Math.sin(reflectRad) * bounceDist;

    // Check if beam strikes crystal (approx within 35px)
    const hitsCrystal = Math.hypot(endX - crystalX, endY - crystalY) < 45;

    // Reflected Light Beam
    ctx.beginPath();
    ctx.moveTo(mirrorX, mirrorY);
    ctx.lineTo(hitsCrystal ? crystalX : endX, hitsCrystal ? crystalY : endY);
    ctx.strokeStyle = '#F7DF94';
    ctx.lineWidth = 3;
    ctx.stroke();

    // If hits crystal, show glorious rainbow spectrum dispersion!
    if (hitsCrystal && dispersionMode) {
      const colors = ['#E56B6F', '#EAAC8B', '#FFE66D', '#70C1B3', '#247BA0', '#B5838D'];
      colors.forEach((col, idx) => {
        const spreadAngle = -0.3 + idx * 0.12;
        ctx.beginPath();
        ctx.moveTo(crystalX, crystalY);
        ctx.lineTo(crystalX + 80, crystalY + Math.sin(spreadAngle) * 80);
        ctx.strokeStyle = col;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      });

      // Ambient geode glow
      ctx.beginPath();
      ctx.arc(crystalX, crystalY, 40, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(247, 223, 148, 0.25)';
      ctx.fill();
    }
  }, [activeDomain, mirrorAngle, dispersionMode]);

  // 3. Interactive Planetary Orbit Animation
  useEffect(() => {
    if (activeDomain !== 'astronomy') return;
    const canvas = orbitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep calm twilight background
      ctx.fillStyle = '#17221C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant stars
      ctx.fillStyle = '#A4C3B5';
      const starCoords = [
        [40, 30], [120, 60], [280, 40], [360, 90], [80, 160], [310, 180]
      ];
      starCoords.forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 2, 2);
      });

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Central peaceful planet (e.g. Sage Mars/Terra)
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#5A7F66';
      ctx.fill();
      ctx.strokeStyle = '#7FA88B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Atmospheric ring
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(127, 168, 139, 0.3)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Orbital Path Ellipse Guideline
      ctx.beginPath();
      ctx.ellipse(cx, cy, orbitRadius, orbitRadius * 0.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#385040';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellite position along ellipse
      const satX = cx + Math.cos(angle) * orbitRadius;
      const satY = cy + Math.sin(angle) * (orbitRadius * 0.7);

      // Glider probe body
      ctx.beginPath();
      ctx.arc(satX, satY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#F5D372';
      ctx.fill();

      // Solar wing panels
      ctx.fillStyle = '#8ABDA2';
      ctx.fillRect(satX - 12, satY - 2, 6, 4);
      ctx.fillRect(satX + 6, satY - 2, 6, 4);

      // Gentle orbital motion (Keplerian speed: faster when closer)
      angle += 0.015 * orbitSpeed;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeDomain, orbitRadius, orbitSpeed]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] overflow-x-auto">
        {(['botany', 'optics', 'ecology', 'circuits', 'astronomy'] as ScienceDomain[]).map(
          (d) => (
            <button
              key={d}
              onClick={() => {
                calmSound.playSoftTap();
                setActiveDomain(d);
              }}
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

      {/* Main Interactive Simulation Card */}
      <div className="bg-[#FAF8F5] border border-[#CCD8CF] rounded-2xl overflow-hidden shadow-xs">
        {/* Visual Hero Backdrop with Image and Fallback */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-[#E2EBE4]">
          <img
            src={LAB_IMAGES[activeDomain]}
            alt={`${activeDomain} Laboratory Discovery View`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E23]/80 via-[#1F2E23]/30 to-transparent flex items-end p-6">
            <div className="text-white space-y-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#B8DFCA]">
                Live Scientific Sandbox
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                {activeDomain === 'botany' && 'The Botanical Greenhouse'}
                {activeDomain === 'optics' && 'Crystal Optics Cavern'}
                {activeDomain === 'ecology' && 'Wetland Ecosystem Sanctuary'}
                {activeDomain === 'circuits' && 'Kinetic Electric Workshop'}
                {activeDomain === 'astronomy' && 'Planetary Orbitarium'}
              </h2>
            </div>
          </div>
        </div>

        {/* Interactive Experiment Bench (Two-Zone split: Stage + Control Deck) */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* 1. BOTANY GREENHOUSE */}
          {activeDomain === 'botany' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Visual Canvas (Zone 1) */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <canvas
                  ref={plantCanvasRef}
                  width={420}
                  height={280}
                  className="w-full max-w-[420px] h-[280px] rounded-xl border border-[#CCD8CF] shadow-inner"
                />
                <span className="text-[11px] text-[#5E7564] mt-2">
                  Real-time cellular sprout simulation powered by math ratios
                </span>
              </div>

              {/* Control Deck (Zone 2) */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-bold text-[#1F2E23]">Growth Parameters</h3>

                {/* Water slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-[#465A4B]">
                      <Droplets className="w-3.5 h-3.5 text-[#3F784C]" />
                      Rain Water Intake:
                    </span>
                    <span className="font-mono font-semibold text-[#1F2E23]">{waterAmount}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={waterAmount}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setWaterAmount(v);
                      onUpdateLabParams({ greenhouseWater: v });
                    }}
                    className="w-full accent-[#3F784C] cursor-pointer"
                  />
                </div>

                {/* Sunlight hours slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-[#465A4B]">
                      <Sun className="w-3.5 h-3.5 text-[#D9822B]" />
                      Sunlight Hours:
                    </span>
                    <span className="font-mono font-semibold text-[#1F2E23]">{sunHours} hrs/day</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={sunHours}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSunHours(v);
                      onUpdateLabParams({ greenhouseSun: v });
                    }}
                    className="w-full accent-[#D9822B] cursor-pointer"
                  />
                </div>

                {/* Sprout Stage Selector */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-[#465A4B] block">Development Stage:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['Seedling', 'Sprout', 'Budding', 'Bloom'].map((st, i) => (
                      <button
                        key={st}
                        onClick={() => {
                          calmSound.playSoftTap();
                          setPlantStage(i + 1);
                          onUpdateLabParams({ greenhouseStage: i + 1 });
                        }}
                        className={`py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                          plantStage === i + 1
                            ? 'bg-[#3F784C] text-white border-[#34653F]'
                            : 'bg-white text-[#465A4B] border-[#CCD8CF] hover:bg-[#EAEFEA]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Science Field Callout */}
                <div className="p-3 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] text-xs text-[#2D5A37] space-y-1">
                  <span className="font-semibold block">Botanical Fact:</span>
                  <p>
                    Leaves contain tiny breathing pores called stomata. They open during daylight to absorb carbon dioxide and release sweet oxygen!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. OPTICS CAVERN */}
          {activeDomain === 'optics' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col items-center">
                <canvas
                  ref={opticsCanvasRef}
                  width={420}
                  height={280}
                  className="w-full max-w-[420px] h-[280px] rounded-xl border border-[#CCD8CF] shadow-inner"
                />
                <span className="text-[11px] text-[#5E7564] mt-2">
                  Rotate mirror to 45° to reflect the ray into the quartz geode!
                </span>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-bold text-[#1F2E23]">Prism Mirror Control</h3>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-[#465A4B]">
                      <Compass className="w-3.5 h-3.5 text-[#3F784C]" />
                      Mirror Angle:
                    </span>
                    <span className="font-mono font-semibold text-[#1F2E23]">{mirrorAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={mirrorAngle}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setMirrorAngle(v);
                      onUpdateLabParams({ opticsAngle: v });
                    }}
                    className="w-full accent-[#3F784C] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#CCD8CF]">
                  <span className="text-xs font-semibold text-[#1F2E23]">Spectrum Dispersion:</span>
                  <button
                    onClick={() => {
                      calmSound.playSoftTap();
                      setDispersionMode(!dispersionMode);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                      dispersionMode
                        ? 'bg-[#3F784C] text-white border-[#34653F]'
                        : 'bg-[#FAF8F5] text-[#465A4B] border-[#CCD8CF]'
                    }`}
                  >
                    {dispersionMode ? 'Rainbow Active' : 'Monochrome'}
                  </button>
                </div>

                <div className="p-3 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] text-xs text-[#2D5A37] space-y-1">
                  <span className="font-semibold block">Optics Principle:</span>
                  <p>
                    Angle of Incidence equals Angle of Reflection! Glass prisms slow down different wavelengths of light at slightly different speeds, revealing the full color spectrum.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. WETLAND SANCTUARY */}
          {activeDomain === 'ecology' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="w-full max-w-[420px] h-[280px] bg-[#E3EFE8] rounded-xl border border-[#CCD8CF] p-4 relative overflow-hidden flex flex-col justify-between shadow-inner">
                  {/* Sky & Reeds */}
                  <div className="flex justify-between items-center z-10">
                    <span className="text-xs font-semibold text-[#2D5A37]">Ecosystem Sanctuary</span>
                    <span className="text-xs font-mono text-[#3F784C] bg-white/70 px-2 py-0.5 rounded-md">
                      Purity: {Math.min(100, wetlandReeds * 14)}%
                    </span>
                  </div>

                  {/* Visual Pond Creatures */}
                  <div className="relative h-44 w-full flex items-center justify-around z-10">
                    {/* Reeds */}
                    <div className="flex gap-1 items-end h-32">
                      {Array.from({ length: wetlandReeds }, (_, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-[#5A8765] rounded-t-full transition-all duration-300"
                          style={{ height: `${50 + (i % 3) * 20}px` }}
                        />
                      ))}
                    </div>

                    {/* Water minnows */}
                    <div className="flex flex-col gap-3">
                      {Array.from({ length: wetlandFishCount }, (_, i) => (
                        <div
                          key={i}
                          className="w-6 h-3 bg-[#D9822B] rounded-full border border-[#B86B1D] shadow-xs animate-pulse"
                          style={{ animationDuration: `${2 + i * 0.5}s` }}
                        />
                      ))}
                    </div>

                    {/* Duck on Lily Pad */}
                    <div className="flex flex-col items-center">
                      <span className="text-2xl" role="img" aria-label="Duck">🦆</span>
                      <div className="w-12 h-3 bg-[#4F8A61] rounded-full mt-[-6px]" />
                    </div>
                  </div>

                  {/* Water bed */}
                  <div className="text-[11px] text-[#3F784C] z-10 text-center font-medium">
                    Clean natural gravel filtration keeps water balanced
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-bold text-[#1F2E23]">Wetland Balance</h3>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#465A4B]">Water Reeds (Producers):</span>
                    <span className="font-mono font-semibold text-[#1F2E23]">{wetlandReeds} bundles</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={wetlandReeds}
                    onChange={(e) => setWetlandReeds(Number(e.target.value))}
                    className="w-full accent-[#3F784C] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#465A4B]">Minnows &amp; Tadpoles:</span>
                    <span className="font-mono font-semibold text-[#1F2E23]">{wetlandFishCount} swimming</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={wetlandFishCount}
                    onChange={(e) => setWetlandFishCount(Number(e.target.value))}
                    className="w-full accent-[#D9822B] cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] text-xs text-[#2D5A37] space-y-1">
                  <span className="font-semibold block">Ecology Principle:</span>
                  <p>
                    Reeds filter muddy sediment from stream runoff, creating oxygen-rich water for tadpoles and dragonflies to flourish!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. KINETIC CIRCUITS */}
          {activeDomain === 'circuits' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="w-full max-w-[420px] h-[280px] bg-[#222E26] rounded-xl border border-[#CCD8CF] p-6 relative flex flex-col justify-between shadow-inner">
                  {/* Closed loop wire track */}
                  <div className="relative w-full h-full border-2 border-[#5F8A6C] rounded-lg p-6 flex items-center justify-between">
                    {/* Battery Pack */}
                    <div className="flex flex-col gap-1 items-center bg-[#304236] p-2 rounded-md border border-[#496553]">
                      <span className="text-[10px] text-[#A8CEB3] font-mono">BATTERY</span>
                      <div className="flex gap-1">
                        {Array.from({ length: batteryCells }, (_, i) => (
                          <div key={i} className="w-3 h-8 bg-[#D9822B] rounded-xs border border-[#F4BF4F]" />
                        ))}
                      </div>
                      <span className="text-[10px] text-white font-mono">{batteryCells * 6}V</span>
                    </div>

                    {/* Switch */}
                    <button
                      onClick={() => {
                        calmSound.playSoftTap();
                        setSwitchClosed(!switchClosed);
                      }}
                      className="px-3 py-1.5 rounded-md text-xs font-mono font-semibold border transition-all"
                      style={{
                        backgroundColor: switchClosed ? '#3F784C' : '#5E4016',
                        color: '#FFFFFF',
                        borderColor: switchClosed ? '#5F9E6E' : '#73511F',
                      }}
                    >
                      {switchClosed ? 'Switch: CLOSED' : 'Switch: OPEN'}
                    </button>

                    {/* Vintage Amber Filament Bulb */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-full border-2 border-[#CCD8CF] flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: switchClosed
                            ? `rgba(245, 191, 79, ${0.3 + batteryCells * 0.15})`
                            : '#2A3A2F',
                          boxShadow: switchClosed
                            ? `0 0 ${batteryCells * 12}px rgba(245, 191, 79, 0.7)`
                            : 'none',
                        }}
                      >
                        <Zap
                          className={`w-8 h-8 transition-colors ${
                            switchClosed ? 'text-[#F5D372]' : 'text-[#465A4B]'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-[#A8CEB3] mt-2 font-mono">
                        {switchClosed ? 'FILAMENT GLOWING' : 'CIRCUIT INACTIVE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-bold text-[#1F2E23]">Circuit Adjustments</h3>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#465A4B]">Battery Cells in Series:</span>
                    <span className="font-mono font-semibold text-[#1F2E23]">{batteryCells} cells ({batteryCells * 6}V)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={batteryCells}
                    onChange={(e) => setBatteryCells(Number(e.target.value))}
                    className="w-full accent-[#3F784C] cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] text-xs text-[#2D5A37] space-y-1">
                  <span className="font-semibold block">Electricity Principle:</span>
                  <p>
                    Electrons only travel when there is an unbroken loop from the positive terminal to the negative terminal. Opening the switch stops the current instantly!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. ASTRONOMY ORBITARIUM */}
          {activeDomain === 'astronomy' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col items-center">
                <canvas
                  ref={orbitCanvasRef}
                  width={420}
                  height={280}
                  className="w-full max-w-[420px] h-[280px] rounded-xl border border-[#CCD8CF] shadow-inner"
                />
                <span className="text-[11px] text-[#5E7564] mt-2">
                  Gravitational orbital probe coaster (Keplerian mechanics)
                </span>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-bold text-[#1F2E23]">Orbital Mechanics</h3>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#465A4B]">Orbital Radius:</span>
                    <span className="font-mono font-semibold text-[#1F2E23]">{orbitRadius} km</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="140"
                    value={orbitRadius}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setOrbitRadius(v);
                      onUpdateLabParams({ orbitRadius: v });
                    }}
                    className="w-full accent-[#3F784C] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#465A4B]">Cruising Velocity:</span>
                    <span className="font-mono font-semibold text-[#1F2E23]">{orbitSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={orbitSpeed}
                    onChange={(e) => setOrbitSpeed(Number(e.target.value))}
                    className="w-full accent-[#3F784C] cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] text-xs text-[#2D5A37] space-y-1">
                  <span className="font-semibold block">Cosmic Law:</span>
                  <p>
                    Gravity pulls the probe toward the planet, while forward momentum keeps it falling in a graceful curve around the planet without crashing!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Adaptive Discovery Nudge (Gentle non-intrusive support after time exploring without progress) */}
          <AdaptiveLabNudge
            domain={activeDomain}
            isGoalAchieved={isGoalAchieved}
            elapsedSeconds={elapsedSeconds}
            onApplyAssistance={handleApplyAssistance}
            onSnooze={handleSnooze}
            speechRate={speechRate}
          />

          {/* Quick Return to Math Inquiry */}
          <div className="pt-4 border-t border-[#E3E8E4] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#5E7564]">
              Ready to unlock more resources and specimens?
            </span>
            <button
              onClick={() => onGoToMath(activeDomain)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3F784C] hover:bg-[#34653F] rounded-lg transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solve Math Inquiry for {activeDomain}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
