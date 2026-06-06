# 经纬 Parallels · 设计规范

> **名称**：项目内部与文档统一称 **Vertical Reading**；网页对外展示名 **Parallels**（中文：经纬）。
> **本文档管什么**：不可违反的设计意图与原则——值之外的、tokens.css 存不下的那部分。
> **读取时机**：默认不读，仅在设计系统级改动时读（见 AGENTS §5 路由表）。出新设计走 Claude Design，本文档作为交付 brief / 审稿对照。

---

## 一、设计意图

经纬（Parallels）是一个将文学书籍投射于历史地图之上的阅读工具。用户可以在同一时间坐标下，看到不同书籍中的人物在不同地点经历的故事。核心交互围绕地图、时间轴、人物阶级标记展开。

---

## 二、不可违反的设计原则

- **视觉气质**：19 世纪欧洲印刷文化，通透、克制、文献感。参考来源：davidrumsey.com（古地图气质）、gallica.bnf.fr（排版与字体气质）。
- **全局无直角**：所有组件遵循对应圆角规范（具体圆角值见 tokens.css）。
- **中英文分字体，不混用**：英文用 Playfair Display / EB Garamond，中文用 Noto Serif SC。**注意 Playfair Display 不含中文字形**，所有中文必须用 Noto Serif SC；英文标题保持 Playfair Display，两套字体共存。
- **动效**：以显示 / 隐藏为主，时长 0.25–0.5s，easing 一律 ease-in-out。
- **不设计额外 hover tooltip。**
- **所有悬浮面板带透明度**，透出地图底图。

---

## 三、值的来源（不在本文档维护）

- **代码层 source of truth**：`app/tokens.css`——颜色、字号、圆角、动效时长、间距等全部 token。
- **视觉参考**：Claude Design 产出的 standalone HTML。
- 实际生效的设计细节以当前生产代码为准；本文档只定原则与意图，不复制精确值。新增稳定设计值时补到 tokens.css，不回写本文档。
