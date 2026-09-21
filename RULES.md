# Food Passport 设计与实现约束

1. 以 PRD v0.4 为业务依据；Design System 不自行增加业务范围。
2. 品牌颜色只改 `src/design-system/theme.ts`。其他基础和组件 token 直接复用 antd 6.0.0，不复制数值另建刻度。
3. CSS 从 TokenProvider 的 `--ds-*` 读取；画布布局、断点、SVG/动画几何与插画资产颜色为明确例外。
4. 优先复用 Ant Design 控件与项目组合组件；不为每页重写按钮或条件选择。
5. 所有组件变更同步规范展示页与 design-system 文档。以实际组件预览，不维护静态假样式。
6. 人物配置与饮食条件、结果状态分别管理。未知不能被缺省为匹配。
7. 保持少文字、可读的状态和原因，不用颜色或角色动作独自传达所有含义。
8. 业务页面、最终人物、最终动效按用户约定逐步确认。示意素材不得标为已确认最终设计。
9. 新依赖与 token 来源发生变化时更新 spec 和项目适配文档。
10. 交付前运行 build、typecheck、check:tokens、check:contrast、test；检查结果与限制如实记录。
