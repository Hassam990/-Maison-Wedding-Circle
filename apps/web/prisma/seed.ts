import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Seeding started...");

  // Seed vendors
  const categories = ["Catering", "Decor", "Photography", "Makeup", "Music"];
  
  for (let i = 1; i <= 10; i++) {
    await prisma.user.create({
      data: {
        email: `vendor${i}@example.com`,
        name: `Vendor ${i}`,
        role: "VENDOR",
        vendorProfile: {
          create: {
            businessName: `Business ${i} ${categories[i % 5]}`,
            category: categories[i % 5],
            city: "Atlanta, GA",
            bio: "Sample vendor bio for South Asian weddings.",
            verified: true,
            plan: "Professional"
          }
        }
      }
    });
  }

  // Seed couples
  for(let i = 1; i <= 3; i++) {
    await prisma.user.create({
      data: {
        email: `couple${i}@example.com`,
        name: `Couple ${i}`,
        role: "COUPLE",
        coupleProfile: {
          create: {
            eventType: "Wedding",
            city: "New York, NY",
            budget: 75000 + (i*10000),
            guestCount: 300,
            style: "Modern Chic"
          }
        }
      }
    });
  }

  // Consultations
  const couple1 = await prisma.coupleProfile.findFirst();
  if (couple1) {
    await prisma.consultation.create({
      data: {
        coupleId: couple1.id,
        status: "New",
        notes: "Excited to get started!"
      }
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
