const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function countRows() {
  const tables = ['profile_settings', 'experience', 'projects', 'education', 'skills'];
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    for (const table of tables) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`Table ${table}: ${rows[0].count} rows`);
      if (rows[0].count > 0) {
        const [data] = await connection.query(`SELECT * FROM ${table} LIMIT 1`);
        console.log(`Sample from ${table}:`, JSON.stringify(data[0]).substring(0, 100) + '...');
      }
    }
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

countRows();
