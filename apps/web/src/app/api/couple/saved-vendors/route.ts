import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function getAuthorizedCoupleProfile() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "COUPLE") {
    return {
      coupleProfile: null,
      unauthorized: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const coupleProfile = await db.coupleProfile.upsert({
    where: {
      userId: session.user.id,
    },
    update: {},
    create: {
      userId: session.user.id,
    },
  });

  return {
    coupleProfile,
    unauthorized: null,
  };
}

export async function GET() {
  const { coupleProfile, unauthorized } = await getAuthorizedCoupleProfile();

  if (unauthorized) {
    return unauthorized;
  }

  if (!coupleProfile) {
    return NextResponse.json(
      { message: "Couple profile not found." },
      { status: 404 }
    );
  }

  const savedVendors = await db.savedVendor.findMany({
    where: {
      coupleId: coupleProfile.id,
    },
    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
          category: true,
          city: true,
          bio: true,
          verified: true,
          plan: true,
          rating: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ savedVendors });
}

export async function POST(request: NextRequest) {
  const { coupleProfile, unauthorized } = await getAuthorizedCoupleProfile();

  if (unauthorized) {
    return unauthorized;
  }

  if (!coupleProfile) {
    return NextResponse.json(
      { message: "Couple profile not found." },
      { status: 404 }
    );
  }

  try {
    const body = (await request.json()) as { vendorId?: string };
    const vendorId = body.vendorId?.trim();

    if (!vendorId) {
      return NextResponse.json(
        { message: "Vendor id is required." },
        { status: 400 }
      );
    }

    const vendor = await db.vendorProfile.findUnique({
      where: {
        id: vendorId,
      },
      select: {
        id: true,
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { message: "Vendor not found." },
        { status: 404 }
      );
    }

    const existingSavedVendor = await db.savedVendor.findFirst({
      where: {
        coupleId: coupleProfile.id,
        vendorId,
      },
      include: {
        vendor: {
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
        },
      },
    });

    if (existingSavedVendor) {
      return NextResponse.json({ savedVendor: existingSavedVendor });
    }

    const savedVendor = await db.savedVendor.create({
      data: {
        coupleId: coupleProfile.id,
        vendorId,
      },
      include: {
        vendor: {
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
        },
      },
    });

    return NextResponse.json({ savedVendor }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to save vendor.",
      },
      { status: 500 }
    );
  }
}