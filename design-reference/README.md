# Parallels · 经纬 — Design System

> Internal codename: **Vertical Reading**. Public-facing name: **Parallels (经纬)**. All visual specs in this system are for the public Parallels surface.

## What is Parallels?

Parallels (经纬) is a reading tool that projects characters from world literature onto historical maps. At any time-coordinate the user can see, side by side, where different characters from different books were living, suffering, and acting. The core interaction is map + timeline + class-marked avatars — the user "vertically pierces" through books to compare parallel fates across the same historical moment.

The product is one personal-scale web app (no auth, no multi-tenant). It is a literary visualisation platform; the visual language deliberately evokes 19th-century European print culture — restrained, archival, paper-and-ink.

## Sources used to build this system

- **Design spec (uploaded):** `uploads/VerticalReading_设计规范.md` — the exact-values spec (colors, font sizes, radii, motion durations, component anatomy). Treat this as authoritative.
- **Codebase:** `github.com/YZzzz-652/vertical-reading` (Next.js 16 + React 19 + Tailwind 4 + Leaflet + OpenStreetMap, deployed on Vercel). Key files read:
  - `app/page.tsx` — full single-page implementation (Landing → Map)
  - `app/globals.css` — production CSS (every value here matches the design spec)
  - `app/layout.tsx` — font loading via `next/font/google`
  - `app/api/events/route.ts` — Feishu Bitable proxy (data layer)
  - `public/icons/*.png` — 8 class-themed oil-painting avatars (imported into `assets/icons/`)
- **Companion docs in repo** (read for context, not copied): `AGENTS.md`, `VerticalReading_项目启动文档.md`, `VerticalReading_决策日志.md`.
- **Live site:** https://vertical-reading.vercel.app

## Products represented

There is only **one** product surface: a single-page web app with two screens — a Landing screen and a Map screen — switched with a 0.6s opacity crossfade (Leaflet hijacks scroll, so no scroll-snapping is used).

## Index of files in this folder

| Path | What it is |
| --- | --- |
| `README.md` | This file. Overview, content & visual foundations, iconography. |
| `colors_and_type.css` | All design tokens: color vars, font families, type scale, radii, shadows, motion. Import this at the top of any artefact. |
| `SKILL.md` | Agent-Skill front matter so this folder can be dropped into Claude Code as a skill. |
| `assets/icons/` | 8 class-avatar PNGs (军人 / 奴隶农奴 / 宗教人士 / 平民 / 底层 / 知识分子 / 贵族 / 资产阶级). |
| `preview/` | One small HTML card per token group — drives the Design System tab. |
| `ui_kits/parallels/` | Hi-fi recreation of the live app: index.html prototype + per-component JSX. |

## Content fundamentals

**Voice.** Quiet, literary, slightly archival. The product treats books as primary material, not content. Copy reads like a museum label or a 19th-century gazetteer caption — short, declarative, no exclamation, no marketing register.

**Bilingual rule.** Chinese (Simplified) and English coexist everywhere but **never mix inside one type family**. Chinese uses Noto Serif SC; English uses Playfair Display (display) or EB Garamond (body). Same hierarchy on both sides, same weight logic, but different fonts. The brand lockup itself is `Parallels · 经纬` with the dot as a connector — both names always travel together.

**Pronouns & address.** No "you" / "your". No "我们" either. Copy is descriptive of the world, not directed at the reader. Buttons read as gentle prompts ("向下探索") rather than instructions ("点击进入").

**Casing.** English titles are Title Case in italic Playfair (`Parallels`, `Vertical Reading`). Chinese has no case; weight does the work. UI labels (filter legends, legend rows) are bare nouns — `阶层` `性别` `时间类型` `地点类型` — never sentences.

