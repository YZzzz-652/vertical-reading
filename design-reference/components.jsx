/* global React */
const { useState, useEffect, useRef } = React;

const CLASS_OPTIONS = ["贵族", "平民", "底层", "知识分子", "军人", "资产阶级", "宗教人士", "奴隶农奴"];
const GENDER_OPTIONS = ["男", "女"];
const TIME_TYPE_OPTIONS = ["历史锚定", "虚构映射", "创作年代"];
const LOCATION_TYPE_OPTIONS = ["真实", "虚构映射", "虚构无对应"];
const TL_START = 1700,TL_END = 1930;

function iconSrc(className) {
  const safe = CLASS_OPTIONS.includes(className) ? className : "平民";
  return "../../assets/icons/" + encodeURIComponent(safe) + ".png";
}

// ── Top Nav ────────────────────────────────────────────────
function TopNav({ mapState }) {
  return (
    <nav className={"vr-top-nav " + (mapState ? "is-map" : "is-landing")}>
      <div className="vr-top-brand">Parallels · 经纬</div>
    </nav>);

}

// ── Book cover (real first-edition image, typographic fallback) ──
function BookCover({ book }) {
  const [errored, setErrored] = React.useState(false);
  if (book.cover && !errored) {
    return (
      <article className="vr-cover vr-cover--img" title={book.title + " · " + book.author + ", " + book.year}>
        <img src={book.cover} alt={book.title + " (" + book.year + ")"} onError={() => setErrored(true)} />
        <div className="vr-cover-caption">
          <span className="vr-cover-caption-title">{book.title}</span>
          <span className="vr-cover-caption-meta">{book.author} · {book.year}</span>
        </div>
      </article>);

  }
  const cls = "vr-cover vr-cover--typographic vr-cover--" + book.style + " vr-cover--" + book.accent;
  return (
    <article className={cls}>
      <div className="vr-cover-region">{book.region}</div>
      <div className="vr-cover-rule" />
      <h3 className="vr-cover-title">{book.title}</h3>
      <div className="vr-cover-zh">{book.zh}</div>
      <div className="vr-cover-foot">
        <span className="vr-cover-author">{book.author}</span>
        <span className="vr-cover-year">{book.year}</span>
      </div>
    </article>);

}

// ── Landing (Gallica-style library wall) ───────────────────
function Landing({ onEnter, active }) {
  const books = window.PARALLELS_BOOKS || [];
  return (
    <section className={"vr-screen vr-landing " + (active ? "is-active" : "")}>
      <div className="vr-landing-grid">
        <div className="vr-landing-hero">
          <div className="vr-landing-eyebrow">EST. 2026 · A LITERARY ATLAS</div>
          <h1 className="vr-landing-title">
            <span>Parallels</span>
            <span>经纬</span>
          </h1>
          <p className="vr-landing-tag">打破书本边界，以时间为坐标轴，<br />在同一历史时刻看见不同作品里的人物<br />如何在各自的命运里行走。</p>
          <p className="vr-landing-tag-en"><em>An atlas that lays the world's literature upon historical maps — so a single year reveals a continent of parallel lives.</em></p>
          <button type="button" className="vr-landing-cta" onClick={onEnter}>
            <span>向下探索</span>
            <span className="vr-landing-cta-en">Enter the Atlas ↓</span>
          </button>
          <div className="vr-landing-stats">
            <div><strong>{books.length}</strong><span>Works</span></div>
            <div><strong>7</strong><span>Regions</span></div>
            <div><strong>1010–1936</strong><span>Years</span></div>
          </div>
        </div>
        <div className="vr-landing-wall">
          {books.map((b, i) => <BookCover key={i} book={b} />)}
        </div>
      </div>
    </section>);

}

// ── Search ─────────────────────────────────────────────────
function SearchBox() {
  return (
    <div className="vr-search">
      <input type="text" placeholder="搜索书目或人物" />
    </div>);

}

// ── Checkbox group helper ──────────────────────────────────
function CheckGroup({ title, options, selected, onToggle }) {
  return (
    <fieldset className="vr-filter-group">
      <legend>{title}</legend>
      <div className="vr-check-grid">
        {options.map((opt) =>
        <label key={opt} className="vr-check-row">
            <input type="checkbox" checked={selected.has(opt)} onChange={() => onToggle(opt)} />
            <span>{opt}</span>
          </label>
        )}
      </div>
    </fieldset>);

}

