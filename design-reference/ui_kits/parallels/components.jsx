/* global React */
const { useState, useEffect, useRef } = React;

const CLASS_OPTIONS = ["贵族","平民","底层","知识分子","军人","资产阶级","宗教人士","奴隶农奴"];
const GENDER_OPTIONS = ["男","女"];
const TIME_TYPE_OPTIONS = ["历史锚定","虚构映射","创作年代"];
const LOCATION_TYPE_OPTIONS = ["真实","虚构映射","虚构无对应"];
const TL_START = 1700, TL_END = 1930;
const MAP_VERSIONS = [
  { id: "17th",   label: "17世纪", caption: "1601 – 1700" },
  { id: "18th",   label: "18世纪", caption: "1701 – 1800" },
  { id: "19th",   label: "19世纪", caption: "1801 – 1900" },
  { id: "modern", label: "现代",   caption: "Today" },
];

// Sample real-world events for the "Meanwhile in History" rail.
const WORLD_EVENTS = [
  { year: 1789, label: "法国大革命爆发" },
  { year: 1804, label: "拿破仑加冕为法兰西皇帝" },
  { year: 1812, label: "拿破仑征俄失败" },
  { year: 1830, label: "法国七月革命" },
  { year: 1848, label: "欧洲革命之年；《共产党宣言》出版" },
  { year: 1859, label: "达尔文《物种起源》出版" },
  { year: 1861, label: "美国南北战争爆发；俄国废除农奴制" },
  { year: 1865, label: "南北战争结束，林肯遇刺" },
  { year: 1869, label: "苏伊士运河通航" },
  { year: 1870, label: "普法战争爆发" },
  { year: 1871, label: "巴黎公社；德意志帝国成立" },
  { year: 1876, label: "贝尔发明电话" },
  { year: 1898, label: "美西战争" },
  { year: 1905, label: "俄国革命" },
  { year: 1914, label: "第一次世界大战爆发" },
];

function iconSrc(className){
  const safe = CLASS_OPTIONS.includes(className) ? className : "平民";
  return "../../assets/icons/" + encodeURIComponent(safe) + ".png";
}

// ── Top Nav ────────────────────────────────────────────────
function TopNav({ mapState }){
  return (
    <nav className={"vr-top-nav " + (mapState ? "is-map" : "is-landing")}>
      <div className="vr-top-brand">Parallels · 经纬</div>
    </nav>
  );
}

// ── Book cover ─────────────────────────────────────────────
function BookCover({ book }){
  const [errored, setErrored] = useState(false);
  if (book.cover && !errored){
    return (
      <article className="vr-cover vr-cover--img" title={book.title + " · " + book.author + ", " + book.year}>
        <img src={book.cover} alt={book.title + " (" + book.year + ")"} onError={() => setErrored(true)} />
        <div className="vr-cover-caption">
          <span className="vr-cover-caption-title">{book.title}</span>
          <span className="vr-cover-caption-meta">{book.author} · {book.year}</span>
        </div>
      </article>
    );
  }
  return (
    <article className="vr-cover vr-cover--typographic vr-cover--paper">
      <div className="vr-cover-region">{book.region}</div>
      <div className="vr-cover-rule" />
      <h3 className="vr-cover-title">{book.title}</h3>
      <div className="vr-cover-zh">{book.zh}</div>
      <div className="vr-cover-foot">
        <span className="vr-cover-author">{book.author}</span>
        <span className="vr-cover-year">{book.year}</span>
      </div>
    </article>
  );
}

// ── Landing ────────────────────────────────────────────────
function Landing({ onEnter, active }){
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
          <p className="vr-landing-tag">打破书本边界，以时间为坐标轴，<br/>在同一历史时刻看见不同作品里的人物<br/>如何在各自的命运里行走。</p>
          <p className="vr-landing-tag-en"><em>An atlas that lays the world's literature upon historical maps — so a single year reveals a continent of parallel lives.</em></p>
          <button type="button" className="vr-landing-cta" onClick={onEnter}>
            <span>向下探索</span>
            <span className="vr-landing-cta-en">Enter the Atlas ↓</span>
          </button>
          <div className="vr-landing-stats">
            <div><strong>{books.length}</strong><span>Featured</span></div>
            <div><strong>7</strong><span>Regions</span></div>
            <div><strong>1010–1936</strong><span>Years</span></div>
          </div>
        </div>
        <div className="vr-landing-wall">
          {books.map((b, i) => <BookCover key={i} book={b} />)}
        </div>
      </div>
    </section>
  );
}

