# 交付说明：Food Check Details 结果详情页

> 交付人员：Codex
> 开发时间：2026-09-25
> 基线提交：`df2698d` → 当前工作区
> 改动范围：结果详情入口、详情视图、选择数据传递、测试与组件文档

## 变更摘要

- 将不可食用结果中的 `Checking Details` 从展示文字改为可聚焦、可点击的按钮。
- 新增结果详情页，展示 Demo 结果、个人条件原因、依据来源和仍未知的信息。
- 按 PRD 的过敏、饮食限制、偏好顺序保留多类原因；未知数据保持为 `Needs confirmation`。
- 返回结果页时保留原有不可食用结果状态，不重新播放检查动画。

## 文件清单

| 文件 | 类型 | 职责 |
|---|---|---|
| `.qoder/specs/2026-09-25-food-check-details-solution-spec.md` | 新增 | 已确认技术方案、范围和验收标准 |
| `src/pages/dietChoices.ts` | 新增 | 设置页与详情页共享三类选择定义和类型 |
| `src/pages/FoodCheckDetails.tsx` | 新增 | 详情内容、原因优先级、依据和未知项 |
| `src/pages/food-check-details.css` | 新增 | iPhone 优先的详情页布局与减少动态降级 |
| `src/pages/DietPreferences.tsx` | 修改 | 将当前选择传入结果流程 |
| `src/pages/PhotoConfirm.tsx` | 修改 | 接入详情状态、入口和返回 |
| `src/pages/photo-confirm.css` | 修改 | 为详情入口补充按钮和焦点样式 |
| `tests/diet-preferences.spec.ts` | 修改 | 覆盖详情原因顺序、返回状态和页面溢出 |
| `design-system/components.md` | 修改 | 登记详情页组合组件和交互规则 |

## 关键决策

- 详情页使用结果流程内部状态切换，不新增路由库，因为页面只属于当前检查会话且返回时需要保留动画结果。
- 只把 PRD 明确给出的 Peanut、No pork、Mild spice 作为脚本冲突依据；其他预置或自定义条件显示为待确认，避免把未知数据变成结论。
- 页面固定显示 `Demo result`，并说明照片不能确认隐藏配料，防止演示结果被理解为现实安全保证。

## 交互链路

```text
Can’t Eat 结果
→ 点击 Checking Details
→ 查看结果摘要
→ 按 Allergies / Dietary restrictions / Preferences 查看原因
→ 查看 Demo 依据与 Still unknown
→ 返回原结果状态
```

无个人条件时显示 `No personal result`，不生成个人化原因。系统启用减少动态时，详情页直接出现。

## 验证结果

| 检查项 | 结果 | 说明 |
|---|---|---|
| 启动检查 | 通过 | Vite 本地预览可访问 |
| 构建检查 | 通过 | `npm run build`；保留项目原有 >500 kB chunk 提示 |
| 交互检查 | 通过 | 入口、三类原因顺序、未知项、返回后保留结果均有浏览器测试 |
| 设计系统检查 | 通过 | 颜色、文字、间距、圆角复用现有 token；复用 Ant Design Button 与统一顶栏 |
| Token 检查 | 通过 | 126 项非颜色 token 与 antd 6.0.0 默认值一致 |
| 对比度检查 | 通过 | 10 组关键文字配色均不低于 4.5:1 |
| 预览验证 | 通过 | 402×874 Chrome 画布人工检查，无横向溢出，详情区域可纵向滚动 |
| 文档完整性检查 | 通过 | spec、组件文档与本交付说明已同步 |
| 自动化测试 | 通过 | 17 项 Playwright 测试通过 |

## 设计系统 / 文档同步

- 组件文档：新增 `FoodCheckDetails` 的输入、输出和状态约束。
- 页面文档：记录详情入口与返回保留结果的交互。
- Token：未修改。
- 规则：未修改。
- 预览页面：实际 `/demo?result=cannot-eat` 流程即预览入口。

## 已知问题与后续建议

- `Ask the restaurant` 当前只作为下一步说明；PRD 步骤 09–10 的双语沟通卡和模拟回复尚未实现。
- 未进行真机 iPhone Safari、动态字体和完整读屏验收。
