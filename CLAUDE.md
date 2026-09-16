# CLAUDE.md - 面试试题项目规范

## 项目概述

这是一个包含三个面试试题的 React 项目，使用 React 18 + TypeScript + Vite 开发，支持 H5/微信/支付宝/抖音/React Native 多端适配。

| 试题 | 路径 | 功能 |
|------|------|------|
| 试题一 | `/q1` | 地址列表组件（标签智能布局） |
| 试题二 | `/q2` | 券浮层（抛物线动效） |
| 试题三 | `/q3` | 待实现 |

**核心功能：**
- 地址列表展示，支持标签和地址文本的智能布局
- 标签固定在第一行，地址文本可折行到第二行
- 支持7种标签类型（常用、公司、距离最近、父母家、学校、家、上次下单）
- 多端适配指南（H5/微信/支付宝/抖音/React Native）

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | ^18.2.0 |
| 语言 | TypeScript | ^5.0.0 |
| 构建 | Vite | ^5.0.0 |
| 样式 | SCSS (sass-embedded) | ^1.104.1 |
| 多端方案 | Taro | 4.2.1（迁移指南） |

## 项目结构

```
src/
├── components/
│   ├── AddressList/
│   │   ├── AddressList.tsx    # 试题一：地址列表（标签智能布局）
│   │   └── AddressList.scss
│   ├── CouponFloat/
│   │   ├── CouponFloat.tsx    # 试题二：券浮层（抛物线动效）
│   │   └── CouponFloat.scss
│   └── Questions/
│       ├── QuestionsIndex.tsx # 主页：三个试题入口
│       ├── Question2.tsx      # 试题二入口组件
│       └── Questions.scss
├── App.css                    # 全局样式重置
├── app.tsx                    # 路由配置（react-router-dom）
├── main.tsx                   # 入口文件
└── index.html                 # HTML 模板

config/
└── index.ts                   # Taro 配置（用于多端迁移）

根目录：
├── package.json               # 依赖配置（含 react-router-dom）
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
├── README.md                  # 项目说明文档
├── PROMPT.md                  # AI 辅助开发提示词
└── GITHUB_PUSH.md             # GitHub 推送指南
```

## 开发规范

### 代码风格

1. **TypeScript**
   - 所有组件必须使用 TypeScript
   - 定义清晰的接口和类型
   - 避免使用 `any`，使用具体类型

2. **组件命名**
   - 组件文件名使用 PascalCase：`AddressList.tsx`
   - 组件名与文件名一致
   - 导出方式：`export default ComponentName`

3. **样式规范**
   - 使用 SCSS 编写样式
   - 类名使用 kebab-case：`address-line`, `tag-badge`
   - 避免使用全局样式，优先使用 CSS Modules 或 scoped 样式
   - 像素单位使用 `px`，Taro 会自动转换

### 核心算法

**标签与地址布局算法**（位于 `AddressList.tsx`）：

```typescript
// 检测第一行是否溢出，动态显示第二行
const checkOverflow = () => {
  if (line1Ref.current) {
    const { scrollWidth, clientWidth } = line1Ref.current;
    setNeedsSecondLine(scrollWidth > clientWidth);
  }
};

// 估算标签宽度（像素）
const estimateTagWidth = (tag: Tag): number => {
  const text = tag.label;
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // 中文字符约 20px，英文/数字约 12px
    width += charCode > 127 ? 20 : 12;
  }
  return width + 24; // padding: 4px * 2 + border-radius
};
```

**关键规则：**
- 标签固定在第一行，不折行
- 地址文本在标签后，可折行到第二行
- 第二行只显示地址文本，不包含标签
- 使用 JavaScript 检测溢出，而非纯 CSS 截断
- **第三行标签智能分配**：当标签数 > 2 且地址溢出时，多余标签尝试放到第二行末尾
- **第二行标签宽度限制**：总宽度不超过容器宽度的 50%

