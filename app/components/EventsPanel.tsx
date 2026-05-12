"use client";

import { useMemo, useState } from "react";
import { WORLD_EVENTS } from "../world-events";
import type { LiteraryEvent } from "../types";

type EventsPanelProps = {
  visible: LiteraryEvent[];
  years: [number, number];
  onPick: (event: LiteraryEvent) => void;
};

export function EventsPanel({ visible, years, onPick }: EventsPanelProps) {
  const [tab, setTab] = useState<"novels" | "world">("novels");
  const sorted = useMemo(
    () => [...visible].sort((a, b) => (a.year ?? 0) - (b.year ?? 0)),
    [visible],
  );
  const worldRows = WORLD_EVENTS.filter((event) => event.year >= years[0] && event.year <= years[1]);

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
                <button type="button" className="vr-event-row" onClick={() => onPick(event)}>
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
              <li key={event.year} className="vr-event-row vr-event-row--world">
                <div className="vr-event-year">{event.year}</div>
                <div className="vr-event-meta">
                  <div className="vr-event-desc">{event.label}</div>
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
