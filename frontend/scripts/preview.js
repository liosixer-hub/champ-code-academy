const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// 定义路径
const distDir = path.join(__dirname, '..', 'dist');
const args = process.argv.slice(2);
const target = args[0];

// 清理指定端口
function killPorts(...ports) {
  const killPort = require('kill-port');
  ports.forEach(port => {
    try {
      execSync(`npx kill-port ${port} --silent`, { stdio: 'ignore' });
    } catch (e) {
      // 端口可能已经未被占用
    }
  });
}

function getApplications() {
  const apps = [];
  const distItems = fs.readdirSync(distDir);
  
  for (const item of distItems) {
    const itemPath = path.join(distDir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      apps.push(item);
    }
  }
  
  return apps;
}

// 获取应用的端口配置
function getAppPort(appName) {
  const portMap = {
    'shared': 5001,
    'login': 5002,
    'host': 5000,
    'dashboard': 5003,
    'home': 5004
  };
  return portMap[appName] || 5000;
}

// 启动预览服务器
function startPreviewServer(appName) {
  const appPath = path.join(distDir, appName);
  const port = getAppPort(appName);
  
  if (!fs.existsSync(appPath)) {
    console.error(`❌ 应用 ${appName} 的 dist 目录不存在`);
    process.exit(1);
  }
  
  console.log(`\n🚀 启动 ${appName} 预览服务器...`);
  console.log(`📍 访问地址: http://localhost:${port}`);
  console.log(`📁 静态文件夹: ${appPath}`);
  console.log(`⏹️  按 Ctrl+C 停止服务器\n`);
  
  // 创建 serve 配置文件到当前目录以支持 CORS
  const serveConfigPath = path.join(process.cwd(), `serve-${appName}.json`);
  const config = {
    "public": appPath,
    "headers": [
      {
        "source": "/**",
        "headers": [
          { "key": "Access-Control-Allow-Origin", "value": "*" },
          { "key": "Access-Control-Allow-Methods", "value": "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS" },
          { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
        ]
      }
    ],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  };
  fs.writeFileSync(serveConfigPath, JSON.stringify(config, null, 2));
  
  const server = spawn('npx', ['serve', '-c', serveConfigPath, '-l', String(port)], {
    stdio: 'inherit',
    shell: true
  });
  
  // 监听服务器错误
  server.on('error', (err) => {
    console.error(`❌ serve 进程错误: ${err.message}`);
    process.exit(1);
  });
  
  server.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`❌ serve 进程异常退出，退出代码: ${code}`);
      process.exit(1);
    }
  });
  
  // 保持进程活跃
  const keepAlive = setInterval(() => {}, 1000);
  
  const cleanup = () => {
    clearInterval(keepAlive);
    server.kill();
    try { fs.unlinkSync(serveConfigPath); } catch (e) { }
    killPorts(port);
  };
  
  process.on('SIGINT', () => {
    console.log('\n\n🛑 停止预览服务器...');
    cleanup();
    console.log('✅ 已停止');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
  });
}

