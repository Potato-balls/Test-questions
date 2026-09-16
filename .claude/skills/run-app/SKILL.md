---
name: run-app
description: 启动开发服务器并在浏览器中打开应用
user-invocable: true
allowed-tools:
  - Bash(pkill -f "vite")
  - Bash(npm install)
  - Bash(npm run dev)
  - Bash(npm run build)
  - Bash(node -e "http.get")
  - Read
---

# /run-app — 启动面试试题项目

## 用途
当用户想要启动面试试题项目（三个试题的集合）进行开发调试或查看效果时，使用此技能。

## 项目信息

- **项目名称**: 面试试题集合（address-list）
- **技术栈**: React 18 + TypeScript + Vite + react-router-dom
- **默认端口**: 10086
- **项目路径**: `/Users/sunminghong/Desktop/question1`
- **入口文件**: `src/main.tsx`
- **路由配置**: `src/app.tsx`

## 路由结构

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | QuestionsIndex | 主页：三个试题入口导航 |
| `/q1` | AddressList | 试题一：地址列表（标签智能布局） |
| `/q2` | Question2 | 试题二：券浮层（抛物线动效） |
| `/q3` | Question3 | 试题三：面试回复邮件 |

## 执行步骤

### 1. 确保旧进程已关闭
```bash
pkill -f "vite" 2>/dev/null; sleep 1
```

### 2. 安装依赖（仅首次或依赖缺失时）
```bash
cd /Users/sunminghong/Desktop/question1 && npm install
```

### 3. 启动开发服务器
在项目根目录后台运行：
```bash
cd /Users/sunminghong/Desktop/question1 && npm run dev -- --port 10086
```
此命令需要在**后台运行**（`run_in_background: true`），因为它是持续运行的开发服务器。

### 4. 验证服务状态
启动完成后验证路由是否可访问：
```bash
node -e "
const http = require('http');
['/', '/q1', '/q2', '/q3'].forEach(r => {
  http.get('http://localhost:10086' + r, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log((res.statusCode === 200 && d.includes('id=\"root\"') ? '✓' : '✗') + ' ' + r);
    });
  });
});
"
```

### 5. 打开浏览器
```bash
open http://localhost:10086
```

### 6. 告知用户
告诉用户应用已成功启动，并说明：
- 开发服务器正在后台运行（端口 10086）
- 修改代码后会自动热更新
- 访问 http://localhost:10086 查看主页
- 测试指令：说"停止服务器"即可停止服务

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（默认端口 10086） |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建结果 |
| `npx tsc --noEmit --skipLibCheck` | TypeScript 类型检查 |
| `pkill -f "vite"` | 停止开发服务器 |

## 注意事项

- 此技能只负责启动服务器，不负责构建或打包
- 如果启动失败，检查是否有端口冲突或其他错误信息
- 如果 TypeScript 有错误，需要先修复错误再启动服务器
- 开发服务器启动后，修改 `.tsx`/`.ts`/`.scss` 文件会自动热更新
- 如果项目路径变化，需要修改脚本中的路径
