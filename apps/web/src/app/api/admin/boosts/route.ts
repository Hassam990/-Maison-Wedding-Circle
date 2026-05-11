import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/boosts
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const boosts = await db.adBoost.findMany({
      include: {
        vendor: {
          select: {
            businessName: true,
            user: { select: { email: true } }
          }
        },
        package: true
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(boosts);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// PATCH /api/admin/boosts/[id] - extend/cancel
export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, isActive, endDate } = body;
        
        const boost = await db.adBoost.update({
            where: { id },
            data: { 
                isActive: isActive !== undefined ? isActive : undefined,
                endDate: endDate ? new Date(endDate) : undefined
            }
        });
        return NextResponse.json(boost);
    } catch (error) {
        return NextResponse.json({ message: "Error Updating Boost" }, { status: 500 });
    }
}
