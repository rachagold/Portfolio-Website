import React from "react";
import { cn } from "../lib/utils";

/**
 * Interactive isometric grid background. Cells faintly light up
 * in the site's brand colors as the cursor passes over them.
 * Uses event delegation + direct DOM mutation for performance
 * (no per-cell React state or motion instances).
 *
 * Touch support: dragging a finger leaves a fading trail of lit cells.
 */

const HOVER_COLORS = [
  "rgba(166, 93, 71, 0.4)",    // terracotta  #A65D47
  "rgba(119, 156, 145, 0.4)",  // sage green  #779C91
  "rgba(147, 49, 42, 0.35)",   // crimson     #93312A
  "rgba(229, 220, 205, 0.3)",  // warm cream  #E5DCCD
  "rgba(94, 133, 122, 0.4)",   // dark sage   #5E857A
  "rgba(45, 31, 28, 0.25)",    // dark brown  #2D1F1C
];

function getRandomColor() {
  return HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)];
}

function lightUpCell(el: HTMLElement) {
  el.style.backgroundColor = getRandomColor();
  el.style.transition = "background-color 0s";
}

function fadeOutCell(el: HTMLElement) {
  el.style.transition = "background-color 1.5s ease";
  el.style.backgroundColor = "transparent";
}

export const BackgroundBoxes = React.memo(function BackgroundBoxes({
  className,
}: {
  className?: string;
}) {
  const numCols = 80;
  const numRows = 50;

  // --- Desktop: mouse hover ---
  const handleMouseOver = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.dataset.cell !== undefined) {
      lightUpCell(target);
    }
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.dataset.cell !== undefined) {
      fadeOutCell(target);
    }
  };

  // --- Mobile: touch drag trail ---
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
    if (el && el.dataset.cell !== undefined && !el.dataset.lit) {
      el.dataset.lit = "1";
      lightUpCell(el);
      setTimeout(() => {
        fadeOutCell(el);
        delete el.dataset.lit;
      }, 300);
    }
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onTouchMove={handleTouchMove}
      style={{
        transform:
          "translate(-40%, -60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)",
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex w-full h-full z-0",
        className
      )}
    >
      {Array.from({ length: numCols }).map((_, i) => (
        <div key={i} className="w-16 h-8 border-l border-white/[0.08] relative">
          {Array.from({ length: numRows }).map((_, j) => (
            <div
              key={j}
              data-cell=""
              className="w-16 h-8 border-r border-t border-white/[0.08] relative"
            >
              {j % 2 === 0 && i % 2 === 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-white/10 stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});
