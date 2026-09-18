import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import WorkspaceGrid from '@/components/landing/WorkspaceGrid';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <WorkspaceGrid />
      <Footer />
    </main>
  );
}
