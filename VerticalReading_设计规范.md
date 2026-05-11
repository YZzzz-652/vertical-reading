# 经纬 Parallels · 设计规范文档

> **名称说明**：项目内部和文档统一称 **Vertical Reading**；本文档涉及的所有视觉规范均用于网页对外展示，对外展示名为 **Parallels**（中文：经纬）。

> 本文档供 Claude 阅读理解后，指导前端代码实施。所有规范值均为精确值，不得自行推断或替换。

---

## 一、项目背景

**中文名：经纬 · 英文名：Parallels**

经纬（Parallels）是一个将文学书籍投射于历史地图之上的阅读工具。用户可以在同一时间坐标下，看到不同书籍中的人物在不同地点经历的故事。核心交互围绕地图、时间轴、人物阶级标记展开。

技术栈：Next.js + Tailwind CSS + Leaflet + OpenStreetMap + Vercel

---

## 二、设计语言

### 气质定位
19世纪欧洲印刷文化，通透、克制、文献感。
参考来源：davidrumsey.com（地图气质）、gallica.bnf.fr（排版与字体气质）

### 色彩规范

| 用途 | 色值 |
|------|------|
| 背景底色（羊皮纸） | `#F5EDD8` |
| 主色（深棕近黑） | `#2C1A0E` |
| 辅助色（暖金棕） | `#c8a87a` |

### 字体规范

**英文字体**

| 用途 | 字体 | 来源 |
|------|------|------|
| 英文标题、导航 | Playfair Display | Google Fonts |
| 英文正文、标签、小字 | EB Garamond | Google Fonts |

**中文字体**

| 用途 | 字体 | 来源 |
|------|------|------|
| 中文标题 | Noto Serif SC | Google Fonts |
| 中文正文、标签、小字 | Noto Serif SC | Google Fonts |

**通用规则**
- 中英文使用各自对应字体，不得混用
- 同一层级的中英文字重逻辑保持一致

### 字号层级

| 层级 | 英文字体 | 中文字体 | 英文字号 | 中文字号 | 字重 | 备注 |
|------|------|------|------|------|------|------|
| H1（首页主标题） | Playfair Display | Noto Serif SC | 72px | 60px | 900 | 英文 italic |
| H2（面板标题、副标题） | Playfair Display | Noto Serif SC | 22px | 20px | 700 | 英文 italic |
| H3（卡片内标题） | Playfair Display | Noto Serif SC | 16px | 15px | 700 | 英文 italic |
| 正文 | EB Garamond | Noto Serif SC | 15px | 14px | 400／300 | line-height 1.75／1.9 |
| 辅助小字 / 标签 | EB Garamond | Noto Serif SC | 11px | 11px | 400 | letter-spacing 0.08em |

**备注说明**
- 英文字体可使用 italic（如 H1-H3 标题），中文字体（Noto Serif SC）无 italic 字形，渲染为常规体
- 正文一行的字重 `400 / 300` 含义待实测后明确（TODO：测试后定稿）
- 辅助小字 `letter-spacing 0.08em` 仅作用于英文字体

### 圆角规范

| 组件类型 | border-radius |
|---------|---------------|
| 大面板（筛选面板、事件面板） | 12px |
| 小组件（标签、徽章、搜索框） | 4px |
| 标记点头像 | 50%（圆形） |

**规则：全局无直角，所有组件必须遵循对应圆角规范。**

### 动效规范

- 所有动效以显示 / 隐藏为主
- 过渡时长：0.25s–0.5s
- easing：ease-in-out
- 无 hover tooltip

---

## 三、页面结构

共两屏，通过点击切换，带淡入淡出过渡动效。

```
首页（Landing）
  ↓ 点击「向下探索」按钮进入（opacity 淡入淡出，0.6s ease-in-out）
地图页（Map）
```

注：不使用滚动切换，原因是 Leaflet 地图会劫持滚动事件。

---

## 四、组件规范

### 4.1 首页

