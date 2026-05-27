const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Frontend and Backend servers concurrently...\n');

// Spawn Backend Process
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true,
  stdio: 'inherit'
});

// Spawn Frontend Process
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true,
  stdio: 'inherit'
});

// Clean up helper
const killAll = () => {
  console.log('\nStopping servers...');
  // On Windows, taskkill might be needed for shell sub-processes
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', backend.pid, '/f', '/t']);
    spawn('taskkill', ['/pid', frontend.pid, '/f', '/t']);
  } else {
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
  }
};

// Monitor exits
backend.on('exit', (code) => {
  console.log(`\nBackend server stopped (exit code ${code})`);
  killAll();
  process.exit(code || 0);
});

frontend.on('exit', (code) => {
  console.log(`\nFrontend server stopped (exit code ${code})`);
  killAll();
  process.exit(code || 0);
});

// Capture Ctrl+C / terminations
process.on('SIGINT', () => {
  killAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  killAll();
  process.exit(0);
});
