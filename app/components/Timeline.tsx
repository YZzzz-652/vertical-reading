"use client";

import { useMemo, useRef } from "react";
import { TIMELINE_END, TIMELINE_START } from "../types";

type TimelineProps = {
  years: [number, number];
  eventYears: number[];
  setYears: (years: [number, number] | ((current: [number, number]) => [number, number])) => void;
};

export function Timeline({ years, eventYears, setYears }: TimelineProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const ticks = useMemo(() => {
    const items = [];
    for (let year = TIMELINE_START; year <= TIMELINE_END; year += 10) {
      items.push({
        year,
        major: (year - TIMELINE_START) % 50 === 0,
        pos: ((year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100,
      });
    }
    return items;
  }, []);

  function pctToYear(pct: number) {
    return Math.round(TIMELINE_START + (pct / 100) * (TIMELINE_END - TIMELINE_START));
  }

  function onDown(which: 0 | 1) {
    return (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);

      const move = (moveEvent: PointerEvent) => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = moveEvent.clientX - rect.left;
        const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const year = pctToYear(pct);
        setYears((current) => {
          if (which === 0) return [Math.min(year, current[1] - 5), current[1]];
          return [current[0], Math.max(year, current[0] + 5)];
        });
      };

      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  }

  const startPct = ((years[0] - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100;
  const endPct = ((years[1] - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100;
  const dots = useMemo(
    () =>
      eventYears
        .filter((year) => year >= TIMELINE_START && year <= TIMELINE_END)
        .map((year, index) => ({
          id: `${year}-${index}`,
          pos: ((year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100,
        })),
    [eventYears],
  );

  return (
    <section className="vr-timeline" aria-label="年份范围筛选">
      <div className="vr-slider" ref={trackRef}>
        <div className="vr-track" />
        <div className="vr-fill" style={{ left: `${startPct}%`, right: `${100 - endPct}%` }} />
        <div
          className="vr-handle"
          role="slider"
          tabIndex={0}
          aria-valuemin={TIMELINE_START}
          aria-valuemax={years[1] - 5}
          aria-valuenow={years[0]}
          style={{ left: `calc(${startPct}% - 7px)` }}
          onPointerDown={onDown(0)}
        />
        <div
          className="vr-handle"
          role="slider"
          tabIndex={0}
          aria-valuemin={years[0] + 5}
          aria-valuemax={TIMELINE_END}
          aria-valuenow={years[1]}
          style={{ left: `calc(${endPct}% - 7px)` }}
          onPointerDown={onDown(1)}
        />
      </div>
      <div className="vr-ticks">
        {ticks.map((tick) => (
          <span
            key={tick.year}
            className={`vr-tick ${tick.major ? "is-major" : ""}`}
            data-year={tick.major ? tick.year : undefined}
            style={{ left: `${tick.pos}%` }}
          />
        ))}
      </div>
      <div className="vr-dots" aria-hidden="true">
        {dots.map((dot) => (
          <span key={dot.id} className="vr-dot" style={{ left: `${dot.pos}%` }} />
        ))}
      </div>
    </section>
  );
}