// ── Search ─────────────────────────────────────────────────
function SearchBox(){
  return (
    <div className="vr-search">
      <input type="text" placeholder="搜索书目或人物" />
    </div>
  );
}

// ── Class filter (avatars; color when on, desaturated when off) ──
function ClassFilter({ selected, onToggle }){
  return (
    <fieldset className="vr-filter-group">
      <legend>阶层 <em>Class</em></legend>
      <div className="vr-avatar-grid">
        {CLASS_OPTIONS.map(opt => {
          const on = selected.has(opt);
          return (
            <button key={opt} type="button" title={opt}
                    className={"vr-avatar-chip " + (on ? "is-on" : "is-off")}
                    onClick={() => onToggle(opt)}>
              <img src={iconSrc(opt)} alt="" />
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// ── Gender filter (oil-painting portrait crops) ───────────────
const GENDER_PORTRAIT = {
  "男": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Jean_Auguste_Dominique_Ingres%2C_Louis-Fran%C3%A7ois_Bertin%2C_1832.jpg/300px-Jean_Auguste_Dominique_Ingres%2C_Louis-Fran%C3%A7ois_Bertin%2C_1832.jpg",
  "女": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Madame_Moitessier_Ingres.jpg/300px-Madame_Moitessier_Ingres.jpg",
};
function GenderFilter({ selected, onToggle }){
  return (
    <fieldset className="vr-filter-group">
      <legend>性别 <em>Gender</em></legend>
      <div className="vr-avatar-grid vr-avatar-grid--2">
        {GENDER_OPTIONS.map(opt => {
          const on = selected.has(opt);
          return (
            <button key={opt} type="button" title={opt}
                    className={"vr-avatar-chip " + (on ? "is-on" : "is-off")}
                    onClick={() => onToggle(opt)}>
              <img className="vr-gender-portrait" src={GENDER_PORTRAIT[opt]} alt="" />
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// ── Time-type filter (clock-glyph pills) ───────────────────
function TimeTypeFilter({ selected, onToggle }){
  return (
    <fieldset className="vr-filter-group">
      <legend>时间类型 <em>Time</em></legend>
      <div className="vr-pill-stack vr-pill-stack--row" data-comment-anchor="time-type-options">
        {TIME_TYPE_OPTIONS.map(opt => {
          const on = selected.has(opt);
          const fictional = opt === "虚构映射";
          return (
            <button key={opt} type="button"
                    className={"vr-meta-pill vr-time-pill " + (on ? "is-on" : "is-off") + (fictional ? " is-fictional" : "")}
                    onClick={() => onToggle(opt)}>
              <svg className="vr-meta-glyph" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" strokeWidth="1.5" stroke="currentColor"
                        strokeDasharray={fictional ? "3 3" : "0"} />
                <path d="M12 7v5l3 2" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" />
              </svg>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// ── Location-type filter (pin-glyph pills, distinct from time) ─
function LocationTypeFilter({ selected, onToggle }){
  return (
    <fieldset className="vr-filter-group">
      <legend>地点类型 <em>Place</em></legend>
      <div className="vr-pill-stack vr-pill-stack--row">
        {LOCATION_TYPE_OPTIONS.map(opt => {
          const on = selected.has(opt);
          const fictional = opt === "虚构映射" || opt === "虚构无对应";
          return (
            <button key={opt} type="button"
                    className={"vr-meta-pill vr-loc-pill " + (on ? "is-on" : "is-off") + (fictional ? " is-fictional" : "")}
                    onClick={() => onToggle(opt)}>
              <svg className="vr-meta-glyph" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z"
                      fill="none" strokeWidth="1.5" stroke="currentColor"
                      strokeDasharray={fictional ? "3 3" : "0"} />
                <circle cx="12" cy="9" r="2.5" fill="currentColor" />
              </svg>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// ── Map-version group (inside the Atlas panel) ───────────────
function MapVersionGroup({ value, onChange }){
  return (
    <fieldset className="vr-filter-group">
      <legend>地图年代 <em>Era</em></legend>
      <div className="vr-mapver-row">
        {MAP_VERSIONS.map(v => (
          <button key={v.id} type="button"
                  className={"vr-mapver-tile " + (v.id === value ? "is-on" : "")}
                  onClick={() => onChange(v.id)}>
            <span className="vr-mapver-tile-label">{v.label}</span>
            <span className="vr-mapver-tile-caption">{v.caption}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

// ── Atlas panel (right side: era + filters) ────────────────
function FilterPanel({ filters, toggle, open, setOpen, mapVer, setMapVer }){
  if (!open) {
    return (
      <button type="button" className="vr-filter-fab" aria-label="展开图志" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 12l9 4 9-4M3 17l9 4 9-4" />
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
        <button type="button" aria-label="收起" onClick={() => setOpen(false)}>›</button>
      </header>
      <div className="vr-panel-body vr-panel-body--scroll">
        <MapVersionGroup value={mapVer} onChange={setMapVer} />
        <ClassFilter selected={filters.classes} onToggle={v => toggle("classes", v)} />
        <GenderFilter selected={filters.genders} onToggle={v => toggle("genders", v)} />
        <TimeTypeFilter selected={filters.timeTypes} onToggle={v => toggle("timeTypes", v)} />
        <LocationTypeFilter selected={filters.locationTypes} onToggle={v => toggle("locationTypes", v)} />
      </div>
    </section>
  );
}

// ── Events panel (left dock; tabbed) ───────────────────────
function EventsPanel({ visible, years, onPick }){
  const [tab, setTab] = useState("novels");
  const sorted = [...visible].sort((a,b) => a.year - b.year);
  const worldRows = WORLD_EVENTS.filter(w => w.year >= years[0] && w.year <= years[1]);
  return (
    <section className="vr-panel vr-events-panel">
      <header className="vr-panel-header">
        <h2 className="vr-panel-h">
          <span>{years[0]} – {years[1]}</span>
          <em>{visible.length} parallel lives</em>
        </h2>
      </header>
      <nav className="vr-events-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "novels"}
                className={"vr-events-tab " + (tab === "novels" ? "is-on" : "")}
                onClick={() => setTab("novels")}>
          <span>书中人物</span><em>Novels</em>
        </button>
        <button type="button" role="tab" aria-selected={tab === "world"}
                className={"vr-events-tab " + (tab === "world" ? "is-on" : "")}
                onClick={() => setTab("world")}>
          <span>真实世界</span><em>History</em>
        </button>
      </nav>
      <div className="vr-events-body">
        {tab === "novels" ? (
          <ul className="vr-events-list">
            {sorted.map(e => (
              <li key={e.id}>
                <button type="button" className="vr-event-row" onClick={() => onPick && onPick(e)}>
                  <div className="vr-event-year">{e.year}</div>
                  <div className="vr-event-meta">
                    <div className="vr-event-character">
                      {e.character}<span className="vr-event-book"> · 《{e.book}》</span>
                    </div>
                    <div className="vr-event-desc">{e.event}</div>
                  </div>
                </button>
              </li>
            ))}
            {sorted.length === 0 && <li className="vr-event-empty">这段时间内没有匹配的事件</li>}
          </ul>
        ) : (
          <ul className="vr-events-list">
            {worldRows.map(w => (
              <li key={w.year} className="vr-event-row vr-event-row--world">
                <div className="vr-event-year">{w.year}</div>
                <div className="vr-event-meta">
                  <div className="vr-event-desc">{w.label}</div>
                </div>
              </li>
            ))}
            {worldRows.length === 0 && <li className="vr-event-empty">这段时间内没有真实世界事件</li>}
          </ul>
        )}
      </div>
    </section>
  );
}

// ── Timeline (display-only double-handle) ──────────────────
function Timeline({ years, setYears }){
  const ticks = [];
  for (let y = TL_START; y <= TL_END; y += 10){
    ticks.push({ year: y, major: (y - TL_START) % 50 === 0, pos: ((y - TL_START) / (TL_END - TL_START)) * 100 });
  }
  const trackRef = useRef(null);
  const dragging = useRef(null);
  function pctFromEvent(e){
    const r = trackRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    return Math.max(0, Math.min(100, (x / r.width) * 100));
  }
  function pctToYear(p){ return Math.round(TL_START + (p / 100) * (TL_END - TL_START)); }
  function onDown(which){ return (e) => {
    dragging.current = which;
    const move = (ev) => {
      if (!dragging.current) return;
      const yr = pctToYear(pctFromEvent(ev));
      setYears(curr => {
        if (which === 0) return [Math.min(yr, curr[1] - 5), curr[1]];
        return [curr[0], Math.max(yr, curr[0] + 5)];
      });
    };
    const up = () => { dragging.current = null; window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }; }
  const aPct = ((years[0] - TL_START) / (TL_END - TL_START)) * 100;
  const bPct = ((years[1] - TL_START) / (TL_END - TL_START)) * 100;
  return (
    <section className="vr-timeline">
      <div className="vr-slider" ref={trackRef}>
        <div className="vr-track" />
        <div className="vr-fill" style={{ left: aPct + "%", right: (100 - bPct) + "%" }} />
        <div className="vr-handle" style={{ left: `calc(${aPct}% - 7px)` }} onPointerDown={onDown(0)} />
        <div className="vr-handle" style={{ left: `calc(${bPct}% - 7px)` }} onPointerDown={onDown(1)} />
      </div>
      <div className="vr-ticks">
        {ticks.map(t => (
          <span key={t.year} className={"vr-tick " + (t.major ? "is-major" : "")} data-year={t.major ? t.year : undefined} style={{ left: t.pos + "%" }} />
        ))}
      </div>
    </section>
  );
}

// ── Event popup ────────────────────────────────────────────
function EventPopup({ event, onClose }){
  if (!event) return null;
  return (
    <div className="vr-popup-overlay" onClick={onClose}>
      <article className="vr-popup-card" onClick={e => e.stopPropagation()}>
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
    </div>
  );
}

// ── Marker ─────────────────────────────────────────────────
function Marker({ event, onClick }){
  const isFic = event.timeType === "虚构映射" || event.locationType === "虚构映射";
  const left = 4 + ((event.lng + 130) / 280) * 92;
  const top = 6 + ((70 - event.lat) / 80) * 88;
  return (
    <button className={"vr-marker-btn " + (isFic ? "is-fictional" : "")}
            style={{ left: left + "%", top: top + "%" }}
            onClick={() => onClick(event)}>
      <img src={iconSrc(event.class)} alt={event.class} />
    </button>
  );
}

// ── Map stage ──────────────────────────────────────────────
function MapStage({ active, events, onMarkerClick, filterOpen, setFilterOpen, filters, toggleFilter, years, setYears, mapVer, setMapVer }){
  const visible = events.filter(e =>
    filters.classes.has(e.class) &&
    filters.genders.has(e.gender) &&
    filters.timeTypes.has(e.timeType) &&
    filters.locationTypes.has(e.locationType) &&
    e.year >= years[0] && e.year <= years[1]
  );
  return (
    <section className={"vr-screen vr-stage map-" + mapVer + " " + (active ? "is-active" : "")}>
      <div className="vr-map" />
      <div className="vr-left-dock">
        <SearchBox />
        <EventsPanel visible={visible} years={years} onPick={onMarkerClick} />
      </div>
      <div className="vr-right-dock">
        <FilterPanel filters={filters} toggle={toggleFilter} open={filterOpen} setOpen={setFilterOpen}
                     mapVer={mapVer} setMapVer={setMapVer} />
      </div>
      <Timeline years={years} setYears={setYears} />
      <div className="vr-markers">
        {visible.map(e => <Marker key={e.id} event={e} onClick={onMarkerClick} />)}
      </div>
    </section>
  );
}

Object.assign(window, {
  TopNav, Landing, MapStage, FilterPanel, Timeline, EventPopup, SearchBox, Marker, BookCover,
  ClassFilter, GenderFilter, TimeTypeFilter, LocationTypeFilter, MapVersionGroup, EventsPanel,
  CLASS_OPTIONS, GENDER_OPTIONS, TIME_TYPE_OPTIONS, LOCATION_TYPE_OPTIONS, MAP_VERSIONS, WORLD_EVENTS, TL_START, TL_END,
});
