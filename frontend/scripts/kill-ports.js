const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 从 .env.dev 文件中提取端口号
function getPortsFromEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.dev');
    const envContent = fs.readFileSync(envPath, 'utf8');
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

// 执行 kill-port 命令
function killPorts() {
  const ports = getPortsFromEnv();
  const command = `kill-port ${ports.join(' ')}`;

  try {
    console.log(`清理端口: ${ports.join(', ')}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('清理端口失败:', error.message);
  }
}

killPorts();