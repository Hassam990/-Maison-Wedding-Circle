
import { db } from "./db";

export async function getSiteContent(group?: string) {
  const contents = await db.siteContent.findMany({
    where: group ? { group } : undefined,
  });

  return contents.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);
}

export async function getTestimonials() {
  return await db.testimonial.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getFaqs(category?: string) {
  return await db.faqItem.findMany({
    where: { 
      isActive: true,
      category: category ? category : undefined
    },
    orderBy: { sortOrder: 'asc' },
  });
}
