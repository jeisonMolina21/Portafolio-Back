const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function checkSchema() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    const tables = ['profile_settings', 'experience', 'projects', 'education', 'skills'];
    const schema = {};
    
    for (const table of tables) {
      try {
        const [columns] = await connection.query(`DESCRIBE ${table}`);
        schema[table] = columns;
      } catch (e) {
        schema[table] = { error: e.message };
      }
    }

    console.log(JSON.stringify(schema, null, 2));
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

checkSchema();