// 启动多个应用的预览服务器
function startMultiplePreviewServers(appNames) {
  console.log('🔧 准备清理端口...');
  const ports = appNames.map(app => getAppPort(app));
  killPorts(...ports);
  
  console.log('\n📦 启动预览服务器...\n');
  
  const servers = [];
  const validApps = [];
  const configFiles = [];
  
  appNames.forEach(appName => {
    const port = getAppPort(appName);
    const appPath = path.join(distDir, appName);
    
    if (!fs.existsSync(appPath)) {
      console.error(`❌ 应用 ${appName} 的 dist 目录不存在`);
      return;
    }
    
    console.log(`▶️  ${appName}: http://localhost:${port}`);
    
    // 创建 serve 配置文件以支持 CORS
    const serveConfigPath = path.join(process.cwd(), `serve-${appName}.json`);
    const config = {
      "public": appPath,
      "headers": [
        {
          "source": "/**",
          "headers": [
            { "key": "Access-Control-Allow-Origin", "value": "*" },
            { "key": "Access-Control-Allow-Methods", "value": "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS" },
            { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
          ]
        }
      ],
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    };
    fs.writeFileSync(serveConfigPath, JSON.stringify(config, null, 2));
    configFiles.push(serveConfigPath);
    
    const server = spawn('npx', ['serve', '-c', serveConfigPath, '-l', String(port)], {
      stdio: 'inherit',
      shell: true
    });
    
    // 监听服务器错误
    server.on('error', (err) => {
      console.error(`❌ ${appName} serve 进程错误: ${err.message}`);
    });
    
    server.on('exit', (code) => {
      if (code !== null && code !== 0) {
        console.error(`❌ ${appName} serve 进程异常退出，退出代码: ${code}`);
      }
    });
    
    servers.push(server);
    validApps.push({ appName, port, server });
  });
  
  if (validApps.length === 0) {
    console.error('❌ 没有成功启动任何预览服务器');
    process.exit(1);
  }
  
  console.log('\n✅ 所有预览服务器已启动！');
  console.log('\n🔗 访问地址:');
  validApps.forEach(({ appName, port }) => {
    console.log(`   ${appName.padEnd(12)} → http://localhost:${port}`);
  });
  
  console.log('\n💡 提示: 按 Ctrl+C 停止所有服务器\n');
  
  // 保持进程活跃
  const keepAlive = setInterval(() => {}, 1000);
  
  const cleanup = () => {
    clearInterval(keepAlive);
    servers.forEach(server => server.kill());
    configFiles.forEach(configFile => {
      try { fs.unlinkSync(configFile); } catch (e) { }
    });
    killPorts(...ports);
  };
  
  // 处理退出
  process.on('SIGINT', () => {
    console.log('\n🛑 停止预览服务器...');
    cleanup();
    console.log('✅ 已停止所有服务器');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
  });
}

// 显示使用说明
function showUsage() {
  const apps = getApplications();
  
  console.log('\n📋 预览脚本使用说明\n');
  console.log('用法:');
  console.log('  pnpm preview                      - 预览所有应用');
  console.log('  pnpm preview <app-name>           - 预览指定应用');
  console.log('  pnpm preview login shared host    - 预览多个应用\n');
  
  console.log('可用的应用:');
  if (apps.length === 0) {
    console.log('  ⚠️  没有找到构建产物，请先运行 pnpm build');
  } else {
    apps.forEach(app => {
      const port = getAppPort(app);
      console.log(`  • ${app.padEnd(12)} (端口: ${port})`);
    });
  }
  console.log();
}

// 主函数
function main() {
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist 目录不存在，请先运行 pnpm build');
    process.exit(1);
  }
  
  const apps = getApplications();
  
  if (apps.length === 0) {
    console.error('❌ 没有找到任何构建产物，请先运行 pnpm build');
    showUsage();
    process.exit(1);
  }
  
  if (!target) {
    // 预览所有应用
    console.log('🎯 预览所有应用\n');
    startMultiplePreviewServers(apps);
  } else if (args.length === 1 && target === '--help') {
    showUsage();
  } else {
    // 预览指定的应用
    const selectedApps = args.filter(app => apps.includes(app));
    const invalidApps = args.filter(app => !apps.includes(app));
    
    if (invalidApps.length > 0) {
      console.error(`❌ 无效的应用名: ${invalidApps.join(', ')}`);
      showUsage();
      process.exit(1);
    }
    
    if (selectedApps.length === 0) {
      console.error('❌ 没有指定有效的应用');
      showUsage();
      process.exit(1);
    }
    
    if (selectedApps.length === 1) {
      console.log(`🎯 预览应用: ${selectedApps[0]}\n`);
      // 清理端口
      const port = getAppPort(selectedApps[0]);
      killPorts(port);
      // 启动单个服务器
      startPreviewServer(selectedApps[0]);
    } else {
      console.log(`🎯 预览应用: ${selectedApps.join(', ')}\n`);
      startMultiplePreviewServers(selectedApps);
    }
  }
}

// 执行
main();
