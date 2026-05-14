
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

import InquiryForm from "./InquiryForm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return notFound();
    }

    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      console.error("Auth session error:", e);
    }

    console.log("Fetching vendor with ID:", params.id);
    let vendorData = null;
    try {
      vendorData = await db.vendorProfile.findUnique({
        where: { id: params.id },
      });
      console.log("Vendor data found:", !!vendorData);
    } catch (error) {
      console.error("DB Error fetching vendor:", error);
      return notFound();
    }

    if (!vendorData) {
      return notFound();
    }

    // Fetch associated user safely
    let userData = null;
    try {
      if ((vendorData as any).userId) {
        const user = await db.user.findUnique({
          where: { id: (vendorData as any).userId },
          select: { name: true, email: true }
        });
        userData = user;
      }
    } catch (e) {
      console.error("Error fetching user:", e);
    }

    const vendor = {
      ...vendorData,
      businessName: vendorData.businessName || "Maison Professional",
      category: vendorData.category || "Vendor",
      city: vendorData.city || "Available Globally",
      bio: vendorData.bio || "This vendor has not added a public bio yet.",
      user: userData || { name: "Maison Vendor", email: "" }
    };

    let reviewsCount = 0;
    try {
      reviewsCount = await db.review.count({ where: { vendorId: params.id } });
    } catch (e) {
      console.error("Error fetching reviews count:", e);
    }

    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Link href="/vendors" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              ← Back to Directory
            </Link>
            <div className="flex items-center gap-4">
              {vendor.logoUrl && (
                <img src={vendor.logoUrl} alt={vendor.businessName} className="w-16 h-16 rounded-full object-cover" />
              )}
              <div>
                <h1 className="font-serif text-4xl text-stone-900">{vendor.businessName}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600 mt-1">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-800">
                    {vendor.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-stone-300" />
                    {vendor.city}
                  </span>
                  {vendor.verified && (
                    <span className="flex items-center gap-1 text-primary">
                      <span className="text-sm">✓</span> Verified Professional
                    </span>
                  )}
                  {vendor.priceRange && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                      {vendor.priceRange}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {vendor.websiteUrl && (
              <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-stone-200 rounded-lg text-sm hover:bg-stone-50 transition-colors">
                Website
              </a>
            )}
            {vendor.instagramUrl && (
              <a href={vendor.instagramUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-stone-200 rounded-lg text-sm hover:bg-stone-50 transition-colors">
                Instagram
              </a>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {vendor.galleryPhotos && vendor.galleryPhotos.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-stone-900">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendor.galleryPhotos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden">
                  <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-stone-900">About the professional</h2>
              <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed">
                {vendor.bio}
              </div>
            </section>

            {/* Services Offered Section */}
            {vendor.servicesOffered && vendor.servicesOffered.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-stone-200">
                <h2 className="font-serif text-2xl text-stone-900">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.servicesOffered.map((service, index) => (
                    <span key={index} className="px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-sm font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-4 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-stone-900">Client Reviews</h2>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-bold text-stone-900">{vendor.rating}</span>
                   <div className="text-primary text-sm">★★★★★</div>
                   <span className="text-sm text-stone-500">({reviewsCount} reviews)</span>
                </div>
              </div>
              
              {reviewsCount === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-200 p-12 text-center text-sm text-stone-500">
                  No reviews yet. Be the first to share your experience after booking!
                </div>
              ) : (
                 <p className="text-sm text-stone-500 italic">Detailed reviews are loading...</p>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24 border-stone-200 shadow-xl shadow-stone-200/40 overflow-hidden">
              <div className="h-2 bg-primary w-full" />
              <CardHeader>
                <CardTitle>Request a Consultation</CardTitle>
                <CardDescription>
                  We&apos;ll personally connect you with {vendor.businessName} for your special day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InquiryForm 
                  vendorId={params.id} 
                  authState={
                    !session ? "guest" : 
                    session.user.role === "COUPLE" ? "couple" : "other"
                  } 
                />
              </CardContent>
            </Card>
            
            <Card className="border-stone-100 bg-stone-50">
               <CardContent className="p-6">
                  <h3 className="font-serif text-lg text-stone-900 mb-2">Maison Guarantee</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    All professionals in our network are vetted for tradition, luxury, and excellence.
                  </p>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Fatal error in vendor detail page:", error);
    return notFound();
  }
}