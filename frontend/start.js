#!/usr/bin/env node
/**
 * 前端服务启动脚本 - 启动前自动停止占用的端口
 */
const { execSync } = require('child_process');
const os = require('os');

const PORTS = [5000, 5001, 5002, 5003, 5004];

function killPort(port) {
  try {
    if (process.platform === 'win32') {
      // Windows
      try {
        const result = execSync(`netstat -ano | findstr ":${port}"`, {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe']
        });
        
        if (result) {
          const lines = result.trim().split('\n');
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length > 0) {
              const pid = parts[parts.length - 1];
              try {
                execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
                console.log(`✓ 已停止占用端口 ${port} 的进程 (PID: ${pid})`);
              } catch (e) {
                // 忽略错误
              }
            }
          }
        }
      } catch (e) {
        // 端口未被占用，继续
      }
    } else {
      // Linux/Mac
      try {
        const result = execSync(`lsof -i :${port}`, {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe']
        });
        
        if (result) {
          const lines = result.trim().split('\n').slice(1);
          for (const line of lines) {
            const parts = line.split(/\s+/);
            if (parts.length > 1) {
              const pid = parts[1];
              try {
                process.kill(parseInt(pid), 9);
                console.log(`✓ 已停止占用端口 ${port} 的进程 (PID: ${pid})`);
              } catch (e) {
                // 忽略错误
              }
            }
          }
        }
      } catch (e) {
        // 端口未被占用，继续
      }
    }
  } catch (e) {
    // 忽略错误
  }
}

console.log('\n' + '='.repeat(50));
console.log('Champ Code Academy - 前端启动脚本');
console.log('='.repeat(50) + '\n');

console.log('清理端口...');
for (const port of PORTS) {
  killPort(port);
}

console.log('\n启动所有前端模块...');
console.log('Host: http://localhost:5000');
console.log('Shared: http://localhost:5001');
console.log('Login: http://localhost:5002');
console.log('Dashboard: http://localhost:5003');
console.log('Home: http://localhost:5004');
console.log('\n' + '='.repeat(50) + '\n');

// 启动pnpm dev，选择all
const { spawn } = require('child_process');
const proc = spawn('pnpm', ['dev'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

proc.on('close', (code) => {
  process.exit(code);
});
