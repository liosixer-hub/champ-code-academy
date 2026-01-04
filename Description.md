# 项目说明

本项目为一个采用微前端架构的前端教学与演示平台，基于 Vite + React，并使用 Module Federation 实现应用间模块共享与动态加载。项目结构清晰、脚本完善，支持快速创建子应用、统一构建与预览。

## 架构与模块

- shared：共享组件、状态管理（Zustand）、实体类型与提供者等
- apps：子应用集合（当前包含 dashboard、login）
- host：主应用容器，负责路由与远程模块加载
- docs：开发、构建、预览与应用创建的文档
- scripts：构建、开发、预览与应用生成的脚本

## 运行模式

- pnpm dev：启动完整开发环境（shared + apps + host）
- pnpm dev <app-name>：启动指定子应用的开发环境（自动包含 shared）
- pnpm build：构建所有模块并生成联邦类型声明
- pnpm preview：预览生产构建产物，支持交互式选择应用

## 端口约定

- host：5000
- shared：5001
- login：5002
- dashboard：5003

可通过环境变量覆盖：
- BASE_URL_SHARED、BASE_URL_LOGIN、BASE_URL_DASHBOARD

## 子应用创建

所有新建子应用均基于 dashboard 模板创建，确保配置与依赖一致：

```bash
pnpm generate-app <appName> [port]
```

详细步骤与约束参见文档：[CREATE_APP_GUIDE.md](file:///d:/Workbench/go-saas/champ-code-academy/frontend/docs/CREATE_APP_GUIDE.md)

## 主应用行为

- 未认证：显示 login 应用
- 已认证：显示 dashboard 应用

认证状态通过 shared 的用户存储信息进行检测。

## 注意事项

- 已移除 home 应用及其相关配置与文档引用
- 新建子应用请遵循 kebab-case 命名规范
- 共享状态与样式建议复用 shared 模块，保持一致性
