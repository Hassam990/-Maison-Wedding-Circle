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
  ChevronDown,
  ChevronUp,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

const CATEGORIES = ["general", "couples", "vendors", "pricing"];

export default function FaqManagerPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<FaqItem>>({
    question: "",
    answer: "",
    category: "general",
    isActive: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/cms/faqs");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/cms/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...formData, category: activeTab}),
      });

      if (res.ok) {
        toast.success("FAQ added successfully");
        setIsAdding(false);
        setFormData({ question: "", answer: "", category: activeTab, isActive: true });
        fetchItems();
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/cms/faqs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter(i => i.id !== id));
        toast.success("Deleted successfully");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredItems = items.filter(item => item.category === activeTab);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCcw className="w-10 h-10 text-[#C9940A] animate-spin mb-4" />
        <p className="text-[#8a6200] font-medium">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">FAQ Manager</h1>
          <p className="text-[#8a6200]">Manage the questions and answers categorized by audience.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#C9940A] text-white rounded-full hover:bg-[#a57808] transition-all font-bold text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-[#fef3d6] rounded-2xl border border-[#dbb84a] w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === cat 
              ? "bg-[#3D0C1A] text-[#fde9b2] shadow-lg" 
              : "text-[#8a6200] hover:bg-[#dbb84a]/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isAdding && (
        <Card className="border-2 border-[#C9940A] bg-[#fffcf0] shadow-lg animate-in slide-in-from-top-4">
           <div className="border-b border-[#dbb84a] px-6 py-4 flex items-center justify-between bg-[#fef3d6]">
              <h2 className="text-lg font-bold text-[#3D0C1A]">New Question in <span className="uppercase">{activeTab}</span></h2>
              <button onClick={() => setIsAdding(false)} className="text-[#3D0C1A] hover:bg-[#dbb84a]/20 p-1 rounded-full"><X className="w-5 h-5"/></button>
           </div>
           <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">Question</label>
                    <input 
                      required 
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm focus:ring-2 focus:ring-[#C9940A] outline-none" 
                      value={formData.question}
                      onChange={e => setFormData({...formData, question: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8a6200] uppercase">Answer</label>
                    <textarea 
                      required
                      className="w-full p-3 border border-[#dbb84a] rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-[#C9940A] outline-none"
                      value={formData.answer}
                      onChange={e => setFormData({...formData, answer: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#dbb84a]">
                    <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-sm font-bold text-[#8a6200]">Cancel</button>
                    <button type="submit" className="px-8 py-2 bg-[#3D0C1A] text-white rounded-full font-bold text-sm shadow-md flex items-center gap-2">
                      <Check className="w-4 h-4" /> Save Question
                    </button>
                  </div>
              </form>
           </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-[#fffcf0] border-2 border-dashed border-[#dbb84a] rounded-[24px]">
            <HelpCircle className="w-12 h-12 text-[#dbb84a] mx-auto mb-4" />
            <p className="text-[#8a6200] font-medium">No FAQs in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredItems.map((item) => (
              <details key={item.id} className="group border border-[#dbb84a] bg-white rounded-2xl overflow-hidden open:ring-2 open:ring-[#C9940A] transition-all">
                <summary className="p-5 flex items-center justify-between cursor-pointer list-none bg-[#fffcf0] group-open:bg-white transition-colors hover:bg-[#fef3d6]">
                  <h3 className="text-sm font-bold text-[#3D0C1A] flex-1 pr-4">{item.question}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button 
                       onClick={(e) => { e.preventDefault(); handleDelete(item.id); }}
                       className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <ChevronDown className="w-5 h-5 text-[#C9940A] group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                <div className="p-6 pt-0 border-t border-[#dbb84a]/30">
                  <p className="text-sm text-[#5a3e00] leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
