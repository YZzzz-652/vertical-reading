"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

type TileJsonResponse = {
  tiles?: string[];
};

function removeLayers(layers: LeafletLayer[]) {
  layers.forEach((layer) => layer.remove());
}

type MapStageProps = {
  active: boolean;
  events: LiteraryEvent[];
  loadError: string;
  isLoading: boolean;
  onMarkerClick: (event: LiteraryEvent) => void;
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
  onMarkerClick,
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
  const historicalLayersRef = useRef<LeafletLayer[]>([]);
  const historicalTileCacheRef = useRef<Map<string, string>>(new Map());
  const historicalRequestRef = useRef(0);
  const [leaflet, setLeaflet] = useState<LeafletModule | null>(null);
  const [query, setQuery] = useState("");
  const [assetError, setAssetError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
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
      removeLayers(historicalLayersRef.current);
      historicalLayersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [leaflet]);

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

    async function tileUrlFor(tileJsonUrl: string) {
      const cached = historicalTileCacheRef.current.get(tileJsonUrl);
      if (cached) return cached;

      const response = await fetch(tileJsonUrl, { cache: "force-cache" });
      if (!response.ok) throw new Error(`TileJSON ${response.status}`);

      const data = (await response.json()) as TileJsonResponse;
      const tileUrl = data.tiles?.[0];
      if (!tileUrl) throw new Error("TileJSON missing tiles[0]");

      historicalTileCacheRef.current.set(tileJsonUrl, tileUrl);
      return tileUrl;
    }

    async function loadHistoricalMap() {
      try {
        const tileUrls = await Promise.all(selectedMap.layers.map((tileJsonUrl) => tileUrlFor(tileJsonUrl)));
        if (cancelled || historicalRequestRef.current !== requestId || !mapRef.current) return;

        const nextLayers = tileUrls.map((tileUrl) =>
          leafletApi
            .tileLayer(tileUrl, {
              opacity: 0.85,
              maxZoom: 20,
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

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events.filter((event) => {
      const year = event.year ?? 0;
      const text = `${event.book} ${event.author} ${event.character} ${event.event} ${event.locationName}`.toLowerCase();
      return (
        filters.classes.has(event.class) &&
        filters.genders.has(event.gender) &&
        filters.timeTypes.has(event.timeType) &&
        filters.locationTypes.has(event.locationType) &&
        year >= years[0] &&
        year <= years[1] &&
        (!needle || text.includes(needle))
      );
    });
  }, [events, filters, query, years]);

  useEffect(() => {
    if (!leaflet || !mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = visible
      .filter((event) => Number.isFinite(event.lat) && Number.isFinite(event.lng))
      .map((event) =>
        leaflet
          .marker([event.lat!, event.lng!], {
            icon: leaflet.divIcon({
              className: "vr-div-icon",
              html: markerHtml(event),
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            }),
          })
          .on("click", () => onMarkerClick(event))
          .addTo(mapRef.current!),
      );
  }, [leaflet, onMarkerClick, visible]);

  const status = isLoading ? "正在读取文学时空数据..." : loadError || assetError;

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
        <EventsPanel visible={visible} years={years} onPick={onMarkerClick} />
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

      <Timeline years={years} setYears={setYears} />

      {status && <div className="vr-status">{status}</div>}
    </section>
  );
}
