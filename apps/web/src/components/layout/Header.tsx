import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 w-full flex justify-center px-4">
      <div className="w-full max-w-6xl flex h-16 items-center justify-between px-6 lg:px-8 rounded-full border border-white/40 bg-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl">
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary bg-white/50">
              <span className="font-serif text-lg">M</span>
            </div>
            <span className="font-serif text-base font-bold tracking-wide uppercase text-burgundy">Maison Wedding circle</span>
          </Link>
        </div>
        
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          <Link href="/about" className="text-sm font-semibold text-burgundy/90 hover:text-primary transition-colors">About Us</Link>
          <Link href="/for-couples" className="text-sm font-semibold text-burgundy/90 hover:text-primary transition-colors">For Couples</Link>
          <Link href="/vendors" className="text-sm font-semibold text-burgundy/90 hover:text-primary transition-colors">Vendors</Link>
          <Link href="/contact" className="text-sm font-semibold text-burgundy/90 hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <Button variant="primary" className="h-10 px-6 rounded-full shadow-lg shadow-primary/30 transition-transform hover:scale-105">Book Consult</Button>
        </div>
      </div>
    </header>
  );
}