- 背景：纯羊皮纸色 `#F5EDD8`
- 布局：居中
- 内容层级：
  1. 项目名称大标题：英文 Parallels / 中文 经纬（H1，Playfair Display 72px italic）
  2. 项目介绍文字（正文，中文用 Noto Serif SC 20px，line-height 1.75）
  3. 向下进入地图的引导（可为向下箭头或文字提示）

---

### 4.2 顶部导航栏

- 高度：48px
- 背景：`#2C1A0E`，opacity 0.85，backdrop-filter: blur(8px)
- 左侧：项目名称 Parallels（经纬），Playfair Display 18px italic，颜色 `#F5EDD8`
- 右侧：暂无导航项
- 定位：fixed，始终在页面顶部，地图页时透出底图

---

### 4.3 地图底图

- 使用真实历史古地图瓦片，按世纪切换（见开发待办）
- 地图全屏铺满，作为地图页唯一背景
- 色调参考：米白通透，接近真实羊皮纸古地图

---

### 4.4 地图标记点

- 形式：圆形裁切的欧洲古典油画人物头像（border-radius 50%）
- 含义：头像对应人物阶级（军人、平民、贵族、宗教等），非具体书中角色
- 悬停（hover）：无任何特效
- 点击：就地弹出事件信息面板（见 4.5）

---

### 4.5 事件信息面板

- 触发：点击地图标记点，就地弹出，位置靠近标记点
- 关闭：点击面板外区域，或点击面板内关闭按钮
- 动效：0.25s 淡入，0.25s 淡出

样式：
- 背景：`#F5EDD8`，opacity 0.97
- 边框：0.5px solid `#c8a87a`
- border-radius：12px
- 面板标题栏：背景 `#2C1A0E`，文字颜色 `#F5EDD8`，字体 Playfair Display italic（H3）
- 内容区正文：EB Garamond 15px
- 辅助信息（年份、地点等标签）：EB Garamond 11px，border 0.5px solid `#c8a87a`，border-radius 4px

---

### 4.6 筛选面板

- 位置：地图左侧悬浮
- 动效：展开 / 收起 0.3s 滑动，ease-in-out

展开状态：
- 背景：`#F5EDD8`，opacity 0.96
- 边框：0.5px solid `#c8a87a`
- border-radius：12px
- 面板标题栏：背景 `#2C1A0E`，文字颜色 `#F5EDD8`，Playfair Display

收起状态：
- 收缩为左侧贴边图标
- 点击图标重新展开

---

### 4.7 搜索框

- 位置：筛选面板正上方，独立悬浮于地图
- 背景：`#F5EDD8`，opacity 0.96
- 边框：0.5px solid `#c8a87a`
- border-radius：4px
- 字体：EB Garamond 15px
- 功能：支持搜索书目或人物
- 无 hover tooltip

---

### 4.8 时间轴

- 位置：浮在地图底部，悬浮于地图之上，无背景色
- 无 border-radius，无背景

功能：
- 选择时间区间（非单一年份）
- 两端各一个可拖动方块手柄
- 手柄样式：竖向方块，宽14px，高26px，border-radius 3px，填充色 #c8a87a，内有三条白色横线作为拖动暗示
- 区间填充色：#c8a87a，粗细 3px
- 未选中区间轨道：rgba(44,26,14,0.22)，粗细 1.5px

刻度尺：
- 主刻度：每50年一个，刻度线高14px，颜色 rgba(44,26,14,0.4)
- 次刻度：每10年一个，刻度线高7px，颜色 rgba(44,26,14,0.2)

字体：
- 年份数字：在轴线下方显示，每50年显示一次，Noto Serif SC 15px，颜色 rgba(44,26,14,0.55)
- 不显示年份气泡

---

## 五、全局交互规范

> 本段只列其他段落未覆盖的全局规则。"全局无直角"详见三·圆角规范，"动效"详见二·动效规范。

- 所有悬浮面板带透明度，透出地图底图
