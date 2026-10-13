require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function resetAuth() {
  const connectionString = process.env.DATABASE_URL;
  const pool = mysql.createPool(connectionString);
  try {
    console.log('--- Resetting Admin User ---');
    
    // Clean old users to avoid confusion
    await pool.query('DELETE FROM users');
    
    const adminEmail = 'jm6120346@gmail.com';
    const pass = 'Horizonte.2026';
    const hashed = await bcrypt.hash(pass, 10);
    
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [adminEmail, hashed]);
    
    const [rows] = await pool.query('SELECT username FROM users');
    console.log('Current Users in DB:', rows);
    console.log('Admin password set to: Horizonte.2026');
    
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
resetAuth();
