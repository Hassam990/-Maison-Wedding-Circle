"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { 
  BarChart, 
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data for the demonstration as per v3 requirements
  const stats = [
    { label: "Total Signups", value: "248", growth: "+12%", up: true },
    { label: "New Vendors", value: "42", growth: "+5%", up: true },
    { label: "Consultation Conv.", value: "68%", growth: "-2%", up: false },
    { label: "Total Ads Revenue", value: "$4,290", growth: "+18%", up: true },
  ];

  const cityData = [
    { name: "Atlanta, GA", count: 85, percentage: 34 },
    { name: "New York, NY", count: 62, percentage: 25 },
    { name: "Dallas, TX", count: 45, percentage: 18 },
    { name: "Houston, TX", count: 32, percentage: 13 },
    { name: "Others", count: 24, percentage: 10 },
  ];

  const topVendors = [
    { name: "Noor Studios", views: "2,450", leads: 43 },
    { name: "Dream Decor Atlanta", views: "1,920", leads: 38 },
    { name: "Bushra's Kitchen", views: "1,850", leads: 35 },
    { name: "Moments by Maha", views: "1,420", leads: 22 },
  ];

  return (
    <div className="space-y-8 font-inter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Platform Analytics</h1>
          <p className="text-burgundy/60 italic">Core performance metrics and growth indicators</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-white border border-burgundy/10 rounded-xl p-1 shadow-sm">
              {["7d", "30d", "90d", "1y"].map(range => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === range ? "bg-[#3D0C1A] text-white" : "text-burgundy/60 hover:bg-burgundy/5"
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-[#C9940A] text-white rounded-xl font-bold text-xs hover:bg-[#a57808] transition-all">
              <Download className="w-4 h-4" />
              Full Report
           </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-burgundy/5 shadow-sm">
             <p className="text-[10px] font-bold text-burgundy/40 uppercase tracking-widest mb-1">{stat.label}</p>
             <div className="flex items-end justify-between">
                <h3 className="text-2xl font-black text-burgundy">{stat.value}</h3>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md ${
                   stat.up ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                }`}>
                   {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                   {stat.growth}
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Signups Growth Chart Placeholder */}
         <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-playfair font-black text-burgundy">New Member Acquisition</h3>
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
            
            {/* Visual Bar Chart Mockup */}
            <div className="h-64 flex items-end justify-between gap-4 border-b border-burgundy/10 pb-2">
               {[40, 65, 35, 80, 55, 90, 70, 85, 45, 100, 75, 95].map((val, i) => (
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

         {/* Distribution by City */}
         <div className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
            <h3 className="text-lg font-playfair font-black text-burgundy mb-6">Regional Distribution</h3>
            <div className="space-y-6">
               {cityData.map((city, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-burgundy">{city.name}</span>
                       <span className="text-burgundy/40">{city.count} users</span>
                    </div>
                    <div className="h-2 w-full bg-burgundy/5 rounded-full overflow-hidden">
                       <div className="h-full bg-[#C9940A] rounded-full" style={{ width: `${city.percentage}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Vendors */}
         <div className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
            <h3 className="text-lg font-playfair font-black text-burgundy mb-6">Top Performing Profiles</h3>
            <div className="bg-[#FFFDF5] rounded-3xl border border-burgundy/5 overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-burgundy/5 text-[10px] font-black uppercase text-burgundy/40 border-b border-burgundy/5">
                     <tr>
                        <th className="px-6 py-4">Vendor</th>
                        <th className="px-6 py-4">Total Views</th>
                        <th className="px-6 py-4">Leads</th>
                        <th className="px-6 py-4">Conv.</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-burgundy/5">
                     {topVendors.map((v, i) => (
                       <tr key={i} className="hover:bg-burgundy/[0.01]">
                          <td className="px-6 py-4 font-black text-burgundy">{v.name}</td>
                          <td className="px-6 py-4 font-bold text-[#C9940A]">{v.views}</td>
                          <td className="px-6 py-4 font-bold text-burgundy/80">{v.leads}</td>
                          <td className="px-6 py-4">
                             <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase">
                                +{Math.floor(Math.random() * 5 + 12)}%
                             </span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Consultation Funnel */}
         <div className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
            <h3 className="text-lg font-playfair font-black text-burgundy mb-6">Consultation Pipeline Funnel</h3>
            <div className="space-y-4">
               {[
                 { label: "Submitted Intake", val: "100%", count: 124, color: "bg-[#3D0C1A]" },
                 { label: "Introductory Call", val: "82%", count: 102, color: "bg-[#5a1428]" },
                 { label: "Matched with Vendors", val: "64%", count: 79, color: "bg-[#C9940A]" },
                 { label: "Confirmed Bookings", val: "28%", count: 35, color: "bg-[#a57808]" },
               ].map((step, i) => (
                 <div key={i} className="group relative">
                    <div 
                       className={`h-14 rounded-2xl ${step.color} flex items-center justify-between px-6 text-white overflow-hidden transition-all group-hover:scale-[1.02]`}
                       style={{ width: `${100 - (i * 10)}%` }}
                    >
                       <span className="text-sm font-bold truncate pr-4">{step.label}</span>
                       <span className="font-black text-lg">{step.count}</span>
                    </div>
                    {i < 3 && (
                       <div className="w-full flex justify-center py-1 opacity-20">
                          <Download className="w-3 h-3 rotate-180" />
                       </div>
                    )}
                 </div>
               ))}
            </div>
            <p className="mt-8 text-xs text-burgundy/40 italic font-medium leading-relaxed">
               * Conversion from Match to Booking has increased by 4% since enabling the direct message feature.
            </p>
         </div>
      </div>
    </div>
  );
}
