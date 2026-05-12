"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  Search, 
  Calendar, 
  User, 
  Tag, 
  CheckCircle,
  X,
  Save,
  Bold,
  Italic,
  List,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

export default function BlogManagerPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    // In a real app: fetch("/api/admin/blog")
    const mockPosts = [
      { id: 1, title: "10 Things Every South Asian Couple Should Do 12 Months Before Their Wedding", author: "Admin", date: "Oct 12, 2024", status: "Published", tags: ["Planning", "Tips"] },
      { id: 2, title: "How to Choose the Right Caterer for a Pakistani Wedding", author: "Admin", date: "Oct 15, 2024", status: "Draft", tags: ["Catering", "Food"] },
    ];
    setPosts(mockPosts);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8 font-inter">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Wedding Journal Manager</h1>
          <p className="text-burgundy/60 italic">Manage educational content and company announcements</p>
        </div>
        <button 
          onClick={() => { setSelectedPost(null); setIsEditing(true); }}
          className="flex items-center gap-2 px-6 py-2 bg-[#C9940A] text-white rounded-full font-black text-sm hover:bg-[#a57808] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Write New Article
        </button>
      </div>

      {!isEditing ? (
        <div className="bg-white rounded-[40px] border border-burgundy/5 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-burgundy/5 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy/30" />
                 <input 
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-2 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm outline-none"
                 />
              </div>
           </div>
           <div className="divide-y divide-burgundy/5">
              {posts.map(post => (
                <div key={post.id} className="p-8 flex items-center justify-between hover:bg-burgundy/[0.01] transition-colors group">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-burgundy/5 flex items-center justify-center font-black text-burgundy text-xl">
                         <FileText size={24} />
                      </div>
                      <div>
                         <h4 className="text-lg font-black text-burgundy group-hover:text-[#C9940A] transition-colors">
                            {post.title}
                         </h4>
                         <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-burgundy/40 uppercase">
                               <User size={12} /> {post.author}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-burgundy/40 uppercase">
                               <Calendar size={12} /> {post.date}
                            </span>
                            <div className="flex gap-2">
                               {post.tags.map((t: string) => <span key={t} className="text-[10px] font-black text-[#C9940A] bg-amber-50 px-2 py-0.5 rounded uppercase">{t}</span>)}
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        post.status === "Published" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-burgundy/5 text-burgundy/40"
                      }`}>{post.status}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setSelectedPost(post); setIsEditing(true); }} className="p-2 text-burgundy/30 hover:text-burgundy transition-colors"><Edit2 className="w-4 h-4" /></button>
                         <button className="p-2 text-burgundy/30 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-burgundy/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
           <div className="p-6 bg-[#3D0C1A] text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                 <h2 className="text-xl font-playfair font-black">{selectedPost ? "Edit Article" : "Compose New Article"}</h2>
              </div>
              <div className="flex gap-3">
                 <button className="flex items-center gap-2 px-6 py-2 bg-white/10 text-white rounded-full font-bold text-xs hover:bg-white/20 transition-all border border-white/10">
                    <Eye className="w-4 h-4" /> Save Draft
                 </button>
                 <button onClick={() => { toast.success("Article Published!"); setIsEditing(false); }} className="flex items-center gap-2 px-8 py-2 bg-[#C9940A] text-white rounded-full font-black text-xs hover:bg-[#a57808] transition-all shadow-lg active:scale-95">
                    <CheckCircle className="w-4 h-4" /> Publish to Blog
                 </button>
              </div>
           </div>
           
           <div className="p-12 space-y-8 max-w-4xl mx-auto">
              <input 
                 placeholder="Enter a compelling title..."
                 defaultValue={selectedPost?.title || ""}
                 className="w-full text-4xl font-playfair font-black text-burgundy outline-none placeholder:text-burgundy/10 border-b border-burgundy/5 pb-6"
              />
              
              <div className="flex gap-6">
                 <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black text-[#8a6200] uppercase tracking-widest">Main Excerpt</label>
                    <textarea 
                       rows={2}
                       placeholder="A brief summary for the blog card..."
                       className="w-full p-4 bg-[#FFFDF5] border border-burgundy/5 rounded-2xl text-sm italic outline-none focus:border-[#C9940A] resize-none"
                    />
                 </div>
                 <div className="w-64 space-y-1">
                    <label className="text-[10px] font-black text-[#8a6200] uppercase tracking-widest">Tags (comma separated)</label>
                    <input 
                       placeholder="e.g. Planning, Tips"
                       className="w-full p-4 bg-[#FFFDF5] border border-burgundy/5 rounded-xl text-xs font-bold outline-none focus:border-[#C9940A]"
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2 p-2 bg-burgundy/5 rounded-xl border border-burgundy/5 w-fit">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors"><Bold size={16} /></button>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors"><Italic size={16} /></button>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors"><List size={16} /></button>
                    <div className="w-[1px] h-6 bg-burgundy/10 mx-1" />
                    <button className="p-2 hover:bg-white rounded-lg transition-colors"><ImageIcon size={16} /></button>
                 </div>
                 <textarea 
                    rows={15}
                    placeholder="Start your story here..."
                    className="w-full p-8 bg-[#FFFDF5] border border-burgundy/10 rounded-[32px] text-lg font-medium outline-none focus:border-[#C9940A] leading-relaxed"
                 />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
