# 面试试题集合

> 前端面试三道试题的完整实现，涵盖地址列表布局、券浮层动效、面试回复邮件。

[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📋 试题概览

| 试题 | 路径 | 功能描述 | 核心难点 |
|------|------|----------|----------|
| **试题一** | `/q1` | 收货地址列表组件 | 标签智能布局、地址换行截断 |
| **试题二** | `/q2` | 优惠券浮层组件 | 抛物线飞行动效、裂变动画 |
| **试题三** | `/q3` | 面试回复邮件 | 邮件正文排版、AI 工具使用回答 |

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/Potato-balls/Test-questions.git
cd question1

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:10086
```

### 访问地址

| 页面 | URL |
|------|-----|
| 主页（试题导航） | http://localhost:10086 |
| 试题一：地址列表 | http://localhost:10086/q1 |
| 试题二：券浮层 | http://localhost:10086/q2 |
| 试题三：面试回复 | http://localhost:10086/q3 |

---

## 📝 试题一：收货地址列表

### 功能需求

- 地址列表展示，支持标签和地址文本的智能布局
- 标签固定在第一行，不折行
- 地址文本紧跟标签后排列，可换行到第二行
- 地址最多显示两行，超出部分显示省略号
- 支持特殊标签（如倒计时）固定在地址右侧
- 支持多端适配（H5/微信/支付宝/抖音/RN）

### 核心实现

**布局策略：**
```
第一行：[常用][公司] 地址文字紧跟标签后排列...
第二行：地址文字超出后从这里开始（从最左边，无标签）...
```

**关键技术点：**
- 使用 `display: -webkit-box` + `-webkit-line-clamp: 2` 实现最多两行截断
- 标签使用 `inline-block` 行内排列，与地址文字自然流式布局
- 特殊标签（如倒计时）使用条件样式，紧跟地址后
- 使用 ResizeObserver 监听容器变化，动态调整布局

**标签类型（7种）：**
| 类型 | 标签名 | 颜色方案 |
|------|--------|----------|
| `common` | 常用 | 粉色系 #FFE4E1 / #E91E63 |
| `company` | 公司 | 蓝色系 #E3F2FD / #1976D2 |
| `recent` | 上次下单 | 橙色系 #FFF3E0 / #F57C00 |
| `school` | 学校 | 紫色系 #F3E5F5 / #7B1FA2 |
| `parents` | 父母家 | 绿色系 #E8F5E9 / #388E3C |
| `home` | 家 | 黄色系 #FFF8E1 / #F9A825 |
| `distance` | 距离最近 | 青色系 #E0F7FA / #00838F |

### 移动端适配

- 视口配置：`viewport-fit=cover` 支持刘海屏/灵动岛
- 安全区适配：`env(safe-area-inset-*)` 全面适配 iPhone X+
- 触摸友好：最小触摸区域 44×44px（Apple HIG 标准）
- 暗黑模式：`prefers-color-scheme: dark` 自动适配
- 响应式断点：768px / 480px 两档移动端优化

---

## 🎫 试题二：券浮层组件

### 功能需求

- 底部弹出浮层，展示优惠券列表
- 点击「立即领券」按钮，裂变出 1~4 张新券
- 新券以**三次贝塞尔抛物线**动画飞向列表对应卡片位置
- 着陆后新券**高亮闪烁** 3 次，1.8 秒后自动消除
- 支持拖拽手势关闭浮层
- 点击遮罩也可关闭浮层

### 核心实现

**抛物线动画：**
```typescript
// 三次贝塞尔曲线插值
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

// 控制点设置
const midY = (item.fromY + item.toY) / 2;
const cp1y = midY - 150;  // 控制点1更高，形成明显抛物线
const cp2y = midY - 120;  // 控制点2稍低，平滑过渡到终点
```

**动画参数：**
| 参数 | 值 | 说明 |
|------|-----|------|
| 时长 | 700ms | 完整的飞行动画时间 |
| 缓动函数 | easeInOutCubic | 先加速后减速 |
| 缩放 | 1.0 → 0.7 | 飞行过程中逐渐缩小 |
| 透明度 | 1.0 → 0.7 | 飞行过程中逐渐淡出 |

**裂变动效：**
- 点击按钮产生 1~4 张随机新券
- 每张券从按钮中心出发，沿抛物线飞向对应卡片
- 落点计算：`rect.left + rect.width / 2`, `rect.top + rect.height / 2`
- 多券分裂：`col = i % 2` 左右分列，`row = Math.floor(i / 2)` 分行

### 多端兼容性策略

| 平台 | 适配方案 |
|------|----------|
| H5 | 直接使用，`requestAnimationFrame` + `will-change` GPU 加速 |
| 微信小程序 | 将 `requestAnimationFrame` 替换为 `wx.createAnimation` |
| React Native | 改用 `Animated.timing` + `useNativeDriver: true` |
| 支付宝/抖音 | 同微信小程序适配方案 |

---

## ✉️ 试题三：面试回复邮件

### 功能需求

- 以邮件正文形式回答三个面试问题
- 采用专业邮件排版样式
- 支持多端适配

### 问题回答要点

**一、日常开发中 AI 工具使用情况**
- AI 作为辅助工具，非完全依赖
- AI 参与比例：40%~60%
- 最终代码结构、业务逻辑、技术方案由开发者负责
- 不直接复制 AI 生成代码上线

**二、使用的 AI 工具和工作流**
- 工具：Claude Code、ChatGPT、Cursor/Codex
- 工作流：分析需求 → 方案设计 → 分步开发 → 排查问题 → Code Review
- 关注：上下文管理、任务拆分、工具调用

**三、AI 在其他工作中的应用**
- 需求分析、文档阅读总结
- 历史代码分析、技术方案整理
- 测试用例编写、技术文档优化
- 面试准备、新技术学习

---

## 🛠️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | ^18.2.0 |
| 语言 | TypeScript | ^5.0.0 |
| 构建 | Vite | ^5.0.0 |
| 路由 | react-router-dom | ^7.18.3 |
| 样式 | SCSS (sass-embedded) | ^1.104.1 |

---

## 📁 项目结构

```
src/
├── components/
│   ├── AddressList/
│   │   ├── AddressList.tsx    # 试题一：地址列表组件
│   │   └── AddressList.scss   # 样式文件
│   ├── CouponFloat/
│   │   ├── CouponFloat.tsx    # 试题二：券浮层组件
│   │   └── CouponFloat.scss   # 样式文件
│   └── Questions/
│       ├── QuestionsIndex.tsx # 主页：三个试题入口导航
│       ├── Question2.tsx      # 试题二入口
│       ├── Question3.tsx      # 试题三入口
│       └── Questions.scss     # 主页样式
├── app.tsx                    # 路由配置
├── main.tsx                   # 入口文件
├── index.html                 # HTML 模板
└── env.d.ts                   # TypeScript 类型声明
```

---

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 10086）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview

# TypeScript 类型检查
npx tsc --noEmit --skipLibCheck
```

---

## 📱 移动端适配

### 视口配置（index.html）

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="format-detection" content="telephone=no" />
```

### CSS 移动端关键样式

| 属性 | 作用 | 适用场景 |
|------|------|----------|
| `min-height: 100dvh` | 动态视口高度 | body, .page-container |
| `env(safe-area-inset-*)` | 安全区适配 | padding/margin |
| `-webkit-tap-highlight-color: transparent` | 移除 iOS 点击高亮 | 所有可交互元素 |
| `-webkit-touch-callout: none` | 禁止长按弹出菜单 | body |
| `overscroll-behavior-y: contain` | 禁止弹性滚动穿透 | html |

---

## 🔍 代码质量

### Git 提交规范

```
<type>: <subject>

<body>

<footer>
```

**Type 类型：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具变更

### 质量检查

```bash
# TypeScript 检查
npx tsc --noEmit --skipLibCheck

# 生产构建
npm run build

# 路由健康检查
curl -s http://localhost:10086/q1 | grep -c "root"
```

---

## 🌐 在线演示

- 主页：https://github.com/Potato-balls/Test-questions
- 本地开发：http://localhost:10086

---

## 📄 License

MIT License

---

## 👤 作者

- 姓名：sunminghong
- GitHub：https://github.com/Potato-balls

---

**最后更新**: 2026-09-16
