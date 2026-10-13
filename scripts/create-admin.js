const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

async function createAdmin() {
    const username = 'jm6120346@gmail.com';
    // User will provide the password as the first argument
    const password = process.argv[2];

    if (!password) {
        console.error('Usage: node create-admin.js YOUR_PASSWORD');
        process.exit(1);
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log(`Creating admin user: ${username}...`);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await connection.query(
            'INSERT INTO users (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?',
            [username, hashedPassword, hashedPassword]
        );

        console.log('Success! Admin user created or updated.');
    } catch (err) {
        console.error('Error creating user:', err.message);
    } finally {
        await connection.end();
    }
}

createAdmin();
