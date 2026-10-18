import React, { useState } from 'react';
import { VisualManipulativeType } from '../types';
import { calmSound } from '../utils/soundEngine';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface ManipulativeTrayProps {
  type: VisualManipulativeType;
  initialCount?: number;
  target?: number;
  operands?: number[];
  unitName?: string;
  onValueChange?: (val: number) => void;
}

export const ManipulativeTray: React.FC<ManipulativeTrayProps> = ({
  type,
  initialCount = 0,
  target = 10,
  operands = [5, 5],
  unitName = 'items',
  onValueChange,
}) => {
  // Counters state (two-ten frame up to 20 slots)
  const [activeCounters, setActiveCounters] = useState<number>(initialCount);

  // Fraction bars state: which segments in current denominator are active
  const denom = operands[1] || 4;
  const [activeFractions, setActiveFractions] = useState<number[]>(
    Array.from({ length: Math.min(operands[0] || 1, denom) }, (_, i) => i)
  );

  // Grid array rows x cols
  const rows = operands[0] || 3;
  const cols = operands[1] || 4;
  const [activeCells, setActiveCells] = useState<boolean[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(true))
  );

  // Angle dial state (0 - 180)
  const [currentAngle, setCurrentAngle] = useState<number>(operands[1] || 45);

  const toggleCounterSlot = (index: number) => {
    calmSound.playSoftTap();
    const newCount = index < activeCounters ? index : index + 1;
    setActiveCounters(newCount);
    onValueChange?.(newCount);
  };

  const addCounter = () => {
    if (activeCounters < 20) {
      calmSound.playSoftTap();
      const n = activeCounters + 1;
      setActiveCounters(n);
      onValueChange?.(n);
    }
  };

  const removeCounter = () => {
    if (activeCounters > 0) {
      calmSound.playSoftTap();
      const n = activeCounters - 1;
      setActiveCounters(n);
      onValueChange?.(n);
    }
  };

  const toggleFraction = (idx: number) => {
    calmSound.playSoftTap();
    let updated: number[];
    if (activeFractions.includes(idx)) {
      updated = activeFractions.filter((i) => i !== idx);
    } else {
      updated = [...activeFractions, idx].sort((a, b) => a - b);
    }
    setActiveFractions(updated);
    onValueChange?.(updated.length);
  };

  const toggleGridCell = (r: number, c: number) => {
    calmSound.playSoftTap();
    const copy = activeCells.map((rowArr, ri) =>
      rowArr.map((cell, ci) => (ri === r && ci === c ? !cell : cell))
    );
    setActiveCells(copy);
    const count = copy.flat().filter(Boolean).length;
    onValueChange?.(count);
  };

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#CCD8CF] rounded-xl p-4 sm:p-5 shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E3E8E4] mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3F784C]" />
          <h4 className="text-xs font-semibold text-[#1F2E23]">
            {type === 'counters' && 'Interactive Ten-Frame Counters'}
            {type === 'fraction_bars' && 'Visual Fraction Strips'}
            {type === 'grid_array' && 'Grouping & Area Grid Array'}
            {type === 'balance_scale' && 'Equation Balance Scale'}
            {type === 'angle_dial' && 'Cavern Protractor Angle Dial'}
          </h4>
        </div>
        <span className="text-xs text-[#5E7564]">
          Hands-on manipulative mode
        </span>
      </div>

      {/* 1. COUNTERS / TEN-FRAME */}
      {type === 'counters' && (
        <div className="space-y-4">
          <p className="text-xs text-[#465A4B]">
            Tap any slot to add or remove counters. Grouping into frames of 5 and 10 helps your eyes count quickly!
          </p>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8]">
            {Array.from({ length: Math.max(10, Math.ceil(Math.max(activeCounters, target) / 5) * 5) }, (_, i) => {
              const isFilled = i < activeCounters;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleCounterSlot(i)}
                  className={`h-11 rounded-lg border flex items-center justify-center transition-all ${
                    isFilled
                      ? 'bg-[#3F784C] border-[#34653F] text-white shadow-xs scale-95'
                      : 'bg-[#FAF8F5] border-[#CCD8CF] hover:border-[#8EAA94]'
                  }`}
                  aria-label={`Counter slot ${i + 1}, ${isFilled ? 'filled' : 'empty'}`}
                >
                  {isFilled && (
                    <span className="w-4 h-4 rounded-full bg-[#A8D5B1] shadow-inner" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={removeCounter}
                className="p-1.5 rounded-lg border border-[#CCD8CF] bg-white hover:bg-[#EAEFEA] text-[#1F2E23]"
                title="Subtract one"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={addCounter}
                className="p-1.5 rounded-lg border border-[#CCD8CF] bg-white hover:bg-[#EAEFEA] text-[#1F2E23]"
                title="Add one"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-semibold text-[#1F2E23]">
              Active count:{' '}
              <span className="text-[#3F784C] font-mono text-sm">{activeCounters}</span>{' '}
              {unitName}
            </div>
          </div>
        </div>
      )}

      {/* 2. FRACTION BARS */}
      {type === 'fraction_bars' && (
        <div className="space-y-4">
          <p className="text-xs text-[#465A4B]">
            Tap segments to shade parts of the whole ({activeFractions.length} / {denom} shaded).
          </p>

          {/* Reference: 1 Whole */}
          <div className="space-y-1">
            <span className="text-[11px] text-[#5E7564] font-medium">1 Whole:</span>
            <div className="w-full h-8 bg-[#D5E2D8] rounded-lg border border-[#CCD8CF] flex items-center justify-center text-xs font-semibold text-[#1F2E23]">
              1 Whole Unit
            </div>
          </div>

          {/* Divided Strip */}
          <div className="space-y-1">
            <span className="text-[11px] text-[#5E7564] font-medium">
              Divided into {denom} equal parts:
            </span>
            <div className="grid gap-1.5 w-full h-11" style={{ gridTemplateColumns: `repeat(${denom}, minmax(0, 1fr))` }}>
              {Array.from({ length: denom }, (_, i) => {
                const isSelected = activeFractions.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleFraction(i)}
                    className={`h-full rounded-lg border font-mono text-xs font-semibold transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#3F784C] border-[#34653F] text-white shadow-xs'
                        : 'bg-white border-[#CCD8CF] text-[#5E7564] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    1/{denom}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-right text-xs font-semibold text-[#1F2E23]">
            Shaded:{' '}
            <span className="text-[#3F784C] font-mono text-sm">
              {activeFractions.length}/{denom}
            </span>
          </div>
        </div>
      )}

      {/* 3. GRID ARRAY */}
      {type === 'grid_array' && (
        <div className="space-y-4">
          <p className="text-xs text-[#465A4B]">
            An array shows {rows} rows of {cols} items ({rows} × {cols} = {rows * cols}). Tap cells to observe grouping!
          </p>

          <div className="inline-block p-3 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] overflow-x-auto max-w-full">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}>
              {activeCells.map((rowArr, r) =>
                rowArr.map((cellActive, c) => (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => toggleGridCell(r, c)}
                    className={`w-10 h-10 rounded-md border text-xs font-mono font-medium transition-all flex items-center justify-center ${
                      cellActive
                        ? 'bg-[#3F784C] border-[#34653F] text-white'
                        : 'bg-white border-[#CCD8CF] text-transparent'
                    }`}
                  >
                    {cellActive ? `${r * cols + c + 1}` : ''}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5E7564]">
              {rows} rows × {cols} columns
            </span>
            <span className="font-semibold text-[#1F2E23]">
              Active cells:{' '}
              <span className="text-[#3F784C] font-mono text-sm">
                {activeCells.flat().filter(Boolean).length}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* 4. BALANCE SCALE */}
      {type === 'balance_scale' && (
        <div className="space-y-4">
          <p className="text-xs text-[#465A4B]">
            Observe how the scale balances when both sides have equal weights ({operands[0]} on left vs {operands[1]} on right).
          </p>

          <div className="relative w-full h-36 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8] flex items-center justify-center p-4">
            {/* Center Fulcrum */}
            <div className="absolute bottom-4 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[32px] border-b-[#465A4B]" />

            {/* Horizontal Balance Beam */}
            <div className="w-64 h-2 bg-[#1F2E23] rounded-full relative">
              {/* Left Pan */}
              <div className="absolute -left-4 -bottom-16 w-20 flex flex-col items-center">
                <div className="w-0.5 h-12 bg-[#465A4B]" />
                <div className="w-20 h-6 bg-white border border-[#CCD8CF] rounded-b-xl flex items-center justify-center text-xs font-semibold text-[#1F2E23] shadow-xs">
                  {operands[0]} {unitName}
                </div>
              </div>

              {/* Right Pan */}
              <div className="absolute -right-4 -bottom-16 w-20 flex flex-col items-center">
                <div className="w-0.5 h-12 bg-[#465A4B]" />
                <div className="w-20 h-6 bg-[#D5E2D8] border border-[#CCD8CF] rounded-b-xl flex items-center justify-center text-xs font-semibold text-[#3F784C] shadow-xs">
                  {target} {unitName}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-xs font-medium text-[#465A4B]">
            Equilibrium achieved when left and right are equal.
          </div>
        </div>
      )}

      {/* 5. ANGLE DIAL */}
      {type === 'angle_dial' && (
        <div className="space-y-4">
          <p className="text-xs text-[#465A4B]">
            Drag the slider to adjust the mirror angle (0° = flat horizontal, 90° = right angle, 180° = opposite flat).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-[#EAEFEA] rounded-xl border border-[#D5E2D8]">
            {/* Protractor Arc SVG */}
            <div className="relative w-36 h-20 flex items-end justify-center">
              <svg viewBox="0 0 100 50" className="w-36 h-20">
                <path
                  d="M 5 50 A 45 45 0 0 1 95 50 Z"
                  fill="#FAF8F5"
                  stroke="#CCD8CF"
                  strokeWidth="2"
                />
                {/* 45 degree guideline */}
                <line x1="50" y1="50" x2="81.8" y2="18.2" stroke="#B8C7BC" strokeWidth="1" strokeDasharray="2,2" />
                {/* 90 degree guideline */}
                <line x1="50" y1="50" x2="50" y2="5" stroke="#B8C7BC" strokeWidth="1" strokeDasharray="2,2" />
                {/* Active Angle Line */}
                <line
                  x1="50"
                  y1="50"
                  x2={50 + 45 * Math.cos(((180 - currentAngle) * Math.PI) / 180)}
                  y2={50 - 45 * Math.sin(((180 - currentAngle) * Math.PI) / 180)}
                  stroke="#3F784C"
                  strokeWidth="3"
                />
              </svg>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-2xl font-bold text-[#1F2E23]">
                {currentAngle}°
              </span>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={currentAngle}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentAngle(val);
                  onValueChange?.(val);
                }}
                className="w-48 accent-[#3F784C] cursor-pointer"
              />
              <div className="flex justify-between w-48 text-[10px] text-[#5E7564]">
                <span>0°</span>
                <span>45°</span>
                <span>90°</span>
                <span>180°</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
