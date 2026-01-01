#!/usr/bin/env node

/**
 * 自动生成远程模块的类型声明文件
 * 从所有 vite.config.ts 文件中提取 exposes 和 remotes 配置
 */

const fs = require('fs');
const path = require('path');

// 配置信息
const appConfigs = [
  {
    name: 'shared',
    configPath: 'src/shared/vite.config.ts',
    distPath: 'src/shared/dist'
  },
  {
    name: 'login',
    configPath: 'src/apps/login/vite.config.ts',
    distPath: 'src/apps/login/dist'
  },
  {
    name: 'dashboard',
    configPath: 'src/apps/dashboard/vite.config.ts',
    distPath: 'src/apps/dashboard/dist'
  },
  {
    name: 'home',
    configPath: 'src/apps/home/vite.config.ts',
    distPath: 'src/apps/home/dist'
  },
];

// 从 vite 配置中解析 exposes
function parseViteConfig(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 使用正则表达式提取 exposes 部分
    const exposesMatch = content.match(/exposes:\s*\{([^}]+)\}/s);
    if (!exposesMatch) return {};

    const exposesContent = exposesMatch[1];
    const exposes = {};
    
    // 匹配每个 expose 条目
    const entries = exposesContent.matchAll(/'\.\/([^']+)':\s*'([^']+)'/g);
    for (const match of entries) {
      exposes[`./${match[1]}`] = match[2];
    }
    
    return exposes;
  } catch (error) {
    console.warn(`⚠️  无法读取配置文件: ${filePath}`);
    return {};
  }
}

// 生成单个应用模块的类型声明
function generateAppDts(appName, exposes) {
  const declarations = [];
  
  declarations.push(`// ${appName} 应用暴露的模块`);
  
  for (const [expose, filePath] of Object.entries(exposes)) {
    const moduleName = expose.replace('./', '');
    
    // 判断是否是 TypeScript/TSX 文件
    const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
    
    if (filePath.endsWith('.tsx') || filePath.endsWith('App.tsx')) {
      // React 组件
      declarations.push(`declare module '${appName}/${moduleName}' {`);
      declarations.push(`  import type React from 'react';`);
      declarations.push(`  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {`);
      declarations.push(`    children?: React.ReactNode;`);
      declarations.push(`  }`);
      declarations.push(`  const component: React.ComponentType<ComponentProps>;`);
      declarations.push(`  export default component;`);
      declarations.push(`}`);
    } else if (filePath.endsWith('.ts') && moduleName.includes('store')) {
      // Store 文件
      declarations.push(`declare module '${appName}/${moduleName}' {`);
      declarations.push(`  interface StoreState {`);
      declarations.push(`    [key: string]: unknown;`);
      declarations.push(`  }`);
      declarations.push(`  export const useAppStore: () => StoreState;`);
      declarations.push(`  export const useUserStore: () => StoreState;`);
      declarations.push(`}`);
    } else if (filePath.endsWith('.tsx')) {
      // 其他 TSX
      declarations.push(`declare module '${appName}/${moduleName}' {`);
      declarations.push(`  import type React from 'react';`);
      declarations.push(`  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {`);
      declarations.push(`    children?: React.ReactNode;`);
      declarations.push(`  }`);
      declarations.push(`  const component: React.ComponentType<ComponentProps>;`);
      declarations.push(`  export default component;`);
      declarations.push(`}`);
    } else if (isTypeScript) {
      // 其他 TypeScript 文件
      declarations.push(`declare module '${appName}/${moduleName}' {`);
      declarations.push(`  export * from '${filePath.replace(/\\/g, '/')}';`);
      declarations.push(`}`);
    }
    
    declarations.push('');
  }
  
  return declarations;
}

// 主函数
function generateDts() {
  const allDeclarations = [];
  
  // 添加通用类型定义
  allDeclarations.push('// ============================================');
  allDeclarations.push('// 自动生成的远程模块类型声明文件');
  allDeclarations.push('// ============================================');
  allDeclarations.push('// 注意: 此文件通过 scripts/generate-dts.js 自动生成');
  allDeclarations.push('// 请勿手动编辑');
  allDeclarations.push('');
  
  // 扫描所有应用的 vite 配置并生成声明
  const cwd = process.cwd();
  
  for (const appConfig of appConfigs) {
    const configPath = path.join(cwd, appConfig.configPath);
    const exposes = parseViteConfig(configPath);
    
    if (Object.keys(exposes).length > 0) {
      console.log(`✓ 扫描 ${appConfig.name}: 找到 ${Object.keys(exposes).length} 个暴露的模块`);
      const appDts = generateAppDts(appConfig.name, exposes);
      allDeclarations.push(...appDts);
    }
  }
  
  // 添加通用的 wildcard 声明
  allDeclarations.push('');
  allDeclarations.push('// ============================================');
  allDeclarations.push('// 通用 Wildcard 声明');
  allDeclarations.push('// ============================================');
  allDeclarations.push('');
  
  const remoteApps = ['shared', 'login', 'dashboard', 'home'];
  for (const app of remoteApps) {
    allDeclarations.push(`declare module '${app}/*' {`);
    allDeclarations.push(`  import type React from 'react';`);
    allDeclarations.push(`  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {`);
    allDeclarations.push(`    children?: React.ReactNode;`);
    allDeclarations.push(`  }`);
    allDeclarations.push(`  const component: React.ComponentType<ComponentProps>;`);
    allDeclarations.push(`  export default component;`);
    allDeclarations.push(`}`);
    allDeclarations.push('');
  }
  
  // 写入文件
  const dtsPath = path.join(cwd, 'src/dts/global.d.ts');
  const content = allDeclarations.join('\n');
  
  fs.writeFileSync(dtsPath, content, 'utf-8');
  console.log(`✅ 类型声明文件已生成: ${dtsPath}`);
}

// 执行
generateDts();
