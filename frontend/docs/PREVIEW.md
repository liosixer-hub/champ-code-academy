# Preview 预览脚本使用指南

## 功能说明

Preview 脚本用于快速预览构建后的应用。它使用 `serve` 静态文件服务器来本地预览生产构建版本。

## 基础用法

### 交互式预览

```bash
pnpm preview
```

启动交互模式，选择要预览的应用。

**输入提示：**
```
请输入要预览的应用 (all, host, shared, login, dashboard, home):
```

### 预览所有应用

```bash
pnpm preview all
```

或在交互模式中输入 `all`。

### 预览单个应用

```bash
pnpm preview dashboard
```

或在交互模式中选择特定应用。

**注意**: 预览单个应用时会自动添加 shared 依赖。

### 预览多个应用

```bash
pnpm preview login dashboard
```

或在交互模式中输入多个应用名（空格分隔）。

**自动依赖**: 如果选择的应用需要 shared，会自动添加。

## 端口配置

默认端口配置：

| 应用 | 端口 |
|------|------|
| host | 5000 |
| shared | 5001 |
| login | 5002 |
| dashboard | 5003 |
| home | 5004 |

## 工作流程

### 1. 构建应用
```bash
pnpm build
```

### 2. 预览构建产物
```bash
# 预览所有应用
pnpm preview

# 或预览指定应用
pnpm preview login
```

### 3. 访问预览
在浏览器中访问显示的 URL，例如 `http://localhost:5002`

### 4. 停止预览
按 `Ctrl+C` 停止服务器，脚本会自动清理占用的端口。

## 常见命令

```bash
# 交互式选择预览应用
pnpm preview

# 预览所有应用
pnpm preview all

# 预览单个应用（自动添加 shared 依赖）
pnpm preview dashboard

# 预览多个应用（自动添加 shared 依赖）
pnpm preview login dashboard

# 显示帮助信息
pnpm preview --help
```

## 特性

✅ **交互式选择** - 支持运行时选择要预览的应用
✅ **自动依赖管理** - 自动添加 shared 等必要依赖
✅ **自动端口清理** - 启动前自动清理被占用的端口
✅ **多应用支持** - 可同时预览多个应用
✅ **本地和网络访问** - 支持本地和网络访问
✅ **优雅关闭** - Ctrl+C 优雅关闭所有服务器
✅ **详细日志** - 显示启动信息和访问 URL

## 故障排查

### 问题：找不到 dist 目录
**解决方案：** 先运行 `pnpm build` 构建应用

```bash
pnpm build
pnpm preview
```

### 问题：端口已被占用
**解决方案：** 脚本会自动清理端口，如果仍有问题，可以手动清理：

```bash
# 清理特定端口
pnpm run kill-ports
```

### 问题：应用无法加载
**解决方案：** 检查以下几点：
1. 确保构建成功（运行 `pnpm build` 时无错误）
2. 确保 dist 目录中有文件
3. 检查浏览器控制台错误信息
4. 尝试硬刷新（Ctrl+F5）

## 与其他脚本的配合

- **`pnpm build`** - 构建所有应用
- **`pnpm dev`** - 开发环境运行
- **`pnpm preview`** - 生产构建预览（此脚本）

## 修改端口

如需修改端口配置，编辑 `scripts/preview.js` 中的 `getAppPort` 函数：

```javascript
function getAppPort(appName) {
  const portMap = {
    'shared': 5001,      // 修改这里
    'login': 5002,       // 修改这里
    // ...
  };
  return portMap[appName] || 5000;
}
```

然后重启 preview 脚本。
