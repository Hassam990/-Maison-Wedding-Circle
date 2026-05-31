export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcryptjs from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    console.log("Fetching vendors from DB...");
    const vendors = await db.vendorProfile.findMany({
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Successfully fetched ${vendors.length} vendors`);
    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      businessName,
      category,
      city,
      bio,
      verified,
      plan,
      rating,
      adminPhone,
      adminWhatsApp,
      adminEmail,
      userEmail,
      userName,
      logoUrl,
      coverUrl,
      bannerUrl,
      instagramUrl,
      websiteUrl,
      priceRange,
      servicesOffered,
      galleryPhotos,
      galleryVideos,
      weddingHighlights,
      isFeatured
    } = data;

    if (!userEmail || !businessName) {
      return NextResponse.json({ error: "Email and business name are required" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email: userEmail } });
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      const existingVendor = await db.vendorProfile.findUnique({ where: { userId } });
      if (existingVendor) {
        return NextResponse.json({ error: "User already has a vendor profile" }, { status: 400 });
      }
    } else {
      const defaultPassword = "Vendor@123";
      const hashedPassword = await bcryptjs.hash(defaultPassword, 10);
      const newUser = await db.user.create({
        data: {
          email: userEmail,
          name: userName || "Vendor",
          passwordHash: hashedPassword,
          role: "VENDOR"
        }
      });
      userId = newUser.id;
    }

    const newVendor = await db.vendorProfile.create({
      data: {
        userId,
        businessName,
        category,
        city,
        bio,
        verified,
        plan,
        rating,
        adminPhone,
        adminWhatsApp,
        adminEmail,
        logoUrl,
        coverUrl,
        bannerUrl,
        instagramUrl,
        websiteUrl,
        priceRange,
        servicesOffered: Array.isArray(servicesOffered) ? servicesOffered : [],
        galleryPhotos: Array.isArray(galleryPhotos) ? galleryPhotos : [],
        galleryVideos: Array.isArray(galleryVideos) ? galleryVideos : [],
        weddingHighlights: Array.isArray(weddingHighlights) ? weddingHighlights : [],
        isFeatured: !!isFeatured
      },
      include: { user: { select: { name: true, email: true } } }
    });

    return NextResponse.json(newVendor, { status: 201 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}