// ── Filter Panel ───────────────────────────────────────────
function FilterPanel({ filters, toggle, open, setOpen }) {
  return (
    <section className={"vr-panel vr-filter-panel " + (open ? "" : "is-collapsed")}>
      <header className="vr-panel-header">
        <h1 className="vr-brand-title">Vertical Reading</h1>
        <button type="button" aria-label={open ? "收起筛选面板" : "展开筛选面板"} onClick={() => setOpen(!open)}>
          {open ? "‹" : "›"}
        </button>
      </header>
      {open &&
      <div className="vr-panel-body">
          <CheckGroup title="阶层" options={CLASS_OPTIONS} selected={filters.classes} onToggle={(v) => toggle("classes", v)} />
          <CheckGroup title="性别" options={GENDER_OPTIONS} selected={filters.genders} onToggle={(v) => toggle("genders", v)} />
          <CheckGroup title="时间类型" options={TIME_TYPE_OPTIONS} selected={filters.timeTypes} onToggle={(v) => toggle("timeTypes", v)} />
          <CheckGroup title="地点类型" options={LOCATION_TYPE_OPTIONS} selected={filters.locationTypes} onToggle={(v) => toggle("locationTypes", v)} />
        </div>
      }
    </section>);

}

// ── Legend ─────────────────────────────────────────────────
function Legend({ open, setOpen }) {
  const Chevron = () =>
  <svg viewBox="0 0 1104 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: 14, height: 14, display: "block", transform: open ? "scaleX(-1)" : "scaleX(1)" }}>
      <path d="M47 739L297 547a45 45 0 0 0 0-71L47 285a30 30 0 0 0-47 23v407a30 30 0 0 0 47 24zM63 127h977a64 64 0 0 0 0-127H63a64 64 0 0 0 0 127zM1040 448H602a64 64 0 0 0 0 128h438a64 64 0 0 0 0-128zM1040 896H63a64 64 0 0 0 0 128h977a64 64 0 1 0 0-128z" fill="#F5EDD8" />
    </svg>;

  if (!open) {
    return (
      <button type="button" className="vr-legend-collapsed" aria-label="展开图例" onClick={() => setOpen(true)}>
        <Chevron />
      </button>);

  }
  return (
    <section className="vr-panel vr-legend">
      <header className="vr-panel-header">
        <h2>图例</h2>
        <button type="button" aria-label="收起图例" onClick={() => setOpen(false)}><Chevron /></button>
      </header>
      <div className="vr-legend-list" style={{ padding: "8px 10px 10px" }}>
        {CLASS_OPTIONS.map((opt) =>
        <div key={opt} className="vr-legend-row">
            <img className="vr-legend-icon" src={iconSrc(opt)} alt="" />
            <span>{opt}</span>
          </div>
        )}
        <div className="vr-legend-row vr-legend-fictional">
          <span className="vr-legend-fictional-dot" />
          <span>虚构映射</span>
        </div>
      </div>
    </section>);

}

// ── Range chip below filter ────────────────────────────────
function RangeChip({ years, count }) {
  return (
    <div className="vr-range-chip">
      {years[0]}–{years[1]}　共 {count} 个事件
    </div>);

}

