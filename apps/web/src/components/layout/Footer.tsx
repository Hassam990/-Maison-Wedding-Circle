import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-burgundy text-ivory py-12">
      <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
           <div className="flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary">
              <span className="font-serif text-xl">M</span>
            </div>
            <span className="font-serif text-lg font-semibold tracking-wide uppercase text-primary">Maison Wedding Circle</span>
          </div>
          <p className="text-sm text-ivory/80">
            A trusted wedding network for the South Asian community in the US.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-serif font-semibold text-primary">Couples</h4>
          <Link href="/for-couples" className="text-sm text-ivory/80 hover:text-primary transition-colors">Plan Your Wedding</Link>
          <Link href="/vendors" className="text-sm text-ivory/80 hover:text-primary transition-colors">Browse Vendors</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-serif font-semibold text-primary">Vendors</h4>
          <Link href="/for-vendors" className="text-sm text-ivory/80 hover:text-primary transition-colors">Join Directory</Link>
          <Link href="/login" className="text-sm text-ivory/80 hover:text-primary transition-colors">Vendor Login</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-serif font-semibold text-primary">Contact</h4>
          <span className="text-sm text-ivory/80">info@maisonweddingcircle.com</span>
          <span className="text-sm text-ivory/80">(470) 835-2007</span>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-ivory/10 text-center text-sm text-ivory/60">
        &copy; {new Date().getFullYear()} Maison Wedding Circle. All rights reserved.
      </div>
    </footer>
  );
}
