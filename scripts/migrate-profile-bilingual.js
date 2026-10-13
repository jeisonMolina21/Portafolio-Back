const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function migrate() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('--- Migrating profile_settings table ---');
    
    // Add missing columns if they don't exist
    const [columns] = await connection.query('DESCRIBE profile_settings');
    const existingCols = columns.map(c => c.Field);

    if (!existingCols.includes('title_es')) {
      await connection.query('ALTER TABLE profile_settings ADD COLUMN title_es TEXT');
      console.log('Added title_es');
    }
    if (!existingCols.includes('title_en')) {
      await connection.query('ALTER TABLE profile_settings ADD COLUMN title_en TEXT');
      console.log('Added title_en');
    }
    if (!existingCols.includes('bio_es')) {
      await connection.query('ALTER TABLE profile_settings ADD COLUMN bio_es TEXT');
      console.log('Added bio_es');
    }
    if (!existingCols.includes('bio_en')) {
      await connection.query('ALTER TABLE profile_settings ADD COLUMN bio_en TEXT');
      console.log('Added bio_en');
    }

    await connection.end();
    console.log('✅ Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

migrate();
