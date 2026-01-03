import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ValueProposition from "@/components/landing/ValueProposition";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

const fenixLogo = "/assets/fenix-logo-transparent-alpha.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Background logo - huge and blurred */}
      <div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
        aria-hidden="true"
      >
        <img 
          src={fenixLogo} 
          alt="" 
          className="w-[300vw] h-auto max-w-none opacity-[0.08] blur-[2px]"
        />
      </div>
      
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <ValueProposition />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
