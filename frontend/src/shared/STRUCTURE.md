# Shared 文件结构说明

## 目录结构

```
src/shared/src/
├── entity/              # 实体定义（新增）
│   ├── Lesson.ts       # 课程实体
│   ├── User.ts         # 用户实体
│   └── index.ts        # 导出所有实体
├── store/              # 状态管理
│   ├── lessonStore.ts  # 课程状态
│   ├── userStore.ts    # 用户状态
│   ├── commonStore.ts  # 通用状态
│   ├── themeStore.ts   # 主题状态
│   └── store.ts        # 主导出文件
├── components/         # 可复用组件
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── LessonCard.tsx
│   └── LessonSection.tsx
├── App.tsx
├── main.tsx
├── index.css
└── index.ts            # 主导出文件
```

## 核心改进

### 1. Entity 文件夹（新增）
将所有实体定义统一集中在 `entity` 文件夹中：
- **Lesson.ts** - 课程实体定义
- **User.ts** - 用户实体定义
- **index.ts** - 统一导出入口

### 2. Store 文件更新
所有 store 文件现在从 `entity` 导入类型定义，而不是在 store 内部定义：
```typescript
// 之前
export interface Lesson { ... }

// 现在
import type { Lesson } from '../entity'
```

### 3. 组件文件更新
组件从 `entity` 导入类型，保持纯展示逻辑：
```typescript
import type { Lesson } from '../entity'
```

### 4. 导出规范化
在 `index.ts` 中统一导出：
- 组件：Button, Header
- 实体类型：Lesson, User
- Store hooks：useLessonStore, useCommonStore 等

## 导入示例

### 在其他应用中使用
```typescript
// 导入实体类型
import type { Lesson, User } from 'shared/entity'

// 导入 store hooks
import { useLessonStore, useCommonStore } from 'shared/store'

// 导入组件
import { Button, Header } from 'shared/components'
```

## 设计优势

1. **关注点分离** - 实体定义独立，易于维护和扩展
2. **类型安全** - 集中管理所有类型定义
3. **高内聚，低耦合** - 组件专注于UI，store专注于状态，entity专注于数据模型
4. **易于扩展** - 新增实体只需在 entity 文件夹中添加新文件
5. **清晰的依赖关系** - 一目了然的导入层级
