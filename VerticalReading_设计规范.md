# Vertical Reading · 设计规范文档

> 本文档供 Claude 阅读理解后，指导前端代码实施。所有规范值均为精确值，不得自行推断或替换。

---

## 一、项目背景

Vertical Reading 是一个将文学书籍投射于历史地图之上的阅读工具。用户可以在同一时间坐标下，看到不同书籍中的人物在不同地点经历的故事。核心交互围绕地图、时间轴、人物阶级标记展开。

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

| 用途 | 字体 | 来源 |
|------|------|------|
| 标题、导航 | Playfair Display | Google Fonts |
| 正文、标签、小字 | EB Garamond | Google Fonts |

### 字号层级

| 层级 | 字体 | 字号 | 字重 | 备注 |
|------|------|------|------|------|
| H1（首页主标题） | Playfair Display | 72px | 900 | italic |
| H2（面板标题、副标题） | Playfair Display | 22px | 700 | |
| H3（卡片内标题） | Playfair Display | 16px | 700 | italic |
| 正文 | EB Garamond | 15px | 400 | line-height 1.75 |
| 辅助小字 / 标签 | EB Garamond | 11px | 400 | letter-spacing 0.08em |

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

共两屏，通过向下滚动切换，带过渡动效。

```
首页（Landing）
  ↓ 向下滚动 / 点击进入（带过渡动效）
地图页（Map）
```

---

## 四、组件规范

### 4.1 首页

- 背景：纯羊皮纸色 `#F5EDD8`
- 布局：居中
- 内容层级：
  1. 项目名称大标题（H1，Playfair Display 72px italic）
  2. 项目介绍文字（正文，EB Garamond 15px，line-height 1.75）
  3. 向下进入地图的引导（可为向下箭头或文字提示）

---

### 4.2 顶部导航栏

- 高度：48px
- 背景：`#2C1A0E`，opacity 0.85，backdrop-filter: blur(8px)
- 左侧：项目名称，Playfair Display 18px italic，颜色 `#F5EDD8`
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

- 位置：浮在地图底部，不占据独立区域，悬浮于地图之上
- 背景：`#2C1A0E`，opacity 0.85
- border-radius：12px

功能：
- 选择时间区间（非单一年份）
- 两端各一个可拖动圆点
- 圆点样式：颜色 `#F5EDD8`，border 2px solid `#c8a87a`
- 区间填充色：`#c8a87a`

字体：
- 年份数字：Playfair Display 16px，颜色 `#F5EDD8`
- 刻度标签：EB Garamond 11px，颜色 `#c8a87a`

---

## 五、全局交互规范

- 全局无直角，所有组件遵循圆角规范
- 无 hover tooltip
- 动效统一：显示 / 隐藏为主，过渡时长 0.25s–0.5s，easing ease-in-out
- 所有悬浮面板带透明度，透出地图底图
