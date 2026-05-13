
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
    const targetId = "cmo9d3bjh000urkuhzjszcjio";
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: targetId }
    });
    console.log(`Vendor ${targetId} exists?`, !!vendor);
    if (vendor) console.log('Vendor Data:', JSON.stringify(vendor, null, 2));

    const allVendors = await prisma.vendorProfile.findMany({ take: 5 });
    console.log('Sample Vendor IDs:', allVendors.map(v => v.id));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
