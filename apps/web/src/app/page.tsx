import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80"
            alt="South Asian Wedding Backdrop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-ivory/60 backdrop-blur-[4px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/70 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <ScrollReveal delay={0.1} className="flex-1 text-center lg:text-left space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold text-burgundy tracking-tight leading-tight drop-shadow-md">
              Your Wedding.<br />
              The Right People.<br />
              <span className="text-primary">Zero Stress.</span>
            </h1>
            <p className="text-lg text-foreground max-w-xl mx-auto lg:mx-0 font-medium">
              A trusted wedding network for the South Asian community in the US. We connect you with verified, experienced vendors and personally guide you through the planning process.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Button variant="primary" className="h-12 px-8 text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/30">Book a Consultation</Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-8">
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="h-10 w-10 rounded-full bg-white/40 backdrop-blur-md border border-white flex items-center justify-center overflow-hidden shadow-sm">
                     <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" width={40} height={40}/>
                   </div>
                 ))}
               </div>
               <div className="flex flex-col">
                 <div className="flex text-primary">★★★★★</div>
                 <span className="text-sm font-bold text-burgundy flex items-center gap-1">
                    Trusted by <span className="text-primary text-xl mx-0.5"><SlidingNumber number={500} />+</span> South Asian Families
                 </span>
               </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3} className="w-full max-w-md hidden lg:block">
            <Card>
              <CardHeader className="text-center pb-4">
                 <span className="text-xs uppercase tracking-widest text-primary font-bold mb-1">For Vendors</span>
                 <CardTitle className="text-3xl text-burgundy">Join Our Network</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-foreground/80 text-center mb-6 font-medium">
                  Get high-quality leads. No commissions taken.
                </p>
                <ul className="space-y-4 mb-8">
                  {['Caterers', 'Decorators', 'Photographers', 'Makeup Artists', 'DJs & Entertainment'].map(cat => (
                    <li key={cat} className="flex items-center gap-3 text-sm font-semibold text-burgundy">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs">✓</span> {cat}
                    </li>
                  ))}
                </ul>
                <Button variant="primary" className="w-full text-md h-12 shadow-md shadow-primary/20 hover:scale-105 transition-transform">Apply to Join</Button>
              </CardContent>
            </Card>
          </ScrollReveal>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-transparent">
        <ScrollReveal className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-sm uppercase tracking-widest text-primary font-bold mb-2 block">How It Works</span>
          <h2 className="text-4xl text-burgundy font-bold mb-16">Simple, Guided, Stress-Free</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="absolute top-12 left-[16%] right-[16%] h-px bg-primary/30 hidden md:block border-dashed border-t" />
             
             {[
               { icon: "📋", num: "1", title: "Tell Us Your Vision", desc: "Share your needs, style & budget through our simple intake form." },
               { icon: "🤝", num: "2", title: "Get Matched", desc: "We connect you with trusted, pre-vetted vendors from our exclusive network." },
               { icon: "💍", num: "3", title: "We Coordinate", desc: "You select your team, we guide you. You enjoy your perfect day." },
             ].map((step, idx) => (
               <ScrollReveal delay={0.2 * idx} key={step.num} className="relative flex flex-col items-center">
                 <div className="w-24 h-24 rounded-full bg-white/50 backdrop-blur-md border border-white flex items-center justify-center mb-6 relative z-10 shadow-lg hover:scale-110 transition-all duration-300">
                   <span className="text-3xl">{step.icon}</span>
                   <div className="absolute -bottom-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">{step.num}</div>
                 </div>
                 <h3 className="text-xl font-bold mb-2 text-burgundy">{step.title}</h3>
                 <p className="text-sm text-foreground/80 font-medium max-w-xs">{step.desc}</p>
               </ScrollReveal>
             ))}
          </div>
        </ScrollReveal>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-transparent text-center">
         <ScrollReveal className="container mx-auto px-4 lg:px-8">
           <span className="text-sm uppercase tracking-widest text-primary font-bold mb-2 block">Why Choose Maison Wedding circle?</span>
           <h2 className="text-4xl text-burgundy font-bold mb-16">Not a Directory. A Guided Wedding Network.</h2>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Real Experience", desc: "Decades of hands-on wedding knowledge", icon: "🌟" },
                { title: "Trusted Vendors", desc: "Personally known & verified suppliers", icon: "🛡️" },
                { title: "Personal Guidance", desc: "One-on-one support from start to finish", icon: "👩‍💼" },
                { title: "Zero Stress", desc: "We connect & coordinate — you enjoy", icon: "✨" }
              ].map((item, idx) => (
                <ScrollReveal delay={0.1 * idx} key={item.title}>
                  <Card className="h-full flex flex-col items-center p-8 justify-center hover:bg-white/60">
                    <div className="text-4xl mb-4 hover:scale-125 transition-transform duration-300">{item.icon}</div>
                    <CardTitle className="text-xl text-primary font-bold mb-2 text-center">{item.title}</CardTitle>
                    <p className="text-sm font-medium text-foreground/70 text-center">{item.desc}</p>
                  </Card>
                </ScrollReveal>
              ))}
           </div>
         </ScrollReveal>
      </section>
      
      {/* START PLANNING WIZARD / FORM */}
      <section className="py-24 bg-transparent overflow-hidden">
         <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-16 items-center">
           <ScrollReveal delay={0.2} className="flex-1 w-full relative">
             <Image 
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" 
                alt="Wedding Celebration" 
                width={800} height={600} 
                className="rounded-[32px] shadow-2xl object-cover h-[600px] w-full hover:scale-[1.02] transition-transform duration-700"
             />
             <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/20" />
           </ScrollReveal>
           <ScrollReveal delay={0.4} className="flex-1 w-full max-w-xl">
             <span className="text-sm uppercase tracking-widest text-primary font-bold mb-2 block">Plan Your Wedding With Us</span>
             <h2 className="text-4xl text-burgundy font-bold mb-4">Start Your Planning Journey</h2>
             <p className="text-foreground/80 mb-8 font-medium">Tell us about your event and we&apos;ll personally connect you with the right vendors for your big day.</p>
             
             <Card className="p-8 border-none hover:-translate-y-3 hover:shadow-2xl transition-all duration-500">
               <form className="space-y-5">
                 <div>
                   <label className="text-sm font-bold mb-1.5 block text-burgundy">Event Type</label>
                   <select className="flex h-12 w-full rounded-xl border border-white bg-white/70 backdrop-blur-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all hover:bg-white/90">
                      <option>Wedding</option>
                      <option>Mehndi</option>
                      <option>Reception</option>
                      <option>Other</option>
                   </select>
                 </div>
                 <div>
                    <label className="text-sm font-bold mb-1.5 block text-burgundy">Location</label>
                    <Input placeholder="City / State" className="rounded-xl border-white bg-white/70 backdrop-blur-md h-12 font-medium shadow-sm hover:bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all" />
                 </div>
                 <div>
                   <label className="text-sm font-bold mb-1.5 block text-burgundy">Budget Range</label>
                   <select className="flex h-12 w-full rounded-xl border border-white bg-white/70 backdrop-blur-md px-4 py-2 text-sm font-medium shadow-sm hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                      <option>$20k - $50k</option>
                      <option>$50k - $100k</option>
                      <option>$100k - $200k+</option>
                   </select>
                 </div>
                 <Button className="w-full mt-6 h-12 text-md font-bold transition-transform hover:scale-[1.03] shadow-lg shadow-primary/20" variant="primary">Schedule Consultation</Button>
               </form>
             </Card>
           </ScrollReveal>
         </div>
      </section>

    </div>
  );
}
