const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const readline = require('readline');

// 定义路径
const frontendPath = path.join(__dirname, '..');
const sharedPath = path.join(frontendPath, 'src', 'shared');
const appsPath = path.join(frontendPath, 'src', 'apps');
const hostPath = path.join(frontendPath, 'src', 'host');
const envDevPath = path.join(frontendPath, '.env.development');

// 获取可用应用列表
function getAvailableApps() {
  const apps = [];
  if (fs.existsSync(appsPath)) {
    const items = fs.readdirSync(appsPath);
    for (const item of items) {
      const itemPath = path.join(appsPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        const packageJsonPath = path.join(itemPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          apps.push(item);
        }
      }
    }
  }
  return apps;
}

const processes = [];

// 从 .env.dev 文件中提取端口号
function getPortsFromEnv() {
  try {
    const envContent = fs.readFileSync(envDevPath, 'utf8');
    const ports = [];
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/BASE_URL_[A-Z_]+ = http:\/\/localhost:(\d+)/);
        if (match) {
          ports.push(parseInt(match[1]));
        }
      }
    }
    
    return ports;
  } catch (error) {
    console.warn('无法读取 .env.dev 文件，使用默认端口');
    return [5000, 5001, 5002, 5003, 5004];
  }
}

// 捕获SIGINT信号来清理所有进程
process.on('SIGINT', () => {
  console.log('\n正在停止所有服务器...');
  processes.forEach(proc => {
    if (proc && !proc.killed) {
      proc.kill();
    }
  });
  process.exit(0);
});

// 执行命令的辅助函数
function executeCommand(cwd, command) {
  try {
    console.log(`执行: ${command} (目录: ${cwd})`);
    execSync(command, { stdio: 'inherit', cwd });
  } catch (error) {
    console.error(`执行失败: ${error.message}`);
    throw error;
  }
}

// 启动后台进程的辅助函数
function startProcess(cwd, command, processName) {
  return new Promise((resolve) => {
    console.log(`启动 ${processName}...`);
    const proc = spawn('cmd', ['/c', command], {
      cwd,
      stdio: 'inherit',
      detached: false
    });

    proc.on('error', (err) => {
      console.error(`启动 ${processName} 失败:`, err);
    });

    processes.push(proc);
    setTimeout(resolve, 2000); // 等待2秒让服务启动
  });
}

// 主函数
async function main() {
  try {
    // 先清理端口
    console.log('清理端口...');
    const ports = getPortsFromEnv();
    const killCommand = `kill-port ${ports.join(' ')}`;
    executeCommand(frontendPath, killCommand);

    // 获取可用应用列表
    const availableApps = getAvailableApps();
    const options = ['all', 'host', 'shared', ...availableApps];
    
    // 检查是否有命令行参数
    const hasArgs = process.argv.slice(2).length > 0;
    let targetApp = process.argv[2];

    if (!hasArgs && process.stdin.isTTY) {
      // 交互式模式：列出选项并让用户选择
      console.log('可用的选项：');
      options.forEach((option, index) => {
        console.log(`${index + 1}. ${option}`);
      });

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      targetApp = await new Promise((resolve) => {
        rl.question('请选择: ', (answer) => {
          rl.close();
          const index = parseInt(answer) - 1;
          if (!isNaN(index) && index >= 0 && index < options.length) {
            resolve(options[index]);
          } else {
            // 如果输入不是数字，视为直接输入的应用名
            resolve(answer.trim());
          }
        });
      });
    }

    if (targetApp && targetApp !== 'host' && targetApp !== 'all') {
      if (targetApp === 'shared') {
        // 场景1.1: 直接启动shared dev
        console.log('启动 shared 开发模式');
        await startProcess(sharedPath, 'pnpm dev', 'shared dev');
      } else {
        // 场景1.2: 针对特定app (如 npm run dev login)
        console.log(`启动特定应用开发模式: ${targetApp}`);
        
        // 先构建shared
        console.log('构建 shared...');
        executeCommand(sharedPath, 'pnpm build');
        
        // 启动shared preview
        await startProcess(sharedPath, 'pnpm preview', 'shared preview');
        
        // 启动指定app的dev
        const appPath = path.join(appsPath, targetApp);
        if (fs.existsSync(appPath)) {
          await startProcess(appPath, 'pnpm dev', `${targetApp} dev`);
        } else {
          console.error(`应用路径不存在: ${appPath}`);
          process.exit(1);
        }
      }
    } else {
      // 场景2: host或all (npm run dev 或 npm run dev host 或 npm run dev all)
      console.log('启动完整开发模式 (shared + apps + host)');
      
      // 先构建shared
      console.log('构建 shared...');
      executeCommand(sharedPath, 'pnpm build');
      
      // 启动shared preview
      await startProcess(sharedPath, 'pnpm preview', 'shared preview');
      
      // 依次启动apps中各模块的preview
      const appsDir = fs.readdirSync(appsPath);
      for (const app of appsDir) {
        const appPath = path.join(appsPath, app);
        if (fs.statSync(appPath).isDirectory()) {
          const packageJsonPath = path.join(appPath, 'package.json');
          if (fs.existsSync(packageJsonPath)) {
            await startProcess(appPath, 'pnpm preview', `${app} preview`);
          }
        }
      }
      
      // 最后启动host preview
      console.log('构建 host...');
      executeCommand(hostPath, 'pnpm build');
      await startProcess(hostPath, 'pnpm preview --port 5000', 'host preview');
    }

    console.log('\n所有服务器已启动，按 Ctrl+C 停止');
    process.stdin.resume();
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

main();