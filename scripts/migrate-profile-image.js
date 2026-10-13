const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'c:/Users/andre/Desktop/portafolio/backend/.env' });

async function migrateProfileImage() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Adding image_url to profile_settings...');
        const [columns] = await connection.query('SHOW COLUMNS FROM profile_settings');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('image_url')) {
            await connection.query('ALTER TABLE profile_settings ADD COLUMN image_url VARCHAR(255) AFTER linkedin');
            console.log('Added image_url column.');
        } else {
            console.log('image_url column already exists.');
        }
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await connection.end();
    }
}

migrateProfileImage();
