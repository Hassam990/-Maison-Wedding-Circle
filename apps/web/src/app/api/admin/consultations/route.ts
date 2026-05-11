import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/consultations
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN" && session.user.role !== "STAFF_ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const consultations = await db.consultation.findMany({
      include: {
        couple: {
          include: {
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

    return NextResponse.json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { message: "Unable to fetch consultations" },
      { status: 500 }
    );
  }
}

// POST /api/admin/consultations (Add manually)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN" && session.user.role !== "STAFF_ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { coupleId, status, notes, assignedTo, followUpDate } = body;

    if (!coupleId) {
      return NextResponse.json({ message: "coupleId is required" }, { status: 400 });
    }

    const consultation = await db.consultation.create({
      data: {
        coupleId,
        status: status || "New",
        notes,
        assignedTo,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
      include: {
        couple: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(consultation);
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      { message: "Unable to create consultation" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/consultations
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN" && session.user.role !== "STAFF_ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, notes, assignedTo, followUpDate } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const consultation = await db.consultation.update({
      where: { id },
      data: {
        status,
        notes,
        assignedTo,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      },
      include: {
        couple: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(consultation);
  } catch (error) {
    console.error("Error updating consultation:", error);
    return NextResponse.json(
      { message: "Unable to update consultation" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/consultations?id=...
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    await db.consultation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    return NextResponse.json(
      { message: "Unable to delete consultation" },
      { status: 500 }
    );
  }
}