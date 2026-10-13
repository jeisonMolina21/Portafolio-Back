require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function check() {
  const connectionString = process.env.DATABASE_URL;
  const pool = mysql.createPool(connectionString);
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', ['jm6120346@gmail.com']);
    console.log('User found:', rows.length > 0);
    if (rows.length > 0) {
      const isMatch = await bcrypt.compare('Horizonte.2026', rows[0].password);
      console.log('Password Match:', isMatch);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
check();
