# Vertical Reading · 前端重写参考

> **归档说明（2026-05-14）**：阶段 3 前端重写已完成，本文档是开工前的历史口径归档，内容不再作为当前实现依据。日常接手项目时暂时不需要查看本文档；实际生效的前端设计以生产代码、`app/tokens.css` 和 Claude Design Standalone HTML 视觉参考为准。
>
> 本文档是阶段 3「前端重写」开工前的基础口径文档，回答 19 个关于设计参考文件、token 体系、重写范围、组件设计的问题。
> 重写过程中如出现本文档未覆盖的疑问，先讨论并补充本文档，再进入实施。

---

## 一、设计参考文件话语权

### 1.1 source of truth

`design-reference/ui_kits/parallels/` 整套是 source of truth：

- `app.css`（891 行）— 完整样式
- `components.jsx`（20K 版本）— 完整组件实现
- `books.js` — 6 本首页书墙数据
- `events.js` — 5 条样本事件（仅供本地预览，生产用飞书数据）
- `index.html` — 本地预览入口

### 1.2 已弃用的设计参考

- `design-reference/components.jsx`（13K 外层版本）— 早期裁剪版，已弃用
- `design-reference/README.md` 中"hi-fi recreation of the live app"的说法 — 写错了，实际是新设计而非 v0.1 复刻

### 1.3 design-reference/colors_and_type.css 的定位

- 作为参考归档保留，不动
- 与 `app/tokens.css` 共存，**`app/tokens.css` 才是生产代码的 source of truth**
- 两者内容应保持一致（token 部分）

---

## 二、Token 体系

### 2.1 source of truth

`app/tokens.css` 是生产代码 token 的唯一来源。`design-reference/colors_and_type.css` 仅作归档。

### 2.2 重写时对 tokens.css 的改动

**Bug 修复：补回字体变量定义（当前是空段，只剩注释标题）**

```css
/* ── Type · families ────────────────────────────────────── */
--font-display:  "Playfair Display", Georgia, serif;
--font-body:     "EB Garamond", Georgia, serif;
--font-zh:       "Noto Serif SC", "Songti SC", serif;
```

**新增 4 个 token（性别圆盘专用）**

```css
/* ── Avatar disc (gender filter) ─────────────────────────── */
--disc-m:        #ece1c6;                       /* 男·圆盘底色 */
--disc-f:        #ead7c6;                       /* 女·圆盘底色 */
--disc-m-ring:   rgba(139, 115, 64, 0.55);      /* 男·内描边 */
--disc-f-ring:   rgba(170, 90, 110, 0.55);      /* 女·内描边 */
```

**修改 H1 字号**

```css
--fs-h1-en: 92px;   /* 原 72px，因首页改为左右两栏 + 大书墙布局，压不住 */
```

**删除 `.p-*` 语义类段（约 80 行）**

`colors_and_type.css` 里 `.p-h1 / .p-h2 / .p-body / .p-panel / .p-chip` 等一整套语义类，整个 `ui_kits/` 零使用，确认弃用。tokens.css 只保留 `:root` 变量段，名实相符。

### 2.3 派生色合并原则

`ui_kits/parallels/app.css` 里仍有约 15 处硬编码颜色（如 `#33271b`、`#5f4725`、`#3a2d20`、`#efe2c0`、`#f7eed6`、`#e9e1cf` 等）。

**重写原则**：不再硬编码颜色，所有视觉值走 token 系统。具体合并方案在重写实施阶段由 Codex 决定，遇到一处合并一处，相近的归到现有 token（如 `--fg-soft / --fg-muted`），真正需要的中间色另立新 token。

**已有派生色保留**：
- `--fg-muted: #6c532e`（副标题、legend）
- `--fg-soft: #71572e`（meta、标签文字）

---

## 三、重写范围与文件清单

