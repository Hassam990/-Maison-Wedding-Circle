"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { 
  Settings, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  Save,
  Search
} from "lucide-react";
import { toast } from "sonner";

export default function SiteSettingsPage() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/cms/content");
        if (res.ok) {
          const data = await res.json();
          // Filter groups: contact, seo, footer, social
          setContent(data.filter((c: any) => ["contact", "seo", "footer", "social", "settings"].includes(c.group)));
        }
      } catch (error) {}
      setLoading(false);
    };
    fetchContent();
  }, []);

  const handleUpdate = (key: string, value: string) => {
    setContent(prev => prev.map(c => c.key === key ? { ...c, value } : c));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const promises = content.map(item => 
        fetch(`/api/cms/content/${item.key}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: item.value })
        })
      );
      await Promise.all(promises);
      toast.success("Global settings updated");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-inter max-w-5xl">
       <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Global Settings</h1>
            <p className="text-burgundy/60 italic">Manage organization info, SEO tags, and system states</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-2 bg-[#3D0C1A] text-white rounded-full font-black text-xs hover:opacity-90 transition-all shadow-lg"
          >
             <Save className="w-4 h-4" />
             {isSaving ? "Saving..." : "Save All Configuration"}
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <section className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm space-y-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFFDF5] text-[#C9940A] flex items-center justify-center border border-[#C9940A]/10">
                   <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-playfair font-black text-burgundy">Contact & Location</h2>
             </div>
             
             <div className="space-y-4">
                {content.filter(c => c.group === "contact").map(item => (
                  <div key={item.key} className="space-y-1">
                     <label className="text-[10px] font-black text-burgundy/30 uppercase tracking-widest">{item.label}</label>
                     <input 
                        value={item.value}
                        onChange={(e) => handleUpdate(item.key, e.target.value)}
                        className="w-full p-3 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm font-bold text-burgundy outline-none focus:border-[#C9940A]"
                     />
                  </div>
                ))}
             </div>
          </section>

          {/* Social Links */}
          <section className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm space-y-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFFDF5] text-blue-600 flex items-center justify-center border border-blue-100">
                   <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-playfair font-black text-burgundy">Social Media Handles</h2>
             </div>
             
             <div className="space-y-4">
                {["Instagram", "Facebook", "Twitter", "LinkedIn"].map(label => (
                  <div key={label} className="flex gap-4 items-center">
                     <div className="w-8 h-8 rounded-lg bg-burgundy/5 flex items-center justify-center text-burgundy/30">
                        <Globe size={16} />
                     </div>
                     <div className="flex-1 space-y-1">
                        <input 
                           placeholder={`@${label.toLowerCase()}_handle`}
                           className="w-full p-3 bg-[#FFFDF5] border border-burgundy/5 rounded-xl text-sm outline-none"
                        />
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* SEO Metadata */}
          <section className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm space-y-6 lg:col-span-2">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFFDF5] text-emerald-600 flex items-center justify-center border border-emerald-100">
                   <Search className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-playfair font-black text-burgundy">SEO & Header Metadata</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.filter(c => c.group === "seo").map(item => (
                  <div key={item.key} className="space-y-1">
                     <label className="text-[10px] font-black text-burgundy/30 uppercase tracking-widest">{item.label}</label>
                     {item.key.includes("description") ? (
                       <textarea 
                          value={item.value}
                          onChange={(e) => handleUpdate(item.key, e.target.value)}
                          rows={4}
                          className="w-full p-4 bg-[#FFFDF5] border border-burgundy/10 rounded-2xl text-xs font-medium outline-none focus:border-[#C9940A] resize-none"
                       />
                     ) : (
                       <input 
                          value={item.value}
                          onChange={(e) => handleUpdate(item.key, e.target.value)}
                          className="w-full p-4 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm font-black text-burgundy outline-none focus:border-[#C9940A]"
                       />
                     )}
                  </div>
                ))}
             </div>
          </section>

          {/* System & Maintenance */}
          <section className="bg-[#3D0C1A] p-8 rounded-[40px] text-white lg:col-span-2">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-6 h-6 text-[#C9940A]" />
                   <h2 className="text-xl font-playfair font-black">System Controls</h2>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase text-white/40">Status:</span>
                   <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-black tracking-widest">PRODUCTION LIVE</span>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                   <div>
                      <h4 className="text-sm font-black mb-1">Maintenance Mode</h4>
                      <p className="text-[10px] text-white/50 leading-relaxed font-medium">Bridges the entire site to a 'Coming Soon' placeholder.</p>
                   </div>
                   <button className="w-full py-2 bg-red-500/20 text-red-200 border border-red-500/30 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/40 transition-all">
                      Enable Now
                   </button>
                </div>
                
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                   <div>
                      <h4 className="text-sm font-black mb-1">Public Registration</h4>
                      <p className="text-[10px] text-white/50 leading-relaxed font-medium">Toggle waitlist-only or open signup for vendors.</p>
                   </div>
                   <button className="w-full py-2 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase">
                      Currently Open
                   </button>
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                   <div>
                      <h4 className="text-sm font-black mb-1">API Cache Clear</h4>
                      <p className="text-[10px] text-white/50 leading-relaxed font-medium">Force refresh project-wide content cache.</p>
                   </div>
                   <button className="w-full py-2 bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded-xl text-[10px] font-black uppercase hover:bg-amber-500/40 transition-all">
                      Purge Cache
                   </button>
                </div>
             </div>
          </section>
       </div>
    </div>
  );
}
