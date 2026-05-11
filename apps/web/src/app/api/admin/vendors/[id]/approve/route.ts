import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { verified } = await req.json();
    const updated = await db.vendorProfile.update({
      where: { id: params.id },
      data: { verified: Boolean(verified) }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
