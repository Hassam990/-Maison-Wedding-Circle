import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function getVendorSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "VENDOR") {
    return null;
  }

  return session;
}

export async function GET() {
  const session = await getVendorSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const vendorProfile = await db.vendorProfile.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        businessName: true,
        category: true,
        city: true,
        bio: true,
        verified: true,
        plan: true,
        rating: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!vendorProfile) {
      return NextResponse.json({ message: "Vendor profile not found" }, { status: 404 });
    }

    return NextResponse.json(vendorProfile);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to load vendor profile at this time",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await getVendorSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: {
    businessName?: string;
    category?: string;
    city?: string;
    bio?: string | null;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const businessName = body.businessName?.trim() || "";
  const category = body.category?.trim() || "";
  const city = body.city?.trim() || "";
  const bio = typeof body.bio === "string" ? body.bio.trim() : null;

  if (!businessName || !category || !city) {
    return NextResponse.json(
      { message: "Business name, category, and city are required" },
      { status: 400 },
    );
  }

  try {
    const existingProfile = await db.vendorProfile.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingProfile) {
      return NextResponse.json({ message: "Vendor profile not found" }, { status: 404 });
    }

    const updatedProfile = await db.vendorProfile.update({
      where: {
        id: existingProfile.id,
      },
      data: {
        businessName,
        category,
        city,
        bio,
      },
      select: {
        id: true,
        businessName: true,
        category: true,
        city: true,
        bio: true,
        verified: true,
        plan: true,
        rating: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to update vendor profile at this time",
      },
      { status: 500 },
    );
  }
}