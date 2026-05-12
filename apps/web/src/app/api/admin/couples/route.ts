export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const couples = await db.coupleProfile.findMany({
      include: {
        user: { select: { name: true, email: true } },
        consultations: { select: { status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(couples);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}