// ── Timeline (display-only double-handle) ──────────────────
function Timeline({ years, setYears }) {
  const ticks = [];
  for (let y = TL_START; y <= TL_END; y += 10) {
    ticks.push({ year: y, major: (y - TL_START) % 50 === 0, pos: (y - TL_START) / (TL_END - TL_START) * 100 });
  }
  const trackRef = useRef(null);
  const dragging = useRef(null);
  function pctFromEvent(e) {
    const r = trackRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    return Math.max(0, Math.min(100, x / r.width * 100));
  }
  function pctToYear(p) {return Math.round(TL_START + p / 100 * (TL_END - TL_START));}
  function onDown(which) {return (e) => {
      dragging.current = which;
      const move = (ev) => {
        if (!dragging.current) return;
        const yr = pctToYear(pctFromEvent(ev));
        setYears((curr) => {
          if (which === 0) return [Math.min(yr, curr[1] - 5), curr[1]];
          return [curr[0], Math.max(yr, curr[0] + 5)];
        });
      };
      const up = () => {dragging.current = null;window.removeEventListener("pointermove", move);window.removeEventListener("pointerup", up);};
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };}
  const aPct = (years[0] - TL_START) / (TL_END - TL_START) * 100;
  const bPct = (years[1] - TL_START) / (TL_END - TL_START) * 100;
  return (
    <section className="vr-timeline">
      <div className="vr-slider" ref={trackRef}>
        <div className="vr-track" />
        <div className="vr-fill" style={{ left: aPct + "%", right: 100 - bPct + "%" }} />
        <div className="vr-handle" style={{ left: `calc(${aPct}% - 7px)` }} onPointerDown={onDown(0)} />
        <div className="vr-handle" style={{ left: `calc(${bPct}% - 7px)` }} onPointerDown={onDown(1)} />
      </div>
      <div className="vr-ticks">
        {ticks.map((t) =>
        <span key={t.year} className={"vr-tick " + (t.major ? "is-major" : "")} data-year={t.major ? t.year : undefined} style={{ left: t.pos + "%" }} />
        )}
      </div>
    </section>);

}

// ── Event popup ────────────────────────────────────────────
function EventPopup({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="vr-popup-overlay" onClick={onClose}>
      <article className="vr-popup-card" onClick={(e) => e.stopPropagation()}>
        <header>
          <div className="vr-popup-title-row">
            <h2>{event.character}</h2>
            <span className="vr-popup-chip">{event.class}</span>
            <span className="vr-popup-chip">{event.gender}</span>
            {event.tags && <span className="vr-popup-chip">{event.tags}</span>}
          </div>
          <p><em>{event.book} · {event.author}</em></p>
        </header>
        <div className="vr-popup-rule" />
        <p className="vr-popup-event">{event.event}</p>
        <p className="vr-popup-meta">地点：{event.locationName} · {event.locationType}　时间：{event.timeType}</p>
        <div className="vr-popup-rule" />
        <details className="vr-popup-quote" open>
          <summary>原文摘录</summary>
          <p>{event.quote}</p>
        </details>
      </article>
    </div>);

}

// ── Marker (positioned by lat/lng using a fake projection) ─
function Marker({ event, onClick }) {
  const isFic = event.timeType === "虚构映射" || event.locationType === "虚构映射";
  // Equirectangular projection within the stage. lng [-130,150] → [4%,96%], lat [70,-10] → [6%,94%]
  const left = 4 + (event.lng + 130) / 280 * 92;
  const top = 6 + (70 - event.lat) / 80 * 88;
  return (
    <button className={"vr-marker-btn " + (isFic ? "is-fictional" : "")}
    style={{ left: left + "%", top: top + "%" }}
    onClick={() => onClick(event)}>
      <img src={iconSrc(event.class)} alt={event.class} />
    </button>);

}

// ── Map stage (with fake antique tile background) ──────────
function MapStage({ active, events, onMarkerClick, filterOpen, setFilterOpen, legendOpen, setLegendOpen, filters, toggleFilter, years, setYears }) {
  const visible = events.filter((e) =>
  filters.classes.has(e.class) &&
  filters.genders.has(e.gender) &&
  filters.timeTypes.has(e.timeType) &&
  filters.locationTypes.has(e.locationType) &&
  e.year >= years[0] && e.year <= years[1]
  );
  return (
    <section className={"vr-screen vr-stage " + (active ? "is-active" : "")}>
      <div className="vr-map" />
      <div className="vr-filter-stack">
        <SearchBox />
        <FilterPanel filters={filters} toggle={toggleFilter} open={filterOpen} setOpen={setFilterOpen} />
      </div>
      {filterOpen && <RangeChip years={years} count={visible.length} />}
      <Legend open={legendOpen} setOpen={setLegendOpen} />
      <Timeline years={years} setYears={setYears} />
      <div className="vr-markers">
        {visible.map((e) => <Marker key={e.id} event={e} onClick={onMarkerClick} />)}
      </div>
    </section>);

}

Object.assign(window, {
  TopNav, Landing, MapStage, FilterPanel, Legend, Timeline, EventPopup, SearchBox, Marker, BookCover,
  CLASS_OPTIONS, GENDER_OPTIONS, TIME_TYPE_OPTIONS, LOCATION_TYPE_OPTIONS, TL_START, TL_END
});