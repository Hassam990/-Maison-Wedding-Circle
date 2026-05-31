export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    let inquiries = [];
    
    if (session.user.role === "COUPLE") {
      const coupleProfile = await db.coupleProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (!coupleProfile) return NextResponse.json([], { status: 200 });
      inquiries = await db.vendorInquiry.findMany({
        where: { coupleId: coupleProfile.id },
        include: { vendor: true },
        orderBy: { createdAt: 'desc' },
      });
    } else if (session.user.role === "VENDOR") {
      const vendorProfile = await db.vendorProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (!vendorProfile) return NextResponse.json([], { status: 200 });
      inquiries = await db.vendorInquiry.findMany({
        where: { vendorId: vendorProfile.id },
        include: { couple: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
