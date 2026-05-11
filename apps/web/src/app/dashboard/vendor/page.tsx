import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function formatDate(value: Date | null) {
  if (!value) {
    return "Flexible";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function VendorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "VENDOR") {
    redirect("/dashboard/couple");
  }

  const vendorProfile = await db.vendorProfile.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      businessName: true,
      category: true,
      city: true,
      verified: true,
      plan: true,
      createdAt: true,
    },
  });

  if (!vendorProfile) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Vendor dashboard</p>
          <h1 className="font-serif text-4xl text-stone-900">Complete your vendor profile</h1>
          <p className="max-w-2xl text-stone-600">
            Your account is ready, but we could not find a vendor profile to display. Set up your
            public listing to start receiving inquiries from couples.
          </p>
        </div>

        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle>Create your listing</CardTitle>
            <CardDescription>
              Add your business name, category, city, and bio so couples can discover you.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-stone-600">
              Once your profile is complete, you can return here to monitor inquiry activity and
              manage your listing.
            </div>
            <form action="/dashboard/vendor/profile">
              <Button type="submit">Set up vendor profile</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [inquiryCount, newInquiryCount, recentInquiries] = await Promise.all([
    db.vendorInquiry.count({
      where: {
        vendorId: vendorProfile.id,
      },
    }),
    db.vendorInquiry.count({
      where: {
        vendorId: vendorProfile.id,
        status: "New",
      },
    }),
    db.vendorInquiry.findMany({
      where: {
        vendorId: vendorProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      select: {
        id: true,
        message: true,
        status: true,
        eventDate: true,
        createdAt: true,
      },
    }),
  ]);

  const metrics = [
    {
      label: "Total inquiries",
      value: inquiryCount.toString(),
      detail: "All couple messages received",
    },
    {
      label: "New inquiries",
      value: newInquiryCount.toString(),
      detail: "Awaiting your first response",
    },
    {
      label: "Current plan",
      value: vendorProfile.plan || "Standard",
      detail: "Displayed on your public profile",
    },
    {
      label: "Verification",
      value: vendorProfile.verified ? "Verified" : "Pending",
      detail: vendorProfile.verified ? "Trusted badge is active" : "Verification is still in review",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Vendor dashboard</p>
          <h1 className="font-serif text-4xl text-stone-900">
            {vendorProfile.businessName || "Your business"}
          </h1>
          <p className="max-w-2xl text-stone-600">
            Track inquiry activity, review listing visibility, and keep your profile polished for
            upcoming bookings.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-stone-600">
            <span className="rounded-full bg-stone-100 px-3 py-1">
              {vendorProfile.category || "Category pending"}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1">
              {vendorProfile.city || "City pending"}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1">
              Joined {formatDate(vendorProfile.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <form action="/vendors">
            <Button type="submit" variant="outline">
              View marketplace
            </Button>
          </form>
          <form action="/dashboard/vendor/profile">
            <Button type="submit">Edit profile</Button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-stone-200">
            <CardHeader className="pb-3">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold text-stone-900">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-stone-600">{metric.detail}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-stone-200">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent inquiries</CardTitle>
            <CardDescription>
              Your latest couple messages, ordered from newest to oldest.
            </CardDescription>
          </div>
          <Link href="/dashboard/vendor/profile" className="text-sm font-medium text-stone-700 underline-offset-4 hover:underline">
            Refresh your listing details
          </Link>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-6 py-10 text-center text-sm text-stone-600">
              No inquiries yet. Once couples contact you through your vendor page, they will appear
              here.
            </div>
          ) : (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
                          {inquiry.status}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                          Event date: {formatDate(inquiry.eventDate)}
                        </span>
                      </div>
                      <p className="text-sm leading-7 text-stone-700">{inquiry.message}</p>
                    </div>
                    <div className="shrink-0 text-sm text-stone-500">
                      {formatDate(inquiry.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}