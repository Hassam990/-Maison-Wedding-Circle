
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const connectionString = "postgresql://postgres.sztsypdamevylxnjagqz:MEqLrab1D3lWMU5W@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const contentCount = await prisma.siteContent.count();
    console.log(`SiteContent Count: ${contentCount}`);
    const contents = await prisma.siteContent.findMany();
    console.log('Contents:', JSON.stringify(contents, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
