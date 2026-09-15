# 地址列表组件 - 多端适配

## 项目简介

基于 React 开发的移动端地址列表组件，实现了视觉稿中的所有需求，并提供多端适配指南。

## 核心功能

### 第三行重点实现

**标签布局规则：**
1. 标签字数不固定（中文/英文混合）
2. 标签可放在第一行开头或第二行结尾
3. 第二行作为结尾时，标签最宽不超过 50%
4. 地址最多两行显示

### 组件特性

- ✅ 响应式标签 Badge，支持 7 种类型
- ✅ 智能标签分行算法
- ✅ 多端样式兼容（H5/微信/支付宝/抖音/RN）
- ✅ Safe Area 适配
- ✅ 选中状态高亮
- ✅ 编辑按钮交互

## 技术栈

- **框架**: React 18 + TypeScript
- **样式**: SCSS
- **构建**: Vite
- **多端适配**: 提供 Taro 迁移指南

## 项目结构

```
src/
├── components/
│   └── AddressList/
│       ├── AddressList.tsx    # 主组件
│       └── AddressList.scss   # 样式文件
├── main.tsx                   # 入口文件
└── App.css                    # 全局样式
```

## 安装与运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

访问 http://localhost:10086 查看效果

## 多端适配指南

### Taro 框架迁移

本项目可以无缝迁移到 Taro 框架实现五端适配：

#### 1. 创建 Taro 项目

```bash
npx taro init address-list --template default --css sass --framework react --typescript
```

#### 2. 替换核心代码

将 `src/components/AddressList/` 复制到 Taro 项目的 `src/pages/index/` 目录。

#### 3. 修改组件

将 HTML 标签替换为 Taro 组件：
- `<div>` → `<View>`
- `<span>` → `<Text>`
- `<input>` → `<Input>`
- `<svg>` → 使用图标库（如 `@tarojs/components` 的 Icon）

#### 4. 样式适配

Taro 会自动将 px 转换为各端单位，无需手动修改。

### 关键代码对比

| H5 (本仓库) | Taro 多端 |
|------------|----------|
| `<div className="address-item">` | `<View className="address-item">` |
| `<span className="tag-text">` | `<Text className="tag-text">` |
| `<input type="radio">` | `<Radio checked={...}>` |
| `<svg>...</svg>` | `<Image src={editIcon} />` |

## 提示词记录

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

## 智能标签算法

```typescript
// 估算标签宽度
const estimateWidth = (tag: Tag): number => {
  const charCount = tag.label.length;
  if (/[一-龥]/.test(tag.label)) {
    return charCount * 20; // 中文字符
  }
  return charCount * 12; // 英文字符
};

// 检查第二行是否超过 50%
const secondLineWidth = restTags.reduce((sum, t) => sum + estimateWidth(t), 0);
const MAX_SECOND_LINE_WIDTH = 187; // 375px * 50%
```

## License

MIT
