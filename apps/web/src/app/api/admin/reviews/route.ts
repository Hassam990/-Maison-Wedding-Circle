import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/reviews
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const reviews = await db.review.findMany({
      include: {
        vendor: { select: { businessName: true } },
        couple: { include: { user: { select: { name: true, email: true } } } }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// DELETE /api/admin/reviews/[id]
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "Id required" }, { status: 400 });

    try {
        await db.review.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting" }, { status: 500 });
    }
}
