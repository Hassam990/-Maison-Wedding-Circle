import { db } from "./src/lib/db";

async function test() {
  try {
    const vendors = await db.vendorProfile.findMany();
    console.log(`Found ${vendors.length} vendors in Supabase.`);
    vendors.forEach(v => console.log(`- ${v.businessName}`));
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Process will exit
  }
}

test();
