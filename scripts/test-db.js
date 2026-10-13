const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function testConnection() {
  console.log('--- Testing DB Connection ---');
  
  let connectionConfig;
  if (process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')); // Hide password in logs
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      const host = parsed.hostname;
      const useSsl = process.env.DATABASE_URL.includes('ssl=true') || 
        (host !== 'localhost' && host !== '127.0.0.1' && host !== 'mariadb' && host !== 'mariadb_prod' && !host.startsWith('172.'));
      connectionConfig = {
        host,
        port: parsed.port ? parseInt(parsed.port) : 3306,
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname.replace(/^\//, ''),
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
        connectTimeout: 10000
      };
    } catch (urlErr) {
      console.error('❌ Failed to parse DATABASE_URL:', urlErr.message);
    }
  }

  if (!connectionConfig) {
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    connectionConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      connectTimeout: 10000
    };
  }
  
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connection successful!');
    const [rows] = await connection.query('SELECT 1 as result');
    console.log('Query result:', rows);
    
    try {
      const [profiles] = await connection.query('SELECT * FROM profile_settings');
      console.log('--- Profile Settings in DB ---');
      console.log(JSON.stringify(profiles, null, 2));
    } catch (dbErr) {
      console.log('Could not fetch profile_settings:', dbErr.message);
    }

    try {
      const [experienceCount] = await connection.query('SELECT COUNT(*) as count FROM experience');
      const [skillsCount] = await connection.query('SELECT COUNT(*) as count FROM skills');
      const [projectsCount] = await connection.query('SELECT COUNT(*) as count FROM projects');
      console.log(`Counts - Experience: ${experienceCount[0].count}, Skills: ${skillsCount[0].count}, Projects: ${projectsCount[0].count}`);
    } catch (dbErr) {
      console.log('Could not fetch other counts:', dbErr.message);
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
