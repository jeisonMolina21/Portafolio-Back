const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function migrate() {
  console.log('--- Migrating Database Schema ---');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // Experience table: add lang
    console.log('Migrating experience table...');
    try {
      await connection.query("ALTER TABLE experience ADD COLUMN lang VARCHAR(5) DEFAULT 'es'");
      console.log('✅ Added lang to experience');
    } catch (err) {
      console.log('Note: experience migration info:', err.message);
    }

    // Projects table: add lang and tech_stack if missing
    console.log('Migrating projects table...');
    try {
      await connection.query("ALTER TABLE projects ADD COLUMN lang VARCHAR(5) DEFAULT 'es'");
      console.log('✅ Added lang to projects');
    } catch (err) {
        console.log('Note: projects lang already exists or error:', err.message);
    }
    try {
        await connection.query('ALTER TABLE projects ADD COLUMN tech_stack TEXT');
        console.log('✅ Added tech_stack to projects');
    } catch (err) {
        console.log('Note: projects tech_stack already exists or error:', err.message);
    }

    // Education table: add lang
    console.log('Migrating education table...');
    try {
      await connection.query("ALTER TABLE education ADD COLUMN lang VARCHAR(5) DEFAULT 'es'");
      console.log('✅ Added lang to education');
    } catch (err) {
      console.log('Note: education migration info:', err.message);
    }

    // Skills table: add category
    console.log('Migrating skills table...');
    try {
        await connection.query("ALTER TABLE skills ADD COLUMN category VARCHAR(50) DEFAULT 'Other'");
        console.log('✅ Added category to skills');
    } catch (err) {
        console.log('Note: skills category already exists or error:', err.message);
    }

    await connection.end();
    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

migrate();
