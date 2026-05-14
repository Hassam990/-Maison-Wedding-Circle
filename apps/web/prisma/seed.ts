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
    { 
      email: 'bushra@vendor.com', name: 'Bushra', business: "Bushra's Kitchen", category: 'Catering', city: 'Atlanta GA', plan: 'PROFESSIONAL', verified: true, rating: 4.8,
      bio: "Authentic Pakistani and Indian catering, specializing in traditional wedding feasts and modern fusion menus.",
      priceRange: "££",
      servicesOffered: ["Mehndi", "Nikkah", "Walima"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800"
      ],
      isFeatured: true,
      logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"
    },
    { 
      email: 'spiceroute@vendor.com', name: 'Spice Route', business: 'Spice Route Catering', category: 'Catering', city: 'New York NY', plan: 'FREE', verified: false, rating: 4.5,
      bio: "Luxury South Asian wedding services tailored to your unique vision and tradition.",
      priceRange: "£",
      servicesOffered: ["Mehndi", "Walima"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=800"
      ],
      isFeatured: false
    },
    { 
      email: 'dreamdecor@vendor.com', name: 'Dream Decor', business: 'Dream Decor Atlanta', category: 'Decor', city: 'Atlanta GA', plan: 'PREMIUM', verified: true, rating: 4.9,
      bio: "Transforming venues into magical spaces with traditional South Asian florals and modern decor.",
      priceRange: "£££",
      servicesOffered: ["Mehndi", "Nikkah", "Walima", "Destination weddings"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800"
      ],
      isFeatured: true,
      logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
    },
    { 
      email: 'reverie@vendor.com', name: 'Reverie', business: 'Reverie Floral Design', category: 'Decor', city: 'New York NY', plan: 'PROFESSIONAL', verified: false, rating: 4.7,
      bio: "Elegant floral designs for every wedding event, from intimate mehndi to grand walima.",
      priceRange: "££",
      servicesOffered: ["Mehndi", "Nikkah"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800"
      ],
      isFeatured: false
    },
    { 
      email: 'noor@vendor.com', name: 'Noor Studios', business: 'Noor Studios', category: 'Photography', city: 'Atlanta GA', plan: 'PREMIUM', verified: true, rating: 5.0,
      bio: "Luxury Pakistani wedding photography team capturing timeless celebrations across Atlanta and beyond.",
      priceRange: "Luxury",
      servicesOffered: ["Mehndi", "Nikkah", "Walima", "Bridal shoots"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800"
      ],
      isFeatured: true,
      instagramUrl: "https://instagram.com/noorstudios",
      logoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200"
    },
    { 
      email: 'maha@vendor.com', name: 'Maha', business: 'Moments by Maha', category: 'Photography', city: 'Dallas TX', plan: 'PROFESSIONAL', verified: false, rating: 4.6,
      bio: "Candid and traditional wedding photography for South Asian couples.",
      priceRange: "££",
      servicesOffered: ["Nikkah", "Walima"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800"
      ],
      isFeatured: false
    },
    { 
      email: 'sana@vendor.com', name: 'Sana', business: 'Glam by Sana', category: 'Makeup', city: 'Atlanta GA', plan: 'PROFESSIONAL', verified: true, rating: 4.9,
      bio: "Expert bridal makeup and hair styling for traditional and modern South Asian brides.",
      priceRange: "££",
      servicesOffered: ["Mehndi", "Nikkah", "Walima", "Bridal shoots"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
      ],
      isFeatured: true,
      logoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
    },
    { 
      email: 'rida@vendor.com', name: 'Rida', business: 'Beauty by Rida', category: 'Makeup', city: 'Houston TX', plan: 'FREE', verified: false, rating: 4.3,
      bio: "Bridal hair and makeup artistry for South Asian weddings.",
      priceRange: "£",
      servicesOffered: ["Nikkah", "Walima"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800"
      ],
      isFeatured: false
    },
    { 
      email: 'encore@vendor.com', name: 'Encore', business: 'Encore Entertainment', category: 'Entertainment', city: 'Atlanta GA', plan: 'PREMIUM', verified: true, rating: 4.8,
      bio: "Premium DJs, dhol players, and live entertainment for unforgettable weddings.",
      priceRange: "£££",
      servicesOffered: ["Mehndi", "Nikkah", "Walima", "Destination weddings"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800"
      ],
      isFeatured: true
    },
    { 
      email: 'desibeats@vendor.com', name: 'Desi Beats', business: 'Desi Beats DJ', category: 'Entertainment', city: 'New Jersey NJ', plan: 'PROFESSIONAL', verified: false, rating: 4.6,
      bio: "DJ services specializing in Bollywood, Bhangra, and Top 40 remixes.",
      priceRange: "££",
      servicesOffered: ["Mehndi", "Walima"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1558346490-a72e53ae2e4e?w=800"
      ],
      isFeatured: false
    },
    { 
      email: 'grandmahal@vendor.com', name: 'Grand Mahal', business: 'The Grand Mahal', category: 'Venue', city: 'Atlanta GA', plan: 'PREMIUM', verified: true, rating: 4.9,
      bio: "Luxury banquet hall and hotel for grand South Asian wedding celebrations.",
      priceRange: "Luxury",
      servicesOffered: ["Mehndi", "Nikkah", "Walima", "Destination weddings"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
      ],
      isFeatured: true,
      websiteUrl: "https://thegrandmahal.com",
      logoUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200"
    },
    { 
      email: 'taj@vendor.com', name: 'Taj', business: 'Taj Banquet Hall', category: 'Venue', city: 'Chicago IL', plan: 'PROFESSIONAL', verified: false, rating: 4.7,
      bio: "Elegant banquet hall for South Asian weddings and events.",
      priceRange: "££",
      servicesOffered: ["Nikkah", "Walima"],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
      ],
      isFeatured: false
    },
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
      update: { 
        businessName: v.business, 
        category: v.category, 
        city: v.city, 
        plan: v.plan, 
        verified: v.verified, 
        rating: v.rating,
        bio: v.bio,
        priceRange: v.priceRange,
        servicesOffered: v.servicesOffered,
        galleryPhotos: v.galleryPhotos,
        isFeatured: v.isFeatured,
        logoUrl: v.logoUrl,
        instagramUrl: v.instagramUrl,
        websiteUrl: v.websiteUrl
      },
      create: { 
        userId: user.id, 
        businessName: v.business, 
        category: v.category, 
        city: v.city, 
        plan: v.plan, 
        verified: v.verified, 
        rating: v.rating,
        bio: v.bio,
        priceRange: v.priceRange,
        servicesOffered: v.servicesOffered,
        galleryPhotos: v.galleryPhotos,
        isFeatured: v.isFeatured,
        logoUrl: v.logoUrl,
        instagramUrl: v.instagramUrl,
        websiteUrl: v.websiteUrl
      }
    })
    vendorProfilesList.push(profile)
  }

  console.log('Seeding Couples...')
  const couples = [
    { email: 'ali@couple.com', name: 'Ali & Sara Malik', ev: 'Wedding', date: new Date('2025-06-15'), city: 'Atlanta GA', budget: 45000, status: 'COMPLETED', tier: 'GOLD' },
    { email: 'omar@couple.com', name: 'Omar & Fatima Qureshi', ev: 'Wedding + Mehndi', date: new Date('2025-08-20'), city: 'New York NY', budget: 65000, status: 'CONFIRMED', tier: 'PLATINUM' },
    { email: 'hassan@couple.com', name: 'Hassan & Amna Baig', ev: 'Wedding', date: new Date('2025-10-10'), city: 'Dallas TX', budget: 35000, status: 'PLANNING', tier: 'SILVER' },
    { email: 'tariq@couple.com', name: 'Tariq & Zainab Shah', ev: 'Wedding', date: new Date('2025-12-05'), city: 'Houston TX', budget: 55000, status: 'MATCHED', tier: 'GOLD' },
    { email: 'kamran@couple.com', name: 'Kamran & Nadia Ahmed', ev: 'Reception', date: new Date('2026-03-01'), city: 'Chicago IL', budget: 25000, status: 'INTAKE', tier: 'SILVER' },
    { email: 'saad@couple.com', name: 'Saad & Hira Chaudhry', ev: 'Wedding', date: new Date('2026-04-12'), city: 'Atlanta GA', budget: 75000, status: 'COMPLETED', tier: 'PLATINUM' },
  ]
  for (const c of couples) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: { passwordHash: coupleHash, role: 'COUPLE' },
      create: { email: c.email, name: c.name, passwordHash: coupleHash, role: 'COUPLE' }
    })
    const cp = await prisma.coupleProfile.upsert({
      where: { userId: user.id },
      update: { eventType: c.ev, eventDate: c.date, city: c.city, budget: c.budget, weddingTier: c.tier },
      create: { userId: user.id, eventType: c.ev, eventDate: c.date, city: c.city, budget: c.budget, weddingTier: c.tier }
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
