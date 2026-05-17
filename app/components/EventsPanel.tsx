"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { worldEvents } from "../world-events";
import type { LiteraryEvent } from "../types";
import type { WorldEvent } from "../world-events";

type EventsPanelProps = {
  visible: LiteraryEvent[];
  years: [number, number];
  selectedEventId: string | null;
  allBooks: string[];
  selectedBooks: Set<string>;
  visibleBookCount: number;
  onPick: (event: LiteraryEvent) => void;
  onBooksChange: (books: Set<string>) => void;
};

const regionLabels: Record<WorldEvent["region"], string> = {
  Europe: "欧洲",
  Asia: "亚洲",
  Americas: "美洲",
  Africa: "非洲",
};

export function EventsPanel({
  visible,
  years,
  selectedEventId,
  allBooks,
  selectedBooks,
  visibleBookCount,
  onPick,
  onBooksChange,
}: EventsPanelProps) {
  const [tab, setTab] = useState<"novels" | "world">("novels");
  const [bookPickerOpen, setBookPickerOpen] = useState(false);
  const [bookQuery, setBookQuery] = useState("");
  const [draftBooks, setDraftBooks] = useState<Set<string>>(() => new Set(selectedBooks));
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [startYear, endYear] = years;
  const sorted = useMemo(
    () =>
      visible
        .filter((event) => selectedBooks.has(event.book))
        .sort((a, b) => (a.year ?? 0) - (b.year ?? 0)),
    [selectedBooks, visible],
  );
  const filteredBooks = useMemo(() => {
    const needle = bookQuery.trim().toLowerCase();
    if (!needle) return allBooks;
    return allBooks.filter((book) => book.toLowerCase().includes(needle));
  }, [allBooks, bookQuery]);
  const worldRows = useMemo(
    () =>
      worldEvents
        .filter((event) => event.year >= startYear && event.year <= endYear)
        .sort((a, b) => a.year - b.year),
    [startYear, endYear],
  );
  const allDraftSelected = allBooks.length > 0 && draftBooks.size === allBooks.length;

  useEffect(() => {
    if (!bookPickerOpen) return;
    searchRef.current?.focus();
  }, [bookPickerOpen]);

  function toggleDraftBook(book: string) {
    setDraftBooks((current) => {
      const next = new Set(current);
      if (next.has(book)) {
        next.delete(book);
      } else {
        next.add(book);
      }
      return next;
    });
  }

  function openBookPicker() {
    setDraftBooks(new Set(selectedBooks));
    setBookPickerOpen((open) => !open);
  }

  function switchTab(nextTab: "novels" | "world") {
    setTab(nextTab);
    if (nextTab !== "novels") setBookPickerOpen(false);
  }

  function toggleAllBooks() {
    setDraftBooks((current) => (current.size === allBooks.length ? new Set() : new Set(allBooks)));
  }

  function confirmBooks() {
    onBooksChange(new Set(draftBooks));
    setBookPickerOpen(false);
  }

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
          onClick={() => switchTab("novels")}
        >
          <span>书中人物</span>
          <em>Novels</em>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "world"}
          className={`vr-events-tab ${tab === "world" ? "is-on" : ""}`}
          onClick={() => switchTab("world")}
        >
          <span>真实世界</span>
          <em>History</em>
        </button>
      </nav>
      {tab === "novels" && (
        <div className="vr-bookfilter">
          <button
            type="button"
            className="vr-bookbar"
            aria-haspopup="dialog"
            aria-expanded={bookPickerOpen}
            onClick={openBookPicker}
          >
            <span className="vr-bookbar-lead">
              我想探索
              <em>To Explore</em>
            </span>
            <span className="vr-bookbar-trigger">
              <span className="vr-bookbar-count-zh">
                <strong>{visibleBookCount}</strong>
                个文学世界
                <span className="vr-bookbar-caret" aria-hidden="true">
                  ▾
                </span>
              </span>
              <span className="vr-bookbar-count-en">Literary Worlds</span>
            </span>
          </button>
          <div className={`vr-bookpop ${bookPickerOpen ? "is-open" : ""}`} role="dialog" aria-label="选择书目">
            <div className="vr-bookpop-head">
              <label className="vr-bookpop-search">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <circle cx="6" cy="6" r="4.2" />
                  <path d="M9.2 9.2 L12 12" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={bookQuery}
                  placeholder="检索书名 · Search by title"
                  onChange={(event) => setBookQuery(event.target.value)}
                />
              </label>
              <button
                type="button"
                className="vr-bookpop-toggle"
                aria-label={allDraftSelected ? "全不选" : "全选"}
                title={allDraftSelected ? "全不选 · Clear all" : "全选 · Select all"}
                onClick={toggleAllBooks}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={allDraftSelected ? "1.1" : "1.3"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
                  {!allDraftSelected && <polyline points="4.8,8.2 7.2,10.4 11.4,5.4" />}
                </svg>
              </button>
            </div>
            <div className="vr-bookpop-status">
              <span className="vr-bookpop-status-count">
                已选<strong>{draftBooks.size}</strong>/<span>{allBooks.length}</span>本
              </span>
              <span>
                <em>Library Catalog</em>
              </span>
            </div>
            <div className="vr-bookpop-list">
              {filteredBooks.map((book) => (
                <label key={book} className="vr-bookpop-item">
                  <input
                    type="checkbox"
                    checked={draftBooks.has(book)}
                    onChange={() => toggleDraftBook(book)}
                  />
                  <span className="vr-bookpop-box" />
                  <span className="vr-bookpop-text">
                    <span className="vr-bookpop-title">《{book}》</span>
                  </span>
                </label>
              ))}
              {filteredBooks.length === 0 && <div className="vr-bookpop-empty">未找到匹配书目 · No match</div>}
            </div>
            <div className="vr-bookpop-foot">
              <button type="button" className="vr-bookpop-confirm" onClick={confirmBooks}>
                完成 Done
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="vr-events-body">
        {tab === "novels" ? (
          <>
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
          </>
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
