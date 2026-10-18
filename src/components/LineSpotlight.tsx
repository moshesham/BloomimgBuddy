import React, { useEffect, useState } from 'react';

interface LineSpotlightProps {
  enabled: boolean;
}

export const LineSpotlight: React.FC<LineSpotlightProps> = ({ enabled }) => {
  const [mouseY, setMouseY] = useState<number>(window.innerHeight / 2);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMouseY(e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  const bandHeight = 70; // 70px reading window
  const topCut = Math.max(0, mouseY - bandHeight / 2);
  const bottomCut = Math.max(0, window.innerHeight - (mouseY + bandHeight / 2));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col transition-opacity duration-300">
      {/* Top Shaded Veil */}
      <div
        className="w-full bg-[#1F2E23]/35 backdrop-blur-[0.5px] transition-all duration-75 ease-out"
        style={{ height: `${topCut}px` }}
      />

      {/* Clear Spotlight Reading Band */}
      <div
        className="w-full border-y border-[#5F7A61]/50 bg-transparent transition-all duration-75 ease-out"
        style={{ height: `${bandHeight}px` }}
      />

      {/* Bottom Shaded Veil */}
      <div
        className="w-full bg-[#1F2E23]/35 backdrop-blur-[0.5px] transition-all duration-75 ease-out"
        style={{ height: `${bottomCut}px` }}
      />
    </div>
  );
};
