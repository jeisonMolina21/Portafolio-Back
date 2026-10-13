const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'c:/Users/andre/Desktop/portafolio/backend/.env' });

async function migrateProfile() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Migrating profile_settings table...');

        // 1. Add new columns
        await connection.query("ALTER TABLE profile_settings ADD COLUMN title TEXT, ADD COLUMN bio TEXT");

        // 2. Copy ES data to new columns (assuming ES is primary)
        await connection.query("UPDATE profile_settings SET title = title_es, bio = bio_es");

        // 3. Drop old columns
        await connection.query("ALTER TABLE profile_settings DROP COLUMN title_es, DROP COLUMN title_en, DROP COLUMN bio_es, DROP COLUMN bio_en");

        console.log('Profile migration successful!');
    } catch (err) {
        console.error('Profile migration failed:', err.message);
    } finally {
        await connection.end();
    }
}

migrateProfile();
