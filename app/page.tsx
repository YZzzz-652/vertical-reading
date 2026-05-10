"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LiteraryEvent = {
  id: string;
  book: string;
  author: string;
  region: string;
  character: string;
  class: string;
  gender: string;
  tags: string;
  event: string;
  quote: string;
  position: string;
  year: number | null;
  timeType: string;
  timeNote: string;
  locationName: string;
  city: string;
  lng: number | null;
  lat: number | null;
  locationType: string;
};

type LatLng = [number, number];
type LeafletMarker = {
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (content: string, options: Record<string, unknown>) => LeafletMarker;
  remove: () => void;
};
type LeafletMap = {
  remove: () => void;
};
type LeafletModule = {
  control: {
    zoom: (options: Record<string, unknown>) => { addTo: (map: LeafletMap) => void };
  };
  divIcon: (options: Record<string, unknown>) => unknown;
  map: (element: HTMLElement, options: Record<string, unknown>) => LeafletMap;
  marker: (latlng: LatLng, options: Record<string, unknown>) => LeafletMarker;
  tileLayer: (
    urlTemplate: string,
    options: Record<string, unknown>,
  ) => { addTo: (map: LeafletMap) => void };
};
type NoUiSliderInstance = {
  destroy: () => void;
  on: (event: string, callback: (values: (number | string)[]) => void) => void;
};

type FilterState = {
  classes: Set<string>;
  genders: Set<string>;
  timeTypes: Set<string>;
  locationTypes: Set<string>;
};

const CLASS_OPTIONS = [
  "贵族",
  "平民",
  "底层",
  "知识分子",
  "军人",
  "资产阶级",
  "宗教人士",
  "奴隶农奴",
];
const GENDER_OPTIONS = ["男", "女"];
const TIME_TYPE_OPTIONS = ["历史锚定", "虚构映射", "创作年代"];
const LOCATION_TYPE_OPTIONS = ["真实", "虚构映射", "虚构无对应"];
const TIMELINE_START = 1700;
const TIMELINE_END = 1930;

const CDN_ASSETS = [
  {
    id: "leaflet-css",
    type: "style",
    href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  },
  {
    id: "nouislider-css",
    type: "style",
    href: "https://unpkg.com/nouislider@15.8.1/dist/nouislider.min.css",
  },
  {
    id: "leaflet-js",
    type: "script",
    src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  },
  {
    id: "nouislider-js",
    type: "script",
    src: "https://unpkg.com/nouislider@15.8.1/dist/nouislider.min.js",
  },
] as const;

declare global {
  interface Window {
    L?: LeafletModule;
    noUiSlider?: {
      create: (
        element: HTMLElement,
        options: Record<string, unknown>,
      ) => NoUiSliderInstance;
    };
  }
}

function loadAsset(asset: (typeof CDN_ASSETS)[number]) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(asset.id)) {
      resolve();
      return;
    }

    if (asset.type === "style") {
      const link = document.createElement("link");
      link.id = asset.id;
      link.rel = "stylesheet";
      link.href = asset.href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`加载样式失败: ${asset.href}`));
      document.head.appendChild(link);
      return;
    }

    const script = document.createElement("script");
    script.id = asset.id;
    script.src = asset.src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`加载脚本失败: ${asset.src}`));
    document.body.appendChild(script);
  });
}

