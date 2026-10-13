import pool from '../lib/db';

async function main() {
  try {
    console.log('Testing Postgres pool wrapper...');
    const [rows]: any = await pool.query('SELECT * FROM profile_settings WHERE id = ?', [1]);
    console.log('Result profile_settings:', rows);
    
    const [skills]: any = await pool.query('SELECT * FROM skills LIMIT 3');
    console.log('Result skills limit 3:', skills);
  } catch (err: any) {
    console.error('Test failed:', err.message);
  } finally {
    await pool.end();
  }
}
main();
