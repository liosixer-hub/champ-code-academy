const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// 定义路径
const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');
const envProdPath = path.join(__dirname, '..', '.env.production');

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

// 加载生产环境变量
const envProd = loadEnvProd();
const buildModules = envProd.BUILD_MODULES ? envProd.BUILD_MODULES.split(',').map(m => m.trim()) : null;

// 获取所有项目
const allProjects = findProjects(srcDir);

// 检查是否有命令行参数
const hasArgs = process.argv.slice(2).length > 0;

let target = 'all';

if (!hasArgs && process.stdin.isTTY) {
  // 交互式模式：列出模块并让用户选择
  const availableModules = allProjects.map(p => path.basename(p));
  console.log('可用的模块：');
  availableModules.forEach((module, index) => {
    console.log(`${index + 1}. ${module}`);
  });
  console.log('输入模块名或编号来构建指定模块，输入 "all" 构建所有模块：');

  // 创建 readline 接口
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // 异步函数来处理用户输入
  const getUserChoice = () => {
    return new Promise((resolve) => {
      rl.question('请选择: ', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  };

  // 主逻辑
  (async () => {
    target = await getUserChoice();

    // 如果输入的是编号，转换为模块名
    const index = parseInt(target) - 1;
    if (!isNaN(index) && index >= 0 && index < availableModules.length) {
      target = availableModules[index];
    }

    processBuild(target);
  })();
} else {
  // 非交互式模式：使用命令行参数
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--module' && args[i + 1]) {
      target = args[i + 1];
      i++; // 跳过下一个参数
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('用法: node scripts/build.js [选项] [模块名]');
      console.log('选项:');
      console.log('  --module <模块名>  指定要构建的模块');
      console.log('  --help, -h        显示此帮助信息');
      console.log('如果不指定模块，则构建所有模块。');
      process.exit(0);
    } else if (!args[i].startsWith('--')) {
      target = args[i];
    }
  }
  processBuild(target);
}

// 构建处理函数
function processBuild(target) {
  // 加载生产环境变量
  const envProd = loadEnvProd();
  const buildModules = envProd.BUILD_MODULES ? envProd.BUILD_MODULES.split(',').map(m => m.trim()) : null;
  if (target === 'all' || target === '') {
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
      let projectDistDest;
      if (projectName === 'host') {
        projectDistDest = distDir;
      } else {
        projectDistDest = path.join(distDir, projectName);
      }

      if (fs.existsSync(projectDistSrc)) {
        // 如果目标存在，先删除（但host不删除，因为与其他应用共存）
        if (fs.existsSync(projectDistDest) && projectName !== 'host') {
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
}