**第三行标签分配算法**：
```typescript
if (address.tags.length > 2 && hasOverflow) {
  const remainingTags = address.tags.slice(2);
  const maxWidth = containerWidth * 0.5;
  let actualTags: Tag[] = [];
  let totalWidth = 0;
  
  for (const tag of remainingTags) {
    const tagWidth = estimateTagWidth(tag);
    if (totalWidth + tagWidth <= maxWidth) {
      actualTags.push(tag);
      totalWidth += tagWidth;
    }
  }
  setSecondLineTags(actualTags);
}
```

**测试用例覆盖**：
| ID | 标签数量 | 地址长度 | 预期行为 |
|----|---------|---------|---------|
| 1-2 | 2 | 短 | 第一行显示全部标签和地址 |
| 3-4 | 2 | 中等 | 第一行显示全部标签和地址 |
| 5-6 | 0-2 | 超长 | 地址溢出，显示省略号 |
| 7 | 2 | 超长 | 地址溢出，显示省略号 |
| 8 | 3 | 超长 | 第三行出现"学校"标签（宽度 ≤ 50%） |
| 9 | 4 | 超长 | 第三行出现"父母家+学校+家"标签（总宽度 ≤ 50%） |

### 状态管理

- 使用 React Hooks（useState, useEffect, useRef）
- 避免过度状态，只在必要时使用
- 列表数据通过 props 传递

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（默认端口 10086）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 多端适配

### Taro 迁移步骤

1. **创建 Taro 项目**
   ```bash
   npx taro init address-list --template default --css sass --framework react --typescript
   ```

2. **替换组件**
   - 将 `src/components/AddressList/` 复制到 Taro 项目
   - 修改 HTML 标签为 Taro 组件：
     - `<div>` → `<View>`
     - `<span>` → `<Text>`
     - `<input>` → `<Radio>`

3. **样式适配**
   - Taro 自动将 px 转换为各端单位
   - 无需手动修改样式

### 各端注意事项

| 平台 | 注意事项 |
|------|----------|
| H5 | 直接可用，支持所有现代浏览器 |
| 微信小程序 | 使用 `wx:if` 替代 `v-if`，使用 `catchtap` 替代 `onClick` |
| 支付宝小程序 | 使用 `a:` 前缀组件 |
| 抖音小程序 | 与微信小程序类似，注意部分 API 差异 |
| React Native | 需将 Web 样式转换为 RN 样式 |

## Git 规范

### 提交信息格式

```
<type>: <subject>

<body>

<footer>
```

**Type 类型：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具变更

**示例：**
```
feat: 实现地址列表智能布局算法

- 标签固定在第一行，不折行
- 地址文本可折行到第二行
- 使用 JavaScript 检测溢出

Closes #1
```

### 分支管理

- `main`: 主分支，保持可部署状态
- `feat/*`: 功能分支
- `fix/*`: 修复分支
- 避免直接在 main 上提交

## 质量检查

### TypeScript 检查

```bash
npx tsc --noEmit --skipLibCheck
```

### 代码规范

- 遵循 ESLint + Prettier 配置
- 提交前运行 `npm run build` 确保无类型错误
- 使用 VS Code 的 TypeScript 诊断功能

## 常见问题

### Q: 如何添加新的标签类型？

1. 在 `Tag` 接口的 type 字段添加新类型
2. 在 SCSS 中添加对应样式类
3. 更新 `MOCK_ADDRESSES` 测试数据

### Q: 如何调整布局规则？

修改 `AddressList.tsx` 中的 `AddressLine` 组件：
- 调整溢出检测逻辑
- 修改第二行显示规则
- 调整样式类名

### Q: 如何适配不同屏幕尺寸？

- 使用相对单位（rem, vw）或让 Taro 自动转换
- 添加响应式媒体查询
- 测试不同设备尺寸

## 文件路径参考

