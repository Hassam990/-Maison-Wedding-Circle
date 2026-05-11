import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function parseInquiryBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await request.formData();

    return {
      message: String(formData.get("message") || ""),
      eventDate: formData.get("eventDate") ? String(formData.get("eventDate")) : undefined,
    };
  }

  return request.json();
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "COUPLE") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: {
    message?: string;
    eventDate?: string;
  };

  try {
    body = await parseInquiryBody(request);
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const message = body.message?.trim() || "";
  const eventDateValue = body.eventDate?.trim();
  const eventDate =
    eventDateValue && !Number.isNaN(new Date(eventDateValue).getTime())
      ? new Date(eventDateValue)
      : null;

  if (!message) {
    return NextResponse.json({ message: "Message is required" }, { status: 400 });
  }

  if (eventDateValue && !eventDate) {
    return NextResponse.json({ message: "Event date is invalid" }, { status: 400 });
  }

  try {
    const [vendor, coupleProfile] = await Promise.all([
      db.vendorProfile.findUnique({
        where: {
          id: params.id,
        },
        select: {
          id: true,
        },
      }),
      db.coupleProfile.findFirst({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    if (!coupleProfile) {
      return NextResponse.json({ message: "Couple profile not found" }, { status: 404 });
    }

    const inquiry = await db.vendorInquiry.create({
      data: {
        vendorId: vendor.id,
        coupleId: coupleProfile.id,
        message,
        eventDate,
        status: "New",
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to send inquiry at this time",
      },
      { status: 500 },
    );
  }
}