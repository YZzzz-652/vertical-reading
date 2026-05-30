"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EventsPanel } from "./EventsPanel";
import { FilterPanel } from "./FilterPanel";
import { Timeline } from "./Timeline";
import { historicalMapById } from "../historical-maps";
import { classIconSrc, type FilterState, type LiteraryEvent, type MapVersion } from "../types";

type LatLng = [number, number];
type LeafletMarker = {
  addTo: (map: LeafletMap) => LeafletMarker;
  on: (event: string, callback: () => void) => LeafletMarker;
  remove: () => void;
};
type LeafletLayer = {
  addTo: (map: LeafletMap) => LeafletLayer;
  remove: () => void;
};
type LeafletMap = {
  remove: () => void;
  invalidateSize: () => void;
  flyTo: (latlng: LatLng, zoom: number, options: Record<string, unknown>) => void;
  getZoom: () => number;
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
  ) => LeafletLayer;
};

declare global {
  interface Window {
    L?: LeafletModule;
  }
}

const LEAFLET_ASSETS = [
  {
    id: "leaflet-css",
    type: "style",
    href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  },
  {
    id: "leaflet-js",
    type: "script",
    src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  },
] as const;

type GeoRegion = "cn" | "global";

type TileLayerSource = {
  url: string;
  options: Record<string, unknown>;
};

const TIANDITU_TK = process.env.NEXT_PUBLIC_TIANDITU_TK;

const MODERN_TILE_SOURCES: Record<
  GeoRegion,
  {
    layers: TileLayerSource[];
  }
> = {
  cn: {
    layers: TIANDITU_TK
      ? [
          {
            url: `https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_TK}`,
            options: {
              attribution: '&copy; <a href="https://www.tianditu.gov.cn/">天地图</a>',
              subdomains: "01234567",
              maxNativeZoom: 18,
              maxZoom: 20,
              zIndex: 100,
            },
          },
          {
            url: `https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_TK}`,
            options: {
              attribution: '&copy; <a href="https://www.tianditu.gov.cn/">天地图</a>',
              subdomains: "01234567",
              maxNativeZoom: 18,
              maxZoom: 20,
              zIndex: 110,
            },
          },
        ]
      : [],
  },
  global: {
    layers: [
      {
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        options: {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        },
      },
    ],
  },
};

