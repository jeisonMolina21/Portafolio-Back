
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Adding github column to profile_settings...');
    await connection.query('ALTER TABLE profile_settings ADD COLUMN IF NOT EXISTS github VARCHAR(255) AFTER linkedin');
    
    await connection.end();
    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

migrate();
