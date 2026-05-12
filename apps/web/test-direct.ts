import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import 'dotenv/config';

async function test() {
  // Use DIRECT_URL for this test
  const connectionString = "postgresql://postgres.sztsypdamevylxnjagqz:MEqLrab1D3lWMU5W@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"; // Port 5432 is direct
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const vendors = await prisma.vendorProfile.findMany();
    console.log(`Found ${vendors.length} vendors in Supabase (Direct).`);
    vendors.forEach(v => console.log(`- ${v.businessName}`));
  } catch (error) {
    console.error("Direct Test failed:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
