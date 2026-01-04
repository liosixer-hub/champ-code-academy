## TypeScript 声明文件生成指南

本文档指导如何为shared模块生成TypeScript声明文件(.d.ts)，确保类型安全和模块联邦的正确工作。

### 目录
1. [Store Hooks 声明](#store-hooks-声明)
2. [React 组件声明](#react-组件声明)
3. [Entity 类型声明](#entity-类型声明)
4. [Provider 声明](#provider-声明)
5. [完整应用组件声明](#完整应用组件声明)
6. [模块联邦远程模块声明](#模块联邦远程模块声明)
7. [生成步骤](#生成步骤)

### Store Hooks 声明

#### 源代码示例
```typescript
// shared/src/commonStore.ts
import { create } from 'zustand'

interface CommonState {
  loading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCommonStore = create<CommonState>((set) => ({
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
```

#### 声明文件示例
```typescript
// types/shared/store/commonStore.d.ts
export interface CommonState {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export declare const useCommonStore: import('zustand').UseBoundStore<import('zustand').StoreApi<CommonState>>;
```

#### 步骤
1. 从源代码中提取接口定义
2. 使用`import('zustand').UseBoundStore<import('zustand').StoreApi<StateType>>`声明hook类型
3. 如果使用persist中间件，确保包含persist相关的类型

### React 组件声明

#### 无Props组件
```typescript
// 源代码: function Header() { ... }
export declare const Header: React.ComponentType<{}>;
```

#### 有Props组件
```typescript
// 源代码接口: interface ButtonProps { children: React.ReactNode; onClick?: () => void; ... }
export declare const Button: React.ComponentType<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'link';
} & React.ButtonHTMLAttributes<HTMLButtonElement>>;
```

#### 步骤
1. 检查组件是否有props接口
2. 如果有props，使用`React.ComponentType<PropsType>`
3. 如果继承HTML属性，使用交叉类型`& React.HTMLAttributes<ElementType>`
4. 如果无props，使用`React.ComponentType<{}>`

### Entity 类型声明

#### 源代码示例
```typescript
// shared/src/entity/lesson.ts
export interface Lesson {
  id: string
  date: string
  type: 'Historic' | 'Upcoming' | 'Available' | 'Today'
  subject: string
  students: string[]
  tutor: string | null
  status: string
}
```

#### 声明文件示例
```typescript
// types/shared/entity/index.d.ts
export interface Lesson {
  id: string;
  date: string;
  type: 'Historic' | 'Upcoming' | 'Available' | 'Today';
  subject: string;
  students: string[];
  tutor: string | null;
  status: string;
}
```

#### 步骤
1. 直接复制接口定义
2. 确保联合类型和可选属性正确声明
3. 保持与源代码完全一致

### Provider 声明

#### 源代码示例
```typescript
// shared/src/providers/ThemeProvider.tsx
interface ThemeProviderProps {
  children: React.ReactNode
  theme: 'light' | 'dark'
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme }) => { ... }
```

#### 声明文件示例
```typescript
// types/shared/providers/index.d.ts
import React from 'react';

export declare const ThemeProvider: React.ComponentType<{
  children: React.ReactNode;
  theme: 'light' | 'dark';
}>;
```

### 完整应用组件声明

#### 源代码示例
```typescript
// shared/src/App.tsx
function SharedApp() { ... }
export default SharedApp;
```

#### 声明文件示例
```typescript
// types/shared/index.d.ts
import React from 'react';

export declare const SharedApp: React.ComponentType<{}>;
```

### 模块联邦远程模块声明

当使用模块联邦时，host 应用需要通过远程路径导入其他应用的组件（如 `login/LoginApp`）。需要为这些远程导入路径创建类型声明。

#### 源代码示例
```typescript
// apps/dashboard/src/App.tsx
export const DashboardApp: React.FC = () => { ... }
export default DashboardApp;

// apps/home/src/App.tsx
interface HomeAppProps {
  onLoginClick?: () => void;
}
function HomeApp({ onLoginClick }: HomeAppProps) { ... }
export default HomeApp;

// apps/login/src/App.tsx
interface LoginAppProps {
  onBackClick?: () => void;
}
function LoginApp({ onBackClick }: LoginAppProps) { ... }
export default LoginApp;
```

#### 应用组件声明文件
首先为每个应用创建组件声明文件，放在与 `shared` 同级的目录下：

```typescript
// types/dashboard/index.d.ts
import React from 'react';

export declare const DashboardApp: React.ComponentType<{}>;
```

```typescript
// types/home/index.d.ts
import React from 'react';

export interface HomeAppProps {
  onLoginClick?: () => void;
}

export declare const HomeApp: React.ComponentType<HomeAppProps>;
```

```typescript
// types/login/index.d.ts
import React from 'react';

export interface LoginAppProps {
  onBackClick?: () => void;
}

export declare const LoginApp: React.ComponentType<LoginAppProps>;
```

#### 模块联邦远程路径声明文件
创建 `apps.d.ts` 文件，将模块联邦的导入路径映射到实际组件类型：

```typescript
// types/apps.d.ts
/**
 * Apps Module Federation Type Declarations
 * Declares types for remote modules loaded via Module Federation
 * 
 * These declarations map the module federation import paths (e.g., 'login/LoginApp')
 * to the actual component types defined in the apps.
 * This enables type checking for module federation imports in host applications.
 */

import React from 'react';

// Re-export app components
export * from './dashboard';
export * from './home';
export * from './login';

// Remote Module Federation declarations
declare module 'login/LoginApp' {
  export interface LoginAppProps {
    onBackClick?: () => void;
  }
  
  export const LoginApp: React.ComponentType<LoginAppProps>;
  export default LoginApp;
}

declare module 'dashboard/DashboardApp' {
  export const DashboardApp: React.ComponentType<{}>;
  export default DashboardApp;
}

declare module 'home/HomeApp' {
  export interface HomeAppProps {
    onLoginClick?: () => void;
  }
  
  export const HomeApp: React.ComponentType<HomeAppProps>;
  export default HomeApp;
}
```

#### 使用示例
在 host 应用中，可以这样使用：

```typescript
// host/src/App.tsx
import React from 'react';

// 这些导入路径由模块联邦在运行时解析
const LoginApp = React.lazy(() => import('login/LoginApp'));
const DashboardApp = React.lazy(() => import('dashboard/DashboardApp'));
const HomeApp = React.lazy(() => import('home/HomeApp'));

// TypeScript 现在可以正确推断这些组件的类型
```

#### 目录结构
应用的类型声明文件应该放在与 `shared` 同级的目录下：

```
frontend/src/types/
├── shared/          # Shared 模块类型声明
│   ├── components/
│   ├── entity/
│   ├── providers/
│   ├── store/
│   └── index.d.ts
├── dashboard/       # Dashboard 应用类型声明
│   └── index.d.ts
├── home/           # Home 应用类型声明
│   └── index.d.ts
├── login/          # Login 应用类型声明
│   └── index.d.ts
├── apps.d.ts       # 模块联邦远程模块声明
└── global.d.ts
```

#### 步骤
1. 为每个应用创建组件声明文件（`types/{appName}/index.d.ts`），与 `shared` 目录同级
2. 创建 `types/apps.d.ts` 文件，使用 `declare module` 声明模块联邦导入路径
3. 在 `apps.d.ts` 中重新导出所有应用组件：`export * from './dashboard'` 等
4. 确保 host 应用的 `tsconfig.json` 包含类型声明目录：
   ```json
   {
     "compilerOptions": {
       "typeRoots": ["../types"]
     },
     "include": ["src/**/*", "../types/**/*.d.ts"]
   }
   ```

#### 注意事项
- 模块联邦的导入路径（如 `login/LoginApp`）必须与 `vite.config.ts` 中的 `remotes` 配置一致
- `declare module` 中的路径必须与实际的导入路径完全匹配
- 接口定义必须在 `declare module` 内部使用 `export` 关键字
- 应用类型声明文件与 `shared` 目录同级，保持目录结构的一致性
- `apps.d.ts` 文件会被 TypeScript 自动识别，无需手动引用

### 生成步骤

1. **分析源代码结构**
   - 查看`vite.config.ts`中的`exposes`配置
   - 确定需要声明的导出项

2. **为每个导出项创建声明**
   - Store hooks: 使用Zustand类型声明
   - React组件: 使用React.ComponentType声明
   - Entity类型: 直接复制接口
   - Providers: 使用React.ComponentType声明

3. **创建主入口文件**
   - 在`types/shared/index.d.ts`中使用`export * from './subfolder'`重新导出

4. **验证声明**
   - 确保所有导出的类型都能正确推断
   - 检查模块联邦配置中的类型暴露

### 参考文件
- `/frontend/src/types/shared/**` - Shared 模块的声明文件
- `/frontend/src/types/dashboard/**` - Dashboard 应用的声明文件
- `/frontend/src/types/home/**` - Home 应用的声明文件
- `/frontend/src/types/login/**` - Login 应用的声明文件
- `/frontend/src/types/apps.d.ts` - 模块联邦远程模块声明文件
- `vite.config.ts` - 模块联邦配置
- 源代码文件在`/frontend/src/shared/src/**` 和 `/frontend/src/apps/**`

### 注意事项
- 声明文件应与源代码保持同步
- 使用具体的类型而不是`any`
- 对于复杂的类型，优先使用接口定义
- 确保导入的类型路径正确


