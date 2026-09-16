---
name: unit-test
description: 运行 TypeScript 类型检查、构建验证和路由健康检查，输出报告
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash(npx tsc *)
  - Bash(npm run build)
  - Bash(node -e "http.get")
  - Bash(mkdir -p)
---

# /unit-test — 代码质量检查与报告

## 用途
当用户说"检查代码"、"运行测试"、"验证构建"、"代码检查"时，使用此技能。

## 项目信息

- **项目路径**: `/Users/sunminghong/Desktop/question1`
- **检查项**: TypeScript 类型检查 + 生产构建 + 路由健康检查

## 工作流程

### 第一步：TypeScript 类型检查
```bash
cd /Users/sunminghong/Desktop/question1 && npx tsc --noEmit --skipLibCheck
```
- 如果无输出 → ✅ 通过
- 如果有错误 → 记录所有错误信息

### 第二步：生产构建验证
```bash
cd /Users/sunminghong/Desktop/question1 && npm run build
```
- 如果成功 → ✅ 通过，记录构建时间和 bundle 大小
- 如果失败 → ❌ 失败，记录错误信息

### 第三步：路由健康检查（需要开发服务器运行）
```bash
node -e "
const http = require('http');
['/', '/q1', '/q2', '/q3'].forEach(r => {
  http.get('http://localhost:10086' + r, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      const ok = res.statusCode === 200 && d.includes('id=\"root\"');
      console.log((ok ? '✓' : '✗') + ' ' + r);
    });
  });
});
"
```
- 如果服务器未运行 → 跳过此步骤，提示用户先启动开发服务器

### 第四步：写入标记文件

**当全部检查通过时**：
```bash
mkdir -p /Users/sunminghong/Desktop/question1/.claude/markers
echo "PASS" > /Users/sunminghong/Desktop/question1/.claude/markers/test-pass.txt
```

**当任一检查失败时**：
```bash
mkdir -p /Users/sunminghong/Desktop/question1/.claude/markers
echo "FAIL" > /Users/sunminghong/Desktop/question1/.claude/markers/test-pass.txt
```

### 第五步：输出报告

按以下格式输出检查报告：

```
📊 代码检查报告
━━━━━━━━━━━━━━━━━━━━━

🔍 TypeScript 类型检查
  状态：✅ 通过 / ❌ 失败
  错误数：X 个
  详细错误：
    [文件:行号] 错误描述

🏗️ 生产构建
  状态：✅ 通过 / ❌ 失败
  构建时间：XXXms
  Bundle 大小：XXX KB

🌐 路由健康检查
  /     : ✅ 正常 / ❌ 失败
  /q1   : ✅ 正常 / ❌ 失败
  /q2   : ✅ 正常 / ❌ 失败
  /q3   : ✅ 正常 / ❌ 失败

━━━━━━━━━━━━━━━━━━━━━
总评：✅ 全部通过 / ⚠️ 存在问题
━━━━━━━━━━━━━━━━━━━━━
```

## 注意事项

1. **不要修改代码** — 只检查，不改文件内容
2. **区分错误级别**：
   - TypeScript 编译错误：🔴 必须修复
   - 构建警告：🟡 建议修复
   - 路由 404：🟡 检查路由配置
3. **如果 TypeScript 有错误，构建也会失败** — 先修复类型错误再构建
4. **路由检查需要开发服务器运行** — 如果没有服务器，跳过此步骤并提示
5. **标记文件路径**：`.claude/markers/test-pass.txt`（相对于项目根目录）
