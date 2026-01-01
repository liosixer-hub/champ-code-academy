#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Create a new sub-app from login template
 * Usage: node scripts/create-app.js <appName> [port]
 * Example: node scripts/create-app.js dashboard 5003
 */

const appName = process.argv[2];
const port = process.argv[3] || null;

if (!appName) {
  console.error('Error: App name is required');
  console.log('Usage: node scripts/create-app.js <appName> [port]');
  console.log('Example: node scripts/create-app.js dashboard 5003');
  process.exit(1);
}

// Validate app name
if (!/^[a-z0-9-]+$/.test(appName)) {
  console.error('Error: App name must contain only lowercase letters, numbers, and hyphens');
  process.exit(1);
}

const sourceDir = path.join(__dirname, '../src/apps/login');
const targetDir = path.join(__dirname, '../src/apps', appName);
const capitalizedAppName = appName
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

console.log(`Creating new app: ${appName}`);
console.log(`Source: ${sourceDir}`);
console.log(`Target: ${targetDir}`);

// Check if target directory already exists
if (fs.existsSync(targetDir)) {
  console.error(`Error: App '${appName}' already exists`);
  process.exit(1);
}

try {
  // Copy the entire login directory
  function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      
      if (fs.statSync(srcFile).isDirectory()) {
        // Skip dist and node_modules directories
        if (file === 'dist' || file === 'node_modules') {
          return;
        }
        copyDirSync(srcFile, destFile);
      } else {
        fs.copyFileSync(srcFile, destFile);
      }
    });
  }
  
  copyDirSync(sourceDir, targetDir);
  console.log('✓ Files copied');

  // Update package.json
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.name = appName;
  packageJson.description = `${capitalizedAppName} application`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✓ Updated package.json');

  // Update vite.config.ts
  const viteConfigPath = path.join(targetDir, 'vite.config.ts');
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
  
  // Replace federation name
  viteConfig = viteConfig.replace(
    /name: ['"]login['"]/,
    `name: '${appName}'`
  );
  
  // Replace port if provided
  if (port) {
    const baseUrlVarName = `BASE_URL_${appName.toUpperCase()}`;
    const urlVarName = `${appName}Url`;
    
    viteConfig = viteConfig.replace(
      /const sharedUrl = .*?\n/,
      `const sharedUrl = process.env.BASE_URL_SHARED || 'http://localhost:5001';\n`
    );
    viteConfig = viteConfig.replace(
      /const loginUrl = process\.env\.BASE_URL_LOGIN \|\| 'http:\/\/localhost:\d+';/,
      `const ${urlVarName} = process.env.${baseUrlVarName} || 'http://localhost:${port}';`
    );
    viteConfig = viteConfig.replace(
      /const port = new URL\(loginUrl\)\.port;/,
      `const port = new URL(${urlVarName}).port;`
    );
  } else {
    // Keep default port 5002 if not specified
    const baseUrlVarName = `BASE_URL_${appName.toUpperCase()}`;
    const urlVarName = `${appName}Url`;
    
    viteConfig = viteConfig.replace(
      /const loginUrl = process\.env\.BASE_URL_LOGIN \|\| 'http:\/\/localhost:5002';/,
      `const ${urlVarName} = process.env.${baseUrlVarName} || 'http://localhost:5002';`
    );
    viteConfig = viteConfig.replace(
      /const port = new URL\(loginUrl\)\.port;/,
      `const port = new URL(${urlVarName}).port;`
    );
  }
  
  fs.writeFileSync(viteConfigPath, viteConfig);
  console.log('✓ Updated vite.config.ts');

  // Update index.html title
  const indexHtmlPath = path.join(targetDir, 'index.html');
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  indexHtml = indexHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${capitalizedAppName} App</title>`
  );
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log('✓ Updated index.html');

  // Update App.tsx with generic template
  const appTsxPath = path.join(targetDir, 'src/App.tsx');
  const appTemplate = `import React from 'react';
import { useAppStore } from 'shared/store';

interface ${capitalizedAppName}AppProps {
  onBackClick?: () => void;
}

function ${capitalizedAppName}App({ onBackClick }: ${capitalizedAppName}AppProps) {
  const storeState = useAppStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ${capitalizedAppName}
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-center text-gray-600">
            This is the ${appName} application. Start building your features here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ${capitalizedAppName}App;
`;
  fs.writeFileSync(appTsxPath, appTemplate);
  console.log('✓ Updated App.tsx');

  // Update src/index.ts
  const indexTsPath = path.join(targetDir, 'src/index.ts');
  const indexTsTemplate = `export { default as App } from './App'
`;
  fs.writeFileSync(indexTsPath, indexTsTemplate);
  console.log('✓ Updated src/index.ts');

  // Update .gitignore if exists
  const gitignorePath = path.join(targetDir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    // Keep existing .gitignore content
    console.log('✓ Preserved .gitignore');
  }

  console.log('\n✅ Successfully created new app!');
  console.log(`\nNext steps:`);
  console.log(`1. cd frontend/src/apps/${appName}`);
  console.log(`2. pnpm install`);
  console.log(`3. pnpm dev`);
  if (port) {
    console.log(`\nApp will run on http://localhost:${port}`);
  }
  
} catch (error) {
  console.error('Error creating app:', error.message);
  // Cleanup on error
  if (fs.existsSync(targetDir)) {
    function removeDirSync(dir) {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(file => {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isDirectory()) {
            removeDirSync(filePath);
          } else {
            fs.unlinkSync(filePath);
          }
        });
        fs.rmdirSync(dir);
      }
    }
    removeDirSync(targetDir);
  }
  process.exit(1);
}
