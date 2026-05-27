"use client";

import { useState } from "react";
import {
  CLASS_OPTIONS,
  EVENT_TYPE_GROUPS,
  LOCATION_TYPE_OPTIONS,
  TIME_TYPE_OPTIONS,
  classIconSrc,
  type FilterState,
  type MapVersion,
} from "../types";
import { HISTORICAL_MAPS } from "../historical-maps";
import { EventTypeGlyph } from "./EventTypeGlyph";
import { IconSourceModal } from "./IconSourceModal";

type FilterPanelProps = {
  filters: FilterState;
  toggle: (key: keyof FilterState, value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  mapVer: MapVersion;
  setMapVer: (value: MapVersion) => void;
};

function MapVersionGroup({ value, onChange }: { value: MapVersion; onChange: (value: MapVersion) => void }) {
  return (
    <fieldset className="vr-filter-group">
      <legend>
        地图年代 <em>Era</em>
      </legend>
      <div className="vr-mapver-row">
        {HISTORICAL_MAPS.filter((version) => !version.hidden).map((version) => (
          <button
            key={version.id}
            type="button"
            className={`vr-mapver-tile ${version.id === value ? "is-on" : ""}`}
            onClick={() => onChange(version.id)}
          >
            <span className="vr-mapver-tile-label">{version.id === "modern" ? "现代" : "20 世纪"}</span>
            <span className="vr-mapver-tile-caption">{version.id === "modern" ? "Today" : "20th Century"}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function InfoButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="vr-legend-info" aria-label={label} onClick={onClick}>
      i
    </button>
  );
}

function ClassFilter({
  selected,
  onToggle,
  onOpenSources,
}: {
  selected: Set<string>;
  onToggle: (value: string) => void;
  onOpenSources: () => void;
}) {
  return (
    <fieldset className="vr-filter-group">
      <legend>
        <span>
          阶层 <em>Class</em>
        </span>
        <InfoButton label="查看阶层图标来源" onClick={onOpenSources} />
      </legend>
      <div className="vr-avatar-grid">
        {CLASS_OPTIONS.map((option) => {
          const on = selected.has(option);
          return (
            <button
              key={option}
              type="button"
              title={option}
              className={`vr-avatar-chip ${on ? "is-on" : "is-off"}`}
              onClick={() => onToggle(option)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={classIconSrc(option)} alt="" />
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function GenderFilter({
  selected,
  onToggle,
  onOpenSources,
}: {
  selected: Set<string>;
  onToggle: (value: string) => void;
  onOpenSources: () => void;
}) {
  const options = [
    { value: "女", zh: "女性角色", en: "Female", image: "/icons/gender-female.png" },
    { value: "男", zh: "男性角色", en: "Male", image: "/icons/gender-male.png" },
  ];
  const labels: Record<string, string> = {
    男: "男性角色",
    女: "女性角色",
  };

  return (
    <fieldset className="vr-filter-group">
      <legend>
        <span>
          性别类型 <em>Gender</em>
        </span>
        <InfoButton label="查看性别图标来源" onClick={onOpenSources} />
      </legend>
      <div className="vr-gender-grid">
        {options.map((option) => {
          const on = selected.has(option.value);
          return (
            <button
              key={option.value}
              type="button"
              title={labels[option.value]}
              className={`vr-gender-chip ${on ? "is-on" : "is-off"}`}
              onClick={() => onToggle(option.value)}
            >
              <span className="vr-gender-portrait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={option.image} alt={option.zh} />
              </span>
              <span className="vr-gender-label">
                <span className="vr-gender-label-zh">{option.zh}</span>
                <span className="vr-gender-label-en">{option.en}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function EventTypeFilter({ selected, onToggle }: { selected: Set<string>; onToggle: (value: string) => void }) {
  return (
    <fieldset className="vr-filter-group">
      <legend>
        事件类型 <em>Event Type</em>
      </legend>
      <div className="vr-axis-grid">
        {EVENT_TYPE_GROUPS.map(([left, right]) => {
          const leftOn = selected.has(left);
          const rightOn = selected.has(right);
          const axisClass = leftOn ? "is-left" : rightOn ? "is-right" : "";
          return (
            <div key={`${left}-${right}`} className={`vr-axis ${axisClass}`} role="group" aria-label={`${left} 或 ${right}`}>
              <button
                type="button"
                className="vr-axis-end"
                aria-pressed={leftOn}
                aria-label={`筛选${left}`}
                onClick={() => onToggle(left)}
              >
                <EventTypeGlyph type={left} />
                <span>{left}</span>
              </button>
              <button
                type="button"
                className="vr-axis-track"
                aria-label={`${left} / ${right} 不参与筛选`}
                onClick={() => {
                  if (leftOn) onToggle(left);
                  if (rightOn) onToggle(right);
                }}
              >
                <span className="vr-axis-line" />
                <span className="vr-axis-fill" />
                <span className="vr-axis-handle" />
              </button>
              <button
                type="button"
                className="vr-axis-end"
                aria-pressed={rightOn}
                aria-label={`筛选${right}`}
                onClick={() => onToggle(right)}
              >
                <EventTypeGlyph type={right} />
                <span>{right}</span>
              </button>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function TimeTypeFilter({ selected, onToggle }: { selected: Set<string>; onToggle: (value: string) => void }) {
  return (
    <fieldset className="vr-filter-group">
      <legend>
        时间类型 <em>Time</em>
      </legend>
      <div className="vr-pill-stack vr-pill-stack--row">
        {TIME_TYPE_OPTIONS.map((option) => {
          const on = selected.has(option);
          const fictional = option === "虚构映射";
          return (
            <button
              key={option}
              type="button"
              className={`vr-meta-pill vr-time-pill ${on ? "is-on" : "is-off"} ${fictional ? "is-fictional" : ""}`}
              onClick={() => onToggle(option)}
            >
              <svg className="vr-meta-glyph" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  strokeDasharray={fictional ? "3 3" : "0"}
                />
                <path d="M12 7v5l3 2" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" />
              </svg>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function LocationTypeFilter({ selected, onToggle }: { selected: Set<string>; onToggle: (value: string) => void }) {
  function locationGlyph(option: string) {
    if (option === "真实") {
      return (
        <svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <path d="M7 1.4C5 1.4 3.5 2.8 3.5 4.6c0 2.4 3.5 7 3.5 7s3.5-4.6 3.5-7C10.5 2.8 9 1.4 7 1.4z" />
          <circle cx="7" cy="4.6" r="1" fill="var(--paper-cream)" />
        </svg>
      );
    }

    if (option === "虚构映射") {
      return (
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 1.4C5 1.4 3.5 2.8 3.5 4.6c0 2.4 3.5 7 3.5 7s3.5-4.6 3.5-7C10.5 2.8 9 1.4 7 1.4z" strokeDasharray="1.6 1.2" />
          <circle cx="7" cy="4.6" r="1" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
        <path d="M7 1.5L8 5.5L12 7L8 8.5L7 12.5L6 8.5L2 7L6 5.5Z" />
      </svg>
    );
  }

  return (
    <fieldset className="vr-filter-group">
      <legend>
        地点类型 <em>Place</em>
      </legend>
      <div className="vr-pill-stack vr-pill-stack--row">
        {LOCATION_TYPE_OPTIONS.map((option) => {
          const on = selected.has(option);
          const fictional = option === "虚构映射";
          return (
            <button
              key={option}
              type="button"
              className={`vr-meta-pill vr-loc-pill ${on ? "is-on" : "is-off"} ${fictional ? "is-fictional" : ""}`}
              onClick={() => onToggle(option)}
            >
              <span className="vr-meta-glyph">{locationGlyph(option)}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterPanel({ filters, toggle, open, setOpen, mapVer, setMapVer }: FilterPanelProps) {
  const [sourceModalType, setSourceModalType] = useState<"class" | "gender" | null>(null);

  return (
    <>
      <button
        type="button"
        className={`vr-filter-fab ${open ? "is-hidden" : "is-visible"}`}
        aria-label="展开图志"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M12 3 L2 8.5 L12 14 L22 8.5 Z" />
          <path d="M2 12 L12 17.5 L22 12 L19.5 10.7 L12 14.7 L4.5 10.7 Z" />
          <path d="M2 15.5 L12 21 L22 15.5 L19.5 14.2 L12 18.2 L4.5 14.2 Z" />
        </svg>
      </button>

      <section className={`vr-panel vr-filter-panel ${open ? "is-visible" : "is-hidden"}`}>
        <header className="vr-panel-header">
          <h2 className="vr-panel-h">
            <span>图志</span>
            <em>Atlas</em>
          </h2>
          <button type="button" aria-label="收起图志" onClick={() => setOpen(false)}>
            ›
          </button>
        </header>
        <div className="vr-panel-body vr-panel-body--scroll">
          <MapVersionGroup value={mapVer} onChange={setMapVer} />
          <ClassFilter
            selected={filters.classes}
            onToggle={(value) => toggle("classes", value)}
            onOpenSources={() => setSourceModalType("class")}
          />
          <EventTypeFilter selected={filters.eventTypes} onToggle={(value) => toggle("eventTypes", value)} />
          <GenderFilter
            selected={filters.genders}
            onToggle={(value) => toggle("genders", value)}
            onOpenSources={() => setSourceModalType("gender")}
          />
          <TimeTypeFilter selected={filters.timeTypes} onToggle={(value) => toggle("timeTypes", value)} />
          <LocationTypeFilter selected={filters.locationTypes} onToggle={(value) => toggle("locationTypes", value)} />
        </div>
      </section>

      {sourceModalType && <IconSourceModal type={sourceModalType} onClose={() => setSourceModalType(null)} />}
    </>
  );
}
