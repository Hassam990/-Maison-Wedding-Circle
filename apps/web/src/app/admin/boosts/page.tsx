"use client";

import { useState, useEffect } from "react";
import { 
  Megaphone, 
  DollarSign, 
  Layers, 
  TrendingUp, 
  Plus, 
  Clock, 
  MoreHorizontal, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight,
  Target,
  BarChart3,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

export default function BoostsPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [boosts, setBoosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingPackage, setIsAddingPackage] = useState(false);

  const fetchData = async () => {
    try {
      const [pkgsRes, boostsRes] = await Promise.all([
        fetch("/api/admin/adpackages"),
        fetch("/api/admin/boosts")
      ]);
      
      if (pkgsRes.ok) setPackages(await pkgsRes.json());
      if (boostsRes.ok) setBoosts(await boostsRes.json());
    } catch (error) {
      toast.error("Failed to load advertising data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePackageStatus = async (id: string, currentStatus: boolean) => {
    // In a real app, this would be a PATCH to /api/admin/adpackages/[id]
    toast.info("Status toggle simulated for demo");
  };

  const handleDeactivateBoost = async (id: string) => {
      if (!confirm("Are you sure you want to deactivate this boost immediately?")) return;
      try {
          const res = await fetch("/api/admin/boosts", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, isActive: false })
          });
          if (res.ok) {
              toast.success("Boost deactivated");
              fetchData();
          }
      } catch (error) {
          toast.error("Failed to update boost");
      }
  };

  const totalRevenue = boosts.reduce((acc, b) => acc + (b.amountPaid || 0), 0);

  return (
    <div className="space-y-8 font-inter">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Advertising & Boosts</h1>
          <p className="text-burgundy/60 italic">Manage high-visibility slots and vendor ad packages</p>
        </div>
        <div className="flex gap-4">
             <div className="bg-[#fde9b2] px-6 py-2 rounded-2xl border border-[#C9940A]/30 flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-[#8a6200] leading-none mb-1">Total Ad Revenue</span>
                <span className="text-xl font-playfair font-black text-[#3D0C1A]">${totalRevenue.toLocaleString()}</span>
             </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Boosts", val: boosts.filter(b => b.isActive).length, icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Impressions", val: boosts.reduce((acc, b) => acc + (b.impressions || 0), 0).toLocaleString(), icon: TrendingUp, color: "text-[#C9940A]", bg: "bg-amber-50" },
          { label: "Avg CTR", val: "4.2%", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Waitlisted", val: "12", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-burgundy/5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-burgundy/50 uppercase tracking-widest">{stat.label}</p>
               <h3 className="text-xl font-black text-burgundy">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Packages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-playfair font-bold text-burgundy flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C9940A]" />
            Ad Packages
          </h2>
          <button className="text-[#C9940A] text-sm font-bold hover:underline flex items-center gap-1">
             <Plus className="w-4 h-4" /> Add New Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-3xl border border-burgundy/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
               <div className="p-5 bg-gradient-to-br from-[#FFFDF5] to-white border-b border-burgundy/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black bg-burgundy/5 px-2 py-1 rounded text-burgundy/60 uppercase tracking-tighter">
                      {pkg.boostType}
                    </span>
                    <button className="text-burgundy/20 group-hover:text-burgundy transition-colors">
                       <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-playfair font-black text-burgundy text-lg">{pkg.name}</h3>
                  <p className="text-xs text-burgundy/50 h-8 line-clamp-2 italic">{pkg.description}</p>
               </div>
               <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-burgundy/60">Price</span>
                    <span className="font-black text-emerald-600">${pkg.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-burgundy/60">Active Slots</span>
                    <span className="font-black text-burgundy">{pkg._count?.boosts || 0} / {pkg.maxSlots}</span>
                  </div>
                  <div className="pt-2">
                    <button 
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        pkg.isActive 
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {pkg.isActive ? "Active & Selling" : "Paused / Disabled"}
                    </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Boosts Table */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-playfair font-bold text-burgundy flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#C9940A]" />
            Active Placements
          </h2>
          <div className="bg-white rounded-3xl border border-burgundy/5 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
               <thead className="bg-[#FFFDF5] text-burgundy/50 text-[10px] font-black uppercase tracking-widest border-b border-burgundy/5">
                 <tr>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4">Package</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Expires</th>
                    <th className="px-6 py-4">Performance</th>
                    <th className="px-6 py-4">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-burgundy/5 font-inter">
                  {boosts.map((boost) => (
                    <tr key={boost.id} className="hover:bg-burgundy/[0.01] transition-colors">
                       <td className="px-6 py-4">
                          <p className="font-bold text-burgundy">{boost.vendor?.businessName}</p>
                          <p className="text-[10px] text-burgundy/60">{boost.vendor?.user?.email}</p>
                       </td>
                       <td className="px-6 py-4 font-semibold text-burgundy/80">
                          {boost.package?.name}
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                            boost.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                          }`}>
                            {boost.isActive ? "Live" : "Inactive"}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-burgundy/70 flex flex-col">
                          <span className="font-bold">{new Date(boost.endDate).toLocaleDateString()}</span>
                          <span className="text-[10px] text-burgundy/40">Starts {new Date(boost.startDate).toLocaleDateString()}</span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div>
                                <p className="text-[10px] font-bold text-burgundy/40 uppercase">Impressions</p>
                                <p className="font-black text-burgundy">{boost.impressions}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-burgundy/40 uppercase">Clicks</p>
                                <p className="font-black text-burgundy">{boost.clicks}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <button 
                            onClick={() => handleDeactivateBoost(boost.id)}
                            className="p-2 text-burgundy/30 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </div>

        {/* Waitlist Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-playfair font-bold text-burgundy flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C9940A]" />
            Waitlist Queue
          </h2>
          <div className="bg-white rounded-3xl border border-burgundy/5 shadow-sm p-6">
             <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#FFFDF5] rounded-2xl border border-burgundy/5 group">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-burgundy/5 flex items-center justify-center font-bold text-burgundy">
                           V
                        </div>
                        <div>
                           <p className="text-sm font-bold text-burgundy">Elite Photography</p>
                           <p className="text-[10px] text-burgundy/50">Joined Oct 12, 2024</p>
                        </div>
                     </div>
                     <button className="p-2 bg-white rounded-lg border border-burgundy/10 text-burgundy/40 group-hover:bg-[#C9940A] group-hover:text-white group-hover:border-[#C9940A] transition-all">
                        <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
                ))}
             </div>
             <div className="mt-8 pt-6 border-t border-burgundy/5">
                <div className="p-4 bg-amber-50 rounded-2xl border border-[#C9940A]/20">
                   <p className="text-xs text-amber-800 font-bold mb-1 flex items-center gap-2">
                     <Target className="w-3 h-3" />
                     Ad Optimization Tip
                   </p>
                   <p className="text-[10px] text-amber-700/80 leading-relaxed italic">
                     Homepage Hero slots usually sell out for the June/July wedding season. Consider increasing pricing for these months.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
