import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { WallCalendar } from "@/components/WallCalendar";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background transition-colors duration-500 overflow-x-hidden">
      <Navbar />
      
      <Hero />
      
      <Features />
      
      <section id="calendar" className="py-24 md:py-48 px-6 md:px-12 bg-background/50 relative overflow-hidden">
         <div className="absolute inset-0 hero-gradient pointer-events-none opacity-40 rotate-180" />
         
         <div className="max-w-6xl mx-auto relative z-10">
            <div className="mb-24 text-center max-w-2xl mx-auto">
               <h2 className="text-sm font-bold text-accent-blue tracking-[0.2em] uppercase mb-6 drop-shadow-sm">The Experience</h2>
               <p className="text-4xl md:text-6xl font-bold tracking-tight font-heading leading-tight text-foreground">
                 A physical artifact for <br />the digital age.
               </p>
            </div>
            
            <WallCalendar />
         </div>

         {/* Decorative ambient light */}
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      </section>

      <Footer />
    </main>
  );
}
