export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "COUPLE") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();

    let coupleProfile = await db.coupleProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!coupleProfile) {
      coupleProfile = await db.coupleProfile.create({
        data: {
          userId: session.user.id,
        },
      });
    }

    const inquiry = await db.vendorInquiry.create({
      data: {
        vendorId: params.id,
        coupleId: coupleProfile.id,
        message: data.message,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
      },
    });

    await db.message.create({
      data: {
        inquiryId: inquiry.id,
        senderId: session.user.id,
        senderType: "COUPLE",
        content: data.message,
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Inquiry error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
