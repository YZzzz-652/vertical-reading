# 经纬 Parallels · 设计规范文档

> **名称说明**：项目内部和文档统一称 **Vertical Reading**；网页对外展示名为 **Parallels**（中文：经纬）。

---

## 一、设计意图

**中文名：经纬 · 英文名：Parallels**

经纬（Parallels）是一个将文学书籍投射于历史地图之上的阅读工具。用户可以在同一时间坐标下，看到不同书籍中的人物在不同地点经历的故事。核心交互围绕地图、时间轴、人物阶级标记展开。

技术栈：Next.js + Tailwind CSS + Leaflet + OpenStreetMap + Vercel

---

## 二、视觉气质

19 世纪欧洲印刷文化，通透、克制、文献感。

参考来源:
- davidrumsey.com（古地图气质）
- gallica.bnf.fr（排版与字体气质）

设计原则：
- 全局无直角，所有组件遵循对应圆角规范
- 中英文使用各自字体（英文 Playfair Display / EB Garamond，中文 Noto Serif SC），不得混用
- 动效以显示/隐藏为主，时长 0.25s–0.5s，easing 全部 ease-in-out
- 不设计额外 hover tooltip
- 所有悬浮面板带透明度，透出地图底图

---

## 三、规范来源

具体视觉规范（颜色值、字号、组件样式、间距、动效时长）见以下两处，本文档不重复维护：

- **代码层 source of truth**：`app/tokens.css`（颜色、字号、圆角、动效时长、间距等全部 token）
- **视觉参考**：Claude Design Standalone HTML

实际生效的设计细节以当前生产代码为准；Claude Design Standalone HTML 作为视觉参考。
