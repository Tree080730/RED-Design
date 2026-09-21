# 开发与预览

## 启动

工作目录为此文件所在目录。执行 `npm ci` 安装锁定依赖，`npm run dev` 启动。默认预览 http://localhost:5173/design-system；端口占用时以 Vite 输出为准。

查看设计系统仅启动现有预览，不重新创建项目。开发服务器端口通过时不重复启动。

## 检查

- `npm run build`：类型构建与静态生产包。
- `npm run typecheck`：独立类型检查。
- `npm run check:tokens`：所有非颜色 tokens 保持 antd 6.0.0 默认值，组件仅覆盖颜色。
- `npm run check:contrast`：关键前景背景文本对比。
- `npm test`：本地 Chrome 浏览器回归；默认端口 5173。需已安装 Google Chrome。

## 按层修改

颜色映射 → theme.ts；组件 → src/components；规范页面 → src/App.tsx；样式 → src/styles/global.css；规范说明 → design-system。

页面内的示例行为是组件沙盒，不是最终业务流程。改动后同步展示和文档。目录/命令改变时更新 `.qoder/project-adapter.md`。
