const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 定义路径
const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');
const envProdPath = path.join(__dirname, '..', '.env.prod');

// 加载环境变量的辅助函数
function loadEnvProd() {
  const env = {};
  if (fs.existsSync(envProdPath)) {
    const content = fs.readFileSync(envProdPath, 'utf-8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  }
  return env;
}

// 确保 dist 目录存在
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制目录的辅助函数
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 递归遍历目录，查找包含 package.json 的文件夹
function findProjects(dir, projects = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const packageJsonPath = path.join(fullPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        projects.push(fullPath);
      } else {
        // 递归查找子目录
        findProjects(fullPath, projects);
      }
    }
  }
  return projects;
}

// 获取命令行参数
const args = process.argv.slice(2);
const target = args[0] || 'all';

// 加载生产环境变量
const envProd = loadEnvProd();
const buildModules = envProd.BUILD_MODULES ? envProd.BUILD_MODULES.split(',').map(m => m.trim()) : null;

// 获取所有项目
const allProjects = findProjects(srcDir);

let projects;
if (target === 'all') {
  if (buildModules) {
    // 根据 BUILD_MODULES 过滤项目
    projects = allProjects.filter(p => buildModules.includes(path.basename(p)));
    console.log(`根据 BUILD_MODULES 过滤: ${buildModules.join(', ')}`);
  } else {
    projects = allProjects;
  }
} else {
  projects = allProjects.filter(p => path.basename(p) === target);
  if (projects.length === 0) {
    console.error(`错误: 未找到项目 "${target}"`);
    process.exit(1);
  }
}

console.log(`目标: ${target}`);
console.log('将构建的项目：', projects.map(p => path.relative(srcDir, p)));

// 逐一构建项目
projects.forEach(projectPath => {
  const projectName = path.basename(projectPath);
  console.log(`\n开始构建项目: ${projectName}`);

  try {
    // 进入项目目录并运行 pnpm build
    process.chdir(projectPath);
    execSync('pnpm build', { stdio: 'inherit' });

    // 构建成功后，复制 dist 到 frontend/dist
    const projectDistSrc = path.join(projectPath, 'dist');
    const projectDistDest = path.join(distDir, projectName);

    if (fs.existsSync(projectDistSrc)) {
      // 如果目标存在，先删除
      if (fs.existsSync(projectDistDest)) {
        fs.rmSync(projectDistDest, { recursive: true, force: true });
      }
      // 复制目录
      copyDir(projectDistSrc, projectDistDest);
      console.log(`项目 ${projectName} 构建完成，dist 已复制到 ${path.relative(path.join(__dirname, '..'), projectDistDest)}`);
    } else {
      console.warn(`警告: 项目 ${projectName} 没有生成 dist 目录`);
    }
  } catch (error) {
    console.error(`构建项目 ${projectName} 失败:`, error.message);
    // 继续下一个项目，而不是退出
  }
});

console.log('\n所有项目构建完成！');

// 构建完成后自动生成类型声明文件
console.log('\n生成远程模块类型声明文件...');
process.chdir(path.join(__dirname, '..'));
try {
  execSync('node scripts/generate-dts.js', { stdio: 'inherit' });
} catch (error) {
  console.error('生成类型声明文件失败:', error.message);
}