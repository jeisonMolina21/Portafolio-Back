
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

async function checkDB() {
    dotenv.config({ path: path.join(__dirname, '../.env') });
    
    const dbConfig = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    };

    console.log('Connecting to:', dbConfig.host, 'DB:', dbConfig.database);

    const connection = await mysql.createConnection(dbConfig);
    
    const tables = ['projects', 'experience', 'education', 'skills', 'profile_settings'];
    
    for (const table of tables) {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`Table ${table}: ${rows[0].count} rows`);
        if (rows[0].count > 0) {
            const [data] = await connection.query(`SELECT * FROM ${table} LIMIT 1`);
            console.log(`  Sample:`, JSON.stringify(data[0]).substring(0, 100));
        }
    }
    
    await connection.end();
}

checkDB().catch(console.error);
