import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24 bg-ivory">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-serif text-5xl font-bold text-burgundy mb-6 text-center">Built on Legacy & Trust</h1>
        <h2 className="text-xl text-primary font-serif text-center mb-16">From Atlanta Roots to New York Celebrations</h2>
        
        <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
          <div className="flex-1">
             <Image src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80" width={600} height={400} alt="Family Legacy" className="rounded-2xl shadow-xl object-cover h-[400px] w-full" />
          </div>
          <div className="flex-1 space-y-6">
            <h3 className="font-serif text-3xl text-burgundy font-semibold">Our Story</h3>
            <p className="text-foreground/80 leading-relaxed">
              Maison Wedding Circle was created by a team with over 20+ years in the wedding industry. We started setting trends in Atlanta, and today, we help families plan celebrations across the country, focusing on the sophisticated markets of New York and beyond.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              We bring that legacy into a new way of helping families plan with confidence, without the burden of managing everything alone.
            </p>
            <p className="font-serif text-xl text-primary italic mt-6">- The Maison Wedding Circle Team</p>
          </div>
        </div>

        <div className="mb-24">
           <h3 className="font-serif text-3xl text-burgundy font-semibold text-center mb-12">Our Core Team</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               {name: "Aisha Pervaiz", role: "Principal Planner", img: "https://i.pravatar.cc/300?img=5"},
               {name: "Zayn Pervaiz", role: "Vendor Relations", img: "https://i.pravatar.cc/300?img=11"},
               {name: "Admin", role: "Design Coordinator", img: "https://i.pravatar.cc/300?img=9"}
             ].map(t => (
               <div key={t.name} className="flex flex-col items-center text-center">
                 <Image src={t.img} alt={t.name} width={200} height={200} className="rounded-full w-48 h-48 object-cover mb-6 border-4 border-primary/30" />
                 <h4 className="font-serif text-xl font-semibold text-burgundy">{t.name}</h4>
                 <span className="text-primary text-sm font-medium">{t.role}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
