"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  RefreshCcw,
  Mail,
  Smartphone,
  Plus,
  Edit2,
  X
} from "lucide-react";
import { toast } from "sonner";

interface Vendor {
  id: string;
  businessName: string | null;
  category: string | null;
  city: string | null;
  bio: string | null;
  verified: boolean;
  plan: string;
  rating: number;
  userId: string;
  adminPhone?: string | null;
  adminWhatsApp?: string | null;
  adminEmail?: string | null;
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
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface VendorFormData {
  businessName: string;
  category: string;
  city: string;
  bio: string;
  verified: boolean;
  plan: string;
  rating: number;
  adminPhone: string;
  adminWhatsApp: string;
  adminEmail: string;
  userEmail: string;
  userName: string;
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
  isFeatured: boolean;
}

const initialFormData: VendorFormData = {
  businessName: "",
  category: "",
  city: "",
  bio: "",
  verified: false,
  plan: "FREE",
  rating: 0,
  adminPhone: "",
  adminWhatsApp: "",
  adminEmail: "",
  userEmail: "",
  userName: "",
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
  isFeatured: false,
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<VendorFormData>(initialFormData);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof VendorFormData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading file...");
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({
          ...prev,
          [field]: data.url
        }));
        toast.success("File uploaded successfully", { id: toastId });
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Upload error", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof VendorFormData) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} file(s)...`);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => {
          const currentVal = prev[field] as string;
          const currentList = currentVal ? currentVal.split(",").map(s => s.trim()).filter(Boolean) : [];
          const newList = [...currentList, ...uploadedUrls];
          return {
            ...prev,
            [field]: newList.join(", ")
          };
        });
        toast.success(`Successfully uploaded ${uploadedUrls.length} file(s)`, { id: toastId });
      } else {
        toast.error("All uploads failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Upload error", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      console.log("Fetching vendors...");
      const res = await fetch("/api/admin/vendors");
      if (res.ok) {
        const data = await res.json();
        console.log("Vendors loaded successfully:", data);
        setVendors(data);
      } else {
        console.error("Failed to load vendors, status:", res.status);
        toast.error(`Failed to load vendors: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error(`Could not load vendors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerify = async (vendor: Vendor) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !vendor.verified }),
      });
      if (res.ok) {
        setVendors(vendors.map(v => v.id === vendor.id ? { ...v, verified: !v.verified } : v));
        toast.success(vendor.verified ? "Verification removed" : "Vendor verified successfully");
      }
    } catch (error) {
      toast.error("Verification update failed");
    }
  };

  const handleDelete = async (vendor: Vendor) => {
    if (!window.confirm(`Are you sure you want to delete ${vendor.businessName}?`)) return;
    try {
      const res = await fetch(`/api/admin/vendors/${vendor.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVendors(vendors.filter(v => v.id !== vendor.id));
        toast.success("Vendor deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete vendor");
    }
  };

  const openAddModal = () => {
    setEditingVendor(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: any) => {
    setEditingVendor(vendor);
    setFormData({
      businessName: vendor.businessName || "",
      category: vendor.category || "",
      city: vendor.city || "",
      bio: vendor.bio || "",
      verified: vendor.verified,
      plan: vendor.plan,
      rating: vendor.rating,
      adminPhone: vendor.adminPhone || "",
      adminWhatsApp: vendor.adminWhatsApp || "",
      adminEmail: vendor.adminEmail || "",
      userEmail: vendor.user.email || "",
      userName: vendor.user.name || "",
      logoUrl: vendor.logoUrl || "",
      coverUrl: vendor.coverUrl || "",
      bannerUrl: vendor.bannerUrl || "",
      instagramUrl: vendor.instagramUrl || "",
      websiteUrl: vendor.websiteUrl || "",
      priceRange: vendor.priceRange || "",
      servicesOffered: vendor.servicesOffered ? vendor.servicesOffered.join(", ") : "",
      portfolioImages: vendor.portfolioImages ? vendor.portfolioImages.join(", ") : "",
      galleryPhotos: vendor.galleryPhotos ? vendor.galleryPhotos.join(", ") : "",
      galleryVideos: vendor.galleryVideos ? vendor.galleryVideos.join(", ") : "",
      weddingHighlights: vendor.weddingHighlights ? vendor.weddingHighlights.join(", ") : "",
      isFeatured: vendor.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        businessName: formData.businessName,
        category: formData.category,
        city: formData.city,
        bio: formData.bio,
        verified: formData.verified,
        plan: formData.plan,
        rating: formData.rating,
        adminPhone: formData.adminPhone || null,
        adminWhatsApp: formData.adminWhatsApp || null,
        adminEmail: formData.adminEmail || null,
        logoUrl: formData.logoUrl || null,
        coverUrl: formData.coverUrl || null,
        bannerUrl: formData.bannerUrl || null,
        instagramUrl: formData.instagramUrl || null,
        websiteUrl: formData.websiteUrl || null,
        priceRange: formData.priceRange || null,
        servicesOffered: formData.servicesOffered.split(",").map(s => s.trim()).filter(Boolean),
        portfolioImages: formData.portfolioImages.split(",").map(s => s.trim()).filter(Boolean),
        galleryPhotos: formData.galleryPhotos.split(",").map(s => s.trim()).filter(Boolean),
        galleryVideos: formData.galleryVideos.split(",").map(s => s.trim()).filter(Boolean),
        weddingHighlights: formData.weddingHighlights.split(",").map(s => s.trim()).filter(Boolean),
        isFeatured: formData.isFeatured,
      };

      if (editingVendor) {
        const res = await fetch(`/api/admin/vendors/${editingVendor.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updatedVendor = await res.json();
          setVendors(vendors.map(v => v.id === editingVendor.id ? { ...v, ...updatedVendor } : v));
          toast.success("Vendor updated successfully");
        }
      } else {
        const res = await fetch("/api/admin/vendors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, userEmail: formData.userEmail, userName: formData.userName }),
        });
        if (res.ok) {
          const newVendor = await res.json();
          setVendors([newVendor, ...vendors]);
          toast.success("Vendor added successfully!");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to add vendor");
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save vendor");
    }
  };

  const filtered = vendors.filter(v => 
    (v.businessName || "").toLowerCase().includes(search.toLowerCase()) ||
    (v.user.email || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center py-20">
         <RefreshCcw className="w-10 h-10 text-[#C9940A] animate-spin mb-4" />
         <p className="text-[#8a6200] font-medium">Loading Vendors List...</p>
       </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Vendors Directory</h1>
          <p className="text-[#8a6200]">Approve, manage plans, and monitor all business accounts.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dbb84a]" />
              <input 
                type="text" 
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2 border border-[#dbb84a] rounded-full text-sm bg-white focus:ring-2 focus:ring-[#C9940A] outline-none min-w-[300px]"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
           <Button onClick={openAddModal} className="flex items-center gap-2 bg-[#3D0C1A] hover:bg-[#5a122a] text-white">
             <Plus className="w-4 h-4" />
             Add Vendor
           </Button>
        </div>
      </div>

      <div className="bg-white border border-[#dbb84a] rounded-[32px] overflow-hidden shadow-sm shadow-[#fde9b2]/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-[#fffcf0] border-b border-[#dbb84a]">
                <tr>
                   <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#8a6200]">Vendor / Business</th>
                   <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#8a6200]">Account Details</th>
                   <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#8a6200]">Status</th>
                   <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#8a6200]">Plan</th>
                   <th className="px-6 py-4 text-right"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#dbb84a]/20">
                {filtered.map((vendor) => (
                   <tr key={vendor.id} className="group hover:bg-[#fffdf5] transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#fef3d6] flex items-center justify-center text-[#C9940A] font-bold text-lg">
                               {(vendor.businessName || "V")[0]}
                            </div>
                            <div>
                               <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-bold text-[#3D0C1A]">{vendor.businessName || "Unnamed Vendor"}</p>
                                  {vendor.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />}
                               </div>
                               <p className="text-[11px] text-[#8a6200]">{(vendor.category || "Uncategorized")} · {(vendor.city || "Unknown Location")}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-[#3D0C1A]">
                               <Mail className="w-3 h-3 text-[#dbb84a]" />
                               {vendor.user.email}
                            </div>
                            <p className="text-[11px] text-[#8a6200] font-medium">{vendor.user.name}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <button 
                          onClick={() => toggleVerify(vendor)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                            vendor.verified 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          }`}
                         >
                            {vendor.verified ? (
                              <><CheckCircle className="w-3 h-3" /> Verified</>
                            ) : (
                              <><RefreshCcw className="w-3 h-3" /> Pending</>
                            )}
                         </button>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${
                              vendor.plan === 'PREMIUM' ? 'bg-[#3D0C1A] text-[#fde9b2]' : 
                              vendor.plan === 'PROFESSIONAL' ? 'bg-[#C9940A] text-white' : 
                              'bg-gray-100 text-gray-500'
                            }`}>
                               <Zap className="w-3 h-3" />
                            </div>
                            <span className="text-[11px] font-bold text-[#3D0C1A] uppercase tracking-wider">{vendor.plan}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => window.open(`/vendors/${vendor.id}`, "_blank")}
                              className="p-2 text-[#8a6200] hover:bg-[#dbb84a]/20 rounded-full" 
                              title="View Profile"
                            >
                               <ExternalLink className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openEditModal(vendor)}
                              className="p-2 text-[#8a6200] hover:bg-[#dbb84a]/20 rounded-full" 
                              title="Edit Vendor"
                            >
                               <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(vendor)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full" 
                              title="Delete Vendor"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
           <div className="py-20 text-center">
              <Users className="w-12 h-12 text-[#dbb84a] mx-auto mb-4" />
              <p className="text-[#8a6200] font-medium">No vendors found matching your search.</p>
           </div>
        )}
        <div className="px-6 py-4 bg-[#faf8f0] border-t border-[#dbb84a] flex items-center justify-between">
           <p className="text-[10px] uppercase font-bold tracking-widest text-[#8a6200]">Showing {filtered.length} of {vendors.length} vendors</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full sm:max-w-2xl sm:max-h-[90vh] shadow-2xl flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 sm:px-8 sm:py-6 border-b border-[#dbb84a] flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-[#3D0C1A]">
                {editingVendor ? "Edit Vendor" : "Add New Vendor"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-[#dbb84a]/20 rounded-full"
              >
                <X className="w-6 h-6 text-[#8a6200]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {!editingVendor && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#3D0C1A] mb-2">Vendor Email</label>
                      <Input 
                        required
                        type="email"
                        value={formData.userEmail}
                        onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                        placeholder="vendor@example.com"
                        className="border-[#dbb84a] focus:ring-[#C9940A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#3D0C1A] mb-2">Vendor Name</label>
                      <Input 
                        required
                        value={formData.userName}
                        onChange={(e) => setFormData({...formData, userName: e.target.value})}
                        placeholder="Enter vendor name"
                        className="border-[#dbb84a] focus:ring-[#C9940A]"
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#3D0C1A] mb-2">Business Name</label>
                    <Input 
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      placeholder="Enter business name"
                      className="border-[#dbb84a] focus:ring-[#C9940A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3D0C1A] mb-2">Category</label>
                    <Input 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="e.g., Catering, Photography"
                      className="border-[#dbb84a] focus:ring-[#C9940A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3D0C1A] mb-2">City</label>
                    <Input 
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="e.g., Atlanta GA"
                      className="border-[#dbb84a] focus:ring-[#C9940A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3D0C1A] mb-2">Plan</label>
                    <select 
                      required
                      value={formData.plan}
                      onChange={(e) => setFormData({...formData, plan: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbb84a] rounded-xl focus:ring-2 focus:ring-[#C9940A] outline-none"
                    >
                      <option value="FREE">FREE</option>
                      <option value="PROFESSIONAL">PROFESSIONAL</option>
                      <option value="PREMIUM">PREMIUM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3D0C1A] mb-2">Rating</label>
                    <Input 
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 0})}
                      placeholder="0-5"
                      className="border-[#dbb84a] focus:ring-[#C9940A]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      id="verified"
                      checked={formData.verified}
                      onChange={(e) => setFormData({...formData, verified: e.target.checked})}
                      className="w-5 h-5 text-[#C9940A] border-[#dbb84a] focus:ring-[#C9940A]"
                    />
                    <label htmlFor="verified" className="text-sm font-bold text-[#3D0C1A]">Verified Vendor</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#3D0C1A] mb-2">Bio / Description</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about this vendor..."
                    className="w-full px-4 py-3 border border-[#dbb84a] rounded-xl focus:ring-2 focus:ring-[#C9940A] outline-none min-h-[100px] sm:min-h-[120px]"
                  />
                </div>

                {/* Media & Additional Info */}
                <div className="pt-4 border-t border-[#dbb84a]">
                  <h3 className="text-lg font-bold text-[#3D0C1A] mb-4">Media & Additional Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#8a6200] mb-2">Logo URL</label>
                      <div className="flex gap-2">
                        <Input 
                          value={formData.logoUrl}
                          onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                          placeholder="https://..."
                          className="border-[#dbb84a] focus:ring-[#C9940A] flex-1"
                        />
                        <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap">
                          {uploading ? "Uploading..." : "Upload Logo"}
                          <input 
                            type="file" 
                            accept="image/*" 
                            disabled={uploading}
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'logoUrl')} 
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#8a6200] mb-2">Cover Image URL</label>
                      <div className="flex gap-2">
                        <Input 
                          value={formData.coverUrl}
                          onChange={(e) => setFormData({...formData, coverUrl: e.target.value})}
                          placeholder="https://..."
                          className="border-[#dbb84a] focus:ring-[#C9940A] flex-1"
                        />
                        <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap">
                          {uploading ? "Uploading..." : "Upload Cover"}
                          <input 
                            type="file" 
                            accept="image/*" 
                            disabled={uploading}
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'coverUrl')} 
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#8a6200] mb-2">Banner Image URL</label>
                      <div className="flex gap-2">
                        <Input 
                          value={formData.bannerUrl}
                          onChange={(e) => setFormData({...formData, bannerUrl: e.target.value})}
                          placeholder="https://..."
                          className="border-[#dbb84a] focus:ring-[#C9940A] flex-1"
                        />
                        <label className="cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-all whitespace-nowrap">
                          {uploading ? "Uploading..." : "Upload Banner"}
                          <input 
                            type="file" 
                            accept="image/*" 
                            disabled={uploading}
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'bannerUrl')} 
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#8a6200] mb-2">Website URL</label>
                      <Input 
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                        placeholder="https://..."
                        className="border-[#dbb84a] focus:ring-[#C9940A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#8a6200] mb-2">Instagram URL</label>
                      <Input 
                        value={formData.instagramUrl}
                        onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
                        placeholder="https://..."
                        className="border-[#dbb84a] focus:ring-[#C9940A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#8a6200] mb-2">Price Range</label>
                      <Input 
                        value={formData.priceRange}
                        onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                        placeholder="£, ££, £££, Luxury"
                        className="border-[#dbb84a] focus:ring-[#C9940A]"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-[#8a6200] mb-2">Services Offered (comma separated)</label>
                    <Input 
                      value={formData.servicesOffered}
                      onChange={(e) => setFormData({...formData, servicesOffered: e.target.value})}
                      placeholder="Mehndi, Nikkah, Walima"
                      className="border-[#dbb84a] focus:ring-[#C9940A]"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-[#8a6200] mb-2">Portfolio Images (comma separated URLs)</label>
                    <div className="space-y-2">
                      <textarea
                        value={formData.portfolioImages}
                        onChange={(e) => setFormData({...formData, portfolioImages: e.target.value})}
                        placeholder="https://..., https://..."
                        rows={2}
                        className="w-full px-4 py-3 border border-[#dbb84a] rounded-xl focus:ring-2 focus:ring-[#C9940A] outline-none"
                      />
                      <label className="inline-flex cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-2 rounded-xl items-center justify-center transition-all">
                        {uploading ? "Uploading..." : "Upload Portfolio Images"}
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          disabled={uploading}
                          className="hidden" 
                          onChange={(e) => handleMultipleFilesUpload(e, 'portfolioImages')} 
                        />
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-[#8a6200] mb-2">Gallery Photos (comma separated URLs)</label>
                    <div className="space-y-2">
                      <textarea
                        value={formData.galleryPhotos}
                        onChange={(e) => setFormData({...formData, galleryPhotos: e.target.value})}
                        placeholder="https://..., https://..."
                        rows={2}
                        className="w-full px-4 py-3 border border-[#dbb84a] rounded-xl focus:ring-2 focus:ring-[#C9940A] outline-none"
                      />
                      <label className="inline-flex cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-2 rounded-xl items-center justify-center transition-all">
                        {uploading ? "Uploading..." : "Upload Photos"}
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          disabled={uploading}
                          className="hidden" 
                          onChange={(e) => handleMultipleFilesUpload(e, 'galleryPhotos')} 
                        />
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-[#8a6200] mb-2">Wedding Highlights (comma separated URLs)</label>
                    <div className="space-y-2">
                      <textarea
                        value={formData.weddingHighlights}
                        onChange={(e) => setFormData({...formData, weddingHighlights: e.target.value})}
                        placeholder="https://..., https://..."
                        rows={2}
                        className="w-full px-4 py-3 border border-[#dbb84a] rounded-xl focus:ring-2 focus:ring-[#C9940A] outline-none"
                      />
                      <label className="inline-flex cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-2 rounded-xl items-center justify-center transition-all">
                        {uploading ? "Uploading..." : "Upload Highlights"}
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          disabled={uploading}
                          className="hidden" 
                          onChange={(e) => handleMultipleFilesUpload(e, 'weddingHighlights')} 
                        />
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-[#8a6200] mb-2">Gallery Videos (comma separated URLs)</label>
                    <div className="space-y-2">
                      <textarea
                        value={formData.galleryVideos}
                        onChange={(e) => setFormData({...formData, galleryVideos: e.target.value})}
                        placeholder="https://..., https://..."
                        rows={2}
                        className="w-full px-4 py-3 border border-[#dbb84a] rounded-xl focus:ring-2 focus:ring-[#C9940A] outline-none"
                      />
                      <label className="inline-flex cursor-pointer bg-[#3D0C1A] text-white hover:bg-[#5a122a] text-xs font-bold px-4 py-2 rounded-xl items-center justify-center transition-all">
                        {uploading ? "Uploading..." : "Upload Videos"}
                        <input 
                          type="file" 
                          accept="video/*" 
                          multiple
                          disabled={uploading}
                          className="hidden" 
                          onChange={(e) => handleMultipleFilesUpload(e, 'galleryVideos')} 
                        />
                      </label>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <input 
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-5 h-5 text-[#C9940A] border-[#dbb84a] focus:ring-[#C9940A]"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-bold text-[#3D0C1A]">Featured Vendor</label>
                  </div>
                </div>
                
                {/* Admin-only contact fields */}
                <div className="pt-4 border-t border-[#dbb84a]">
                  <h3 className="text-lg font-bold text-[#3D0C1A] mb-4">Admin-Only Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#8a6200] mb-2">Phone Number</label>
                      <Input 
                        value={formData.adminPhone}
                        onChange={(e) => setFormData({...formData, adminPhone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="border-[#dbb84a] focus:ring-[#C9940A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#8a6200] mb-2">WhatsApp</label>
                      <Input 
                        value={formData.adminWhatsApp}
                        onChange={(e) => setFormData({...formData, adminWhatsApp: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="border-[#dbb84a] focus:ring-[#C9940A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#8a6200] mb-2">Admin Email</label>
                      <Input 
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                        placeholder="vendor@example.com"
                        className="border-[#dbb84a] focus:ring-[#C9940A]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {editingVendor && (
                <div className="pt-4 border-t border-[#dbb84a]">
                  <h3 className="text-lg font-bold text-[#3D0C1A] mb-4">Account Info (Read Only)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#8a6200] mb-1">Email</label>
                      <Input 
                        disabled
                        value={formData.userEmail}
                        className="bg-gray-50 border-[#dbb84a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#8a6200] mb-1">Name</label>
                      <Input 
                        disabled
                        value={formData.userName}
                        className="bg-gray-50 border-[#dbb84a]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 sticky bottom-0 bg-white pt-4">
                <Button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  variant="secondary"
                  className="border-[#dbb84a] text-[#3D0C1A] hover:bg-[#fffcf0] flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#3D0C1A] hover:bg-[#5a122a] text-white flex-1 sm:flex-none">
                  {editingVendor ? "Save Changes" : "Add Vendor"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
