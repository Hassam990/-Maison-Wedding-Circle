import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";

export default function VendorProfile() {
  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      {/* HEADER SECTION */}
      <div className="relative w-full h-[40vh] min-h-[300px]">
        <Image src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80" alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative -mt-24 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
           
           {/* MAIN CONTENT */}
           <div className="flex-1 space-y-8">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/20 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md relative overflow-hidden shrink-0">
                  <Image src="https://i.pravatar.cc/300?img=12" fill className="object-cover" alt="Logo" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">Photography</span>
                    <span className="text-yellow-500 font-bold text-sm">★ 4.9 (124 Reviews)</span>
                  </div>
                  <h1 className="font-serif text-4xl font-bold text-burgundy flex items-center gap-2">
                    Reverie Photography
                    <span className="text-primary text-xl" title="Verified vendor">✔</span>
                  </h1>
                  <p className="text-foreground/70 mt-1">Atlanta, GA</p>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <Button variant="outline">♡ Save to My List</Button>
                </div>
             </div>

             {/* ABOUT */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/20">
               <h3 className="font-serif text-2xl text-burgundy font-semibold mb-4">About the Vendor</h3>
               <p className="text-foreground/80 leading-relaxed">
                 We are a fine art wedding photography studio based in Atlanta, with a passion for South Asian celebrations. Our approach blends editorial elegance with photojournalistic authenticity, capturing the essence of your rich traditions, vibrant colors, and unscripted emotions.
               </p>
             </div>

             {/* GALLERY */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/20">
               <h3 className="font-serif text-2xl text-burgundy font-semibold mb-4">Gallery</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="aspect-square relative rounded-lg overflow-hidden border border-primary/10">
                     <Image src={`https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&sig=${i}`} fill className="object-cover hover:scale-105 transition-transform" alt="Gallery image" />
                   </div>
                 ))}
               </div>
             </div>

             {/* SERVICES & PRICING */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/20">
               <h3 className="font-serif text-2xl text-burgundy font-semibold mb-4">Services & Pricing</h3>
               <div className="divide-y divide-primary/10">
                 <div className="py-4 flex justify-between items-center">
                   <div>
                     <h4 className="font-semibold text-burgundy">Engagement Session</h4>
                     <p className="text-sm text-foreground/70">2 hours, multiple locations, 100+ edited photos</p>
                   </div>
                   <span className="font-semibold text-primary">From $500</span>
                 </div>
                 <div className="py-4 flex justify-between items-center">
                   <div>
                     <h4 className="font-semibold text-burgundy">Wedding Day Coverage (8 Hours)</h4>
                     <p className="text-sm text-foreground/70">Single photographer, online gallery, print release</p>
                   </div>
                   <span className="font-semibold text-primary">From $3,200</span>
                 </div>
                 <div className="py-4 flex justify-between items-center">
                   <div>
                     <h4 className="font-semibold text-burgundy">Multi-Day Destination Wedding</h4>
                     <p className="text-sm text-foreground/70">3-day coverage (Mehndi, Sangeet, Wedding, Reception)</p>
                   </div>
                   <span className="font-semibold text-primary">Custom Quote</span>
                 </div>
               </div>
             </div>
           </div>

           {/* SIDEBAR */}
           <div className="w-full lg:w-96 space-y-6">
             <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-sm border border-primary/20">
               <h3 className="font-serif text-2xl text-burgundy font-semibold mb-2">Message Vendor</h3>
               <p className="text-sm text-foreground/70 mb-6">Contact Reverie Photography directly for availability and custom quotes.</p>
               
               <form className="space-y-4">
                 <div>
                   <label className="text-xs font-semibold mb-1 block text-burgundy">Your Name</label>
                   <Input placeholder="John & Jane" />
                 </div>
                 <div>
                   <label className="text-xs font-semibold mb-1 block text-burgundy">Email</label>
                   <Input type="email" placeholder="john@example.com" />
                 </div>
                 <div>
                   <label className="text-xs font-semibold mb-1 block text-burgundy">Event Date (Optional)</label>
                   <Input type="date" />
                 </div>
                 <div>
                   <label className="text-xs font-semibold mb-1 block text-burgundy">Message</label>
                   <textarea 
                      className="flex min-h-[100px] w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Hi, we love your work and are planning a wedding for next summer..."
                   ></textarea>
                 </div>
                 <Button className="w-full" variant="primary">Send Message</Button>
               </form>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
