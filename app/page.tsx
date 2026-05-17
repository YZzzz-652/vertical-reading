"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BOOKS } from "./books";
import { EventPopup } from "./components/EventPopup";
import { Landing } from "./components/Landing";
import { MapStage } from "./components/MapStage";
import { TopNav } from "./components/TopNav";
import {
  TIMELINE_END,
  TIMELINE_START,
  makeFilterState,
  type FilterState,
  type LiteraryEvent,
  type MapVersion,
} from "./types";

const POPUP_EXIT_MS = 250;

export default function Home() {
  const [mapState, setMapState] = useState(false);
  const [events, setEvents] = useState<LiteraryEvent[]>([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [popupClosing, setPopupClosing] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);
  const [mapVer, setMapVer] = useState<MapVersion>("modern");
  const [years, setYears] = useState<[number, number]>([TIMELINE_START, TIMELINE_END]);
  const [filters, setFilters] = useState<FilterState>(() => makeFilterState());
  const popupCloseTimerRef = useRef<number | null>(null);
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId],
  );
  const landingStats = useMemo(() => {
    const novels = new Set(events.map((event) => event.book).filter(Boolean)).size;
    const regions = new Set(events.map((event) => event.region).filter(Boolean)).size;
    const eventYears = events
      .map((event) => event.year)
      .filter((year): year is number => Number.isFinite(year));
    const minYear = eventYears.length > 0 ? Math.min(...eventYears) : null;
    const maxYear = eventYears.length > 0 ? Math.max(...eventYears) : null;

    return {
      novels: novels || null,
      regions: regions || null,
      yearRange: minYear !== null && maxYear !== null ? `${minYear} - ${maxYear}` : null,
    };
  }, [events]);
  const selectEvent = useCallback((event: LiteraryEvent) => {
    if (popupCloseTimerRef.current) {
      window.clearTimeout(popupCloseTimerRef.current);
      popupCloseTimerRef.current = null;
    }
    setPopupClosing(false);
    setSelectedEventId(event.id);
  }, []);
  const closeSelectedEvent = useCallback(() => {
    if (!selectedEventId) return;

    if (popupCloseTimerRef.current) {
      window.clearTimeout(popupCloseTimerRef.current);
    }

    setPopupClosing(true);
    popupCloseTimerRef.current = window.setTimeout(() => {
      setSelectedEventId(null);
      setPopupClosing(false);
      popupCloseTimerRef.current = null;
    }, POPUP_EXIT_MS);
  }, [selectedEventId]);
  const goHome = useCallback(() => {
    closeSelectedEvent();
    setMapState(false);
  }, [closeSelectedEvent]);

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
            (event) => Number.isFinite(event.lat) && Number.isFinite(event.lng) && Number.isFinite(event.year),
          );
          setEvents(usableEvents);
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
    return () => {
      if (popupCloseTimerRef.current) {
        window.clearTimeout(popupCloseTimerRef.current);
      }
    };
  }, []);

  const toggleFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters((current) => {
      const next = new Set(current[key]);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return { ...current, [key]: next };
    });
  }, []);

  return (
    <main className={`vr-app ${mapState ? "is-map" : "is-landing"} ${filterOpen ? "is-atlas-open" : "is-atlas-collapsed"}`}>
      <TopNav mapState={mapState} onHome={goHome} />
      <Landing active={!mapState} books={BOOKS} stats={landingStats} onEnter={() => setMapState(true)} />
      <MapStage
        active={mapState}
        events={events}
        loadError={loadError}
        isLoading={isLoading}
        selectedEventId={selectedEventId}
        onSelectEvent={selectEvent}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        filters={filters}
        toggleFilter={toggleFilter}
        years={years}
        setYears={setYears}
        mapVer={mapVer}
        setMapVer={setMapVer}
      />
      <EventPopup event={selectedEvent} atlasOpen={filterOpen} isClosing={popupClosing} onClose={closeSelectedEvent} />
    </main>
  );
}
