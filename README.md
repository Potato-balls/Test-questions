# 地址列表组件 - 多端适配

## 项目简介

基于 Taro 框架开发的移动端地址列表组件，支持以下五端：
- H5
- 微信小程序
- 支付宝小程序
- 抖音小程序
- React Native

## 核心功能

### 第三行重点实现

**标签布局规则：**
1. 标签字数不固定（中文/英文混合）
2. 标签可放在第一行开头，也可在第二行作为结尾
3. 第二行作为结尾时，标签总宽度最宽不能超过 50%
4. 地址最多显示两行

### 组件特性

- ✅ 响应式标签Badge，支持7种类型（常用、公司、距离最近、父母家、学校、家、上次下单）
- ✅ 智能标签分行算法，自动计算宽度分配
- ✅ 多端样式兼容（H5/微信/支付宝/抖音/RN）
- ✅ Safe Area 适配（iPhone X 系列）
- ✅ 选中状态高亮
- ✅ 编辑按钮交互

## 技术栈

- **框架**: Taro 4.2.1 (React + TypeScript)
- **样式**: SCSS
- **构建**: Webpack 5
- **多端支持**: 微信/支付宝/抖音/H5/RN

## 项目结构

```
src/
├── pages/
│   └── index/
│       ├── index.tsx      # 主页面组件
│       └── index.scss     # 样式文件
├── app.tsx                # 应用入口
├── app.ts                 # 应用配置
├── app.scss               # 全局样式
└── index.html             # H5 HTML 模板
config/
├── index.ts               # Taro 配置
├── dev.js                 # 开发配置
└── prod.js                # 生产配置
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# H5
npm run dev:h5

# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:swan

# 抖音小程序
npm run dev:tt

# React Native
npm run dev:rn
```

### 生产构建

```bash
# H5
npm run build:h5

# 微信小程序
npm run build:weapp

# 支付宝小程序
npm run build:swan

# 抖音小程序
npm run build:tt

# React Native
npm run build:rn
```

## 提示词记录

### AI 辅助开发提示词

```
还原左侧视觉稿为一个移动端地址列表组件，使用最新 React 技术栈。

核心需求：
1. 第三行是最需要实现的，标签字数不固定
2. 标签可放第一行开头或第二行结尾，第二行结尾时最宽占50%
3. 地址最多两行
4. 多端兼容：RN、微信、H5、支付宝、抖音

技术方案：
- 使用 Taro 框架实现多端适配
- 使用 SCSS 编写样式
- 实现智能标签分配算法

GitHub 要求：
- 将提示词和相关 harness 一并提交到 GitHub
```

## 演示

访问 http://localhost:10086 查看 H5 效果

## License

MIT
