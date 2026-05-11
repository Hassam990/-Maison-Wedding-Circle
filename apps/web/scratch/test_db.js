const { Client } = require('pg');

async function testConnection() {
  const connectionString = "postgresql://postgres.sztsypdamevylxnjagqz:3LWlX2LZpEA72CDp@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting to pooler...");
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection failed:", err.message);
    if (err.detail) console.error("Detail:", err.detail);
    if (err.hint) console.error("Hint:", err.hint);
  }
}

testConnection();
