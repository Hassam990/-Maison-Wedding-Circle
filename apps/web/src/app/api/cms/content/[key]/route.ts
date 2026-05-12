export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { key: string } }
) {
  try {
    const content = await db.siteContent.findUnique({
      where: { key: params.key },
    });
    return NextResponse.json(content);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { key: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await req.json();
    const content = await db.siteContent.upsert({
      where: { key: params.key },
      update: {
        value: data.value,
        description: data.description,
      },
      create: {
        key: params.key,
        value: data.value,
        description: data.description,
      },
    });
    return NextResponse.json(content);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
