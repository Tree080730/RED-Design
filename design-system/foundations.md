# Foundations

## 颜色

palette 使用 Food Passport 品牌蓝和插画辅助色。`colorPrimary` → Passport Blue（#2563EB），hover → #1D4ED8，active → #1E40AF；`colorSuccess` → Feather Green；`colorInfo` → Macaw；`colorWarning` → Bee；`colorError` → Cardinal。背景以 Snow / Polar 为主，主体文字使用 Eel。

鲜亮颜色适合视觉强调，不能默认配白色小字。品牌蓝按钮使用白色文字 `colorTextLightSolid`。状态标签前景使用更深的 `colorSuccessText`、`colorErrorText`、`colorWarningText`、`colorInfoText`。这些深色值是项目衍生色，不标称官方色板。

Tabs 的选中/悬停文字，Radio、Checkbox、Switch 的选中强调使用深蓝颜色覆盖，以提升白底可读性与控件辨识。它们没有覆盖任何非颜色组件 token。色板区展示原始色，语义区展示当前运行时映射，两者不得混淆。

人物肤色、发色与食物局部颜色属于插画资产颜色，不反向改写全局主题。

## 继承

`ConfigProvider` 使用 `defaultAlgorithm`。字号、字重、字体族、行高、padding、margin、borderRadius、controlHeight、lineWidth、boxShadow、motionDuration、motionEase 保持原值。`check:tokens` 对所有非颜色全局 token 与默认值比较，而非只校验展示表里的部分项目；组件覆盖额外检查只能为颜色字段。

CSS 使用 `--ds-fontSize`、`--ds-paddingLG` 等真实派生变量。不存在另外一份手工维护的 tokens.css/JSON 副本。

## 布局与可访问性

- 布局断点、侧栏宽度、SVG 坐标属于页面/资产几何，不是基础 token 覆盖。
- 自定义导航与人物色块的最小点击区域由 `controlHeightLG + marginXXS` 组合得到；不改 Ant Design 原生控件尺寸。
- 移动展示采用单列和可滚动导航；主内容不能横向溢出，宽 token 表格可在自己的容器内滚动。
- 文字层级使用 Heading1/2/3、Body、Caption；关键原因不使用低对比弱化文字。
- 操作必须有文本或可访问名称；状态不能仅靠色彩传达。
- 不承诺本规范站已经覆盖所有浏览器、屏幕阅读器或全部无障碍标准。

## 颜色检查

关键文本组合的对比由 `npm run check:contrast` 计算。装饰色、插画与禁用态不包含在普通正文文本检查中。显示“符合样例条件”不能推导成真实食物安全保证。
