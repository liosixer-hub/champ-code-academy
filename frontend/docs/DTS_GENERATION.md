# 模块联邦类型声明自动生成

## 功能说明

该脚本自动从各个应用的 `vite.config.ts` 中读取 Module Federation 配置，提取暴露的模块信息，并生成对应的 TypeScript 类型声明文件。

## 工作流程

### 自动生成（推荐）
在执行 `pnpm build` 时，脚本会自动在构建完成后执行：

```bash
pnpm build
# 自动执行生成 DTS 并输出到 src/dts/global.d.ts
```

### 手动生成
也可以单独运行类型声明生成脚本：

```bash
pnpm run generate-dts
# 或
npm run generate-dts
```

## 脚本文件

- **[scripts/generate-dts.js](scripts/generate-dts.js)** - 核心生成脚本
  - 扫描所有应用的 vite 配置
  - 提取 `exposes` 中定义的模块
  - 根据文件类型生成对应的类型声明
  - 输出到 `src/dts/global.d.ts`

## 生成的类型声明

### 组件声明
```typescript
declare module 'shared/Button' {
  const component: React.ComponentType<any>;
  export default component;
}

declare module 'shared/Header' {
  const component: React.ComponentType<any>;
  export default component;
}
```

### Store 声明
```typescript
declare module 'shared/store' {
  export const useAppStore: any;
  [key: string]: any;
}
```

### 应用组件声明
```typescript
declare module 'login/LoginApp' {
  const component: React.ComponentType<any>;
  export default component;
}

declare module 'dashboard/DashboardApp' {
  const component: React.ComponentType<any>;
  export default component;
}
```

## 配置支持

脚本自动识别以下文件类型：

| 文件类型 | 声明方式 |
|---------|---------|
| `.tsx` / `App.tsx` | React 组件声明 |
| `.ts` (store) | Store 导出声明 |
| `.ts` (其他) | 通用模块声明 |

## 配置示例

### 添加新的暴露模块

在 `vite.config.ts` 中更新 `exposes` 配置：

```typescript
federation({
  name: 'shared',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/components/Button.tsx',      // 自动生成组件声明
    './Header': './src/components/Header.tsx',      // 自动生成组件声明
    './store': './src/store/store.ts',              // 自动生成 store 声明
  },
  shared: ['react', 'react-dom', 'zustand']
})
```

对于子应用：

```typescript
federation({
  name: 'dashboard',
  filename: 'remoteEntry.js',
  exposes: {
    './DashboardApp': './src/App.tsx',              // 自动生成应用组件声明
  },
  remotes: {
    shared: sharedUrl + '/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'zustand']
})
```

修改后，下次构建时会自动生成对应的类型声明。

## 注意事项

⚠️ **重要**: `src/dts/global.d.ts` 是自动生成文件，请勿手动编辑。任何直接编辑都会在下次运行脚本时被覆盖。

## 开发工作流

1. **修改应用暴露的模块**
   - 编辑 `src/shared/vite.config.ts` 或其他应用的配置文件
   - 更新 `exposes` 部分

2. **构建项目**
   ```bash
   pnpm build
   ```
   - 自动生成新的类型声明

3. **使用类型提示**
   ```typescript
   import Button from 'shared/Button';
   import { useAppStore } from 'shared/store';
   ```

## 故障排查

### 类型声明没有更新

1. 确保 vite 配置文件路径正确
2. 检查 `exposes` 配置是否有效
3. 手动运行 `pnpm run generate-dts` 进行调试

### 查看脚本输出

运行脚本时会输出扫描结果：
```
✓ 扫描 shared: 找到 3 个暴露的模块
✓ 扫描 login: 找到 1 个暴露的模块
✓ 扫描 dashboard: 找到 1 个暴露的模块
✓ 扫描 home: 找到 1 个暴露的模块
✅ 类型声明文件已生成: src/dts/global.d.ts
```
