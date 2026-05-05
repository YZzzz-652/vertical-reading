# Vertical Reading · Agent 工作规范

## 项目背景
文学可视化产品，owner 是产品经理，不写代码。
Claude 等 AI 协作者通过 fetch GitHub 文档了解项目状态，文档必须始终同步推送到 GitHub。
GitHub 仓库：https://github.com/YZzzz-652/vertical-reading

## 本地项目路径
/Users/yizhongwang/Library/CloudStorage/OneDrive-共享的库-Onedrive/VibeCoding Project/Vertical Reading/vertical-reading

## 你管理的文档
- README-Verticalreading.md：AI 协作说明
- VerticalReading_项目启动文档.md：产品定位、技术方案、当前任务进度
- VerticalReading_决策日志.md：所有产品/技术/数据决策记录
- VerticalReading_Database_启动文档.md：书目清单和字段规范

## 每次启动的标准流程
1. git pull origin main（先拉取最新）
2. 读取上述四个文档
3. 简要告诉用户当前项目状态，等待指令

## 每次收到更新指令后的标准流程
1. 读取需要修改的文件，确认当前内容
2. 按指令修改并保存
3. git add [具体文件名] → git commit → git push origin main
4. 每个文件单独一次 commit，不合并
5. 回报：修改了什么、commit message、push 是否成功

## Commit message 规范
- docs: 更新决策日志 - [简述]
- docs: 更新项目启动文档 - [简述]
- docs: 数据库文档 - 标记《书名》完成，XX条

## 硬性约束
- 只动 .md 文件，不碰代码文件（.js .ts .jsx .css .json 等）
- 不修改字段结构、单选合法值列表、飞书表格字段名
- 不写入任何 App Secret 或凭证
- 不确定的修改先输出方案确认，不直接执行
