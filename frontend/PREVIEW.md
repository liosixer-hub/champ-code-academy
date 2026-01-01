# Preview 预览脚本使用指南

## 功能说明

Preview 脚本用于快速预览构建后的应用。它使用 `serve` 静态文件服务器来本地预览生产构建版本。

## 基础用法

### 预览所有应用
```bash
pnpm preview
```
启动所有构建完成的应用的预览服务器。

**输出示例：**
```
🎯 预览所有应用

🔧 准备清理端口...
✓ 已清理端口 5002
✓ 已清理端口 5001

📦 启动预览服务器...

▶️  login: http://localhost:5002
▶️  shared: http://localhost:5001

✅ 所有预览服务器已启动！

🔗 访问地址:
   login        → http://localhost:5002
   shared       → http://localhost:5001

💡 提示: 按 Ctrl+C 停止所有服务器
```

### 预览单个应用
```bash
pnpm preview shared
```
启动指定应用的预览服务器。

**输出示例：**
```
🎯 预览应用: shared

✓ 已清理端口 5001

🚀 启动 shared 预览服务器...
📍 访问地址: http://localhost:5001
📁 静态文件夹: D:\...\frontend\dist\shared
⏹️  按 Ctrl+C 停止服务器

   Serving!

   - Local:    http://localhost:5001
   - Network:  use --host to expose

   Copied local address to clipboard!
```

### 预览多个应用
```bash
pnpm preview login shared host
```
启动指定的多个应用的预览服务器。

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
# 显示帮助信息
pnpm preview --help

# 预览所有应用
pnpm preview

# 预览 shared 应用
pnpm preview shared

# 预览多个应用
pnpm preview login shared
```

## 特性

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
