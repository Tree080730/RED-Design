# Components

## 原生基础

Button、Tabs、Checkbox、Radio、Input、Switch、Modal 直接使用 antd 6.0.0。继承 token，必要修改颜色通过 ConfigProvider 白名单实现。默认、禁用、加载、选中、焦点等样例在规范站中展示。

## 组合组件

| 组件 | 输入／输出 | 状态与约束 |
|---|---|---|
| StatusLabel | match / conflict / unknown → 图标与短文案 | 不处理业务判定，不将绿视为安全认证 |
| ChoiceDemo | 分类 + 选中项 → 所有分类的汇总 | Tabs 只切换展示；复选框可跨类共存 |
| Avatar | AvatarConfig + Mood → SVG | 发型、肤色、服装、眼镜保持一致；viewBox 统一 |
| FoodSticker | 样例 SVG + className → 贴纸 | 原创面条示意，非实时生成 |
| CharacterLab（AvatarBuilder.tsx） | 编辑草稿／已保存配置与结果选择 → 头像预览和动画样例 | 保存应用；取消回退；状态与外观分离，离开取消计时 |
| TokenProvider | theme.useToken → CSS 变量 | 单一运行时来源，不复制刻度 |

人物 v0.2 字段：skin、hair（wave / crop / bob / curly / ponytail / bald）、hairColor、shirt、glasses、glassesShape、face、body、outfit、background。Mood：idle、eating、match、conflict、unknown。详见 [人物规范](./avatar.md)。

## 交互

- 沟通卡 Modal 可打开、关闭；键盘可操作，沿用 Ant Design 焦点行为。
- 色板点击复制十六进制值；剪贴板不可用时显示颜色值，不声称复制成功。
- token 搜索有无结果状态。
- 角色编辑与反应分成两个模式。更换部件只更新草稿；保存后用于动作；取消回退到已保存形象。重置动作不重置人物。
- 规范导航切换栏目，不触发真实扫描或询问。
- 纯图标按钮必须指定 aria-label；非必要图标不能污染主要操作名称。

新增组件时至少记录职责、输入输出、状态、使用 token、可访问交互和展示位置。组件不得内置真实过敏推断。
