import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingDirectory } from "@/components/landing/LandingDirectory";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 selection:bg-fuchsia-500 selection:text-white text-slate-50 overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 inset-x-0 h-screen pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/30 blur-[120px]" />
         <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/20 blur-[120px]" />
         <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-cyan-600/20 blur-[150px]" />
      </div>

      <LandingHeader />

      <main className="flex-1">
        <LandingHero />
        <LandingDirectory />
      </main>
      
      <LandingFooter />
    </div>
  );
}