function loadAsset(asset: (typeof LEAFLET_ASSETS)[number]) {
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

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function markerHtml(event: LiteraryEvent) {
  const isFictional = event.timeType === "虚构映射" || event.locationType === "虚构映射";
  return `
    <img
      class="vr-leaflet-marker ${isFictional ? "is-fictional" : ""}"
      src="${classIconSrc(event.class)}"
      alt="${escapeHtml(event.class || "阶层图标")}"
      title="${escapeHtml(event.character)}"
    />
  `;
}

function removeLayers(layers: LeafletLayer[]) {
  layers.forEach((layer) => layer.remove());
}

type MapStageProps = {
  active: boolean;
  events: LiteraryEvent[];
  loadError: string;
  isLoading: boolean;
  selectedEventId: string | null;
  onSelectEvent: (event: LiteraryEvent) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filters: FilterState;
  toggleFilter: (key: keyof FilterState, value: string) => void;
  years: [number, number];
  setYears: (years: [number, number] | ((current: [number, number]) => [number, number])) => void;
  mapVer: MapVersion;
  setMapVer: (value: MapVersion) => void;
};

export function MapStage({
  active,
  events,
  loadError,
  isLoading,
  selectedEventId,
  onSelectEvent,
  filterOpen,
  setFilterOpen,
  filters,
  toggleFilter,
  years,
  setYears,
  mapVer,
  setMapVer,
}: MapStageProps) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const modernLayersRef = useRef<LeafletLayer[]>([]);
  const historicalLayersRef = useRef<LeafletLayer[]>([]);
  const historicalRequestRef = useRef(0);
  const [leaflet, setLeaflet] = useState<LeafletModule | null>(null);
  const [geoRegion, setGeoRegion] = useState<GeoRegion>("global");
  const [query, setQuery] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(() => new Set());
  const [assetError, setAssetError] = useState("");
  const bookFilterInitializedRef = useRef(false);
  const timelineInitializedRef = useRef(false);

  const allBooks = useMemo(() => {
    const books = new Set<string>();
    events.forEach((event) => {
      if (event.book) books.add(event.book);
    });
    return [...books];
  }, [events]);

  const timelineBounds = useMemo<[number, number]>(() => {
    const eventYears = events
      .map((event) => event.year)
      .filter((year): year is number => Number.isFinite(year));
    if (eventYears.length === 0) return [1700, 1930];

    const minYear = Math.floor(Math.min(...eventYears) / 10) * 10;
    const maxYear = Math.ceil(Math.max(...eventYears) / 10) * 10;
    return minYear === maxYear ? [minYear - 5, maxYear + 5] : [minYear, maxYear];
  }, [events]);

  useEffect(() => {
    let cancelled = false;

    async function detectRegion() {
      try {
        const response = await fetch("/api/geo");
        const data = (await response.json()) as { region?: string };
        if (!cancelled && data.region === "cn") setGeoRegion("cn");
      } catch (error) {
        console.warn("Geo region detection failed", error);
      }
    }

    async function boot() {
      try {
        detectRegion();
        await loadAsset(LEAFLET_ASSETS[0]);
        await loadAsset(LEAFLET_ASSETS[1]);
        if (!cancelled && window.L) setLeaflet(window.L);
      } catch (error) {
        if (!cancelled) setAssetError(error instanceof Error ? error.message : "地图资源加载失败");
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!leaflet || !mapEl.current || mapRef.current) return;

    const map = leaflet.map(mapEl.current, {
      center: [49, 18],
      zoom: 4,
      zoomControl: false,
      worldCopyJump: true,
    });

    modernLayersRef.current = MODERN_TILE_SOURCES.global.layers.map((layer) =>
      leaflet.tileLayer(layer.url, layer.options).addTo(map),
    );

    leaflet.control.zoom({ position: "topright" }).addTo(map);
    mapRef.current = map;

    return () => {
      removeLayers(historicalLayersRef.current);
      historicalLayersRef.current = [];
      removeLayers(modernLayersRef.current);
      modernLayersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [leaflet]);

  useEffect(() => {
    if (!leaflet || !mapRef.current) return;

    const tileSource = MODERN_TILE_SOURCES[geoRegion];

    if (geoRegion === "cn" && !TIANDITU_TK) {
      return;
    }

    removeLayers(modernLayersRef.current);
    modernLayersRef.current = tileSource.layers.map((layer) =>
      leaflet.tileLayer(layer.url, layer.options).addTo(mapRef.current!),
    );
  }, [geoRegion, leaflet]);

  useEffect(() => {
    if (!leaflet || !mapRef.current) return;

    const targetMap = historicalMapById(mapVer);
    const requestId = historicalRequestRef.current + 1;
    historicalRequestRef.current = requestId;

    if (targetMap.id === "modern") {
      removeLayers(historicalLayersRef.current);
      historicalLayersRef.current = [];
      return;
    }

    const leafletApi = leaflet;
    const selectedMap = targetMap;
    let cancelled = false;

    async function loadHistoricalMap() {
      try {
        if (cancelled || historicalRequestRef.current !== requestId || !mapRef.current) return;

        const nextLayers = selectedMap.layers.map((layer) =>
          leafletApi
            .tileLayer(layer.tileUrl, {
              opacity: 0.85,
              minZoom: layer.minzoom,
              maxZoom: 20,
              maxNativeZoom: layer.maxzoom,
              zIndex: 240,
            })
            .addTo(mapRef.current!),
        );

        removeLayers(historicalLayersRef.current);
        historicalLayersRef.current = nextLayers;
      } catch (error) {
        if (!cancelled && historicalRequestRef.current === requestId) {
          console.warn("Historical map layer failed to load", error);
        }
      }
    }

    loadHistoricalMap();
    return () => {
      cancelled = true;
    };
  }, [leaflet, mapVer]);

  useEffect(() => {
    if (active && mapRef.current) {
      window.setTimeout(() => mapRef.current?.invalidateSize(), 320);
    }
  }, [active]);

  useEffect(() => {
    if (bookFilterInitializedRef.current || allBooks.length === 0) return;
    setSelectedBooks(new Set(allBooks));
    bookFilterInitializedRef.current = true;
  }, [allBooks]);

  useEffect(() => {
    if (timelineInitializedRef.current || events.length === 0) return;
    setYears(timelineBounds);
    timelineInitializedRef.current = true;
  }, [events.length, setYears, timelineBounds]);

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          filters.classes.has(event.class) &&
          filters.genders.has(event.gender) &&
          filters.timeTypes.has(event.timeType) &&
          filters.locationTypes.has(event.locationType) &&
          (filters.eventTypes.size === 0 || event.eventTypes.some((type) => filters.eventTypes.has(type))) &&
          selectedBooks.has(event.book),
      ),
    [events, filters, selectedBooks],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return filteredEvents.filter((event) => {
      const year = event.year ?? 0;
      const text = `${event.book} ${event.author} ${event.character} ${event.event} ${event.locationName}`.toLowerCase();
      return (
        year >= years[0] &&
        year <= years[1] &&
        (!needle || text.includes(needle))
      );
    });
  }, [filteredEvents, query, years]);

  const visibleBookCount = useMemo(
    () => new Set(visible.map((event) => event.book).filter(Boolean)).size,
    [visible],
  );

  const timelineEventYears = useMemo(
    () =>
      filteredEvents
        .map((event) => event.year)
        .filter((year): year is number => Number.isFinite(year)),
    [filteredEvents],
  );

  const selectFromList = useCallback(
    (event: LiteraryEvent) => {
      onSelectEvent(event);
      if (!mapRef.current || !Number.isFinite(event.lat) || !Number.isFinite(event.lng)) return;

      mapRef.current.flyTo([event.lat!, event.lng!], mapRef.current.getZoom(), {
        duration: 1.2,
      });
    },
    [onSelectEvent],
  );

  useEffect(() => {
    if (!leaflet || !mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = visible
      .filter((event) => selectedBooks.has(event.book) && Number.isFinite(event.lat) && Number.isFinite(event.lng))
      .map((event) =>
        leaflet
          .marker([event.lat!, event.lng!], {
            icon: leaflet.divIcon({
              className: `vr-div-icon ${event.id === selectedEventId ? "marker-selected" : ""}`,
              html: markerHtml(event),
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            }),
            zIndexOffset: event.id === selectedEventId ? 10000 : 0,
          })
          .on("click", () => onSelectEvent(event))
          .addTo(mapRef.current!),
      );
  }, [leaflet, onSelectEvent, selectedBooks, selectedEventId, visible]);

  const tiandituConfigError =
    geoRegion === "cn" && !TIANDITU_TK ? "缺少 NEXT_PUBLIC_TIANDITU_TK，已停止加载墙内天地图底图。" : "";
  const status = isLoading ? "正在读取文学时空数据..." : loadError || assetError || tiandituConfigError;

  return (
    <section className={`vr-screen vr-stage map-${mapVer} ${active ? "is-active" : ""}`}>
      <div ref={mapEl} className="vr-map" aria-label="文学事件地图" />
      <div className="vr-map-scrim" aria-hidden="true" />

      <div className="vr-left-dock">
        <div className="vr-search">
          <input
            type="text"
            placeholder="搜索书目或人物"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <EventsPanel
          visible={visible}
          years={years}
          selectedEventId={selectedEventId}
          allBooks={allBooks}
          selectedBooks={selectedBooks}
          visibleBookCount={visibleBookCount}
          onPick={selectFromList}
          onBooksChange={setSelectedBooks}
        />
      </div>

      <div className={`vr-right-dock ${filterOpen ? "" : "is-collapsed"}`}>
        <FilterPanel
          filters={filters}
          toggle={toggleFilter}
          open={filterOpen}
          setOpen={setFilterOpen}
          mapVer={mapVer}
          setMapVer={setMapVer}
        />
      </div>

      <Timeline years={years} bounds={timelineBounds} eventYears={timelineEventYears} setYears={setYears} />

      {status && <div className="vr-status">{status}</div>}
    </section>
  );
}
