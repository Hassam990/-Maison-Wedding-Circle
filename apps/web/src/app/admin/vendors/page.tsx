"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
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
  Smartphone
} from "lucide-react";
import { toast } from "sonner";

interface Vendor {
  id: string;
  businessName: string;
  category: string;
  city: string;
  verified: boolean;
  plan: string;
  rating: number;
  user: {
    name: string | null;
    email: string | null;
  };
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/admin/vendors");
      console.log("Vendors fetch status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Vendors data received:", data.length);
        setVendors(data);
      } else {
        const text = await res.text();
        console.error("Vendors fetch failed:", text);
        toast.error(`Failed to load vendors: ${res.status}`);
      }
    } catch (error) {
       console.error("Vendors fetch error:", error);
       toast.error("Could not load vendors");
    } finally {
      setLoading(false);
    }
  };

  const toggleVerify = async (vendor: Vendor) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendor.id}/approve`, {
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

  const filtered = vendors.filter(v => 
    v.businessName.toLowerCase().includes(search.toLowerCase()) ||
    v.user.email?.toLowerCase().includes(search.toLowerCase())
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
           <button className="p-2 border border-[#dbb84a] rounded-full text-[#3D0C1A] hover:bg-[#fffcf0] transition-colors">
              <Filter className="w-4 h-4" />
           </button>
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
                               {vendor.businessName[0]}
                            </div>
                            <div>
                               <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-bold text-[#3D0C1A]">{vendor.businessName}</p>
                                  {vendor.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />}
                               </div>
                               <p className="text-[11px] text-[#8a6200]">{vendor.category} Ã‚Â· {vendor.city}</p>
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
                         <div className="flex items-center justify-end gap-1 translate-x-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-2 text-[#8a6200] hover:bg-[#dbb84a]/20 rounded-full" title="View Profile">
                               <ExternalLink className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-400 hover:bg-red-50 rounded-full" title="Ban Vendor">
                               <XCircle className="w-4 h-4" />
                            </button>
                            <div className="w-8 h-8 flex items-center justify-center text-[#dbb84a]">
                               <MoreVertical className="w-4 h-4" />
                            </div>
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
           <div className="flex gap-2">
              <button disabled className="px-4 py-1.5 border border-[#dbb84a] rounded-lg text-xs font-bold opacity-50">Back</button>
              <button disabled className="px-4 py-1.5 bg-[#3D0C1A] text-white rounded-lg text-xs font-bold">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
