
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
    const testimonialCount = await prisma.testimonial.count();
    console.log(`Testimonial Count: ${testimonialCount}`);
    const testimonials = await prisma.testimonial.findMany();
    console.log('Testimonials:', JSON.stringify(testimonials, null, 2));

    const faqCount = await prisma.faqItem.count();
    console.log(`FAQ Count: ${faqCount}`);
    const faqs = await prisma.faqItem.findMany();
    console.log('FAQs:', JSON.stringify(faqs, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
