import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/cms/content/[key]
export async function PATCH(
  request: Request,
  { params }: { params: { key: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const content = await db.siteContent.update({
      where: { key: params.key },
      data: { 
          value: body.value,
          updatedBy: session.user.email
      }
    });
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
