"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  RefreshCcw, 
  Tags,
  LayoutGrid,
  MoveVertical
} from "lucide-react";
import { toast } from "sonner";

interface VendorCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function CategoriesManagerPage() {
  const [items, setItems] = useState<VendorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<VendorCategory>>({
    name: "",
    slug: "",
    icon: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData(prev => ({...prev, slug: prev.name?.toLowerCase().replace(/\s+/g, '-')}));
    }
  }, [formData.name]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/cms/categories");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/cms/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Category added successfully");
        setIsAdding(false);
        setFormData({ name: "", slug: "", icon: "", description: "", isActive: true });
        fetchItems();
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const toggleStatus = async (item: VendorCategory) => {
    try {
      const res = await fetch(`/api/cms/categories/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        setItems(items.map(i => i.id === item.id ? { ...i, isActive: !item.isActive } : i));
        toast.success("Status updated");
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCcw className="w-10 h-10 text-[#C9940A] animate-spin mb-4" />
        <p className="text-[#8a6200] font-medium">Loading Categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Vendor Categories</h1>
          <p className="text-[#8a6200]">Create and manage the business categories available in the directory.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#C9940A] text-white rounded-full hover:bg-[#a57808] transition-all font-bold text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {isAdding && (
        <Card className="border-2 border-[#C9940A] bg-[#fffcf0] shadow-xl animate-in slide-in-from-top-4">
           <div className="border-b border-[#dbb84a] px-6 py-4 flex items-center justify-between bg-[#fef3d6]">
              <h2 className="text-lg font-bold text-[#3D0C1A]">New Category</h2>
              <button onClick={() => setIsAdding(false)} className="text-[#3D0C1A] hover:bg-[#dbb84a]/20 p-1 rounded-full"><X className="w-5 h-5"/></button>
           </div>
           <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">Category Name</label>
                    <input 
                      required 
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm focus:ring-2 focus:ring-[#C9940A] outline-none" 
                      placeholder="e.g. Catering"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">URL Slug</label>
                    <input 
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm focus:ring-2 focus:ring-[#C9940A] outline-none bg-white font-mono" 
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">Icon (Emoji or SVG)</label>
                    <input 
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm focus:ring-2 focus:ring-[#C9940A] outline-none" 
                      placeholder="Ã°Å¸ÂÂ½Ã¯Â¸Â"
                      value={formData.icon || ""}
                      onChange={e => setFormData({...formData, icon: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">Description</label>
                    <input 
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm focus:ring-2 focus:ring-[#C9940A] outline-none" 
                      placeholder="Brief description for directory"
                      value={formData.description || ""}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-[#dbb84a]">
                    <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-sm font-bold text-[#8a6200]">Cancel</button>
                    <button type="submit" className="px-8 py-2 bg-[#3D0C1A] text-white rounded-full font-bold text-sm shadow-md flex items-center gap-2">
                      <Check className="w-4 h-4" /> Save Category
                    </button>
                  </div>
              </form>
           </CardContent>
        </Card>
      )}

      <div className="bg-white border border-[#dbb84a] rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#fffcf0] border-b border-[#dbb84a]">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#8a6200]">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#8a6200]">Slug</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#8a6200]">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#8a6200]">Order</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dbb84a]/30">
            {items.length === 0 ? (
               <tr>
                 <td colSpan={5} className="px-6 py-20 text-center">
                    <Tags className="w-10 h-10 text-[#dbb84a] mx-auto mb-3" />
                    <p className="text-[#8a6200] font-medium">No categories created yet.</p>
                 </td>
               </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="group hover:bg-[#fffdf5] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon || "Ã°Å¸ÂÂ·Ã¯Â¸Â"}</span>
                      <div>
                        <p className="text-sm font-bold text-[#3D0C1A]">{item.name}</p>
                        <p className="text-xs text-[#8a6200]">{item.description || "No description provided."}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#8a6200]">/{item.slug}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(item)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-bold text-[#3D0C1A]">{item.sortOrder}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-[#8a6200] hover:bg-[#fef3d6] rounded-xl transition-colors"><Edit2 className="w-4 h-4" /></button>
                       <button className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                       <div className="p-2 text-[#dbb84a] cursor-grab"><MoveVertical className="w-4 h-4" /></div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
