import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Image from "next/image";
import Link from "next/link";

export default function VendorDirectory() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <div className="bg-burgundy pt-28 pb-12 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8">
           <h1 className="text-5xl mb-8 text-ivory font-bold drop-shadow-sm">Vendor Directory</h1>
           <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-md">
             <Input placeholder="Search vendors..." className="bg-white/80 backdrop-blur-sm text-foreground border-white/40 focus:border-primary font-medium shadow-sm h-12" />
             <select className="rounded-md border-none bg-white px-4 py-2 text-sm text-foreground">
                <option>Category</option>
                <option>Catering</option>
             </select>
             <select className="rounded-md border-none bg-white px-4 py-2 text-sm text-foreground">
                <option>Location</option>
                <option>Atlanta</option>
             </select>
             <Button variant="primary">Filter</Button>
           </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
           {[1,2,3,4,5,6,7,8].map((i, idx) => (
             <ScrollReveal key={i} delay={idx * 0.05}>
               <Card className="flex flex-col overflow-hidden h-full">
                   <div className="h-48 relative shrink-0">
                     <Image src={`https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80`} fill className="object-cover" alt="Vendor" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-full border-[3px] border-white bg-white overflow-hidden shadow-md">
                        <Image src={`https://i.pravatar.cc/150?img=${i+20}`} fill className="object-cover" alt="Logo" />
                     </div>
                   </div>
                   <CardContent className="pt-10 p-6 flex flex-col flex-1 bg-white/40">
                     <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 shadow-sm">Decor & Design</span>
                       <span className="text-primary font-bold text-xs bg-white/90 px-2 py-1 rounded-md shadow-sm border border-white/50">★ 4.9</span>
                     </div>
                     <h3 className="text-xl font-bold text-burgundy mb-1 leading-snug">Dream Decor Atlanta</h3>
                     <p className="text-xs font-semibold text-foreground/60 mb-3">Atlanta, GA</p>
                     <p className="text-sm font-medium text-foreground/80 line-clamp-2 mb-5">Creating magical and timeless sets for your most memorable celebration.</p>
                     <div className="mt-auto">
                        <Link href={`/vendors/${i}`} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">View Profile <span>&rarr;</span></Link>
                     </div>
                   </CardContent>
               </Card>
             </ScrollReveal>
           ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </div>
  );
}
