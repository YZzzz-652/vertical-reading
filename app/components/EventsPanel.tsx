"use client";

import { useMemo, useState } from "react";
import { worldEvents } from "../world-events";
import type { LiteraryEvent } from "../types";
import type { WorldEvent } from "../world-events";

type EventsPanelProps = {
  visible: LiteraryEvent[];
  years: [number, number];
  selectedEventId: string | null;
  onPick: (event: LiteraryEvent) => void;
};

const regionLabels: Record<WorldEvent["region"], string> = {
  Europe: "欧洲",
  Asia: "亚洲",
  Americas: "美洲",
  Africa: "非洲",
};

export function EventsPanel({ visible, years, selectedEventId, onPick }: EventsPanelProps) {
  const [tab, setTab] = useState<"novels" | "world">("novels");
  const [startYear, endYear] = years;
  const sorted = useMemo(
    () => [...visible].sort((a, b) => (a.year ?? 0) - (b.year ?? 0)),
    [visible],
  );
  const worldRows = useMemo(
    () =>
      worldEvents
        .filter((event) => event.year >= startYear && event.year <= endYear)
        .sort((a, b) => a.year - b.year),
    [startYear, endYear],
  );

  return (
    <section className="vr-panel vr-events-panel">
      <header className="vr-panel-header">
        <h2 className="vr-panel-h">
          <span>
            {years[0]} - {years[1]}
          </span>
          <em>{visible.length} parallel lives</em>
        </h2>
      </header>
      <nav className="vr-events-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "novels"}
          className={`vr-events-tab ${tab === "novels" ? "is-on" : ""}`}
          onClick={() => setTab("novels")}
        >
          <span>书中人物</span>
          <em>Novels</em>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "world"}
          className={`vr-events-tab ${tab === "world" ? "is-on" : ""}`}
          onClick={() => setTab("world")}
        >
          <span>真实世界</span>
          <em>History</em>
        </button>
      </nav>
      <div className="vr-events-body">
        {tab === "novels" ? (
          <ul className="vr-events-list">
            {sorted.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  className={`vr-event-row ${event.id === selectedEventId ? "is-selected" : ""}`}
                  onClick={() => onPick(event)}
                >
                  <div className="vr-event-year">{event.year}</div>
                  <div className="vr-event-meta">
                    <div className="vr-event-character">
                      {event.character}
                      <span className="vr-event-book"> · 《{event.book}》</span>
                    </div>
                    <div className="vr-event-desc">{event.event}</div>
                  </div>
                </button>
              </li>
            ))}
            {sorted.length === 0 && <li className="vr-event-empty">这段时间内没有匹配的事件</li>}
          </ul>
        ) : (
          <ul className="vr-events-list">
            {worldRows.map((event) => (
              <li key={event.id} className="vr-event-row vr-event-row--world">
                <div className="vr-event-year">{event.year}</div>
                <div className="vr-event-meta">
                  <div className="vr-event-character">
                    <span className="vr-event-book">{regionLabels[event.region]} · </span>
                    {event.title}
                  </div>
                  <div className="vr-event-desc">{event.description}</div>
                </div>
              </li>
            ))}
            {worldRows.length === 0 && (
              <li className="vr-event-empty vr-event-empty--pending">
                <span>真实世界事件待录入</span>
                <em>History records pending</em>
              </li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