| 文件 | 操作 |
|---|---|
| `app/globals.css` | **清空重写**，从 `ui_kits/parallels/app.css` 移植，配 Next.js 项目结构 |
| `app/tokens.css` | **修改**：补字体变量、删 `.p-*` 段、新增 disc token、改 H1 字号 |
| `app/page.tsx` | **清空重写**，按 `ui_kits/parallels/components.jsx` 拆 |
| `app/books.ts` | **新建**：从 `ui_kits/parallels/books.js` 移植，cover URL 改本地 `/covers/xxx.jpg` |
| `app/world-events.ts` | **新建**：从 `components.jsx` 移植硬编码的 15 条 WORLD_EVENTS |
| `app/components/TopNav.tsx` | **新建** |
| `app/components/Landing.tsx` | **新建**（含 BookCover 子组件） |
| `app/components/MapStage.tsx` | **新建**（含 Marker 子组件） |
| `app/components/FilterPanel.tsx` | **新建**（含 MapVersionGroup、ClassFilter、GenderFilter、TimeTypeFilter、LocationTypeFilter；具体拆分粒度 Codex 决定） |
| `app/components/EventsPanel.tsx` | **新建**（带 Novels / History 双 Tab） |
| `app/components/Timeline.tsx` | **新建** |
| `app/components/EventPopup.tsx` | **新建** |
| `app/layout.tsx` | **保留不动**（字体加载已正确） |
| `app/api/events/route.ts` | **保留不动** |
| `app/favicon.ico` | **保留不动** |
| `public/covers/*.jpg` | **保留不动**（6 张封面图已下载） |
| `public/icons/*.png` | **保留不动**（8 张阶层图标已就位） |

---

## 四、组件设计要点

### 4.1 首页 Landing

- 左 hero + 右 3×2 书墙布局（`grid-template-columns: 1fr 1.25fr`）
- 书墙错落：第 2、3、5、6 张 cover 用 `translateY(18px)` / `translateY(34px)` 形成参差
- 6 本书全部使用 `.vr-cover--img` 分支（有本地封面图）
- BookCover hover 时 caption 渐显（`opacity: 0 → 1`，0.25s）
- `.vr-cover--typographic` 等 7 个 style 变体保留为降级分支（cover 加载失败时启用）
- 首页 H1：英文 92px / 中文 60px（已更新设计规范）
- 统计三栏：`{books.length} Featured · 7 Regions · 1010–1936 Years`
- CTA 按钮"向下探索 Enter the Atlas ↓"，触发 0.6s 透明度淡入到地图页

### 4.2 地图页 Map

布局：

```
┌─顶部导航 (fixed, 48px, ink @ 0.85)──────────────────┐
│                                                    │
│ ┌─左 Dock (top:64 left:16)─┐    ┌─右 Dock─┐         │
│ │ SearchBox               │    │ FilterPanel       │
│ │ EventsPanel (tabbed)    │    │ (Atlas)           │
│ └─────────────────────────┘    └──────────┘         │
│                                                    │
│              [Leaflet 地图底图]                      │
│                                                    │
├─时间轴 (absolute, 双手柄)──────────────────────────┤
└────────────────────────────────────────────────────┘
```

### 4.3 EventsPanel · 双 Tab

- 「书中人物 Novels」：从飞书 201 条数据按 filters + years 区间筛选后渲染
- 「真实世界 History」：用 `app/world-events.ts` 的 15 条硬编码数据，按 years 区间筛选；行不可点击（`vr-event-row--world`）

### 4.4 Atlas Panel · 4 块拼合

按从上到下的顺序：

1. **地图年代 Era**：4 个 tile（17世纪 / 18世纪 / 19世纪 / 现代）
2. **阶层 Class**：8 个头像 chip（4 列网格）
3. **性别 Gender**：2 个头像 chip（2 列网格）
4. **时间类型 Time**：3 个 pill（含 clock SVG glyph，虚构映射用 dashed）
5. **地点类型 Place**：3 个 pill（含 pin SVG glyph）

内容超出视口时面板内部滚动（`.vr-panel-body--scroll`）。

### 4.5 Atlas Panel 收起态 → 圆形 FAB

map-6 截图显示：右侧 Atlas 面板可整体收起，变成右上角圆形 ink-color FAB。

**FAB 样式：** 沿用 `app.css` 的 `.vr-filter-fab` 类（已定义在 line 540-551）：
- 44×44 圆形，背景 ink，色 parchment，shadow-panel
- hover 时背景变 `#1f120a`

**FAB 内的 SVG 图标（地图图层符号）：**

```svg
<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
  <path d="M12 3 L2 8.5 L12 14 L22 8.5 Z"/>
  <path d="M2 12 L12 17.5 L22 12 L19.5 10.7 L12 14.7 L4.5 10.7 Z"/>
  <path d="M2 15.5 L12 21 L22 15.5 L19.5 14.2 L12 18.2 L4.5 14.2 Z"/>
</svg>
```

3 个堆叠菱形，实心填充，`currentColor` 继承 FAB 的 parchment 颜色。

**状态管理：** FilterPanel 的 `open` state 控制：
- `open === true` → render `<section className="vr-panel vr-filter-panel">`（完整面板）
- `open === false` → render `<button className="vr-filter-fab">` + 上方 SVG 图标

### 4.6 Atlas · 地图年代 tile

