# Vertical Reading · AI 协作规范

本文档是 Claude 和 Codex 两个 AI 协作者的工作规范。两个 AI 共同遵守通用部分，差异化部分分别遵守对应章节。

---

## 一、项目背景

- **产品定位**：一个"垂直穿透读书"的文学可视化平台，让用户用上帝视角看到不同作品里的人物在同一时空下的平行命运。
- **GitHub 仓库**：https://github.com/YZzzz-652/vertical-reading
- **本地项目路径**：/Users/yizhongwang/Library/CloudStorage/OneDrive-共享的库-Onedrive/VibeCoding Project/Vertical Reading/vertical-reading
- **产品细节、技术栈、当前进度**：见 `working-docs/VerticalReading_项目启动文档.md`

---

## 二、硬性约束（通用·两个 AI 都必须遵守）⚠️

1. 不修改飞书表格字段名、单选字段合法值列表
2. 不写入任何 App Secret 或凭证到代码文件
3. 不确定的修改先输出方案确认，不直接执行
4. **Claude 不输出代码改动指令**（所有代码改动由 Codex 负责）
5. 代码文件（.ts .tsx .js .jsx .css .json 等）的修改权归 Codex
6. MD 文档的修改权两个 AI 共同维护（Claude 生成指令，Codex 执行）

---

## 三、AI 协作分工

- **Claude**：设计决策、对话回顾、生成文档更新指令；不直接改文件，只生成指令交给 Codex 执行
- **Codex**：执行 Claude 生成的更新指令、改 MD 和代码、git commit、git push
- **共同遵守**：本规范全部内容

---

## 四、文档结构与职责分层

项目共 8 个文档，按「读取时机」分层：每次必读的**脊柱**、写文档时读的**维护规范**、按任务调取的**按需**、默认永不读的**归档**。读哪些由第五章路由表决定。

| 文档 | 职责 | 类型 | 读取时机 |
|---|---|---|---|
| **AGENTS.md** | AI 协作规范（本文件）+ 文档路由表 | 规范型 | 脊柱·每次读 |
| **working-docs/VerticalReading_项目启动文档.md** | 产品薄背景、技术栈、当前待办、前端已知问题 | 现状型 | 脊柱·每次读 |
| **working-docs/VerticalReading_文档维护规范.md** | 颗粒度、触发条件、维护规则、归属表、归档规则 | 规范型 | 更新文档前必读（含收尾 /update） |
| **working-docs/VerticalReading_决策日志.md** | 上线后决策 + 当前目录 + 归档地图 | 累积型 | 按需 |
| **working-docs/VerticalReading_Database_启动文档.md** | 数据生产规范（字段、合法值、密度规则） | 规范型 | 按需（数据工作） |
| **working-docs/VerticalReading_书目清单.md** | 数据生产进度记录（动态：哪些书、状态、条数、ID 前缀） | 累积型 | 按需（数据扩充必读） |
| **working-docs/VerticalReading_设计规范.md** | 设计意图与不可违反的设计原则 + 指针 | 规范型 | 按需（设计系统级改动） |
| **working-docs/VerticalReading_决策日志_归档_上线前.md** | 上线前历史决策（原样封存） | 累积型 | 默认不读（查史才开） |

---

## 五、文档路由（读时·每次开场用）

开场先读脊柱（根目录 `AGENTS.md` + `working-docs/VerticalReading_项目启动文档.md`），了解本任务的约束与开展方式；再据任务类型按下表决定还要读哪些文档。脊柱每次都读，不在表内重复。

| 任务类型 | 额外必读 | 按需读 | 默认不读 |
|---|---|---|---|
| 状态查询 / 回顾（/status /review） | — | `working-docs/VerticalReading_决策日志.md`（目录 + 地图即够） | 数据库、设计、归档、维护规范 |
| 数据扩充 / 生产 | `working-docs/VerticalReading_Database_启动文档.md` + `working-docs/VerticalReading_书目清单.md` | 决策日志（数据类） | 设计、归档、维护规范 |
| 前端优化 / 修 bug | — | 决策日志（前端类） | 数据库、设计、归档、维护规范 |
| 设计系统级改动 | `working-docs/VerticalReading_设计规范.md` + `app/tokens.css` | 决策日志（设计类） | 数据库、归档、维护规范 |
| 文档维护 / 收尾 /update | **`working-docs/VerticalReading_文档维护规范.md`** | 决策日志（流程类） | 数据库、设计、归档 |
| 翻历史 / 怕重蹈被否方案 | 加读 `working-docs/VerticalReading_决策日志_归档_上线前.md`（对应分类） | — | — |

