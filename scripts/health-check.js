const http = require('http');

const endpoints = [
  '/api/health',
  '/api/profile',
  '/api/projects',
  '/api/skills',
  '/api/experience',
  '/api/summary'
];

console.log('🔍 Executing Automated Backend Diagnostics Check...');

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const req = http.get({
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      timeout: 3000
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          endpoint,
          statusCode: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          sample: body.substring(0, 80)
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        endpoint,
        statusCode: 0,
        ok: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        endpoint,
        statusCode: 408,
        ok: false,
        error: 'Timeout'
      });
    });
  });
}

async function runDiagnostics() {
  console.log('----------------------------------------------------');
  for (const ep of endpoints) {
    const result = await testEndpoint(ep);
    if (result.ok) {
      console.log(`✅ [${result.statusCode}] ${result.endpoint} - Responding`);
    } else {
      console.log(`⚠️ [${result.statusCode || 'OFFLINE'}] ${result.endpoint} - ${result.error || 'Server not running on port 3000'}`);
    }
  }
  console.log('----------------------------------------------------');
  console.log('💡 Note: Launch `npm run dev` in backend to serve live endpoints locally.');
}

runDiagnostics();
