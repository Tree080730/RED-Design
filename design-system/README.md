# Food Passport Design System v0.1

状态：已实现的规范基础与交互展示；人物、食物、动作均为原创示意，最终产品视觉仍按 PRD 逐页确认。

## 设计师阅读

预览进入「设计师手册」，或访问 `/design-system#guide`。完整性结论：基础可用于逐页设计，核心业务组合与手机细节尚未完整。手册展示实际主题值，区分已实现、示例与待确认，不等同于全流程 Demo。

## 入口

- `npm install`（已有锁文件时用 `npm ci`）
- `npm run dev`，访问 `/design-system`（默认 http://localhost:5173/design-system；实际以终端输出为准）。
- `npm run build`、`npm run typecheck`、`npm run check:tokens`。
- `npm test`：浏览器回归，需要安装 Google Chrome；测试默认复用 5173 上的开发服务。

## 权威来源

| 范围 | 唯一来源 | 规则 |
|---|---|---|
| 品牌颜色 | `src/design-system/theme.ts` 中的 palette | Food Passport 品牌蓝 + 插画辅助色 |
| 品牌／语义映射 | 同文件的 brandTheme | 仅允许颜色覆盖；深色文字为项目可读性扩展 |
| 字体、字号、间距、圆角、尺寸、阴影、基础动效 | 实际安装的 `antd@6.0.0` defaultAlgorithm | 不抄数值，不重设刻度；用 theme.useToken() |
| CSS 引用 | `TokenProvider.tsx` | 从实际主题派生 `--ds-*`；色板派生 `--brand-*` |
| 控件行为 | Ant Design 实际组件 | 不画假控件 |
| 人物与食物 | `Illustrations.tsx` | 原创 SVG 示意，不使用 Duo 吉祥物或专有字体 |

- [基础与颜色映射](./foundations.md)
- [组件规范](./components.md)
- [人物与动效](./motion.md)
- [人物 v0.2 配置规范](./avatar.md)
- [项目开发规则](../RULES.md)
- [工作流与运行](../DEV-WORKFLOW.md)

## 风格边界

参考多邻国的白底、明亮配色、友好人物与食物表现。其他 token 直接继承 Ant Design，因此没有复制多邻国的大圆角、专用字体或厚底按钮；不宣称复刻其完整 UI。

规范站是评审工具，使用中文说明；未来 Demo 的用户界面仍按 PRD 默认英文。站内控件与人物选择是独立交互沙盒，切换规范栏目会重置该沙盒，不是完整业务状态持久化。

## 官方参考

- [Duolingo Color](https://design.duolingo.com/identity/color/1000)
- [Duolingo Typography](https://design.duolingo.com/identity/typography)
- [Ant Design Theme](https://ant.design/docs/react/customize-theme/)
- [Ant Design 6 migration](https://ant.design/docs/react/migration-v6/)

线上文档可能继续更新；工程与原值校验以锁定的 6.0.0 包为准。
