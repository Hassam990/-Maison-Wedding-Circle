export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const inquiry = await db.vendorInquiry.findUnique({
      where: { id: params.id },
      include: { vendor: true, couple: true },
    });

    if (!inquiry) {
      return new NextResponse("Not Found", { status: 404 });
    }

    let hasAccess = false;
    if (session.user.role === "COUPLE") {
      const coupleProfile = await db.coupleProfile.findUnique({
        where: { userId: session.user.id },
      });
      hasAccess = coupleProfile?.id === inquiry.coupleId;
    } else if (session.user.role === "VENDOR") {
      const vendorProfile = await db.vendorProfile.findUnique({
        where: { userId: session.user.id },
      });
      hasAccess = vendorProfile?.id === inquiry.vendorId;
    }

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const messages = await db.message.findMany({
      where: { inquiryId: params.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages, inquiry });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await req.json();
    const { content } = data;

    const inquiry = await db.vendorInquiry.findUnique({
      where: { id: params.id },
    });

    if (!inquiry) {
      return new NextResponse("Not Found", { status: 404 });
    }

    let senderType: "COUPLE" | "VENDOR";
    let hasAccess = false;
    if (session.user.role === "COUPLE") {
      const coupleProfile = await db.coupleProfile.findUnique({
        where: { userId: session.user.id },
      });
      hasAccess = coupleProfile?.id === inquiry.coupleId;
      senderType = "COUPLE";
    } else if (session.user.role === "VENDOR") {
      const vendorProfile = await db.vendorProfile.findUnique({
        where: { userId: session.user.id },
      });
      hasAccess = vendorProfile?.id === inquiry.vendorId;
      senderType = "VENDOR";
    } else {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const message = await db.message.create({
      data: {
        inquiryId: params.id,
        senderId: session.user.id,
        senderType,
        content,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
