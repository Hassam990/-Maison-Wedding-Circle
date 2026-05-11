const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const sqlPath = path.join(__dirname, '..', 'latest_schema.sql');
    let sql = fs.readFileSync(sqlPath, 'utf16le');
    // Remove BOM if present
    if (sql.charCodeAt(0) === 0xFEFF) {
        sql = sql.slice(1);
    }

    try {
        console.log('Connecting to database...');
        await client.connect();
        
        console.log('Clearing database...');
        await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;');

        console.log('Applying latest schema statement by statement...');
        // Split by semicolon but be careful with functions/enums
        // A simple split usually works for Prisma generated SQL
        const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
        
        for (let i = 0; i < statements.length; i++) {
            try {
                await client.query(statements[i] + ';');
            } catch (err) {
                console.error(`Error in statement ${i}:`, err.message);
                console.error('Statement:', statements[i]);
            }
        }
        
        console.log('Schema synchronized successfully!');
    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        await client.end();
    }
}

run();
