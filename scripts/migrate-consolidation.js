const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'c:/Users/andre/Desktop/portafolio/backend/.env' });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('Migrating database...');

    try {
        // 1. Delete all English duplicates (since we'll translate from Spanish)
        console.log('Cleaning up duplicate rows...');
        await connection.query("DELETE FROM projects WHERE lang = 'en'");
        await connection.query("DELETE FROM experience WHERE lang = 'en'");
        await connection.query("DELETE FROM education WHERE lang = 'en'");

        // 2. Remove the lang column
        console.log('Removing lang columns...');
        await connection.query("ALTER TABLE projects DROP COLUMN lang");
        await connection.query("ALTER TABLE experience DROP COLUMN lang");
        await connection.query("ALTER TABLE education DROP COLUMN lang");

        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await connection.end();
    }
}

migrate();
