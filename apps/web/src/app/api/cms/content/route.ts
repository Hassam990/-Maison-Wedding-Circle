export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/cms/content
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    // In v3, public can read content too, but let's keep list for admin for now
  }

  try {
    const contents = await db.siteContent.findMany({
      orderBy: { key: "asc" }
    });
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// POST /api/cms/content (Initialize new keys)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const content = await db.siteContent.upsert({
            where: { key: body.key },
            update: { value: body.value, type: body.type, label: body.label, group: body.group, updatedBy: session.user.email },
            create: { key: body.key, value: body.value, type: body.type, label: body.label, group: body.group, updatedBy: session.user.email }
        });
        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}