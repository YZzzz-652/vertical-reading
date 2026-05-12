# Parallels UI Kit

Hi-fi recreation of the live single-page app at `vertical-reading.vercel.app`. Faithfully reproduces the two screens (Landing / Map), the filter panel, the legend, the timeline, and the event popup using the exact tokens from `colors_and_type.css`.

Open `index.html` to step through the flow:

1. **Landing** — solid parchment, master title `Parallels / 经纬`, intro paragraph, "向下探索" CTA.
2. Click the CTA → 0.6s opacity crossfade →
3. **Map** — Leaflet (loaded from CDN) with CartoDB Voyager tiles. Filter panel docks left, legend right, timeline floats bottom. Five sample literary events sit on real coordinates.
4. Click any avatar → event popup fades in (0.25s) with character, byline, event line, meta, and quote.

Components live as standalone files and are composed in `index.html` via inline `<script type="text/babel">`:

| File | What it covers |
| --- | --- |
| `components.jsx` | All shared components exported to `window`: `TopNav`, `Landing`, `MapStage`, `FilterPanel`, `Legend`, `Timeline`, `EventPopup`, `SearchBox`, `Marker`. |
| `events.js` | A hand-curated array of 5 sample events mirroring the Feishu data shape (so we don't need the Feishu API key). |
| `index.html` | App shell — loads Leaflet from CDN, runs the React root, wires the cross-fade. |

The fidelity target is **pixel-match the Map screen** against a screenshot of the live app, less so the exact icon SVGs. Where the live app fetches from `/api/events` (Feishu) we hardcode 5 events; everything else is intended to be visually identical.