4 个 tile 的点击行为：
- 仅切换 `mapVer` state（"17th" / "18th" / "19th" / "modern"，默认 "modern"）
- 给 `.vr-stage` 加 `map-${mapVer}` class
- **不切换真实瓦片**，瓦片调研在另一个独立待办里推进

### 4.7 性别 Gender 圆盘

- **临时方案**：保持 `components.jsx` 现状，使用 Wikimedia 两张 Ingres 油画头像（Bertin & Madame Moitessier）
- 后续会和其他视觉细节一起调整，届时再决定是否切换为汉字「男」「女」disc 显示
- 重写时不动 `GENDER_PORTRAIT` 数据结构

### 4.8 Marker 地图标记点

- 40×40 圆形头像，2px 白边
- 阶层图标从 `/icons/${className}.png` 取（8 张文件名为中文，不要改）
- `timeType === '虚构映射'` 或 `locationType === '虚构映射'` → border 改 dashed、opacity 0.75
- Marker 由 Leaflet 接管（`leaflet.divIcon` + `iconHtml`），保留现有 `app/page.tsx` 里 escapeHtml / iconHtml / popupHtml 三个工具函数的逻辑

### 4.9 时间轴

- 区间 1700–1930，双手柄，最小宽度 5 年
- 主刻度每 50 年，次刻度每 10 年
- 当前 v0.1 用 noUiSlider；重写后可改用 `components.jsx` 中的纯 React pointer 实现（更轻量），具体方案 Codex 实施时决定

### 4.10 EventPopup 弹窗

- 居中弹出（非 Leaflet 原生 popup，是 fixed overlay）
- 字段：character、class chip、gender chip、tags chip（可选）、book + author、event、location + locationType + timeType、quote（默认展开）
- 点 overlay 关闭，0.25s 淡入

---

## 五、已确认弃用 / 关闭的项

### 5.1 「真实世界 History tab 数据来源」待办

**关闭。** components.jsx 已硬编码 15 条 WORLD_EVENTS，对应"前端硬编码临时清单"方案。重写时移到 `app/world-events.ts`。未来扩展时再开新待办。

### 5.2 v0.1 的 globals.css 全部硬编码

清空重写，新代码所有视觉值走 token 系统。原 globals.css 在 git 历史里可查（tag `v0.1-pre-redesign`）。

### 5.3 v0.1 的 page.tsx 结构

清空重写，按 ui_kits/parallels/components.jsx 拆分组件。保留三个工具函数的逻辑（escapeHtml / iconHtml / popupHtml）适配新组件。

---

## 六、设计规范文档同步更新

重写完成后，`VerticalReading_设计规范.md` 需要同步以下变化：

1. **H1 字号**：英文 72px → 92px，中文保持 60px
2. **新增组件章节**：
   - 4.x 首页书墙
   - 4.x EventsPanel（双 Tab）
   - 4.x Atlas 4 tile（地图年代切换）
   - 4.x Avatar Chip（阶层 / 性别筛选）
   - 4.x Meta Pill（时间 / 地点类型筛选）
   - 4.x Atlas 收起 FAB（含图层 SVG）
3. **新增 token 段**：disc-m / disc-f / disc-m-ring / disc-f-ring

---

## 七、开工流程

1. Codex 在 main 分支 `git checkout -b redesign` 建分支
2. main 分支保持 v0.1 线上版本不动
3. 重写在 redesign 分支推进，分批 commit
4. 全部完成、本地浏览器验证通过后，合并回 main → Vercel 自动部署
5. v0.1 的快照 tag `v0.1-pre-redesign`（commit 067d305）作为回滚锚点保留

---

## 附录·关键文件路径速查

```
设计参考（不动）
├── design-reference/README.md
├── design-reference/colors_and_type.css
├── design-reference/components.jsx              (13K，弃用)
├── design-reference/screenshots/                (6 张截图)
└── design-reference/ui_kits/parallels/
    ├── app.css                                  ★ 重写源
    ├── components.jsx                           ★ 重写源 (20K)
    ├── books.js                                 ★ 移植源
    ├── events.js                                (本地预览用，不移植)
    └── index.html                               (本地预览用，不移植)

生产代码（重写改动）
├── app/globals.css                              重写
├── app/tokens.css                               修改
├── app/page.tsx                                 重写
├── app/books.ts                                 新建
├── app/world-events.ts                          新建
├── app/components/                              新建目录
└── app/api/events/route.ts                      不动

资源（不动）
├── public/covers/*.jpg                          6 张封面
└── public/icons/*.png                           8 张阶层图标
```
