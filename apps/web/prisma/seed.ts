import 'dotenv/config'
import { PrismaClient, BoostType, AdPlacement } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcryptjs from 'bcryptjs'

// Use the same Prisma 7 adapter pattern as the main app
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Hash passwords
  const adminHash = await bcryptjs.hash('Admin@1234', 10)
  const staffHash = await bcryptjs.hash('Staff@1234', 10)
  const vendorHash = await bcryptjs.hash('Vendor@1234', 10)
  const coupleHash = await bcryptjs.hash('Couple@1234', 10)

  console.log('Seeding Super Admin and Staff Admins...')
  // 2. Create Super Admin
  const adminUser = await prisma.user.upsert({ 
    where: { email: 'admin@maisoncircle.com' }, 
    update: { passwordHash: adminHash, role: 'SUPER_ADMIN', name: 'Lister' }, 
    create: { name: 'Lister', email: 'admin@maisoncircle.com', passwordHash: adminHash, role: 'SUPER_ADMIN' }
  })

  // 3. Create Staff Admins
  const staff1 = await prisma.user.upsert({
    where: { email: 'staff1@maisoncircle.com' },
    update: { passwordHash: staffHash, role: 'STAFF_ADMIN', name: 'Aisha Mirza' },
    create: { name: 'Aisha Mirza', email: 'staff1@maisoncircle.com', passwordHash: staffHash, role: 'STAFF_ADMIN' }
  })
  const staff2 = await prisma.user.upsert({
    where: { email: 'staff2@maisoncircle.com' },
    update: { passwordHash: staffHash, role: 'STAFF_ADMIN', name: 'Bilal Siddiqui' },
    create: { name: 'Bilal Siddiqui', email: 'staff2@maisoncircle.com', passwordHash: staffHash, role: 'STAFF_ADMIN' }
  })

  console.log('Seeding Vendor Categories...')
  const categories = [
    { name: 'Catering', slug: 'catering', icon: '🍳', description: 'Gourmet South Asian cuisine' },
    { name: 'Decor', slug: 'decor', icon: '✨', description: 'Luxury stage and event decor' },
    { name: 'Photography', slug: 'photography', icon: '📸', description: 'Cinematic wedding storytelling' },
    { name: 'Makeup', slug: 'makeup', icon: '💄', description: 'Bridal hair and makeup artistry' },
    { name: 'Entertainment', slug: 'entertainment', icon: '🎵', description: 'DJs, DHOL, and performers' },
    { name: 'Venue', slug: 'venue', icon: '🏰', description: 'Premium banquet halls and hotels' },
    { name: 'Bridal Wear', slug: 'bridal-wear', icon: '👗', description: 'Traditional and modern bridal outfits' },
    { name: 'Planning', slug: 'planning', icon: '📋', description: 'Expert wedding coordination' },
    { name: 'Henna/Mehndi', slug: 'henna', icon: '🎨', description: 'Intricate bridal mehndi designs' },
    { name: 'Jewelry', slug: 'jewelry', icon: '💎', description: 'Exquisite bridal jewelry sets' },
  ]
  for (const cat of categories) {
    await prisma.vendorCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat
    })
  }

  console.log('Seeding Service Cities...')
  const citiesData = [
    { city: 'Atlanta', state: 'GA' },
    { city: 'New York', state: 'NY' },
    { city: 'Dallas', state: 'TX' },
    { city: 'Houston', state: 'TX' },
    { city: 'Chicago', state: 'IL' },
    { city: 'Washington', state: 'DC' },
    { city: 'Los Angeles', state: 'CA' },
    { city: 'New Jersey', state: 'NJ' },
  ]
  for (const city of citiesData) {
    const id = `city_${city.city.toLowerCase()}`
    await prisma.serviceCity.upsert({
      where: { id },
      update: city,
      create: { ...city, id }
    })
  }

  console.log('Seeding Vendors...')
  const vendors = [
    { email: 'bushra@vendor.com', name: 'Bushra', business: "Bushra's Kitchen", category: 'Catering', city: 'Atlanta GA', plan: 'PROFESSIONAL', verified: true, rating: 4.8 },
    { email: 'spiceroute@vendor.com', name: 'Spice Route', business: 'Spice Route Catering', category: 'Catering', city: 'New York NY', plan: 'FREE', verified: false, rating: 4.5 },
    { email: 'dreamdecor@vendor.com', name: 'Dream Decor', business: 'Dream Decor Atlanta', category: 'Decor', city: 'Atlanta GA', plan: 'PREMIUM', verified: true, rating: 4.9 },
    { email: 'reverie@vendor.com', name: 'Reverie', business: 'Reverie Floral Design', category: 'Decor', city: 'New York NY', plan: 'PROFESSIONAL', verified: false, rating: 4.7 },
    { email: 'noor@vendor.com', name: 'Noor Studios', business: 'Noor Studios', category: 'Photography', city: 'Atlanta GA', plan: 'PREMIUM', verified: true, rating: 5.0 },
    { email: 'maha@vendor.com', name: 'Maha', business: 'Moments by Maha', category: 'Photography', city: 'Dallas TX', plan: 'PROFESSIONAL', verified: false, rating: 4.6 },
    { email: 'sana@vendor.com', name: 'Sana', business: 'Glam by Sana', category: 'Makeup', city: 'Atlanta GA', plan: 'PROFESSIONAL', verified: true, rating: 4.9 },
    { email: 'rida@vendor.com', name: 'Rida', business: 'Beauty by Rida', category: 'Makeup', city: 'Houston TX', plan: 'FREE', verified: false, rating: 4.3 },
    { email: 'encore@vendor.com', name: 'Encore', business: 'Encore Entertainment', category: 'Entertainment', city: 'Atlanta GA', plan: 'PREMIUM', verified: true, rating: 4.8 },
    { email: 'desibeats@vendor.com', name: 'Desi Beats', business: 'Desi Beats DJ', category: 'Entertainment', city: 'New Jersey NJ', plan: 'PROFESSIONAL', verified: false, rating: 4.6 },
    { email: 'grandmahal@vendor.com', name: 'Grand Mahal', business: 'The Grand Mahal', category: 'Venue', city: 'Atlanta GA', plan: 'PREMIUM', verified: true, rating: 4.9 },
    { email: 'taj@vendor.com', name: 'Taj', business: 'Taj Banquet Hall', category: 'Venue', city: 'Chicago IL', plan: 'PROFESSIONAL', verified: false, rating: 4.7 },
  ]

  const vendorProfilesList: any[] = []
  for (const v of vendors) {
    const user = await prisma.user.upsert({
      where: { email: v.email },
      update: { passwordHash: vendorHash, role: 'VENDOR' },
      create: { email: v.email, name: v.name, passwordHash: vendorHash, role: 'VENDOR' }
    })
    const profile = await prisma.vendorProfile.upsert({
      where: { userId: user.id },
      update: { businessName: v.business, category: v.category, city: v.city, plan: v.plan, verified: v.verified, rating: v.rating },
      create: { userId: user.id, businessName: v.business, category: v.category, city: v.city, plan: v.plan, verified: v.verified, rating: v.rating }
    })
    vendorProfilesList.push(profile)
  }

  console.log('Seeding Couples...')
  const couples = [
    { email: 'ali@couple.com', name: 'Ali & Sara Malik', ev: 'Wedding', date: new Date('2025-06-15'), city: 'Atlanta GA', budget: 45000, status: 'COMPLETED' },
    { email: 'omar@couple.com', name: 'Omar & Fatima Qureshi', ev: 'Wedding + Mehndi', date: new Date('2025-08-20'), city: 'New York NY', budget: 65000, status: 'CONFIRMED' },
    { email: 'hassan@couple.com', name: 'Hassan & Amna Baig', ev: 'Wedding', date: new Date('2025-10-10'), city: 'Dallas TX', budget: 35000, status: 'PLANNING' },
    { email: 'tariq@couple.com', name: 'Tariq & Zainab Shah', ev: 'Wedding', date: new Date('2025-12-05'), city: 'Houston TX', budget: 55000, status: 'MATCHED' },
    { email: 'kamran@couple.com', name: 'Kamran & Nadia Ahmed', ev: 'Reception', date: new Date('2026-03-01'), city: 'Chicago IL', budget: 25000, status: 'INTAKE' },
    { email: 'saad@couple.com', name: 'Saad & Hira Chaudhry', ev: 'Wedding', date: new Date('2026-04-12'), city: 'Atlanta GA', budget: 75000, status: 'COMPLETED' },
  ]
  for (const c of couples) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: { passwordHash: coupleHash, role: 'COUPLE' },
      create: { email: c.email, name: c.name, passwordHash: coupleHash, role: 'COUPLE' }
    })
    const cp = await prisma.coupleProfile.upsert({
      where: { userId: user.id },
      update: { eventType: c.ev, eventDate: c.date, city: c.city, budget: c.budget },
      create: { userId: user.id, eventType: c.ev, eventDate: c.date, city: c.city, budget: c.budget }
    })
    
    // Add initial consultation record
    const consId = `cons_${user.id}`
    await prisma.consultation.upsert({
        where: { id: consId },
        update: { status: c.status },
        create: { id: consId, coupleId: cp.id, status: c.status }
    })
  }

  console.log('Seeding Ad Packages...')
  const adPackages = [
    { id: 'pkg_featured_top', name: 'Featured Top', description: '$29/7 days, $79/30 days', boostType: BoostType.FEATURED_TOP, placement: AdPlacement.CATEGORY_PAGE, durationDays: 7, price: 29, maxSlots: 3 },
    { id: 'pkg_homepage_hero', name: 'Homepage Hero', description: '$99/7 days', boostType: BoostType.HOMEPAGE_HERO, placement: AdPlacement.HOMEPAGE, durationDays: 7, price: 99, maxSlots: 4 },
    { id: 'pkg_category_spotlight', name: 'Category Spotlight', description: '$49/14 days', boostType: BoostType.CATEGORY_SPOTLIGHT, placement: AdPlacement.CATEGORY_PAGE, durationDays: 14, price: 49, maxSlots: 3 },
    { id: 'pkg_search_priority', name: 'Search Priority', description: '$39/14 days', boostType: BoostType.SEARCH_PRIORITY, placement: AdPlacement.SEARCH_RESULTS, durationDays: 14, price: 39, maxSlots: 5 },
  ]
  for (const pkg of adPackages) {
    await prisma.adPackage.upsert({
      where: { id: pkg.id },
      update: pkg,
      create: pkg
    })
  }

  console.log('Seeding Content...')
  const contentMap = [
    { key: "hero_headline", value: "Your Wedding. The Right People. Zero Stress.", group: "homepage", label: "Hero Headline" },
    { key: "hero_subtext", value: "A trusted wedding network for the South Asian community in the U.S.", group: "homepage", label: "Hero Subtext" },
    { key: "hero_cta_primary", value: "Book a Consultation", group: "homepage", label: "Hero CTA Primary" },
    { key: "hero_cta_secondary", value: "Browse Trusted Vendors", group: "homepage", label: "Hero CTA Secondary" },
    { key: "hero_trust_badge", value: "Trusted by 500+ South Asian Families Across the USA", group: "homepage", label: "Hero Trust Badge" },
    { key: "how_it_works_title", value: "Simple, Guided, Stress-Free", group: "homepage", label: "How it works title" },
    { key: "why_choose_title", value: "Not a Directory. A Guided Wedding Network.", group: "homepage", label: "Why Choose Title" },
    { key: "legacy_headline", value: "From Atlanta Roots to New York Celebrations", group: "homepage", label: "Legacy Headline" },
    { key: "legacy_body", value: "Created by a family with 20+ years in the wedding industry...", group: "homepage", label: "Legacy Body" },
    { key: "legacy_signature", value: "— The Khan Family", group: "homepage", label: "Legacy Signature" },
    { key: "sticky_bar_text", value: "Ready to Plan Your Dream Wedding?", group: "homepage", label: "Sticky Bar Text" },
    { key: "sticky_bar_cta", value: "Book My Free Consultation", group: "homepage", label: "Sticky Bar CTA" },
    { key: "vendor_join_headline", value: "Join Our Trusted Network", group: "homepage", label: "Vendor Join Headline" },
    { key: "vendor_join_subtext", value: "Get quality leads. No commissions taken.", group: "homepage", label: "Vendor Join Subtext" },
    { key: "contact_phone", value: "(470) 835-2007", group: "contact", label: "Contact Phone" },
    { key: "contact_email", value: "hello@maisoncircle.com", group: "contact", label: "Contact Email" },
    { key: "contact_whatsapp", value: "+14708352007", group: "contact", label: "Contact Whatsapp" },
    { key: "contact_address", value: "Atlanta, GA & New York, NY", group: "contact", label: "Contact Address" },
    { key: "footer_tagline", value: "Your wedding, guided by trust and experience.", group: "footer", label: "Footer Tagline" },
    { key: "footer_copyright", value: "© 2025 Maison Wedding Circle. All rights reserved.", group: "footer", label: "Footer Copyright" },
    { key: "meta_title", value: "Maison Wedding Circle — South Asian Wedding Vendors USA", group: "seo", label: "Meta Title" },
    { key: "meta_description", value: "Find trusted South Asian wedding vendors in Atlanta, New York, Dallas & more.", group: "seo", label: "Meta Description" },
  ]
  for (const item of contentMap) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value, label: item.label, group: item.group },
      create: item
    })
  }

  console.log('Seeding Testimonials...')
  const testimonials = [
    { name: 'Sana & Usman', location: 'Atlanta GA', eventType: 'Wedding', quote: 'We had no idea where to start. Maison connected us with our dream team in days.', rating: 5 },
    { name: 'Priya & Rahul', location: 'New York NY', eventType: 'Wedding', quote: 'Every vendor they suggested was professional and understood our South Asian traditions.', rating: 5 },
    { name: 'Hina & Fahad', location: 'Dallas TX', eventType: 'Wedding', quote: 'The budget tracker and checklist kept us sane during 8 months of planning.', rating: 5 },
  ]
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t })
  }

  console.log('Seeding FAQ...')
  const faqItems = [
    { question: 'How do you match us with vendors?', answer: 'We review your event details, style, budget, and city then personally introduce you to 2-3 hand-picked vendors per category from our verified network.', category: 'couples' },
    { question: 'Is there a fee for couples?', answer: 'No — our service is completely free for couples.', category: 'couples' },
  ]
  for (const faq of faqItems) {
    await prisma.faqItem.create({ data: faq })
  }

  console.log('Seed completed successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
