
const fetch = require('node-fetch');

async function testAPI() {
    const urls = [
        'http://localhost:3000/api/profile',
        'http://localhost:3000/api/skills',
        'http://localhost:3000/api/projects',
        'http://localhost:3000/api/experience',
        'http://localhost:3000/api/education'
    ];

    console.log('--- Testing Local Backend API (with Aiven DB) ---');
    for (const url of urls) {
        try {
            const res = await fetch(url);
            console.log(`${url}: ${res.status} ${res.statusText}`);
            if (res.status !== 200) {
                const text = await res.text();
                console.log('Error Body:', text);
            } else {
                const data = await res.json();
                console.log('Data count:', Array.isArray(data) ? data.length : (data ? '1 (object)' : '0'));
            }
        } catch (err) {
            console.error(`❌ Failed to fetch ${url}:`, err.message);
        }
    }
}

testAPI();
