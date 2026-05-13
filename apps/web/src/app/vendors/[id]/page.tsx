export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

import InquiryForm from "./InquiryForm";

type VendorDetailPageProps = {
  params: {
    id: string;
  };
};

function formatDate(value: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(value);
  } catch (e) {
    return "N/A";
  }
}

export default async function VendorDetailPage({ params }: VendorDetailPageProps) {
  // Ensure we have an ID
  if (!params.id) notFound();

  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.warn("Auth session fetch failed in vendor profile");
  }

  let vendor;
  try {
    vendor = await db.vendorProfile.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("CRITICAL: Failed to fetch vendor profile from DB:", error);
    // In production, a DB error should show a friendly message or 404
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold text-burgundy">Profile Temporarily Unavailable</h1>
        <p className="text-stone-600">We encountered a connection issue. Please refresh the page.</p>
        <Link href="/vendors" className="text-primary underline">Back to Directory</Link>
      </div>
    );
  }

  if (!vendor) {
    notFound();
  }

  let reviewsCount = 0;
  let recentReviews: any[] = [];

  try {
    const [count, reviews] = await Promise.all([
      db.review.count({
        where: {
          vendorId: vendor.id,
        },
      }),
      db.review.findMany({
        where: {
          vendorId: vendor.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);
    reviewsCount = count;
    recentReviews = reviews;
  } catch (error) {
    console.warn("Failed to fetch reviews for vendor:", error);
  }

  const authState =
    !session?.user ? "guest" : session.user.role === "COUPLE" ? "couple" : "other";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
            <Link href="/vendors" className="underline-offset-4 hover:underline">
              Vendors
            </Link>
            <span>/</span>
            <span>{vendor.businessName || "Vendor profile"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              {vendor.category || "Category pending"}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              {vendor.city || "City pending"}
            </span>
            {vendor.verified ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                Verified
              </span>
            ) : null}
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-4xl text-stone-900">
              {vendor.businessName || "Untitled vendor"}
            </h1>
            <p className="text-lg leading-8 text-stone-600">
              {vendor.bio || "This vendor has not added a public bio yet."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-stone-200">
              <CardHeader className="pb-3">
                <CardDescription>Rating</CardDescription>
                <CardTitle>
                  {vendor.rating !== null && vendor.rating !== undefined
                    ? Number(vendor.rating).toFixed(1)
                    : "New"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-stone-600">
                Based on visible couple feedback.
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardHeader className="pb-3">
                <CardDescription>Reviews</CardDescription>
                <CardTitle>{reviewsCount}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-stone-600">
                Public reviews currently available.
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardHeader className="pb-3">
                <CardDescription>Plan</CardDescription>
                <CardTitle>{vendor.plan || "Standard"}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-stone-600">
                Listing tier in the Maison Events marketplace.
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="w-full max-w-xl border-stone-200">
          <CardHeader>
            <CardTitle>Request Through Consultation</CardTitle>
            <CardDescription>
              Tell us your vision and we will curate this vendor for your wedding team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InquiryForm vendorId={vendor.id} authState={authState} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle>About this vendor</CardTitle>
            <CardDescription>
              Key details couples often review before reaching out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-stone-600">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Business name</p>
                <p className="mt-2 text-base font-medium text-stone-900">
                  {vendor.businessName || "Untitled vendor"}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Category</p>
                <p className="mt-2 text-base font-medium text-stone-900">
                  {vendor.category || "Not provided"}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">City</p>
                <p className="mt-2 text-base font-medium text-stone-900">
                  {vendor.city || "Not provided"}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Contact</p>
                <p className="mt-2 text-base font-medium text-stone-900">
                  Available through Maison Wedding Circle
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Public bio</p>
              <p className="mt-3 leading-7 text-stone-700">
                {vendor.bio || "This vendor has not yet shared a detailed public biography."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle>Recent reviews</CardTitle>
            <CardDescription>
              Latest feedback shared by couples in the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-5 py-8 text-sm text-stone-600">
                No public reviews yet. Couples can still reach out directly through the inquiry
                form.
              </div>
            ) : (
              <div className="space-y-4">
                {(recentReviews as Array<any>).map((review) => (
                  <div key={review.id} className="rounded-2xl border border-stone-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-stone-900">
                        {typeof review.rating === "number" ? `${review.rating}/5` : "Review"}
                      </div>
                      <div className="text-xs uppercase tracking-[0.2em] text-stone-500">
                        {review.createdAt ? formatDate(new Date(review.createdAt)) : ""}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-stone-600">
                      {review.comment ||
                        review.message ||
                        review.content ||
                        "This review did not include written feedback."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle>Listing activity</CardTitle>
          <CardDescription>
            Helpful context for how established this profile is in the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Status</p>
            <p className="mt-2 text-base font-medium text-stone-900">
              {vendor.verified ? "Verified and public" : "Pending verification"}
            </p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Member since</p>
            <p className="mt-2 text-base font-medium text-stone-900">
              {formatDate(vendor.createdAt)}
            </p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Contact visibility</p>
            <p className="mt-2 text-base font-medium text-stone-900">
              Curated through Consultation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}