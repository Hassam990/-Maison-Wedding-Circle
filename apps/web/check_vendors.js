
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const connectionString = "postgresql://postgres.sztsypdamevylxnjagqz:MEqLrab1D3lWMU5W@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const vendorCount = await prisma.vendorProfile.count();
    console.log(`Vendor Count: ${vendorCount}`);
    const vendors = await prisma.vendorProfile.findMany({
      take: 5,
      include: { user: true }
    });
    console.log('Vendors:', JSON.stringify(vendors, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
