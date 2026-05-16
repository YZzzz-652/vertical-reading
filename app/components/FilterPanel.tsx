"use client";

import {
  CLASS_OPTIONS,
  GENDER_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  TIME_TYPE_OPTIONS,
  classIconSrc,
  type FilterState,
  type MapVersion,
} from "../types";
import { HISTORICAL_MAPS } from "../historical-maps";

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
            <span className="vr-mapver-tile-label">
              {version.labelZh} <em>{version.labelEn}</em>
            </span>
            <span className="vr-mapver-tile-caption">{version.id === "modern" ? "OSM" : version.yearRange}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ClassFilter({ selected, onToggle }: { selected: Set<string>; onToggle: (value: string) => void }) {
  return (
    <fieldset className="vr-filter-group">
      <legend>
        阶层 <em>Class</em>
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

function GenderFilter({ selected, onToggle }: { selected: Set<string>; onToggle: (value: string) => void }) {
  const labels: Record<string, string> = {
    男: "男性角色",
    女: "女性角色",
  };

  return (
    <fieldset className="vr-filter-group">
      <legend>
        性别 <em>Gender</em>
      </legend>
      <div className="vr-gender-grid">
        {GENDER_OPTIONS.map((option) => {
          const on = selected.has(option);
          return (
            <button
              key={option}
              type="button"
              title={labels[option]}
              className={`vr-gender-chip ${on ? "is-on" : "is-off"}`}
              onClick={() => onToggle(option)}
            >
              {labels[option]}
            </button>
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
  return (
    <fieldset className="vr-filter-group">
      <legend>
        地点类型 <em>Place</em>
      </legend>
      <div className="vr-pill-stack vr-pill-stack--row">
        {LOCATION_TYPE_OPTIONS.map((option) => {
          const on = selected.has(option);
          const fictional = option === "虚构映射" || option === "虚构无对应";
          return (
            <button
              key={option}
              type="button"
              className={`vr-meta-pill vr-loc-pill ${on ? "is-on" : "is-off"} ${fictional ? "is-fictional" : ""}`}
              onClick={() => onToggle(option)}
            >
              <svg className="vr-meta-glyph" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  strokeDasharray={fictional ? "3 3" : "0"}
                />
                <circle cx="12" cy="9" r="2.5" fill="currentColor" />
              </svg>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterPanel({ filters, toggle, open, setOpen, mapVer, setMapVer }: FilterPanelProps) {
  if (!open) {
    return (
      <button type="button" className="vr-filter-fab" aria-label="展开图志" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M12 3 L2 8.5 L12 14 L22 8.5 Z" />
          <path d="M2 12 L12 17.5 L22 12 L19.5 10.7 L12 14.7 L4.5 10.7 Z" />
          <path d="M2 15.5 L12 21 L22 15.5 L19.5 14.2 L12 18.2 L4.5 14.2 Z" />
        </svg>
      </button>
    );
  }

  return (
    <section className="vr-panel vr-filter-panel">
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
        <ClassFilter selected={filters.classes} onToggle={(value) => toggle("classes", value)} />
        <GenderFilter selected={filters.genders} onToggle={(value) => toggle("genders", value)} />
        <TimeTypeFilter selected={filters.timeTypes} onToggle={(value) => toggle("timeTypes", value)} />
        <LocationTypeFilter selected={filters.locationTypes} onToggle={(value) => toggle("locationTypes", value)} />
      </div>
    </section>
  );
}
