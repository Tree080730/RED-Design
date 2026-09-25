# Food Passport 完整复原说明

本项目必须通过 Git 仓库复原，不得根据截图、口头描述或旧交付图重新生成。用于迁移的固定版本为 Git 标签 `demo-reproduction-2026-09-25`。

## 1. 获取唯一正确的源码

```sh
git clone https://github.com/Tree080730/RED-Design.git
cd RED-Design
git checkout demo-reproduction-2026-09-25
git status --short
```

最后一条命令必须无输出。不要重新初始化 React/Vite，不要升级依赖，不要删除规范、测试或 `public/` 资产。

## 2. 使用锁定环境

- Node.js：`22.23.2`
- npm：`10.9.8`
- 依赖来源：`package-lock.json`
- 自动化浏览器：Google Chrome，由 Playwright 的 `channel: "chrome"` 指定

使用 nvm 时：

```sh
nvm install
nvm use
npm --version
npm ci
npx playwright install chrome
```

有系统依赖安装权限的 Linux 平台可使用 `npx playwright install --with-deps chrome`。必须使用 `npm ci`；不要使用 `npm install` 改写锁文件。

## 3. 完整验收

```sh
npm run verify
```

该命令依次执行类型检查、Ant Design Token 约束、文本对比度、生产构建和 Playwright 全量回归。全部通过才表示功能、结构、响应式布局和核心动画状态已复原。

## 4. 启动演示

```sh
npm run dev -- --host 0.0.0.0 --port 5173
```

主要入口：

- `/demo`：默认可吃流程
- `/demo?result=cannot-eat`：宫保鸡丁不能吃流程
- `/demo?result=unknown`：未知结果与服务员确认流程
- `/design-system#guide`：设计系统手册

新平台需要公开或转发 5173 端口。不要让平台自动改用其他框架、替换 Vite 配置或生成新的入口文件。

## 5. 视觉一致条件

产品基准是 402×874 CSS viewport，浏览器缩放 100%。源码、SVG、PNG、CSS、动画时间和依赖版本均已纳入仓库；`public/kung-pao-chicken-demo.png` 等资产不得重新压缩。

当前项目继承 Ant Design 的系统字体。不同操作系统、Chrome 版本、设备像素比和字体抗锯齿会改变最终截图的栅格像素。要求逐像素一致时，应固定以下条件：

1. 使用同一操作系统与 Chrome 版本；或在双方完全相同的容器/虚拟机中验收。
2. viewport 固定为 402×874，缩放 100%，设备像素比一致。
3. 不启用浏览器自动翻译、字体替换、页面缩放或无障碍强制字号。
4. 以 `npm run verify` 为功能基线，并对关键页面增加同一环境内的截图差异测试。

如果新平台只能使用 Linux，而原评审环境是 macOS，源码和交互可以 100% 一致，但系统字体的抗锯齿无法承诺逐像素完全相同。要消除这一差异，需要选定并合法地把 Web 字体文件纳入仓库，再统一字体渲染基线。

## 6. 给新 Coding Agent 的首条指令

> 克隆 `https://github.com/Tree080730/RED-Design.git`，检出标签 `demo-reproduction-2026-09-25`。先阅读 `AGENTS.md`、`START_HERE.md`、`HANDOFF.md`、`REPRODUCE.md`、PRD 与 `RULES.md`。严格保留现有 React + TypeScript + Vite、Ant Design 6.0.0、品牌蓝 #2563EB、全部图片/SVG/CSS/动画与路由。不要重新初始化、不要根据截图重写、不要升级依赖。使用 Node 22.23.2、npm 10.9.8，执行 `npm ci`、安装 Chrome，然后运行 `npm run verify`。只有全部检查通过后才启动 5173 端口并报告预览地址；若失败，修复环境而不是改产品实现来迎合环境。

## 7. 判断是否复原成功

- `git status --short` 无输出。
- `git describe --tags --exact-match` 输出 `demo-reproduction-2026-09-25`。
- `npm run verify` 全部通过。
- 三个 `/demo` 结果入口和设计系统入口均可访问。
- 402×874 下无横向溢出，关键动画与测试断言一致。
