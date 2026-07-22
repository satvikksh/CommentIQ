import Navbar from "@/app/components/layout/Navbar";
import Hero from "@/app/components/home/Hero";
import Features from "@/app/components/home/Features";
import HowItWorks from "@/app/components/home/HowItWorks";
import FAQ from "@/app/components/home/FAQ";
import CTA from "@/app/components/home/CTA";
import Footer from "@/app/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
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
