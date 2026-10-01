import { Providers } from "@/components/Providers";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Capabilities } from "@/components/Capabilities";
import { Experience } from "@/components/Experience";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function VeronicaPage() {
  return (
    <Providers>
      <div className="site-shell">
        <Navigation />
        <main className="main">
          <Hero />
          <Work />
          <Capabilities />
          <Experience />
          <About />
          <CTA />
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
