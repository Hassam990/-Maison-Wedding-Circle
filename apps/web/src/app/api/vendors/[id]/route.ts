import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const vendor = await db.vendorProfile.findUnique({
      where: {
        id: params.id,
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
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    const [reviewsCount, recentReviews] = await Promise.all([
      db.review.count({
        where: {
          vendorId: params.id,
        },
      }),
      db.review.findMany({
        where: {
          vendorId: params.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      ...vendor,
      reviewsCount,
      recentReviews,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to load vendor details at this time",
      },
      { status: 500 },
    );
  }
}