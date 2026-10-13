const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function checkAllSchemas() {
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
      console.log(`\n--- Schema for table: ${table} ---`);
      try {
        const [rows] = await connection.query(`DESCRIBE ${table}`);
        console.table(rows.map(r => ({ Field: r.Field, Type: r.Type })));
      } catch (err) {
        console.log(`Table ${table} error: ${err.message}`);
      }
    }
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

checkAllSchemas();
