# 开发环境指南

## 概述

本项目采用微前端架构，使用 Module Federation 实现应用间的模块共享。开发环境支持多种启动模式，满足不同的开发需求。

## 项目结构

```
frontend/
├── src/
│   ├── apps/           # 子应用
│   │   ├── dashboard/  # 仪表板应用
│   │   ├── home/       # 首页应用
│   │   ├── login/      # 登录应用
│   │   └── shared/     # 共享模块
│   ├── host/           # 主应用容器
│   └── dts/            # 类型声明
├── scripts/            # 构建脚本
├── docs/               # 文档
└── dist/               # 构建输出
```

## 开发模式

### 完整开发环境

启动所有应用和主容器：

```bash
pnpm dev
```

**工作流程：**
1. 构建 shared 模块
2. 启动 shared 预览服务器
3. 启动所有子应用的预览服务器
4. 构建并启动 host 主容器

### 单个应用开发

开发特定子应用：

```bash
pnpm dev <app-name>
```

**示例：**
```bash
pnpm dev dashboard    # 开发 dashboard 应用
pnpm dev login        # 开发 login 应用
pnpm dev shared       # 开发 shared 模块
```

**工作流程：**
1. 构建 shared 模块
2. 启动 shared 预览服务器
3. 启动指定应用的开发服务器

### 交互式选择

不指定应用名时进入交互模式：

```bash
pnpm dev
# 请输入要启动的应用 (all, host, shared, login, dashboard, home):
```

## 端口配置

默认端口分配：

| 应用 | 端口 | 说明 |
|------|------|------|
| host | 5000 | 主应用容器 |
| shared | 5001 | 共享模块 |
| login | 5002 | 登录应用 |
| dashboard | 5003 | 仪表板应用 |
| home | 5004 | 首页应用 |

## 开发工作流

### 1. 启动开发环境

```bash
# 方式1：完整环境
pnpm dev

# 方式2：单个应用
pnpm dev dashboard

# 方式3：交互式选择
pnpm dev
```

### 2. 开发子应用

```bash
# 进入应用目录
cd src/apps/dashboard

# 安装依赖（如果需要）
pnpm install

# 启动开发服务器（通常由根目录的 dev 脚本处理）
pnpm dev
```

### 3. 修改共享模块

```bash
# 进入 shared 目录
cd src/shared

# 开发 shared 组件
pnpm dev
```

### 4. 构建和预览

```bash
# 构建所有应用
pnpm build

# 预览构建结果
pnpm preview
```

## 模块联邦配置

### Shared 模块配置

`src/shared/vite.config.ts`:
```typescript
federation({
  name: 'shared',
  exposes: {
    './Button': './src/components/Button.tsx',
    './store': './src/store/store.ts',
  },
  shared: ['react', 'react-dom', 'zustand']
})
```

### 子应用配置

`src/apps/dashboard/vite.config.ts`:
```typescript
federation({
  name: 'dashboard',
  exposes: {
    './DashboardApp': './src/App.tsx',
  },
  remotes: {
    shared: 'http://localhost:5001/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'zustand']
})
```

## 热重载和开发体验

- ✅ **热重载**: 修改代码自动刷新浏览器
- ✅ **类型检查**: TypeScript 自动类型检查
- ✅ **ESLint**: 代码质量检查
- ✅ **模块联邦**: 跨应用模块热更新

## 常见问题

### 端口冲突

**问题**: `Error: Port 5001 is already in use`

**解决方案**:
```bash
# 清理端口
pnpm run kill-ports

# 或修改端口配置
```

### Shared 模块更新不生效

**问题**: 修改 shared 组件后其他应用没有更新

**解决方案**:
1. 确保 shared 服务器正在运行
2. 重启相关应用的开发服务器
3. 检查浏览器缓存

### 类型声明问题

**问题**: 模块联邦导入出现类型错误

**解决方案**:

## 调试技巧

### 浏览器开发工具

1. **Network 标签**: 查看模块联邦资源加载
2. **Console**: 查看运行时错误
3. **Application > Shared Workers**: 查看共享模块状态

### 日志调试

```bash
# 查看详细构建日志
pnpm build --verbose

# 查看开发服务器日志
DEBUG=vite:* pnpm dev dashboard
```

## 最佳实践

1. **模块拆分**: 将可复用组件放在 shared 中
2. **状态管理**: 使用 shared 中的 Zustand store
3. **样式一致**: 使用 Tailwind CSS 保持风格统一
4. **类型安全**: 充分利用 TypeScript 类型声明
5. **性能优化**: 合理配置代码分割和懒加载