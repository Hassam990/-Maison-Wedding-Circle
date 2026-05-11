import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const category = request.nextUrl.searchParams.get("category")?.trim() || "";
  const city = request.nextUrl.searchParams.get("city")?.trim() || "";

  const filters: any[] = [];

  if (category) {
    filters.push({
      category: {
        contains: category,
      },
    });
  }

  if (city) {
    filters.push({
      city: {
        contains: city,
      },
    });
  }

  if (search) {
    filters.push({
      OR: [
        {
          businessName: {
            contains: search,
          },
        },
        {
          category: {
            contains: search,
          },
        },
        {
          city: {
            contains: search,
          },
        },
        {
          bio: {
            contains: search,
          },
        },
      ],
    });
  }

  try {
    const vendors = await db.vendorProfile.findMany({
      where: filters.length > 0 ? { AND: filters } : undefined,
      orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        businessName: true,
        category: true,
        city: true,
        bio: true,
        verified: true,
        plan: true,
        rating: true,
      },
    });

    return NextResponse.json(vendors);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to load vendors at this time",
      },
      { status: 500 },
    );
  }
}