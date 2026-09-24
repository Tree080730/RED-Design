# Check → Checking 连续演示

最新结果演示：默认 `/demo` 播放 Can eat；`/demo?result=cannot-eat` 走相同拍摄与咀嚼流程，结束后播放 Cannot eat。负向口腔按用户整页参考图实现：上排白牙、深红口腔、浅绿色向下延伸的流体与少量红色/棕色颗粒。两种结果均直接展示食物与结果短文案，不恢复页面上的演示控制按钮。两者都是预设视觉效果，与真实饮食匹配无关。

沿用 Check 页布局。点击 Check food 后，在同一个 PhotoConfirm 场景内完成按钮淡出、口水隐藏、照片缩小下落、同一矢量面部放大。全部动作由同一个 requestAnimationFrame 时间轴驱动：照片连续缩小并加速下落，约 1460ms 完成吞入；1500ms 开始显示气泡，1540ms 开始柔和接入咀嚼，面部在 1680ms 完成展开。头部和鼻子随后固定，口腔在 460ms 内收拢为波浪嘴线，嘴线与右侧鼓起脸颊按 940ms 周期连续起伏，表现闭嘴咀嚼。运动函数在 journeyMotion.ts 中统一定义，避免分段 CSS easing 导致停顿。

屏幕中上部显示 100×100 正圆思考气泡，食物字号 58px，每 120ms 切换。依照最新用户要求，演示控制区已移除。当前先演示「可以吃」：咀嚼 3 秒后自动停止，720ms 内从闭嘴状态过渡为顶部平缓、底部圆弧的大笑嘴形，包含白色上下牙齿与粉色双瓣舌头。气泡显示勾号和 Can eat。这只是固定的正向视觉演示，不读取饮食条件、不产生实际安全判断；不能吃效果待后续设计。照片仍为现有灰色占位。

返回检查前画面会重置场景；Again 返回相机。离开场景取消计时和动画。系统减少动态时跳过大幅转场、咀嚼和食物轮换。原 Analyzing 文件保留，但不再作为业务流程的独立页面挂载。

实现：PhotoConfirm.tsx、JourneyMouth.tsx、photo-confirm.css。402×874 截图：food-journey-checking.png、food-journey-can-eat.png。

验证：构建、类型、126 项 token、10 组文本对比度、13 项浏览器测试通过；包含同一 SVG 节点连续变形、结果切换、重播、中途返回与减少动态。构建仍有已有的 JS 包体积提示。动画已分阶段检查，尚未进行 iPhone Safari 真机性能验收。
# 2026-09-22 mouth setup update

The `/demo` entry now starts with a light mouth setup screen based on the approved reference composition. It keeps the existing mouth-only options (nose, mouth, teeth, tongue and interior color), uses the blue brand theme, and saves before opening dietary preferences. The saved mouth interior and tongue colors, nose shape and custom teeth are reused by the journey SVG.