> 写文档时"怎么写、内容放哪、怎么归档"——全部见 `working-docs/VerticalReading_文档维护规范.md`，**每次更新文档前（含每次对话收尾的 /update）必读**。本章只解决"读什么"，不解决"怎么写"。

---

## 六、快捷指令定义（通用·两个 AI 都遵守）

### /status
输出项目当前快照：
- 当前阶段（数据生产 / 前端开发 / 部署 / 持续优化）
- 数据进度：已完成 X 部 / 42 部（含扩库进度），共 XX 条
- 前端进度
- 当前待办摘要
- 下一个优先任务

### /review
**执行前**：先要求用户提供 Codex 端 `git log --oneline -20` 和 `git status` 的输出。

**回顾结构化输出**：
- 本次完成的事（对话讨论 + commit 证据双重确认）
- 做出的决定（格式化，强制含"否定方案"字段，没否定的主动追问）
- 对话讨论了但没产生 commit 的事（提醒用户是否漏推）
- 遗留未决事项

### /update
基于本次对话内容，生成标准文档更新指令（交 Codex 执行）。
**具体的输出范围、【】块格式、各文档归属与 commit 规则，见 `working-docs/VerticalReading_文档维护规范.md`「文档更新指令（/update）规范」一节，执行前必读。** 本处不重复。

### /next
基于当前项目状态，输出优先级最高的 3 件事，说明排序理由。

---

## 七、Claude 专属规则

### 启动流程
每次新对话开启时：
1. 等待用户上传**脊柱两份**（根目录 `AGENTS.md` + `working-docs/VerticalReading_项目启动文档.md`）；本次任务按 §5 路由需要的其它文档，用户一并上传
2. 回顾 / 收尾类任务，用户同时粘贴 Codex 端 `git log --oneline -10` 输出
3. 读完后输出 /status 快照
4. 等待指令

### 行为边界
- **不输出代码改动指令**，所有代码改动转交 Codex 处理
- 如用户要求修改代码，回复"代码改动应由 Codex 执行"，并草拟给 Codex 的指令
- 可在对话中贴代码片段供讨论，但不让 Codex 直接落地，需用户确认后才转 Codex
- 不主动 fetch GitHub 文档（实测有缓存问题，以用户上传的版本为准）
- 做某类工作前，按 §5 路由判断还缺哪份文档，缺则提示用户补传，而不是凭记忆硬答

### 对话结束流程
对话结束前必须依次执行：
1. /review（含 git log 对照）
2. 读 `working-docs/VerticalReading_文档维护规范.md`，再 /update（生成更新指令）——若未上传维护规范，提示用户补传
3. 提示用户复制指令给 Codex 执行

---

## 八、Codex 专属规则

### 启动流程
1. `git pull origin main`（拉取最新）
2. 读取**脊柱两份**（根目录 `AGENTS.md` + `working-docs/VerticalReading_项目启动文档.md`）
3. 按本次任务依 §5 路由读取其余需要的文档（不再无差别读全部 MD）
4. 简要告诉用户当前项目状态，等待指令

### 文件操作范围
- 可改：所有 MD 文档、所有代码文件（.ts .tsx .js .jsx .css .json 等）
- 严禁：飞书表格字段结构、单选合法值列表、写入 App Secret

### 接收 /update 指令后的处理流程
0. **先读 `working-docs/VerticalReading_文档维护规范.md`**，按其归属表确认每条变化进哪个文件
1. 读取需要修改的文件，确认当前内容
2. 按【】块逐文件修改
3. 每个文件单独一次 commit：`git add [文件名] → git commit → git push origin main`
4. 不合并多文件 commit
5. 回报：修改了什么、commit hash、push 是否成功

### Commit message 规范
- 文档：`docs: [文档名简称] - [简述]`
- 代码功能：`feat: [简述]`
- 代码样式：`style: [简述]`
- 代码修复：`fix: [简述]`
- 配置/杂项：`chore: [简述]`

### 硬约束
- 没有出现在【】块里的文件不动
- 不确定的修改先输出方案确认，不直接执行
- 归档文件（决策日志归档）默认不读、不写，仅在执行归档动作时按维护规范操作
