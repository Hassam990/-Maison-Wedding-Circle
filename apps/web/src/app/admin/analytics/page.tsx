
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  Mail, 
  Calendar, 
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LayoutDashboard
} from "lucide-react";

async function getAnalyticsData() {
  const totalUsers = await db.user.count();
  const totalVendors = await db.vendorProfile.count();
  const totalCouples = await db.coupleProfile.count();
  const totalConsultations = await db.consultation.count();
  const totalInquiries = await db.vendorInquiry.count();
  const totalAdBoosts = await db.adBoost.count();
  const totalReviews = await db.review.count();
  
  const vendorsByCity = await db.vendorProfile.groupBy({
    by: ['city'],
    _count: true,
    orderBy: { _count: { city: 'desc' } },
  });
  
  const topVendors = await db.vendorProfile.findMany({
    take: 5,
    orderBy: { rating: 'desc' },
    include: { user: { select: { name: true } } },
  });
  
  return {
    totalUsers,
    totalVendors,
    totalCouples,
    totalConsultations,
    totalInquiries,
    totalAdBoosts,
    totalReviews,
    vendorsByCity,
    topVendors,
  };
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    redirect("/");
  }
  
  const analyticsData = await getAnalyticsData();
  
  return (
    <div className="space-y-8 font-inter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Platform Analytics</h1>
          <p className="text-burgundy/60 italic">Core performance metrics and growth indicators</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#C9940A] text-white rounded-xl font-bold text-xs hover:bg-[#a57808] transition-all">
            <Download className="w-4 h-4" />
            Full Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-burgundy/5 shadow-sm">
          <p className="text-[10px] font-bold text-burgundy/40 uppercase tracking-widest mb-1">Total Users</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-burgundy">{analyticsData.totalUsers}</h3>
            <div className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md text-emerald-600 bg-emerald-50">
              <ArrowUpRight className="w-3 h-3" />
              +12%
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-burgundy/5 shadow-sm">
          <p className="text-[10px] font-bold text-burgundy/40 uppercase tracking-widest mb-1">Total Vendors</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-burgundy">{analyticsData.totalVendors}</h3>
            <div className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md text-emerald-600 bg-emerald-50">
              <ArrowUpRight className="w-3 h-3" />
              +5%
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-burgundy/5 shadow-sm">
          <p className="text-[10px] font-bold text-burgundy/40 uppercase tracking-widest mb-1">Consultations</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-burgundy">{analyticsData.totalConsultations}</h3>
            <div className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md text-red-600 bg-red-50">
              <ArrowDownRight className="w-3 h-3" />
              -2%
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-burgundy/5 shadow-sm">
          <p className="text-[10px] font-bold text-burgundy/40 uppercase tracking-widest mb-1">Total Inquiries</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-burgundy">{analyticsData.totalInquiries}</h3>
            <div className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md text-emerald-600 bg-emerald-50">
              <ArrowUpRight className="w-3 h-3" />
              +18%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-playfair font-black text-burgundy">User Growth Overview</h3>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3D0C1A]" />
                <span className="text-burgundy/60">Couples</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#C9940A]" />
                <span className="text-burgundy/60">Vendors</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 border-b border-burgundy/10 pb-2">
            {[10, 15, 20, 25, 30, 35, 30, 25, 20, 15, 10].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5 group">
                  <div className="w-full bg-[#C9940A]/20 rounded-t-sm group-hover:bg-[#C9940A]/40 transition-colors" style={{ height: `${val * 0.4}%` }} />
                  <div className="w-full bg-[#3D0C1A] rounded-t-sm group-hover:opacity-80 transition-opacity" style={{ height: `${val * 0.6}%` }} />
                </div>
                <span className="text-[8px] font-bold text-burgundy/30 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
          <h3 className="text-lg font-playfair font-black text-burgundy mb-6">Regional Distribution</h3>
          <div className="space-y-6">
            {analyticsData.vendorsByCity.slice(0, 5).map((cityData, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-burgundy">{cityData.city || 'Unknown'}</span>
                  <span className="text-burgundy/40">{cityData._count} vendors</span>
                </div>
                <div className="h-2 w-full bg-burgundy/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9940A] rounded-full" style={{ width: `${Math.min((cityData._count / analyticsData.totalVendors) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
          <h3 className="text-lg font-playfair font-black text-burgundy mb-6">Top Performing Vendors</h3>
          <div className="bg-[#FFFDF5] rounded-3xl border border-burgundy/5 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-burgundy/5 text-[10px] font-black uppercase text-burgundy/40 border-b border-burgundy/5">
                <tr>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-burgundy/5">
                {analyticsData.topVendors.map((vendor, i) => (
                  <tr key={vendor.id} className="hover:bg-burgundy/[0.01]">
                    <td className="px-6 py-4 font-black text-burgundy">
                      {vendor.businessName || vendor.user?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#C9940A]">{vendor.rating.toFixed(1)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${vendor.verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {vendor.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
          <h3 className="text-lg font-playfair font-black text-burgundy mb-6">Platform Stats</h3>
          <div className="space-y-4">
            {[
              { label: "Total Reviews", value: analyticsData.totalReviews, color: "bg-[#3D0C1A]" },
              { label: "Ad Boosts", value: analyticsData.totalAdBoosts, color: "bg-[#5a1428]" },
              { label: "Total Couples", value: analyticsData.totalCouples, color: "bg-[#C9940A]" },
            ].map((stat, i) => (
              <div key={i} className="group relative">
                <div 
                  className={`h-14 rounded-2xl ${stat.color} flex items-center justify-between px-6 text-white overflow-hidden transition-all group-hover:scale-[1.02]`}
                  style={{ width: `${100 - (i * 10)}%` }}
                >
                  <span className="text-sm font-bold truncate pr-4">{stat.label}</span>
                  <span className="font-black text-lg">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