| 文件 | 用途 |
|------|------|
| `src/components/AddressList/AddressList.tsx` | 核心组件，包含布局算法 |
| `src/components/AddressList/AddressList.scss` | 样式定义 |
| `src/main.tsx` | 应用入口 |
| `vite.config.ts` | Vite 构建配置 |
| `config/index.ts` | Taro 多端配置（迁移时用） |
| `PROMPT.md` | AI 辅助开发提示词记录 |
| `README.md` | 项目说明文档 |
| `GITHUB_PUSH.md` | GitHub 推送指南 |

## 性能优化建议

1. **列表虚拟化**：当地址数量超过 50 条时，考虑使用虚拟列表
2. **图片优化**：使用 WebP 格式，添加懒加载
3. **代码分割**：使用 React.lazy 实现路由级代码分割
4. **样式优化**：提取公共样式，减少重复代码

## 安全注意事项

1. 用户输入需要进行 XSS 过滤
2. 手机号等敏感信息使用脱敏处理
3. 不要在前端硬编码 API 密钥

## 试题二：券浮层（CouponFloat）

### 功能说明

- 底部弹出浮层，展示优惠券列表
- 支持上下拖拽手势（touch start/move/end）
- 点击「立即领券」按钮，裂变出 1~4 张新券
- 新券以**三次贝塞尔抛物线**动画飞向列表对应卡片位置
- 着陆后新券**高亮闪烁**3次（box-shadow 脉冲），1.8秒后自动消除
- 点击遮罩或向下滑动可关闭浮层
- **领取横幅随机插入列表**：每次打开浮层，横幅随机出现在券列表的某个位置（0~length 之间），模拟真实场景中随机插入广告位

### 核心技术点

```typescript
// 抛物线路径：三次贝塞尔曲线
function cubicBezier(t, p0, p1, p2, p3) {
  const mt = 1 - t;
  return mt^3*p0 + 3*mt^2*t*p1 + 3*mt*t^2*p2 + t^3*p3;
}

// 控制点：起点向上偏移 100px 形成弧线
const cp1y = fromY - 100;
const cp2y = fromY - 60;
```

- **FlyFrom**: 按钮中心绝对坐标（getBoundingClientRect）
- **FlyTo**: 目标卡片中心（根据列表 DOM 测量计算）
- **动画时长**: 650ms，easeInOutCubic 缓动
- **多券分裂**: 按 `col = i % 2` 左右分列，`row = Math.floor(i / 2)` 分行
- **随机横幅位置**: 组件挂载时随机生成 0~coupons.length 之间的位置索引，将横幅插入该位置

### 文件路径

| 文件 | 说明 |
|------|------|
| `src/components/CouponFloat/CouponFloat.tsx` | 主组件 |
| `src/components/CouponFloat/CouponFloat.scss` | 样式 |
| `src/components/Questions/Question2.tsx` | 试题二入口 |

### 多端兼容性策略

- H5：直接使用，`requestAnimationFrame` + `will-change` GPU 加速
- 微信小程序：将 `requestAnimationFrame` 替换为 `wx.createAnimation`，触摸事件改用 `catchtouchstart/move/end`
- React Native：需改用 `Animated.timing` + `useNativeDriver: true`
- 支付宝/抖音：同微信小程序适配方案

---

## 移动端适配规范

