"use client";
export const dynamic = 'force-dynamic';

import { FormEvent, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type VendorProfileResponse = {
  id: string;
  businessName: string | null;
  category: string | null;
  city: string | null;
  bio: string | null;
  verified?: boolean | null;
  plan?: string | null;
  rating?: number | string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  bannerUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  priceRange?: string | null;
  servicesOffered?: string[];
  portfolioImages?: string[];
  galleryPhotos?: string[];
  galleryVideos?: string[];
  weddingHighlights?: string[];
  isFeatured?: boolean;
};

type FormState = {
  businessName: string;
  category: string;
  city: string;
  bio: string;
  logoUrl: string;
  coverUrl: string;
  bannerUrl: string;
  instagramUrl: string;
  websiteUrl: string;
  priceRange: string;
  servicesOffered: string;
  portfolioImages: string;
  galleryPhotos: string;
  galleryVideos: string;
  weddingHighlights: string;
};

const initialForm: FormState = {
  businessName: "",
  category: "",
  city: "",
  bio: "",
  logoUrl: "",
  coverUrl: "",
  bannerUrl: "",
  instagramUrl: "",
  websiteUrl: "",
  priceRange: "",
  servicesOffered: "",
  portfolioImages: "",
  galleryPhotos: "",
  galleryVideos: "",
  weddingHighlights: "",
};

export default function VendorProfilePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [profileMeta, setProfileMeta] = useState<{
    verified?: boolean | null;
    plan?: string | null;
    rating?: number | string | null;
  }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormState) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "maison-wedding-unsigned"); // Replace with your preset name!
      formData.append("cloud_name", "dgatsavij"); // Your cloud name!

      const response = await fetch(`https://api.cloudinary.com/v1_1/dgatsavij/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm((current) => ({ ...current, [field]: data.secure_url }));
        toast.success("File uploaded successfully!");
      } else {
        const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
        toast.error(errorData.error?.message || "Failed to upload file");
      }
    } catch (error) {
      console.error("Upload error", error);
      toast.error("An unexpected error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormState) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", "maison-wedding-unsigned"); // Replace with your preset name!
        formData.append("cloud_name", "dgatsavij"); // Your cloud name!

        const response = await fetch(`https://api.cloudinary.com/v1_1/dgatsavij/image/upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.secure_url);
        }
      }

      if (uploadedUrls.length > 0) {
        setForm((current) => {
          const currentVal = current[field] as string;
          const currentList = currentVal ? currentVal.split(",").map(s => s.trim()).filter(Boolean) : [];
          const newList = [...currentList, ...uploadedUrls];
          return { ...current, [field]: newList.join(", ") };
        });
        toast.success(`Uploaded ${uploadedUrls.length} file(s) successfully!`);
      }
    } catch (error) {
      console.error("Upload error", error);
      toast.error("An unexpected error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setFeedback(null);

      try {
        const response = await fetch("/api/vendor/profile", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load your vendor profile.");
        }

        if (cancelled) {
          return;
        }

        const profile = data as VendorProfileResponse;

        setForm({
          businessName: profile.businessName || "",
          category: profile.category || "",
          city: profile.city || "",
          bio: profile.bio || "",
          logoUrl: profile.logoUrl || "",
          coverUrl: profile.coverUrl || "",
          bannerUrl: profile.bannerUrl || "",
          instagramUrl: profile.instagramUrl || "",
          websiteUrl: profile.websiteUrl || "",
          priceRange: profile.priceRange || "",
          servicesOffered: profile.servicesOffered ? profile.servicesOffered.join(", ") : "",
          portfolioImages: profile.portfolioImages ? profile.portfolioImages.join(", ") : "",
          galleryPhotos: profile.galleryPhotos ? profile.galleryPhotos.join(", ") : "",
          galleryVideos: profile.galleryVideos ? profile.galleryVideos.join(", ") : "",
          weddingHighlights: profile.weddingHighlights ? profile.weddingHighlights.join(", ") : "",
        });
        setProfileMeta({
          verified: profile.verified,
          plan: profile.plan,
          rating: profile.rating,
        });
      } catch (error) {
        if (!cancelled) {
          setFeedback({
            type: "error",
            message:
              error instanceof Error ? error.message : "Unable to load your vendor profile.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: form.businessName.trim(),
          category: form.category.trim(),
          city: form.city.trim(),
          bio: form.bio.trim(),
          logoUrl: form.logoUrl.trim() || null,
          coverUrl: form.coverUrl.trim() || null,
          bannerUrl: form.bannerUrl.trim() || null,
          instagramUrl: form.instagramUrl.trim() || null,
          websiteUrl: form.websiteUrl.trim() || null,
          priceRange: form.priceRange.trim() || null,
          servicesOffered: form.servicesOffered.split(",").map(s => s.trim()).filter(Boolean),
          portfolioImages: form.portfolioImages.split(",").map(s => s.trim()).filter(Boolean),
          galleryPhotos: form.galleryPhotos.split(",").map(s => s.trim()).filter(Boolean),
          galleryVideos: form.galleryVideos.split(",").map(s => s.trim()).filter(Boolean),
          weddingHighlights: form.weddingHighlights.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to save your vendor profile.");
      }

      const profile = data as VendorProfileResponse;

      setForm({
        businessName: profile.businessName || "",
        category: profile.category || "",
        city: profile.city || "",
        bio: profile.bio || "",
        logoUrl: profile.logoUrl || "",
        coverUrl: profile.coverUrl || "",
        bannerUrl: profile.bannerUrl || "",
        instagramUrl: profile.instagramUrl || "",
        websiteUrl: profile.websiteUrl || "",
        priceRange: profile.priceRange || "",
        servicesOffered: profile.servicesOffered ? profile.servicesOffered.join(", ") : "",
        portfolioImages: profile.portfolioImages ? profile.portfolioImages.join(", ") : "",
        galleryPhotos: profile.galleryPhotos ? profile.galleryPhotos.join(", ") : "",
        galleryVideos: profile.galleryVideos ? profile.galleryVideos.join(", ") : "",
        weddingHighlights: profile.weddingHighlights ? profile.weddingHighlights.join(", ") : "",
      });
      setProfileMeta({
        verified: profile.verified,
        plan: profile.plan,
        rating: profile.rating,
      });
      setFeedback({
        type: "success",
        message: "Your vendor profile has been updated successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to save your vendor profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Vendor profile</p>
        <h1 className="font-serif text-4xl text-stone-900">Manage your marketplace listing</h1>
        <p className="max-w-2xl text-stone-600">
          Keep your public profile polished so couples can quickly understand your style,
          availability, and location.
        </p>
      </div>

      {feedback ? (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-stone-200">
          <CardHeader className="pb-3">
            <CardDescription>Verification</CardDescription>
            <CardTitle>{profileMeta.verified ? "Verified" : "Pending review"}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-stone-600">
            Verified vendors appear with extra trust signals in the public directory.
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardHeader className="pb-3">
            <CardDescription>Plan</CardDescription>
            <CardTitle>{profileMeta.plan || "Standard"}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-stone-600">
            Your current plan influences how your listing is displayed in the marketplace.
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardHeader className="pb-3">
            <CardDescription>Rating</CardDescription>
            <CardTitle>
              {profileMeta.rating !== null && profileMeta.rating !== undefined
                ? Number(profileMeta.rating).toFixed(1)
                : "New"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-stone-600">
            Ratings update as couples leave reviews for your services.
          </CardContent>
        </Card>
      </div>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle>Edit listing details</CardTitle>
          <CardDescription>
            Business name, category, and city are required before your profile can be shown clearly
            to couples.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-6 py-10 text-center text-sm text-stone-600">
              Loading your vendor profile...
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="businessName">
                      Business name
                    </label>
                    <Input
                      id="businessName"
                      value={form.businessName}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, businessName: event.target.value }))
                      }
                      placeholder="Maison Floral Studio"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="category">
                      Category
                    </label>
                    <Input
                      id="category"
                      value={form.category}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, category: event.target.value }))
                      }
                      placeholder="Florist"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="city">
                      City
                    </label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, city: event.target.value }))
                      }
                      placeholder="Lahore"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="priceRange">
                      Price Range
                    </label>
                    <Input
                      id="priceRange"
                      value={form.priceRange}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, priceRange: event.target.value }))
                      }
                      placeholder="£, ££, £££, Luxury"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="logoUrl">
                      Logo URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="logoUrl"
                        value={form.logoUrl}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, logoUrl: event.target.value }))
                        }
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap">
                        {uploading ? "Uploading..." : "Upload Logo"}
                        <input 
                          type="file" 
                          accept="image/*" 
                          disabled={uploading}
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, "logoUrl")} 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="coverUrl">
                      Cover Image URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="coverUrl"
                        value={form.coverUrl}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, coverUrl: event.target.value }))
                        }
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap">
                        {uploading ? "Uploading..." : "Upload Cover"}
                        <input 
                          type="file" 
                          accept="image/*" 
                          disabled={uploading}
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, "coverUrl")} 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="bannerUrl">
                      Banner Image URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="bannerUrl"
                        value={form.bannerUrl}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, bannerUrl: event.target.value }))
                        }
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap">
                        {uploading ? "Uploading..." : "Upload Banner"}
                        <input 
                          type="file" 
                          accept="image/*" 
                          disabled={uploading}
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, "bannerUrl")} 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="websiteUrl">
                      Website URL
                    </label>
                    <Input
                      id="websiteUrl"
                      value={form.websiteUrl}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, websiteUrl: event.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="instagramUrl">
                      Instagram URL
                    </label>
                    <Input
                      id="instagramUrl"
                      value={form.instagramUrl}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, instagramUrl: event.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700" htmlFor="servicesOffered">
                      Services Offered (comma separated)
                    </label>
                    <Input
                      id="servicesOffered"
                      value={form.servicesOffered}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, servicesOffered: event.target.value }))
                      }
                      placeholder="Mehndi, Nikkah, Walima"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700" htmlFor="logoUrl">
                    Logo Preview
                  </label>
                  {form.logoUrl && (
                    <div className="h-24 w-24 rounded-full border border-stone-200 overflow-hidden">
                      <img src={form.logoUrl} alt="Logo Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700" htmlFor="coverUrl">
                    Cover Image Preview
                  </label>
                  {form.coverUrl && (
                    <div className="h-48 w-full rounded-xl border border-stone-200 overflow-hidden">
                      <img src={form.coverUrl} alt="Cover Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700" htmlFor="bannerUrl">
                    Banner Image Preview
                  </label>
                  {form.bannerUrl && (
                    <div className="h-32 w-full rounded-xl border border-stone-200 overflow-hidden">
                      <img src={form.bannerUrl} alt="Banner Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={form.bio}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, bio: event.target.value }))
                    }
                    placeholder="Tell couples what makes your service special, your aesthetic, and how you work."
                    rows={6}
                    className="flex min-h-[140px] w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700" htmlFor="galleryPhotos">
                    Gallery Photos (comma separated URLs)
                  </label>
                  <div className="flex flex-col gap-2">
                    <textarea
                      id="galleryPhotos"
                      value={form.galleryPhotos}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, galleryPhotos: event.target.value }))
                      }
                      placeholder="https://..., https://..."
                      rows={3}
                      className="flex w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                    />
                    <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap self-start">
                      {uploading ? "Uploading..." : "Upload Gallery Photos"}
                      <input 
                        type="file" 
                        multiple
                        accept="image/*" 
                        disabled={uploading}
                        className="hidden" 
                        onChange={(e) => handleMultipleFilesUpload(e, "galleryPhotos")} 
                      />
                    </label>
                  </div>
                  {form.galleryPhotos && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {form.galleryPhotos.split(",").map((url, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-stone-200">
                          <img src={url.trim()} alt={`Gallery ${i+1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700" htmlFor="portfolioImages">
                    Portfolio Images (comma separated URLs)
                  </label>
                  <div className="flex flex-col gap-2">
                    <textarea
                      id="portfolioImages"
                      value={form.portfolioImages}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, portfolioImages: event.target.value }))
                      }
                      placeholder="https://..., https://..."
                      rows={3}
                      className="flex w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                    />
                    <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap self-start">
                      {uploading ? "Uploading..." : "Upload Portfolio Images"}
                      <input 
                        type="file" 
                        multiple
                        accept="image/*" 
                        disabled={uploading}
                        className="hidden" 
                        onChange={(e) => handleMultipleFilesUpload(e, "portfolioImages")} 
                      />
                    </label>
                  </div>
                  {form.portfolioImages && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {form.portfolioImages.split(",").map((url, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-stone-200">
                          <img src={url.trim()} alt={`Portfolio ${i+1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700" htmlFor="weddingHighlights">
                    Wedding Highlights (comma separated URLs)
                  </label>
                  <div className="flex flex-col gap-2">
                    <textarea
                      id="weddingHighlights"
                      value={form.weddingHighlights}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, weddingHighlights: event.target.value }))
                      }
                      placeholder="https://..., https://..."
                      rows={3}
                      className="flex w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                    />
                    <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap self-start">
                      {uploading ? "Uploading..." : "Upload Wedding Highlights"}
                      <input 
                        type="file" 
                        multiple
                        accept="image/*,video/*" 
                        disabled={uploading}
                        className="hidden" 
                        onChange={(e) => handleMultipleFilesUpload(e, "weddingHighlights")} 
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700" htmlFor="galleryVideos">
                    Gallery Videos (comma separated URLs)
                  </label>
                  <div className="flex flex-col gap-2">
                    <textarea
                      id="galleryVideos"
                      value={form.galleryVideos}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, galleryVideos: event.target.value }))
                      }
                      placeholder="https://..., https://..."
                      rows={3}
                      className="flex w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                    />
                    <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap self-start">
                      {uploading ? "Uploading..." : "Upload Gallery Videos"}
                      <input 
                        type="file" 
                        multiple
                        accept="video/*" 
                        disabled={uploading}
                        className="hidden" 
                        onChange={(e) => handleMultipleFilesUpload(e, "galleryVideos")} 
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => {
                    setFeedback(null);
                    setLoading(true);
                    fetch("/api/vendor/profile", { cache: "no-store" })
                      .then(async (response) => {
                        const data = await response.json().catch(() => null);

                        if (!response.ok) {
                          throw new Error(data?.message || "Unable to reload your profile.");
                        }

                        const profile = data as VendorProfileResponse;

                        setForm({
                          businessName: profile.businessName || "",
                          category: profile.category || "",
                          city: profile.city || "",
                          bio: profile.bio || "",
                          logoUrl: profile.logoUrl || "",
                          coverUrl: profile.coverUrl || "",
                          bannerUrl: profile.bannerUrl || "",
                          instagramUrl: profile.instagramUrl || "",
                          websiteUrl: profile.websiteUrl || "",
                          priceRange: profile.priceRange || "",
                          servicesOffered: profile.servicesOffered ? profile.servicesOffered.join(", ") : "",
                          portfolioImages: profile.portfolioImages ? profile.portfolioImages.join(", ") : "",
                          galleryPhotos: profile.galleryPhotos ? profile.galleryPhotos.join(", ") : "",
                          galleryVideos: profile.galleryVideos ? profile.galleryVideos.join(", ") : "",
                          weddingHighlights: profile.weddingHighlights ? profile.weddingHighlights.join(", ") : "",
                        });
                        setProfileMeta({
                          verified: profile.verified,
                          plan: profile.plan,
                          rating: profile.rating,
                        });
                      })
                      .catch((error) => {
                        setFeedback({
                          type: "error",
                          message:
                            error instanceof Error
                              ? error.message
                              : "Unable to reload your profile.",
                        });
                      })
                      .finally(() => setLoading(false));
                  }}
                >
                  Reload
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
