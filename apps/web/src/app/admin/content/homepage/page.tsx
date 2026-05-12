"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { 
  LayoutTemplate, 
  Save, 
  Undo, 
  Eye, 
  Image as ImageIcon, 
  Type, 
  Plus, 
  GripVertical 
} from "lucide-react";
import { toast } from "sonner";

export default function HomepageEditorPage() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/cms/content");
      if (res.ok) {
        const data = await res.json();
        // Filter only homepage group
        setContent(data.filter((c: any) => c.group === "homepage"));
      }
    } catch (error) {
      toast.error("Failed to load homepage content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      toast.success("Homepage updated successfully");
    } catch (error) {
      toast.error("Failed to save some changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-inter max-w-5xl">
       <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Homepage Editor</h1>
            <p className="text-burgundy/60 italic">Modify hero text, CTAs, and storytelling sections</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-2 bg-white border border-burgundy/10 rounded-full font-bold text-xs text-burgundy/60 hover:bg-burgundy/5 transition-all">
                <Eye className="w-4 h-4" />
                Live Preview
             </button>
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="flex items-center gap-2 px-8 py-2 bg-[#C9940A] text-white rounded-full font-black text-xs hover:bg-[#a57808] transition-all shadow-lg disabled:opacity-50"
             >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Publish Changes"}
             </button>
          </div>
       </div>

       <div className="space-y-12">
          {/* Section: Hero */}
          <section className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
             <div className="flex items-center gap-4 mb-8 border-b border-burgundy/5 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C9940A] flex items-center justify-center">
                   <LayoutTemplate className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-playfair font-black text-burgundy">Hero Section</h2>
             </div>
             
             <div className="grid grid-cols-1 gap-8">
                {content.filter(c => c.key.startsWith("hero_")).map((item) => (
                  <div key={item.key} className="space-y-2">
                     <div className="flex justify-between">
                        <label className="text-[10px] font-black text-burgundy/40 uppercase tracking-widest">{item.label}</label>
                        <span className="text-[10px] font-bold text-[#C9940A] bg-amber-50 px-2 py-0.5 rounded cursor-pointer">Revert</span>
                     </div>
                     {item.value.length > 50 ? (
                       <textarea 
                          value={item.value}
                          onChange={(e) => handleUpdate(item.key, e.target.value)}
                          rows={3}
                          className="w-full p-4 bg-[#FFFDF5] border border-burgundy/10 rounded-2xl text-sm font-medium outline-none focus:border-[#C9940A] resize-none"
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

          {/* Section: Legacy & Family */}
          <section className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
             <div className="flex items-center gap-4 mb-8 border-b border-burgundy/5 pb-4">
                <div className="w-10 h-10 rounded-xl bg-burgundy/5 text-burgundy flex items-center justify-center">
                   <Type className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-playfair font-black text-burgundy">Brand Story & Legacy</h2>
             </div>
             
             <div className="grid grid-cols-1 gap-8">
                {content.filter(c => c.key.startsWith("legacy_")).map((item) => (
                  <div key={item.key} className="space-y-2">
                     <label className="text-[10px] font-black text-burgundy/40 uppercase tracking-widest">{item.label}</label>
                     <textarea 
                        value={item.value}
                        onChange={(e) => handleUpdate(item.key, e.target.value)}
                        rows={item.key === 'legacy_body' ? 6 : 2}
                        className="w-full p-4 bg-[#FFFDF5] border border-burgundy/10 rounded-2xl text-sm font-medium outline-none focus:border-[#C9940A] resize-none"
                     />
                  </div>
                ))}
             </div>
          </section>

          {/* Section: Sticky Bar & CTAs */}
          <section className="bg-[#3D0C1A] p-8 rounded-[40px] text-white">
             <h2 className="text-xl font-playfair font-black mb-6">Conversion Toggles</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.filter(c => c.key.includes("_cta") || c.key.includes("sticky")).map((item) => (
                  <div key={item.key} className="space-y-2">
                     <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</label>
                     <input 
                        value={item.value}
                        onChange={(e) => handleUpdate(item.key, e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold outline-none focus:border-[#C9940A] text-white"
                     />
                  </div>
                ))}
             </div>
          </section>
       </div>
    </div>
  );
}
