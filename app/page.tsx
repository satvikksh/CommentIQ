import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import DashboardPreview from "@/components/home/DashboardPreview";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

export function Error() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="pt-24 text-center">
        <h1 className="text-5xl font-bold">
          Welcome to CommentIQ
        </h1>
      </div>
    </main>
  );
}