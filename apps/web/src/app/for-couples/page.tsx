import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function ForCouplesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <section className="bg-burgundy text-ivory pt-32 pb-24 shadow-lg">
        <ScrollReveal className="container mx-auto px-4 lg:px-8 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-ivory drop-shadow-md">Find Your Vibe. Build Your Team.</h1>
          <p className="text-lg text-ivory/80 mb-12 font-medium">Search our curated network of top South Asian wedding professionals.</p>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col md:flex-row gap-4 max-w-3xl mx-auto shadow-2xl border border-white/20">
            <Input placeholder="City or State" className="flex-1 bg-white/80 backdrop-blur-md text-foreground border-white/40 h-14" />
            <select className="flex-1 rounded-xl border border-white/40 bg-white/80 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-14 font-medium backdrop-blur-md">
               <option>All Categories</option>
               <option>Catering</option>
               <option>Decor</option>
               <option>Photography</option>
            </select>
            <Button variant="primary" className="px-8 h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Search</Button>
          </div>
        </ScrollReveal>
      </section>

      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-4 lg:px-8">
           <ScrollReveal className="flex justify-between items-end mb-12">
             <div>
               <span className="text-sm uppercase tracking-widest text-primary font-bold block mb-2">Editor&apos;s Picks</span>
               <h2 className="text-4xl text-burgundy font-bold">Featured Vendors</h2>
             </div>
             <Link href="/vendors" className="text-primary hover:underline font-bold">View All &rarr;</Link>
           </ScrollReveal>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1,2,3].map((i, idx) => (
               <ScrollReveal key={i} delay={idx * 0.1}>
                 <Card className="overflow-hidden bg-white/40 border border-white/50 backdrop-blur-xl hover:-translate-y-2 hover:shadow-[0_16px_48px_0_rgba(201,148,10,0.15)] transition-all duration-500 flex flex-col h-full">
                   <div className="h-56 relative shrink-0">
                     <Image src={`https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80`} fill className="object-cover" alt="Vendor" />
                   </div>
                   <CardContent className="p-6 flex flex-col flex-1">
                     <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 shadow-sm">Catering</span>
                       <span className="text-primary font-bold text-xs bg-white/90 px-2 py-1 rounded-md shadow-sm border border-white/50">★ 5.0</span>
                     </div>
                     <h3 className="text-2xl font-bold text-burgundy mb-2">Taj Authentic Catering</h3>
                     <p className="text-xs font-semibold text-foreground/60 mb-6">Atlanta, GA</p>
                     <div className="mt-auto">
                       <Button variant="outline" className="w-full h-12 shadow-sm font-bold bg-white/60 hover:bg-white/90">View Profile</Button>
                     </div>
                   </CardContent>
                 </Card>
               </ScrollReveal>
             ))}
           </div>
        </div>
      </section>

      <section className="bg-primary/10 py-24 backdrop-blur-md border-t border-primary/20">
        <ScrollReveal className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
          <h2 className="text-4xl text-burgundy font-bold mb-6">Free Wedding Checklist</h2>
          <p className="text-foreground/80 mb-8 font-medium">Download our comprehensive South Asian wedding timeline and checklist.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Input placeholder="Email Address" className="w-full sm:max-w-xs bg-white/80 h-14 backdrop-blur-md border-white/50 shadow-sm" />
            <Button variant="primary" className="h-14 px-8 font-bold shadow-lg hover:-translate-y-1 transition-transform w-full sm:w-auto">Get Checklist</Button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
