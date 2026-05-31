
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
      &lt;div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12"&gt;
        {/* Banner Image */}
        {vendor.bannerUrl &amp;&amp; (
          &lt;div className="w-full h-64 sm:h-80 rounded-3xl overflow-hidden"&gt;
            &lt;img 
              src={vendor.bannerUrl} 
              alt={`${vendor.businessName} banner`} 
              className="w-full h-full object-cover"
            /&gt;
          &lt;/div&gt;
        )}

        {/* Header Section */}
        &lt;div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"&gt;
          &lt;div className="space-y-1"&gt;
            &lt;Link href="/vendors" className="text-sm text-stone-500 hover:text-stone-900 transition-colors"&gt;
              ← Back to Directory
            &lt;/Link&gt;
            &lt;div className="flex items-center gap-4"&gt;
              {vendor.logoUrl &amp;&amp; (
                &lt;div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg"&gt;
                  &lt;img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover" /&gt;
                &lt;/div&gt;
              )}
              &lt;div&gt;
                &lt;h1 className="font-serif text-4xl text-stone-900"&gt;{vendor.businessName}&lt;/h1&gt;
                &lt;div className="flex flex-wrap items-center gap-3 text-sm text-stone-600 mt-1"&gt;
                  &lt;span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-800"&gt;
                    {vendor.category}
                  &lt;/span&gt;
                  &lt;span className="flex items-center gap-1.5"&gt;
                    &lt;span className="h-1 w-1 rounded-full bg-stone-300" /&gt;
                    {vendor.city}
                  &lt;/span&gt;
                  {vendor.verified &amp;&amp; (
                    &lt;span className="flex items-center gap-1 text-primary"&gt;
                      &lt;span className="text-sm"&gt;✓&lt;/span&gt; Verified Professional
                    &lt;/span&gt;
                  )}
                  {vendor.priceRange &amp;&amp; (
                    &lt;span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"&gt;
                      {vendor.priceRange}
                    &lt;/span&gt;
                  )}
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        {/* Cover Image */}
        {vendor.coverUrl &amp;&amp; (
          &lt;div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden"&gt;
            &lt;img 
              src={vendor.coverUrl} 
              alt={`${vendor.businessName} cover`} 
              className="w-full h-full object-cover"
            /&gt;
          &lt;/div&gt;
        )}

        &lt;div className="grid gap-8 lg:grid-cols-3"&gt;
          &lt;div className="lg:col-span-2 space-y-10"&gt;
            {/* Portfolio Section */}
            {vendor.portfolioImages &amp;&amp; vendor.portfolioImages.length &gt; 0 &amp;&amp; (
              &lt;section className="space-y-4"&gt;
                &lt;h2 className="font-serif text-2xl text-stone-900"&gt;Portfolio&lt;/h2&gt;
                &lt;div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"&gt;
                  {vendor.portfolioImages.map((photo, index) =&gt; (
                    &lt;div key={index} className="relative aspect-square rounded-2xl overflow-hidden"&gt;
                      &lt;img src={photo} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" /&gt;
                    &lt;/div&gt;
                  ))}
                &lt;/div&gt;
              &lt;/section&gt;
            )}

            &lt;section className="space-y-4"&gt;
              &lt;h2 className="font-serif text-2xl text-stone-900"&gt;About the professional&lt;/h2&gt;
              &lt;div className="prose prose-stone max-w-none text-stone-600 leading-relaxed"&gt;
                {vendor.bio}
              &lt;/div&gt;
            &lt;/section&gt;

            {/* Services Offered Section */}
            {vendor.servicesOffered &amp;&amp; vendor.servicesOffered.length &gt; 0 &amp;&amp; (
              &lt;section className="space-y-4 pt-4 border-t border-stone-200"&gt;
                &lt;h2 className="font-serif text-2xl text-stone-900"&gt;Services Offered&lt;/h2&gt;
                &lt;div className="flex flex-wrap gap-2"&gt;
                  {vendor.servicesOffered.map((service, index) =&gt; (
                    &lt;span key={index} className="px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-sm font-medium"&gt;
                      {service}
                    &lt;/span&gt;
                  ))}
                &lt;/div&gt;
              &lt;/section&gt;
            )}

            {/* Gallery Section */}
            {(vendor.galleryPhotos &amp;&amp; vendor.galleryPhotos.length &gt; 0) || (vendor.galleryVideos &amp;&amp; vendor.galleryVideos.length &gt; 0) || (vendor.weddingHighlights &amp;&amp; vendor.weddingHighlights.length &gt; 0) ? (
              &lt;section className="space-y-4 pt-4 border-t border-stone-200"&gt;
                &lt;h2 className="font-serif text-2xl text-stone-900"&gt;Gallery&lt;/h2&gt;
                &lt;div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"&gt;
                  {[...(vendor.galleryPhotos || []), ...(vendor.galleryVideos || []), ...(vendor.weddingHighlights || [])].map((media, index) =&gt; (
                    &lt;div key={index} className="relative aspect-square rounded-2xl overflow-hidden"&gt;
                      &lt;img src={media} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" /&gt;
                    &lt;/div&gt;
                  ))}
                &lt;/div&gt;
              &lt;/section&gt;
            ) : null}

            &lt;section className="space-y-4 pt-4 border-t border-stone-200"&gt;
              &lt;div className="flex items-center justify-between"&gt;
                &lt;h2 className="font-serif text-2xl text-stone-900"&gt;Client Reviews&lt;/h2&gt;
                &lt;div className="flex items-center gap-2"&gt;
                   &lt;span className="text-2xl font-bold text-stone-900"&gt;{vendor.rating}&lt;/span&gt;
                   &lt;div className="text-primary text-sm"&gt;★★★★★&lt;/div&gt;
                   &lt;span className="text-sm text-stone-500"&gt;({reviewsCount} reviews)&lt;/span&gt;
                &lt;/div&gt;
              &lt;/div&gt;
              
              {reviewsCount === 0 ? (
                &lt;div className="rounded-2xl border border-dashed border-stone-200 p-12 text-center text-sm text-stone-500"&gt;
                  No reviews yet. Be the first to share your experience after booking!
                &lt;/div&gt;
              ) : (
                 &lt;p className="text-sm text-stone-500 italic"&gt;Detailed reviews are loading...&lt;/p&gt;
              )}
            &lt;/section&gt;
          &lt;/div&gt;

          &lt;div className="space-y-6"&gt;
            &lt;Card className="sticky top-24 border-stone-200 shadow-xl shadow-stone-200/40 overflow-hidden"&gt;
              &lt;div className="h-2 bg-primary w-full" /&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle&gt;Request a Consultation&lt;/CardTitle&gt;
                &lt;CardDescription&gt;
                  We&apos;ll personally connect you with {vendor.businessName} for your special day.
                &lt;/CardDescription&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent&gt;
                &lt;InquiryForm 
                  vendorId={params.id} 
                  authState={
                    !session ? "guest" : 
                    session.user.role === "COUPLE" ? "couple" : "other"
                  } 
                /&gt;
              &lt;/CardContent&gt;
            &lt;/Card&gt;
            
            &lt;Card className="border-stone-100 bg-stone-50"&gt;
               &lt;CardContent className="p-6"&gt;
                  &lt;h3 className="font-serif text-lg text-stone-900 mb-2"&gt;Maison Guarantee&lt;/h3&gt;
                  &lt;p className="text-sm text-stone-600 leading-relaxed"&gt;
                    All professionals in our network are vetted for tradition, luxury, and excellence.
                  &lt;/p&gt;
               &lt;/CardContent&gt;
            &lt;/Card&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    );
  } catch (error) {
    console.error("Fatal error in vendor detail page:", error);
    return notFound();
  }
}

