const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function checkProfileSchema() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('\n--- Schema for profile_settings ---');
    const [columns] = await connection.query('DESCRIBE profile_settings');
    console.log(JSON.stringify(columns, null, 2));

    await connection.end();
  } catch (error) {
    console.error('Check failed:', error.message);
  }
}

checkProfileSchema();