**Tone examples (lifted from the live app).**
- Landing tagline (zh): `打破书本边界，以时间为坐标轴，在同一历史时刻看见不同作品里的人物如何在各自的命运里行走。`
- CTA: `向下探索` (not `开始` or `进入地图`)
- Empty/loading: `正在读取文学时空数据...`
- Filter section labels: `阶层 / 性别 / 时间类型 / 地点类型`
- Range chip pattern: `1700–1930　共 N 个事件` (note the full-width space `　` between range and count)
- Time-type vocabulary: `历史锚定 / 虚构映射 / 创作年代` — these are product-specific terms; never paraphrase.
- Location-type vocabulary: `真实 / 虚构映射 / 虚构无对应`.

**Emoji.** None. Not anywhere. The visual register is paper, ink, and oil paint; emoji would break the spell.

**Unicode glyphs as UI.** A small set is used in lieu of icons: `‹` `›` for panel collapse/expand chevrons, `·` as the brand separator (`Parallels · 经纬`), em-dashes and Chinese full-width separators in inline meta lines.

**Numbers & dates.** Years render as `1700`, `1860`, never `1700s` or `19th c.`. Ranges use an en-dash: `1700–1930`. Coordinates always use ASCII minus `-` (the Feishu API rejects U+2212).

**Vibe.** A reading-room hush. The user is the cartographer, not the customer.

## Visual foundations

**Palette.** Three colors carry the entire system: parchment `#F5EDD8`, ink `#2C1A0E`, bronze `#c8a87a`. Everything else is a translucency of one of those three. There are no accent hues, no greens for "success", no reds for "error" — the design spec explicitly disallows extending the palette.

**Type.** Three families, strictly partitioned: Playfair Display (English display, always italic at H1–H3), EB Garamond (English body and small caps-ish 11px labels), Noto Serif SC (all Chinese). Sizes are exact: 72/22/16/15/11 px for English and 60/20/15/14/11 px for Chinese — see the type-scale card in `preview/`.

**Backgrounds.** Solid parchment on Landing; the historical map itself (cartocdn Voyager tiles, with a future plan for century-switched antique tiles) on Map. **No gradients, no textures, no patterns, no full-bleed photos.** Translucency reveals the map underneath every panel — this is the system's signature: surfaces are paper laid on top of paper, not opaque cards.

**Imagery.** The only imagery in the entire system is the eight oil-painting class avatars (warm, varnished, museum-photo crops, circle-cropped with a 2px white border). Treatment is consistent: 40×40 on the map, 22×22 in the legend, always circular, always with a soft 0–2/6 shadow. Fictional-mapping avatars get a dashed border + 0.75 opacity instead of solid.

**Animation.** Only show/hide. Duration 0.25–0.5s, easing `ease-in-out`, no spring, no bounce, no parallax. The Landing→Map transition is a 0.6s opacity crossfade. **There are no hover tooltips anywhere** — the spec is explicit: `无 hover tooltip`.

**Hover & press.** The system is almost stateless. Cursor changes on buttons; no color shift, no scale, no opacity dip. Markers do not react to hover. Panel collapse buttons just swap glyph (`‹` ↔ `›`). The single concession to feedback is the slider handle's box-shadow.

**Borders.** Hairlines, always. `0.5px solid #c8a87a` on every panel, popup, search box, and tag. The 0.5px (not 1px) is intentional — at 1× DPR it sub-pixels into a very faint line, evoking copperplate engraving rule. The only thicker border is the 2px white ring around avatars.

**Shadows.** Two recipes, both warm:
- Panel shadow: `0 16px 42px rgba(54, 42, 25, 0.16)` — large, soft, slightly amber.
- Popup shadow: `0 18px 40px rgba(54, 42, 25, 0.20)`.
- Marker shadow: `0 2px 6px rgba(0, 0, 0, 0.30)` — the only neutral-grey shadow, because it sits on imagery, not paper.

No inner shadows. No insets. No "neumorphism".

**Transparency & blur.** Every floating surface is translucent and backdrop-blurred (`backdrop-filter: blur(8px)`). Specific opacities are codified:
- Top nav (map state): ink @ 0.85
- Top nav (landing state): ink @ 0.60
- Filter panel / search: parchment @ 0.96
- Event popup: parchment @ 0.97
- Leaflet zoom control: paper @ 0.93

