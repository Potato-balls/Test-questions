# GitHub 推送说明

## 步骤 1：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 仓库名称：`address-list`
3. 描述：多端地址列表组件 - Taro + React 实现 H5/微信/支付宝/抖音/RN 五端适配
4. 可见性：Public
5. 不勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

## 步骤 2：推送代码

在终端执行：

```bash
cd /Users/sunminghong/Desktop/question1
git remote add origin https://github.com/sunminghong/address-list.git
git branch -M main
git push -u origin main
```

## 如果需要认证

如果推送失败，需要配置 GitHub 认证：

### 方式一：使用 GitHub Token（推荐）
1. 访问 https://github.com/settings/tokens
2. 生成新 Token（选择 repo 权限）
3. 使用命令：
```bash
git remote set-url origin https://<TOKEN>@github.com/sunminghong/address-list.git
git push -u origin main
```

### 方式二：使用 gh CLI
```bash
gh auth login
gh repo create address-list --public --source=. --push
```

### 方式三：使用 SSH
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 将 ~/.ssh/id_ed25519.pub 内容添加到 GitHub
git remote set-url origin git@github.com:sunminghong/address-list.git
git push -u origin main
```

## 项目文件清单

确保包含以下文件：
- ✅ README.md - 项目说明文档
- ✅ PROMPT.md - AI 辅助开发提示词
- ✅ package.json - 依赖配置
- ✅ tsconfig.json - TypeScript 配置
- ✅ vite.config.ts - Vite 配置
- ✅ src/components/AddressList/ - 核心组件
- ✅ .gitignore - Git 忽略规则
