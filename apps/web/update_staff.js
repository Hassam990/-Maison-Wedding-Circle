
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function main() {
  const connectionString = "postgresql://postgres.sztsypdamevylxnjagqz:MEqLrab1D3lWMU5W@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const adminPass = await bcrypt.hash('MaisonAdmin2026!', 10);
  const staffPass = await bcrypt.hash('MaisonStaff2026!', 10);

  const updates = [
    { email: 'admin@maisoncircle.com', name: 'Lister', pass: adminPass },
    { email: 'staff1@maisoncircle.com', name: 'Dawood Staff 2', pass: staffPass },
    { email: 'staff2@maisoncircle.com', name: 'Huma Mea Staff 2', pass: staffPass }
  ];

  try {
    for (const user of updates) {
      console.log(`Updating ${user.email}...`);
      await prisma.user.update({
        where: { email: user.email },
        data: {
          name: user.name,
          passwordHash: user.pass
        }
      });
    }
    console.log('Successfully updated staff names and passwords.');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
