---
name: parallels-design
description: Use this skill to generate well-branded interfaces and assets for Parallels (经纬), a literary visualization tool that projects books onto historical maps. Contains the project's exact design tokens (parchment / ink / bronze palette, Playfair Display + EB Garamond + Noto Serif SC type system), the eight class-avatar PNGs, and a UI kit of the live Map and Landing screens. Use for production work or throwaway prototypes / mocks that need to feel like Parallels.
user-invocable: true
---

# Parallels (经纬) — design skill

Read `README.md` in this folder first. It is the source of truth for content voice, visual foundations, and iconography. Then explore:

- `colors_and_type.css` — design tokens; import at the top of every artefact.
- `assets/icons/` — the eight class avatars (Chinese filenames are intentional, the live app does `/icons/${className}.png` lookup).
- `preview/` — one card per token group; quick visual reference.
- `ui_kits/parallels/` — JSX components and an interactive `index.html` recreating the live Landing → Map flow.

## When this skill is invoked

If creating visual artefacts (slides, mocks, throwaway prototypes), copy the assets and tokens out and produce static HTML files for the user. If working on production code (the actual Vertical Reading repo), read the token file and component recreations as the canonical visual reference, but defer all code commits to Codex per the project's `AGENTS.md` split.

If the user invokes this skill without a brief, ask:

1. Are you working on the live Parallels app, or making a one-off mock/slide/proposal?
2. Which screen(s) — Landing, Map, the event popup, or something new?
3. Static or interactive?
4. English-led, Chinese-led, or true bilingual?
5. Any additional class avatars / book covers / map tiles to incorporate?

## Hard rules (from `VerticalReading_设计规范.md`)

- Only three colors: `#F5EDD8` parchment, `#2C1A0E` ink, `#c8a87a` bronze. No new hues, ever.
- No mixing Chinese and English inside one font family. Playfair Display for English display (italic at H1–H3), EB Garamond for English body, Noto Serif SC for everything Chinese.
- No right angles. 12px on panels, 4px on chips, 50% on avatars.
- No hover states. No tooltips. Animations are show/hide only, 0.25–0.5s, `ease-in-out`.
- No emoji in product. No inventing new icons — fall back to typographic characters or 0.5px bronze hairline marks.
- Panels are translucent over the map; never solid opaque cards.
