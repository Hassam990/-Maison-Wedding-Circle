import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN" && session.user.role !== "VENDOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create public/uploads directory inside apps/web
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique name
    const timestamp = Date.now();
    const ext = path.extname(file.name) || ".png";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${baseName}_${timestamp}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file
    await fs.writeFile(filePath, buffer);

    // Return relative URL
    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
