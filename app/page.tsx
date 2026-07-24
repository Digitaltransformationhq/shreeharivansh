import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import RecentProjects from "@/components/RecentProjects";
import Brochure from "@/components/Brochure";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import IntroReveal from "@/components/IntroReveal";

export default function Home() {
  return (
    <main className="relative bg-rust">
      <IntroReveal />
      <Navbar />
      <Hero />
      <About />
      <RecentProjects />
      <Brochure />
      <Contact />
      <Footer />
    </main>
  );
}
