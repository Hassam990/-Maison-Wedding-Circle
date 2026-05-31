import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import sharp from "sharp";

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

    // Optimize and compress image with sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: 1200, // Resize to max width of 1200px
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 }) // Convert to webp with 80% quality
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const ext = ".webp";
    const baseName = file.name.replace(/[^a-zA-Z0-9]/g, "_").replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}_${timestamp}${ext}`;

    // Upload to Vercel Blob
    const blob = await put(`uploads/${fileName}`, optimizedBuffer, {
      access: 'public',
    });

    // Return the blob URL
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}