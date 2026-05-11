"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Star, 
  Check, 
  X, 
  RefreshCcw, 
  MoveVertical,
  MessageSquareQuote
} from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  eventType: string;
  quote: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
}

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: "",
    location: "",
    eventType: "",
    quote: "",
    rating: 5,
    isActive: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/cms/testimonials");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId 
      ? `/api/cms/testimonials/${editingId}` 
      : "/api/cms/testimonials";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Testimonial ${editingId ? "updated" : "added"} successfully`);
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: "", location: "", eventType: "", quote: "", rating: 5, isActive: true });
        fetchItems();
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/cms/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        setItems(items.filter(i => i.id !== id));
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (item: Testimonial) => {
    try {
      const res = await fetch(`/api/cms/testimonials/${item.id}`, {
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
        <p className="text-[#8a6200] font-medium">Loading Testimonials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Testimonials Manager</h1>
          <p className="text-[#8a6200]">Manage customer stories and quotes shown on the site.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#C9940A] text-white rounded-full hover:bg-[#a57808] transition-all font-bold text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {isAdding && (
         <Card className="border-2 border-[#C9940A] bg-[#fffcf0] shadow-lg animate-in fade-in slide-in-from-top-4">
           <div className="border-b border-[#dbb84a] px-6 py-4 flex items-center justify-between bg-[#fef3d6]">
              <h2 className="text-lg font-bold text-[#3D0C1A]">New Testimonial</h2>
              <button onClick={() => setIsAdding(false)} className="text-[#3D0C1A] hover:bg-[#dbb84a]/20 p-1 rounded-full"><X className="w-5 h-5"/></button>
           </div>
           <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">Client Name</label>
                    <input 
                      required 
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm focus:ring-2 focus:ring-[#C9940A] outline-none" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">Location</label>
                    <input 
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm focus:ring-2 focus:ring-[#C9940A] outline-none" 
                      placeholder="e.g. Atlanta, GA"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">Event Type</label>
                    <input 
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm focus:ring-2 focus:ring-[#C9940A] outline-none" 
                      placeholder="e.g. Wedding Reception"
                      value={formData.eventType}
                      onChange={e => setFormData({...formData, eventType: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">Rating (1-5)</label>
                    <select 
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm focus:ring-2 focus:ring-[#C9940A] outline-none"
                      value={formData.rating}
                      onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                    >
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">The Quote</label>
                    <textarea 
                      required
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-[#C9940A] outline-none"
                      value={formData.quote}
                      onChange={e => setFormData({...formData, quote: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-[#dbb84a]">
                    <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-sm font-bold text-[#8a6200]">Cancel</button>
                    <button type="submit" className="px-8 py-2 bg-[#3D0C1A] text-white rounded-full font-bold text-sm shadow-md flex items-center gap-2">
                      <Check className="w-4 h-4" /> Save Testimonial
                    </button>
                  </div>
              </form>
           </CardContent>
         </Card>
      )}

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="p-12 text-center bg-[#fffcf0] border-2 border-dashed border-[#dbb84a] rounded-[24px]">
            <MessageSquareQuote className="w-12 h-12 text-[#dbb84a] mx-auto mb-4" />
            <p className="text-[#8a6200] font-medium">No testimonials found. Add your first one above!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id} className={`group border border-[#dbb84a] transition-all hover:border-[#C9940A] ${!item.isActive ? 'opacity-60 bg-gray-50' : 'bg-white shadow-sm'}`}>
                <CardContent className="p-0">
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-[#C9940A] text-[#C9940A]' : 'text-gray-200 fill-gray-200'}`} />
                            ))}
                         </div>
                         <div className="flex items-center gap-1">
                           <button 
                            onClick={() => toggleStatus(item)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                           >
                             {item.isActive ? 'Active' : 'Inactive'}
                           </button>
                         </div>
                      </div>
                      
                      <p className="text-[#3D0C1A] font-inter italic leading-relaxed">"{item.quote}"</p>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fef3d6] flex items-center justify-center font-bold text-[#C9940A] text-sm">
                          {item.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#3D0C1A]">{item.name}</p>
                          <p className="text-[11px] text-[#8a6200]">{item.eventType} · {item.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-[#dbb84a] pt-4 md:pt-0 md:pl-4">
                      <button className="p-2 text-[#8a6200] hover:bg-[#fef3d6] rounded-xl transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#dbb84a] cursor-grab active:cursor-grabbing hover:bg-gray-50 rounded-xl transition-colors">
                        <MoveVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
