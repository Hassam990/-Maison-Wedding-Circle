export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "COUPLE") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if vendor exists
    const vendor = await db.vendorProfile.findUnique({
      where: { id: params.id },
      include: { user: true }
    });
    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    const data = await req.json();

    let coupleProfile = await db.coupleProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    });

    if (!coupleProfile) {
      coupleProfile = await db.coupleProfile.create({
        data: {
          userId: session.user.id,
        },
        include: { user: true }
      });
    }

    const inquiry = await db.vendorInquiry.create({
      data: {
        vendorId: params.id,
        coupleId: coupleProfile.id,
        message: data.message,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
      },
    });

    await db.message.create({
      data: {
        inquiryId: inquiry.id,
        senderId: session.user.id,
        senderType: "COUPLE",
        content: data.message,
      },
    });

    // Get all admin users (ADMIN and STAFF_ADMIN)
    const admins = await db.user.findMany({
      where: { 
        OR: [
          { role: "ADMIN" },
          { role: "SUPER_ADMIN" },
          { role: "STAFF_ADMIN" }
        ] 
      }
    });

    // Get vendor user too so we can notify them
    const vendorUser = vendor.user;
    const coupleUser = coupleProfile.user;

    // Create notifications for all admins
    const notificationsPromises = admins.map(admin => 
      db.notification.create({
        data: {
          userId: admin.id,
          type: "NEW_INQUIRY",
          title: "New Vendor Inquiry",
          body: `${coupleUser?.name || "A couple"} sent an inquiry to ${vendor.businessName || "a vendor"}`,
          link: `/admin/vendors`
        }
      })
    );

    // Also notify the vendor if they are a user
    if (vendorUser) {
      notificationsPromises.push(
        db.notification.create({
          data: {
            userId: vendorUser.id,
            type: "NEW_INQUIRY",
            title: "New Inquiry from Couple",
            body: `${coupleUser?.name || "A couple"} sent you an inquiry!`,
            link: `/dashboard/messages`
          }
        })
      );
    }

    await Promise.all(notificationsPromises);

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json(
      { message: "Unable to send inquiry. " + (error as Error).message },
      { status: 500 }
    );
  }
}
