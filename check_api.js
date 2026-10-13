const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/profile',
  method: 'GET'
};

console.log('🔍 Checking backend at http://localhost:3000/api/profile...');

const req = http.request(options, (res) => {
  console.log(`✅ Status Code: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error('❌ Connection failed:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.log('💡 Tip: No server is listening on port 3000. Make sure the backend is running!');
  }
});

req.end();
