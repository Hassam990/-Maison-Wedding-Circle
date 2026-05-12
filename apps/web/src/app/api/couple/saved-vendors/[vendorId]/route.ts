export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: { vendorId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "COUPLE") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const couple = await db.coupleProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!couple) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    await db.savedVendor.delete({
      where: {
        coupleId_vendorId: {
          coupleId: couple.id,
          vendorId: params.vendorId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
