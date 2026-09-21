# Project Adapter — Food Passport

2026-09-21。首次实施：用户已授权 Duolingo 颜色和风格 + Ant Design 6.0 其他 tokens 的 Design System。

- 项目：React + TypeScript + Vite，移动浏览器 Demo，桌面兼容的规范站。
- 包管理：npm，精确版本与 package-lock.json。
- 依赖：antd 6.0.0，React 19；版本见 package.json。
- 命令与预览：见 ../DEV-WORKFLOW.md；默认 /design-system，端口 5173。
- tokens：src/design-system/theme.ts；运行时桥接 TokenProvider.tsx。
- 组件：src/components；页面：src/App.tsx；样式：src/styles/global.css。
- 复用优先级：antd 组件 → 项目组合组件 → 按需新增。
- 规则：见 ../RULES.md；设计系统索引：../design-system/README.md。
- 交付目录：docs/delivery；spec：.qoder/specs。
- 同步：预览直接使用实际 theme 和组件；改用法时同步文档。
- 检查：DEV-WORKFLOW.md 所列命令 + 实际浏览器截图审阅。
- 未进入完整业务页面；人物与食物为原创示意资产。

人物 v0.2：新增 src/components/AvatarBuilder.tsx 与 design-system/avatar.md，编辑与动作工作台分离；其他目录与命令不变。

品牌蓝调整：用户要求区别于多邻国，主色改为 #2563EB；非颜色 token 仍继承 Ant Design 6.0。
