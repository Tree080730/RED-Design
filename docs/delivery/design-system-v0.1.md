# Design System v0.1 交付记录

日期：2026-09-21。

## 结果

已按用户指定方案建立 Duolingo 色彩风格 + Ant Design 6.0.0 非颜色 tokens 的 React / TypeScript / Vite 规范站。入口为 `/design-system`。未实现最终业务页面，未接入 AI 或后端。

## 实现

- 官方品牌色及中性色、可读性衍生前景色、颜色覆盖白名单。
- Ant Design 默认字体、字号、行高、尺寸、间距、圆角、阴影与基础动效原值继承。
- 7 个规范栏目：总览、品牌色彩、字体排版、基础变量、组件规范、人物与动效、使用约束。
- 可操作 Button、Tabs、Checkbox、Radio、Input、Switch、Modal；选择跨类共存、色值复制、token 搜索。
- 原创 SVG 人物和食物示意；切换发型、肤色、衣服、眼镜；动作状态与外观分离；重置、系统／手动减少动态效果。
- 人物 v0.2：改为头像／半身像主导的组合式编辑器，增加 6 种发型、2 种脸型、6 种肤色、5 种发色、2 种服装、眼镜与背景；加入 4 个原创人物预设。
- 人物编辑与反应预览分离，支持草稿、保存、取消回退；同一人物配置贯穿缩略图、预览和反应舞台。
- 文档索引、规则与 Project Adapter 已建立。

## 文件索引

工程与依赖：package.json、package-lock.json、tsconfig.json、vite.config.ts、index.html。

主题：src/design-system/theme.ts、TokenProvider.tsx。组件：src/components/Illustrations.tsx、Playgrounds.tsx。页面与样式：src/App.tsx、src/styles/global.css。

文档：design-system/README.md、foundations.md、components.md、motion.md、RULES.md、DEV-WORKFLOW.md、.qoder/project-adapter.md。

验证：scripts/check-tokens.ts、scripts/check-contrast.ts、playwright.config.ts、tests/design-system.spec.ts。

## 验证证据

- `npm run build`：通过，包含 TypeScript 检查。
- `npm run check:tokens`：126 项非颜色 token 与 antd 6.0.0 默认值一致；全局和组件覆盖字段仅为颜色。
- `npm run check:contrast`：10 组关键文本对比均 ≥ 4.5:1，最低为主按钮按下态 4.96:1。
- `npm test`：3 项测试通过，覆盖跨类选择、Modal 开关、人物配置跨状态保留、待确认、减少动态、重置、键盘焦点和 token 检索。
- `npm test`：4 项测试通过，新增人物部件切换、预设、保存／取消回退和跨分类保持验证。
- 7 栏目在 360/390/430/1440 CSS px 下无页面级横向溢出。
- 已人工查看桌面总览、手机总览、手机人物页截图，未发现关键内容裁切。

截图：overview-desktop.png、overview-mobile.png、character-mobile.png、avatar-v2-desktop.png、avatar-v2-mobile.png（同目录）。

## 修正记录

- 主按钮按下态文字对比不足，调整深色文字，仅修改颜色。
- 将重复暴露 radio 角色的 Segmented 替换为原生 Radio.Group。
- 为带图标的主要按钮和导航添加清晰可访问名称。
- 移动总览中的浮动标签移开人物面部。

## 已知限制

- 浏览器自动化与截图使用本机 Chrome；未声称完成 iPhone Safari 真机或完整屏幕阅读器验证。
- 人物、食物与动作是技术示意；最终画风和负向／未知分镜仍逐场景确认。
- 每个组件沙盒的状态随栏目卸载重置；本版本不是全流程 App 状态管理实现。
- 生产 JS 约 697 kB（gzip 224 kB），Vite 有大于 500 kB 的 chunk 提示；本地规范预览可用，正式站点发布前可再按栏目拆分。
- 未部署到公网，开发预览由本地 Vite 服务提供。
- 未改变 PRD 的功能范围或升级到正式识别服务。
- 参考多邻国人物编辑器的组合机制与预览结构，不复制其角色资产、专有字体或品牌图形。