The map underneath is always visible through chrome — this is the product's core metaphor.

**Corner radii.** Global rule: **no right angles anywhere.**
- 12px on large panels (filter, event popup, search-wrapping containers)
- 4px on small components (tags, badges, search box, slider handle uses 3px)
- 50% on avatars
- 999px pill on inline chips inside the popup title row

**Cards / panels.** The "card" idiom is the panel: translucent parchment, 0.5px bronze hairline, 12px radius, soft warm shadow, ink header bar with parchment text. Headers always have the ink-on-parchment inversion at the top — this is the system's most recognisable element.

**Layout rules.**
- Top nav is fixed, full-width, 48px tall, sits above everything (z 1000).
- Filter stack docks left at `top: 64px, left: 16px`, max width 340px.
- Legend docks right at `top: 136px, right: 16px`, fixed width 160px.
- Timeline floats at the bottom, inset 44px left / 260px right / 38px bottom — it has **no background**, sits directly on the map with the parchment showing through.
- Zoom control is moved off the corner to `topright` with a 64px top margin so it clears the nav.

**Slider anatomy.** Two vertical-block handles (14×26, 3px radius, bronze fill, three white horizontal hairlines as a drag-affordance). The selected range fill is 3px bronze; the unselected track is 1.5px ink @ 0.22.

**Tick scale.** Major ticks every 50 years at 14px, ink @ 0.40; minor ticks every 10 years at 7px, ink @ 0.20. Year numbers (every 50y) sit below the axis in Noto Serif SC 15px, ink @ 0.55. No year-bubble tooltip.

## Iconography

**Avatars (the only "icons" in the product).** Eight oil-painting portraits, one per social class — military, slave/serf, religious, commoner, lower-class, intellectual, noble, bourgeois. Sourced as 120×120 transparent-background PNGs, circle-cropped at render time with a 2px white border and a soft drop shadow. They are **not** symbols of specific book characters — they represent class, and they appear both as map markers and in the legend.

Files (Chinese filenames, kept as-is to match the codebase's hardcoded `/icons/${className}.png` lookup):

```
assets/icons/军人.png         (Military)
assets/icons/奴隶农奴.png      (Slave / serf)
assets/icons/宗教人士.png      (Religious)
assets/icons/平民.png         (Commoner)
assets/icons/底层.png         (Lower class)
assets/icons/知识分子.png      (Intellectual)
assets/icons/贵族.png         (Noble)
assets/icons/资产阶级.png      (Bourgeois)
```

**Fictional-mapping treatment.** When `timeType === '虚构映射'` or `locationType === '虚构映射'`, the avatar border becomes **dashed** and opacity drops to 0.75. The legend has a separate row for this state, rendered as an empty dashed-border circle (no portrait inside).

**Symbol-icons.** The product has almost none. The few in use:
- `‹` `›` — panel collapse/expand chevrons (Unicode, set in Noto Serif SC).
- A single inline SVG (`viewBox="0 0 1104 1024"`) for the legend's collapse arrow — 16×16, fill `#F5EDD8`, mirrored by `transform: scaleX(-1)` to indicate the inverse action. The source SVG is referenced inline in `app/page.tsx` and reproduced in this kit.
- The favicon (`app/favicon.ico` — not copied; can be regenerated from the brand mark).

**Emoji.** Never used in product. Decision docs (`AGENTS.md`) use 💡/⏳/✅/🚧 as status markers in internal Markdown only — those are explicitly back-office, not product surface.

**No external icon library.** The system uses zero of Lucide / Heroicons / Material / Font Awesome. If a new product surface needs a glyph and the existing set can't cover it, **draw it as a 0.5px bronze hairline mark** matching the timeline tick style — or substitute with a typographic character.

**Substitution notes.** All three font families (Playfair Display, EB Garamond, Noto Serif SC) are loaded from Google Fonts in the codebase via `next/font/google` and in this system via `@import` at the top of `colors_and_type.css`. No local font files are needed and none are missing.
