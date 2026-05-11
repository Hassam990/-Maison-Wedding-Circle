import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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

type RouteContext = {
  params: {
    vendorId: string;
  };
};

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
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

  const vendorId = params.vendorId?.trim();

  if (!vendorId) {
    return NextResponse.json(
      { message: "Vendor id is required." },
      { status: 400 }
    );
  }

  try {
    const deletedRecord = await db.savedVendor.deleteMany({
      where: {
        coupleId: coupleProfile.id,
        vendorId,
      },
    });

    if (deletedRecord.count === 0) {
      return NextResponse.json(
        { message: "Saved vendor not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Vendor removed from saved list.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to remove saved vendor.",
      },
      { status: 500 }
    );
  }
}