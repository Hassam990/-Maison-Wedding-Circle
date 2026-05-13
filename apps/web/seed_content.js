
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

  const content = [
    { key: "hero_headline", value: "Your story deserves more than a booking website.", label: "Hero Headline", group: "homepage" },
    { key: "hero_subtext", value: "We curate, match, coordinate, and simplify your wedding. Curated South Asian weddings across the USA.", label: "Hero Subtext", group: "homepage" },
    { key: "hero_trust_badge", value: "Trusted by 500+ South Asian Families", label: "Hero Trust Badge", group: "homepage" },
    { key: "how_it_works_title", value: "Simple, Guided, Stress-Free", label: "How it works title", group: "homepage" },
    { key: "why_choose_title", value: "Not a Directory. A Guided Wedding Network.", label: "Why Choose Title", group: "homepage" },
    { key: "vendor_join_headline", value: "Join Our Network", label: "Vendor Join Headline", group: "homepage" },
    { key: "vendor_join_subtext", value: "Get high-quality leads. No commissions taken.", label: "Vendor Join Subtext", group: "homepage" },
    { key: "footer_tagline", value: "Your wedding, guided by trust and experience.", label: "Footer Tagline", group: "footer" },
    { key: "footer_copyright", value: "© 2026 Maison Wedding Circle. All rights reserved.", label: "Footer Copyright", group: "footer" }
  ];

  try {
    for (const item of content) {
      console.log(`Upserting ${item.key}...`);
      await prisma.siteContent.upsert({
        where: { key: item.key },
        update: { value: item.value, label: item.label, group: item.group },
        create: { key: item.key, value: item.value, label: item.label, group: item.group }
      });
    }
    console.log('Database seeded with current website content.');
  } catch (error) {
    console.error('Error seeding content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