function makeFilterState(): FilterState {
  return {
    classes: new Set(CLASS_OPTIONS),
    genders: new Set(GENDER_OPTIONS),
    timeTypes: new Set(TIME_TYPE_OPTIONS),
    locationTypes: new Set(LOCATION_TYPE_OPTIONS),
  };
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function classIconSrc(className: string) {
  const safeClassName = CLASS_OPTIONS.includes(className) ? className : "平民";
  return `/icons/${encodeURIComponent(safeClassName)}.png`;
}

function iconHtml(event: LiteraryEvent) {
  const isFictional = event.timeType === "虚构映射" || event.locationType === "虚构映射";
  return `
    <img
      class="vr-marker ${isFictional ? "vr-marker--fictional" : ""}"
      src="${classIconSrc(event.class)}"
      alt="${escapeHtml(event.class || "阶层图标")}"
      title="${escapeHtml(event.character)}"
    />
  `;
}

function popupHtml(event: LiteraryEvent) {
  return `
    <article class="vr-popup-card">
      <header>
        <div class="vr-popup-title-row">
          <h2>${escapeHtml(event.character || "未命名人物")}</h2>
          <span>${escapeHtml(event.class || "未知阶层")}</span>
          ${event.tags ? `<span>${escapeHtml(event.tags)}</span>` : ""}
        </div>
        <p><em>${escapeHtml(event.book || "未知作品")} · ${escapeHtml(event.author || "未知作者")}</em></p>
      </header>
      <div class="vr-popup-rule"></div>
      <p class="vr-popup-event">${escapeHtml(event.event || "暂无事件描述")}</p>
      <p class="vr-popup-meta">地点：${escapeHtml(event.locationName || event.city || "未知地点")} · ${escapeHtml(event.locationType || "未知地点类型")}　时间：${escapeHtml(event.timeType || "未知时间类型")}</p>
      <div class="vr-popup-rule"></div>
      <details class="vr-popup-quote">
        <summary>原文摘录</summary>
        <p>${escapeHtml(event.quote || "暂无摘录")}</p>
      </details>
    </article>
  `;
}

function checkboxList(
  title: string,
  options: string[],
  selected: Set<string>,
  onToggle: (value: string) => void,
) {
  return (
    <fieldset className="vr-filter-group">
      <legend>{title}</legend>
      <div className="vr-check-grid">
        {options.map((option) => (
          <label key={option} className="vr-check-row">
            <input
              type="checkbox"
              checked={selected.has(option)}
              onChange={() => onToggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Home() {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const sliderEl = useRef<HTMLDivElement | null>(null);
  const filterPanelRef = useRef<HTMLElement | null>(null);
  const mapSectionRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const sliderRef = useRef<NoUiSliderInstance | null>(null);
  const [leaflet, setLeaflet] = useState<LeafletModule | null>(null);
  const [events, setEvents] = useState<LiteraryEvent[]>([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(() => makeFilterState());
  const [filterOpen, setFilterOpen] = useState(true);
  const [legendOpen, setLegendOpen] = useState(true);
  const [yearRange, setYearRange] = useState<[number, number]>([0, 0]);
  const [selectedYears, setSelectedYears] = useState<[number, number]>([0, 0]);
  const [rangeChipTop, setRangeChipTop] = useState(0);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        await Promise.all(CDN_ASSETS.filter((asset) => asset.type === "style").map(loadAsset));
        await loadAsset(CDN_ASSETS.find((asset) => asset.id === "leaflet-js")!);
        await loadAsset(CDN_ASSETS.find((asset) => asset.id === "nouislider-js")!);

        if (!cancelled && window.L) {
          setLeaflet(window.L);
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "地图资源加载失败");
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error ?? "事件数据读取失败");
        }

        if (!cancelled) {
          const usableEvents = (json.data as LiteraryEvent[]).filter(
            (item) => Number.isFinite(item.lat) && Number.isFinite(item.lng),
          );
          setEvents(usableEvents);
          setYearRange([TIMELINE_START, TIMELINE_END]);
          setSelectedYears([TIMELINE_START, TIMELINE_END]);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "事件数据读取失败");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!leaflet || !mapEl.current || mapRef.current) return;

    const map = leaflet.map(mapEl.current, {
      center: [50, 20],
      zoom: 4,
      zoomControl: false,
      worldCopyJump: true,
    });

    leaflet
      .tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      })
      .addTo(map);

    leaflet.control.zoom({ position: "topright" }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [leaflet]);

  useEffect(() => {
    if (!filterOpen || !filterPanelRef.current) return;

    const updateRangeChipTop = () => {
      const panelRect = filterPanelRef.current?.getBoundingClientRect();
      const stageRect = mapSectionRef.current?.getBoundingClientRect();
      if (panelRect && stageRect) {
        setRangeChipTop(panelRect.bottom - stageRect.top + 8);
      }
    };

    updateRangeChipTop();
    const observer = new ResizeObserver(updateRangeChipTop);
    observer.observe(filterPanelRef.current);
    window.addEventListener("resize", updateRangeChipTop);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateRangeChipTop);
    };
  }, [filterOpen]);

  useEffect(() => {
    if (!sliderEl.current || !window.noUiSlider || yearRange[0] === yearRange[1] || sliderRef.current) {
      return;
    }

    sliderRef.current = window.noUiSlider.create(sliderEl.current, {
      start: yearRange,
      connect: true,
      step: 1,
      range: {
        min: yearRange[0],
        max: yearRange[1],
      },
      format: {
        to: (value: number) => Math.round(value).toString(),
        from: (value: string) => Number(value),
      },
    });

    sliderRef.current.on("update", (values) => {
      setSelectedYears([Number(values[0]), Number(values[1])]);
    });

    return () => {
      sliderRef.current?.destroy();
      sliderRef.current = null;
    };
  }, [yearRange]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const year = event.year ?? 0;
      return (
        filters.classes.has(event.class) &&
        filters.genders.has(event.gender) &&
        filters.timeTypes.has(event.timeType) &&
        filters.locationTypes.has(event.locationType) &&
        year >= selectedYears[0] &&
        year <= selectedYears[1]
      );
    });
  }, [events, filters, selectedYears]);

  useEffect(() => {
    if (!leaflet || !mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = filteredEvents.map((event) => {
      const marker = leaflet
        .marker([event.lat!, event.lng!], {
          icon: leaflet.divIcon({
            className: "vr-div-icon",
            html: iconHtml(event),
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -22],
          }),
        })
        .bindPopup(popupHtml(event), {
          className: "vr-leaflet-popup",
          maxWidth: 390,
          minWidth: 290,
        })
        .addTo(mapRef.current!);

      return marker;
    });
  }, [filteredEvents, leaflet]);

  const toggleFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((current) => {
        const next = new Set(current[key]);
        if (next.has(value)) {
          next.delete(value);
        } else {
          next.add(value);
        }
        return { ...current, [key]: next };
      });
    },
    [],
  );

  const ticks = useMemo(() => {
    return Array.from(
      { length: (TIMELINE_END - TIMELINE_START) / 10 + 1 },
      (_, index) => {
        const year = TIMELINE_START + index * 10;
        return {
          year,
          isMajor: (year - TIMELINE_START) % 50 === 0,
          position: ((year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100,
        };
      },
    );
  }, []);

  return (
    <main className={`vr-app ${showMap ? "is-map" : "is-landing"}`}>
      <nav className="vr-top-nav" aria-label="主导航">
        <div className="vr-top-brand">Parallels · 经纬</div>
      </nav>

      <section className={`vr-screen vr-landing ${showMap ? "" : "is-active"}`}>
        <div className="vr-landing-content">
          <h1 className="vr-landing-title">
            <span>Parallels</span>
            <span>经纬</span>
          </h1>
          <p>
            打破书本边界，以时间为坐标轴，在同一历史时刻看见不同作品里的人物如何在各自的命运里行走。
          </p>
          <button
            type="button"
            className="vr-scroll-cue"
            onClick={() => setShowMap(true)}
          >
            向下探索
          </button>
        </div>
      </section>

      <section
        ref={mapSectionRef}
        id="map"
        className={`vr-screen vr-stage ${showMap ? "is-active" : ""}`}
      >
        <div ref={mapEl} className="vr-map" aria-label="文学事件地图" />

        <div className="vr-filter-stack">
          <section
            ref={filterPanelRef}
            className={`vr-panel vr-filter-panel ${filterOpen ? "" : "is-collapsed"}`}
          >
            <header className="vr-panel-header">
              <h1 className="vr-brand-title">Vertical Reading</h1>
              <button
                type="button"
                aria-label={filterOpen ? "收起筛选面板" : "展开筛选面板"}
                onClick={() => setFilterOpen((open) => !open)}
              >
                {filterOpen ? "‹" : "›"}
              </button>
            </header>
            {filterOpen && (
              <div className="vr-panel-body">
                {checkboxList("阶层", CLASS_OPTIONS, filters.classes, (value) =>
                  toggleFilter("classes", value),
                )}
                {checkboxList("性别", GENDER_OPTIONS, filters.genders, (value) =>
                  toggleFilter("genders", value),
                )}
                {checkboxList("时间类型", TIME_TYPE_OPTIONS, filters.timeTypes, (value) =>
                  toggleFilter("timeTypes", value),
                )}
                {checkboxList("地点类型", LOCATION_TYPE_OPTIONS, filters.locationTypes, (value) =>
                  toggleFilter("locationTypes", value),
                )}
                <fieldset className="vr-filter-group is-disabled">
                  <legend>事件类型</legend>
                  <label className="vr-check-row">
                    <input type="checkbox" disabled />
                    <span>即将上线</span>
                  </label>
                </fieldset>
              </div>
            )}
          </section>
        </div>

        {filterOpen && (
          <div className="vr-range-chip" style={{ top: `${rangeChipTop}px` }}>
            {selectedYears[0]}–{selectedYears[1]}　共 {filteredEvents.length} 个事件
          </div>
        )}

        {legendOpen ? (
          <section className="vr-panel vr-legend">
            <header className="vr-panel-header">
              <h2>图例</h2>
              <button
                type="button"
                aria-label="收起图例面板"
                onClick={() => setLegendOpen(false)}
              >
                <svg
                  className="vr-legend-toggle-icon is-collapse"
                  viewBox="0 0 1104 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M47.995063 739.437578L297.305722 547.464123a45.020324 45.020324 0 0 0 0-70.928246L47.995063 284.562422A30.155122 30.155122 0 0 0 0.001699 308.346744v407.306512a29.730402 29.730402 0 0 0 47.993364 23.784322zM63.709704 127.41601h976.856076a63.708005 63.708005 0 0 0 0-127.41601h-976.856076a63.708005 63.708005 0 0 0 0 127.41601zM1040.9905 448.504355H602.254706a63.708005 63.708005 0 0 0 0 127.41601h438.735794a63.708005 63.708005 0 0 0 0-127.41601zM1040.9905 896.58399H63.709704a63.708005 63.708005 0 0 0 0 127.41601h976.856076a63.708005 63.708005 0 1 0 0-127.41601z" fill="#F5EDD8" />
                </svg>
              </button>
            </header>
            <div className="vr-legend-list">
              {CLASS_OPTIONS.map((option) => (
                <div key={option} className="vr-legend-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="vr-legend-icon" src={classIconSrc(option)} alt="" />
                  <span>{option}</span>
                </div>
              ))}
              <div className="vr-legend-row vr-legend-fictional">
                <span className="vr-legend-fictional-dot" />
                <span>虚构映射</span>
              </div>
            </div>
          </section>
        ) : (
          <button
            type="button"
            className="vr-legend-collapsed"
            aria-label="展开图例面板"
            onClick={() => setLegendOpen(true)}
          >
            <svg viewBox="0 0 1104 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M47.995063 739.437578L297.305722 547.464123a45.020324 45.020324 0 0 0 0-70.928246L47.995063 284.562422A30.155122 30.155122 0 0 0 0.001699 308.346744v407.306512a29.730402 29.730402 0 0 0 47.993364 23.784322zM63.709704 127.41601h976.856076a63.708005 63.708005 0 0 0 0-127.41601h-976.856076a63.708005 63.708005 0 0 0 0 127.41601zM1040.9905 448.504355H602.254706a63.708005 63.708005 0 0 0 0 127.41601h438.735794a63.708005 63.708005 0 0 0 0-127.41601zM1040.9905 896.58399H63.709704a63.708005 63.708005 0 0 0 0 127.41601h976.856076a63.708005 63.708005 0 1 0 0-127.41601z" fill="#F5EDD8" />
            </svg>
          </button>
        )}

        <section className="vr-timeline vr-timeline-bar" aria-label="年份范围筛选">
          <div ref={sliderEl} className="vr-slider" />
          <div className="vr-ticks">
            {ticks.map((tick) => (
              <span
                key={tick.year}
                className={`vr-tick ${tick.isMajor ? "is-major" : ""}`}
                data-year={tick.isMajor ? tick.year : undefined}
                style={{ left: `${tick.position}%` }}
              />
            ))}
          </div>
        </section>

        {(isLoading || loadError) && (
          <div className="vr-status">
            {isLoading ? "正在读取文学时空数据..." : loadError}
          </div>
        )}
      </section>
    </main>
  );
}
