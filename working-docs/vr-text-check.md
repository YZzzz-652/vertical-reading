# 文学译本原文摘录核对工作流（外部副本）

> 本文件对应 Kimi Skill `vr-text-check` 的 SKILL.md，供 Claude 或其他 AI 手动调用时参考。

## 触发条件

当用户需要对一本书或多本书的 CSV 数据中的「原文摘录」字段进行逐条核对时。触发关键词：原文摘录核对、书籍核对、原文核对。

## 目录约定（绝对路径）

- **CSV 输入目录**：`/Users/yizhongwang/Library/CloudStorage/OneDrive-共享的库-Onedrive/VibeCoding Project/Vertical Reading/书籍数据/飞书数据生产`
- **Epub 原文目录**：`/Users/yizhongwang/Library/CloudStorage/OneDrive-共享的库-Onedrive/VibeCoding Project/Vertical Reading/书籍数据/原版书`
- **核对结果输出目录**：`/Users/yizhongwang/Library/CloudStorage/OneDrive-共享的库-Onedrive/VibeCoding Project/Vertical Reading/书籍数据/飞书数据生产/核对结果`

## 文件名匹配逻辑

1. 用户说「核对《书名》」时：
   - 在 CSV 输入目录下搜索所有 `.csv` 文件
   - 读取每个 CSV，在「书名」列中查找包含该书名的行
   - 找到唯一匹配 → 使用；多个匹配 → 列出文件让用户选；无匹配 → 报错
2. 用户直接说「核对 XXX.csv」时：直接定位该文件名
3. 用户说「核对第 N 批」时：尝试匹配 `第N批.csv` 或 `第N批_扩库.csv` 等变体

## 输出目录与命名规则

- **输出目录**：CSV 输入目录下的 `核对结果/` 子目录
- **命名规则**：`{原CSV文件名}-核对-YYYYMMDD}.csv`
- 示例：`第一批.csv` → `核对结果/第一批-核对-2026-06-29.csv`
- **不覆盖原文件**，核对结果另存新文件

## 工作流

1. **识别用户指令**：提取书名或 CSV 文件名
2. **文件定位**：按「文件名匹配逻辑」找到对应的 CSV 和 epub
3. **读取核对指令**：读取 `vr-text-check-prompt.md` 获取详细核对规则
4. **逐条核对**：对 CSV 每一条记录，根据「书名」「事件描述」「书中位置」定位 epub 段落，逐字比对「原文摘录」
5. **输出结果**：在 CSV 末尾追加第 21 列「核对状态」和第 22 列「核对后原文」
6. **附核对报告**：在 CSV 后输出简短统计报告
7. **保存文件**：将完整 CSV 保存到输出目录，按命名规则命名

## 报告格式

```
## 核对报告
- 总条数：X
- 一致（无需修改）：X 条
- 微调：X 条（列出 ID）
- 替换：X 条（列出 ID）
- 未找到：X 条（列出 ID + 原因）
```

## 注意事项

- 每次核对完一本（或一批），更新 `working-docs/VerticalReading_书目清单.md` 中对应书的「原文核对」列状态
- 如果某书被拆分到多个 CSV 中，各批次分别输出，结果 CSV 命名体现批次名
- 用户提供的 CSV 和 epub 中可能存在繁体、英文、法文等，按核对指令中的语言处理规则执行
- 详细核对规则（逐条比对标准、输出格式、语言处理）见同目录下的 `vr-text-check-prompt.md`