### 视口配置（index.html）

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="format-detection" content="telephone=no" />
```

**关键点：**
- `viewport-fit=cover`：支持 iPhone X 及以上机型的刘海屏/灵动岛
- `user-scalable=no`：禁止用户缩放，适合单页应用
- `apple-mobile-web-app-capable`：iOS 添加到主屏幕后全屏显示
- `format-detection`：禁止 iOS 自动识别电话号码

### CSS 移动端关键样式

| 属性 | 作用 | 适用场景 |
|------|------|----------|
| `min-height: 100dvh` | 动态视口高度，解决移动端地址栏问题 | body, .page-container |
| `env(safe-area-inset-*)` | 安全区适配（刘海屏、底部横条） | padding/margin |
| `-webkit-tap-highlight-color: transparent` | 移除 iOS 点击高亮 | 所有可交互元素 |
| `-webkit-touch-callout: none` | 禁止长按弹出菜单 | body |
| `overscroll-behavior-y: contain` | 禁止弹性滚动穿透 | html |
| `-webkit-font-smoothing: antialiased` | iOS 字体平滑 | body |
| `user-select: none` | 禁止文字选中 | html |

### 触摸友好设计

- **最小触摸区域**：44×44px（Apple HIG 标准）
- **active 状态反馈**：使用 `:active` 而非 `:hover` 提供点击反馈
- **按钮尺寸**：编辑按钮、复选框区域均已调整为 44px 触摸热区
- **地址项最小高度**：88px（2×44px），确保点击无歧义

### 响应式断点

| 断点 | 适用设备 | 主要调整 |
|------|----------|----------|
| `max-width: 768px` | iPad 竖屏及更小 | 减小内边距 |
| `max-width: 480px` | 主流手机 | 字体缩小 2px，间距调整 |
| `orientation: landscape` | 横屏手机 | 紧凑布局 |

### 暗黑模式支持

使用 `@media (prefers-color-scheme: dark)` 实现自动适配，无需用户手动切换。

### 各端特殊处理

| 平台 | 特殊处理 |
|------|----------|
| iOS Safari | safe-area + dvh + 禁止缩放 |
| 微信浏览器 | 禁用弹性滚动，使用 catchtap |
| 支付宝小程序 | constant() + env() 双写安全区 |
| 抖音小程序 | 额外底部间距 28px |
| React Native | 样式需转换为 RN StyleSheet |

### 已知限制与解决方案

1. **第二行标签宽度估算**：当前使用固定 18px/字符估算，极端字体下可能有偏差。解决方案：生产环境可通过 DOM 测量精确计算。

2. **iOS 15 以下 dvh 不支持**：已添加 `min-height: 100vh` 作为降级方案。

3. **Android Chrome 地址栏**：使用 `dvh` 单位自动适配，无需额外 JS 监听。

4. **微信小程序 radio 样式**：需使用 `wx-radio-input` 自定义样式，H5 的 accent-color 无效。

## 更新记录

- **2026-09-15**: 初始版本，实现地址列表组件基础功能
- **2026-09-15**: 重构布局算法，实现标签固定第一行，地址可折行
- **2026-09-15**: 添加 Taro 多端适配指南
- **2026-09-15**: 全面移动端适配优化（视口配置、safe-area、触摸热区、暗黑模式）
- **2026-09-15**: 添加试题二券浮层组件（抛物线动效、领券裂变、高亮闪烁）及主页入口导航
- **2026-09-15**: 将领取横幅改为随机插入券列表位置（每次打开浮层随机定位）
- **2026-09-15**: 修复抛物线动效起点：点击横幅时飞行动画从横幅中心出发，点击底部按钮时从按钮中心出发；落点使用 DOM getBoundingClientRect() 精确测量卡片正中心坐标，消除固定估算误差
- **2026-09-15**: 重构时序机制：用 RAF 双重等待 + ref 状态机替代 rAF 手动等待，解决 React 批量更新竞态导致 DOM 未就绪的问题
- **2026-09-15**: 修复动画触发问题：使用 `animStateRef` 状态机（idle→measuring→flying）防止重复触发，确保每次点击只产生一次飞行动画
- **2026-09-15**: 试题一添加第三行标签智能分配算法：标签数 > 2 且地址溢出时，多余标签放到第二行末尾，总宽度不超过容器 50%；新增测试用例 ID 8-9 覆盖该逻辑

---

**维护者**: sunminghong  
**最后更新**: 2026-09-15（试题一第三行标签分配算法 + 试题三面试回复邮件）
