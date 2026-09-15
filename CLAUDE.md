# CLAUDE.md - 地址列表组件项目规范

## 项目概述

这是一个基于 React 18 + TypeScript + Vite 开发的移动端地址列表组件，实现视觉稿中的地址展示功能，并提供 Taro 多端适配指南。

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
│   └── AddressList/
│       ├── AddressList.tsx    # 主组件（包含智能布局算法）
│       └── AddressList.scss   # 样式文件
├── App.css                    # 全局样式重置
├── app.tsx                    # 应用根组件
├── main.tsx                   # 入口文件
└── index.html                 # HTML 模板

config/
└── index.ts                   # Taro 配置（用于多端迁移）

根目录：
├── package.json               # 依赖配置
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
```

**关键规则：**
- 标签固定在第一行，不折行
- 地址文本在标签后，可折行到第二行
- 第二行只显示地址文本，不包含标签
- 使用 JavaScript 检测溢出，而非纯 CSS 截断

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

## 更新记录

- **2026-09-15**: 初始版本，实现地址列表组件基础功能
- **2026-09-15**: 重构布局算法，实现标签固定第一行，地址可折行
- **2026-09-15**: 添加 Taro 多端适配指南

---

**维护者**: sunminghong  
**最后更新**: 2026-09-15
