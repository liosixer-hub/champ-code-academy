# Sub-App 创建工具

这是一个基于login模块的sub-app模板生成工具，用于快速创建新的微前端应用。

## 功能特性

- ✅ 基于login模块的完整模板克隆
- ✅ 自动更新配置文件（package.json、vite.config.ts等）
- ✅ 支持自定义端口配置
- ✅ 自动生成组件模板
- ✅ 保留微前端Federation配置

## 使用方式

### 基本用法

```bash
# 创建一个新的sub-app（自动分配端口）
pnpm create-app <appName>

# 示例
pnpm create-app dashboard
pnpm create-app user-profile
pnpm create-app settings
```

### 指定端口

```bash
# 创建一个新的sub-app并指定端口
pnpm create-app <appName> <port>

# 示例
pnpm create-app dashboard 5003
pnpm create-app user-profile 5004
```

## 命令详解

```bash
node scripts/create-app.js <appName> [port]
```

**参数：**
- `appName` (必需)：应用名称，只能包含小写字母、数字和连字符
  - 示例：`dashboard`、`user-profile`、`admin-panel`
- `port` (可选)：应用监听的端口号
  - 如果不指定，需要手动配置环境变量

**约束：**
- 应用名称必须唯一（不能与已有app同名）
- 应用名称格式：kebab-case（小写字母和连字符）

## 生成的文件结构

```
frontend/src/apps/<appName>/
├── src/
│   ├── App.tsx          # 主应用组件（自动生成模板）
│   ├── index.ts         # 导出
│   ├── index.css        # 样式
│   └── main.tsx         # 入口
├── index.html           # HTML模板
├── package.json         # 包配置（自动更新）
├── vite.config.ts       # Vite配置（自动更新）
├── tsconfig.json        # TypeScript配置
├── tailwind.config.js   # Tailwind配置
├── postcss.config.mjs   # PostCSS配置
└── .gitignore          # Git忽略规则
```

## 生成后的步骤

创建app后，按照提示执行以下步骤：

```bash
# 1. 进入新应用目录
cd frontend/src/apps/<appName>

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

## 环境变量配置

如果指定了端口，脚本会自动配置vite.config.ts。如果需要手动配置环境变量：

```bash
# .env 或 .env.local
BASE_URL_DASHBOARD=http://localhost:5003
BASE_URL_USER_PROFILE=http://localhost:5004
```

## 微前端集成

生成的app自动包含Module Federation配置：

- **Exposes**: 导出`./src/App.tsx`作为`<AppName>App`
- **Remotes**: 引用shared应用的资源
- **Shared**: 共享react、react-dom、zustand等库

## 示例

### 创建dashboard应用

```bash
pnpm create-app dashboard 5003
```

输出：
```
Creating new app: dashboard
✓ Files copied
✓ Updated package.json
✓ Updated vite.config.ts
✓ Updated index.html
✓ Updated App.tsx
✓ Updated src/index.ts
✓ Preserved .gitignore

✅ Successfully created new app!

Next steps:
1. cd frontend/src/apps/dashboard
2. pnpm install
3. pnpm dev

App will run on http://localhost:5003
```

### 创建user-profile应用

```bash
pnpm create-app user-profile 5004
```

生成的`src/apps/user-profile/`目录结构与dashboard相同，但名称不同。

## 故障排除

### 错误：App name is required
确保提供了应用名称：
```bash
pnpm create-app my-app
```

### 错误：App '<appName>' already exists
应用名称已存在，请使用不同的名称：
```bash
pnpm create-app my-new-app
```

### 错误：App name must contain only lowercase letters, numbers, and hyphens
应用名称格式不正确。使用kebab-case格式：
- ✅ 正确：`dashboard`、`user-profile`、`admin-panel`
- ❌ 错误：`Dashboard`、`user_profile`、`AdminPanel`

## 开发建议

1. **命名规范**：使用kebab-case命名app
2. **功能模块化**：将功能拆分为多个components
3. **共享状态**：使用shared中的zustand store
4. **样式一致**：使用Tailwind CSS保持风格一致
5. **模块联邦**：合理配置Exposes和Remotes

## 配置修改

如需修改生成app的默认配置，编辑`scripts/create-app.js`：

- 调整模板内容（App.tsx、index.html等）
- 修改依赖配置
- 更改端口分配策略
- 扩展Federation配置

## 注意事项

- 脚本在创建失败时会自动清理已生成的文件
- 生成的app会继承login模块的所有依赖
- 需要在app目录中执行`pnpm install`以安装依赖
- 端口配置需要确保不与其他app冲突
