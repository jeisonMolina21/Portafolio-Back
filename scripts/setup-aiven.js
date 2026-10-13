
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function setup() {
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '15903'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  };

  try {
    const connection = await mysql.createConnection(config);
    const dbName = process.env.DB_NAME || 'my_proyectsast';
    console.log(`Creating database ${dbName}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.query(`USE ${dbName}`);

    console.log('Creating necessary tables...');
    
    // Drop existing tables to ensure clean setup
    const tablesToDrop = ['messages', 'skills', 'education', 'experience', 'projects', 'profile_settings', 'users'];
    for (const table of tablesToDrop) {
      await connection.query(`DROP TABLE IF EXISTS ${table}`);
    }

    // profile_settings
    await connection.query(`
      CREATE TABLE profile_settings (
        id INT PRIMARY KEY DEFAULT 1,
        full_name VARCHAR(255),
        title_es TEXT,
        title_en TEXT,
        bio_es TEXT,
        bio_en TEXT,
        location VARCHAR(100),
        whatsapp VARCHAR(255),
        email VARCHAR(255),
        linkedin VARCHAR(255),
        github VARCHAR(255),
        image_url VARCHAR(255),
        cv_url VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // projects (added lang column)
    await connection.query(`
      CREATE TABLE projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        video_url VARCHAR(255),
        github_url VARCHAR(255),
        demo_url VARCHAR(255),
        tech_stack TEXT,
        lang VARCHAR(10) DEFAULT 'es',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // experience (added lang column)
    await connection.query(`
      CREATE TABLE experience (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        period VARCHAR(100),
        description TEXT,
        skills TEXT,
        lang VARCHAR(10) DEFAULT 'es',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // education (added lang column)
    await connection.query(`
      CREATE TABLE education (
        id INT AUTO_INCREMENT PRIMARY KEY,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        period VARCHAR(100),
        description TEXT,
        lang VARCHAR(10) DEFAULT 'es',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // skills
    await connection.query(`
      CREATE TABLE skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // messages
    await connection.query(`
      CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        whatsapp VARCHAR(50),
        city VARCHAR(100),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // users
    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.end();
    console.log('✅ Database and Tables SETUP SUCCESSFUL!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setup();
