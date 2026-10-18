import React, { useEffect, useRef, useState } from 'react';
import { X, Volume2, VolumeX, Sparkles, Wind, Eye } from 'lucide-react';
import { calmSound } from '../utils/soundEngine';

interface SensoryPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambientSound: 'none' | 'gentle_rain' | 'forest_breeze' | 'singing_bowl';
  setAmbientSound: (sound: 'none' | 'gentle_rain' | 'forest_breeze' | 'singing_bowl') => void;
}

export const SensoryPauseModal: React.FC<SensoryPauseModalProps> = ({
  isOpen,
  onClose,
  ambientSound,
  setAmbientSound,
}) => {
  const [activeTab, setActiveTab] = useState<'breathe' | 'pond' | 'ground'>('breathe');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState<number>(4);

  // Canvas for Interactive Ripple Pond
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<{ x: number; y: number; r: number; opacity: number }[]>([]);

  // 4-7-8 Breathing timer
  useEffect(() => {
    if (!isOpen || activeTab !== 'breathe') return;

    let timer: NodeJS.Timeout;
    const runCycle = () => {
      // Inhale: 4 seconds
      setBreathPhase('inhale');
      setBreathCount(4);
      let count = 4;
      const inhaleInt = setInterval(() => {
        count -= 1;
        if (count > 0) setBreathCount(count);
      }, 1000);

      timer = setTimeout(() => {
        clearInterval(inhaleInt);
        // Hold: 7 seconds
        setBreathPhase('hold');
        setBreathCount(7);
        let holdCount = 7;
        const holdInt = setInterval(() => {
          holdCount -= 1;
          if (holdCount > 0) setBreathCount(holdCount);
        }, 1000);

        timer = setTimeout(() => {
          clearInterval(holdInt);
          // Exhale: 8 seconds
          setBreathPhase('exhale');
          setBreathCount(8);
          let exhaleCount = 8;
          const exhaleInt = setInterval(() => {
            exhaleCount -= 1;
            if (exhaleCount > 0) setBreathCount(exhaleCount);
          }, 1000);

          timer = setTimeout(() => {
            clearInterval(exhaleInt);
            runCycle();
          }, 8000);
        }, 7000);
      }, 4000);
    };

    runCycle();
    return () => clearTimeout(timer);
  }, [isOpen, activeTab]);

  // Interactive Ripple Pond animation loop
  useEffect(() => {
    if (!isOpen || activeTab !== 'pond') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Water background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#E8F1EC');
      grad.addColorStop(1, '#DCE7E1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i];
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(95, 122, 97, ${ripple.opacity})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ripple.r += 0.8;
        ripple.opacity -= 0.008;

        if (ripple.opacity <= 0 || ripple.r > 160) {
          ripplesRef.current.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, activeTab]);

  const addRipple = (x: number, y: number) => {
    calmSound.playSoftTap();
    ripplesRef.current.push({ x, y, r: 8, opacity: 0.7 });
    if (ripplesRef.current.length > 25) {
      ripplesRef.current.shift();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addRipple(x, y);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2E23]/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#FAF8F5] border border-[#CCD8CF] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E8E4]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5F7A61]" />
            <h2 className="text-base font-semibold text-[#1F2E23]">Sensory Pause &amp; Breathing Room</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E7564] hover:text-[#1F2E23] hover:bg-[#EAEFEA] transition-colors"
            aria-label="Close sensory pause"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#E3E8E4] px-6 bg-[#F4EFEA]/60">
          <button
            onClick={() => {
              calmSound.playSoftTap();
              setActiveTab('breathe');
            }}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'breathe'
                ? 'border-[#3F784C] text-[#1F2E23]'
                : 'border-transparent text-[#5E7564] hover:text-[#1F2E23]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            4-7-8 Breathing
          </button>
          <button
            onClick={() => {
              calmSound.playSoftTap();
              setActiveTab('pond');
            }}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'pond'
                ? 'border-[#3F784C] text-[#1F2E23]'
                : 'border-transparent text-[#5E7564] hover:text-[#1F2E23]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tactile Ripple Pond
          </button>
          <button
            onClick={() => {
              calmSound.playSoftTap();
              setActiveTab('ground');
            }}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'ground'
                ? 'border-[#3F784C] text-[#1F2E23]'
                : 'border-transparent text-[#5E7564] hover:text-[#1F2E23]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            5-4-3-2-1 Grounding
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[320px]">
          {activeTab === 'breathe' && (
            <div className="flex flex-col items-center text-center">
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                {/* Outer Breathing Guide Glow */}
                <div
                  className={`absolute rounded-full transition-all duration-1000 ease-in-out ${
                    breathPhase === 'inhale'
                      ? 'w-44 h-44 bg-[#C8DBD0]/60 scale-100'
                      : breathPhase === 'hold'
                      ? 'w-44 h-44 bg-[#C8DBD0]/80 scale-105'
                      : 'w-24 h-24 bg-[#E3ECE6]/50 scale-95'
                  }`}
                />
                {/* Core Circle */}
                <div
                  className={`w-32 h-32 rounded-full border-2 border-[#5F7A61] flex flex-col items-center justify-center bg-[#FAF8F5] shadow-sm z-10 transition-transform duration-700 ${
                    breathPhase === 'inhale'
                      ? 'scale-110'
                      : breathPhase === 'hold'
                      ? 'scale-110'
                      : 'scale-90'
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#5F7A61]">
                    {breathPhase === 'inhale'
                      ? 'Breathe In'
                      : breathPhase === 'hold'
                      ? 'Hold Gently'
                      : 'Exhale Slowly'}
                  </span>
                  <span className="text-3xl font-bold text-[#1F2E23] mt-1 font-mono">
                    {breathCount}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#465A4B] max-w-sm">
                There is zero hurry. Let your shoulders drop, relax your hands, and breathe naturally.
              </p>
            </div>
          )}

          {activeTab === 'pond' && (
            <div className="flex flex-col items-center w-full">
              <p className="text-xs text-[#5E7564] mb-3">
                Tap or click anywhere on the water surface to create peaceful calming ripples.
              </p>
              <canvas
                ref={canvasRef}
                width={500}
                height={260}
                onClick={handleCanvasClick}
                className="w-full max-w-[500px] h-[260px] rounded-xl border border-[#CCD8CF] cursor-pointer shadow-inner touch-none"
              />
            </div>
          )}

          {activeTab === 'ground' && (
            <div className="w-full max-w-lg space-y-3 text-left">
              <h3 className="text-sm font-semibold text-[#1F2E23] mb-2">5-4-3-2-1 Sensory Reset</h3>
              <div className="p-3 bg-[#EAEFEA] rounded-lg border border-[#D5E2D8] text-xs text-[#1F2E23]">
                <strong className="text-[#3F784C]">5 Things you see:</strong> Look around your room. Notice 5 calm colors or textures.
              </div>
              <div className="p-3 bg-[#EAEFEA] rounded-lg border border-[#D5E2D8] text-xs text-[#1F2E23]">
                <strong className="text-[#3F784C]">4 Things you can feel:</strong> The chair beneath you, your feet on the floor, your breath.
              </div>
              <div className="p-3 bg-[#EAEFEA] rounded-lg border border-[#D5E2D8] text-xs text-[#1F2E23]">
                <strong className="text-[#3F784C]">3 Sounds you hear:</strong> A distant car, the gentle hum of the room, or gentle nature audio.
              </div>
              <div className="p-3 bg-[#EAEFEA] rounded-lg border border-[#D5E2D8] text-xs text-[#1F2E23]">
                <strong className="text-[#3F784C]">2 Calm thoughts:</strong> You are safe, and learning is an adventure at your own pace.
              </div>
              <div className="p-3 bg-[#EAEFEA] rounded-lg border border-[#D5E2D8] text-xs text-[#1F2E23]">
                <strong className="text-[#3F784C]">1 Deep breath:</strong> Feel the fresh air fill your lungs.
              </div>
            </div>
          )}
        </div>

        {/* Ambient Soundbar in Modal */}
        <div className="px-6 py-4 bg-[#F4EFEA] border-t border-[#E3E8E4] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#465A4B]">Ambient Sound:</span>
            <button
              onClick={() => {
                calmSound.playSoftTap();
                const next = ambientSound === 'gentle_rain' ? 'none' : 'gentle_rain';
                setAmbientSound(next);
                calmSound.setAmbientSoundscape(next);
              }}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                ambientSound === 'gentle_rain'
                  ? 'bg-[#3F784C] text-white'
                  : 'bg-[#E2EBE4] text-[#1F2E23] hover:bg-[#D5E2D8]'
              }`}
            >
              Rain
            </button>
            <button
              onClick={() => {
                calmSound.playSoftTap();
                const next = ambientSound === 'forest_breeze' ? 'none' : 'forest_breeze';
                setAmbientSound(next);
                calmSound.setAmbientSoundscape(next);
              }}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                ambientSound === 'forest_breeze'
                  ? 'bg-[#3F784C] text-white'
                  : 'bg-[#E2EBE4] text-[#1F2E23] hover:bg-[#D5E2D8]'
              }`}
            >
              Breeze
            </button>
            <button
              onClick={() => {
                calmSound.playSoftTap();
                const next = ambientSound === 'singing_bowl' ? 'none' : 'singing_bowl';
                setAmbientSound(next);
                calmSound.setAmbientSoundscape(next);
              }}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                ambientSound === 'singing_bowl'
                  ? 'bg-[#3F784C] text-white'
                  : 'bg-[#E2EBE4] text-[#1F2E23] hover:bg-[#D5E2D8]'
              }`}
            >
              Singing Bowl
            </button>
            {ambientSound !== 'none' && (
              <button
                onClick={() => {
                  setAmbientSound('none');
                  calmSound.setAmbientSoundscape('none');
                }}
                className="p-1 text-[#5E7564] hover:text-[#1F2E23]"
                title="Mute ambient"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              calmSound.playSoftTap();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#3F784C] hover:bg-[#34653F] rounded-lg transition-colors shadow-xs"
          >
            I feel ready to return
          </button>
        </div>
      </div>
    </div>
  );
};
