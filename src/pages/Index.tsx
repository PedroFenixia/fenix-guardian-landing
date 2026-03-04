import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ValueProposition from "@/components/landing/ValueProposition";
import FutureSection from "@/components/landing/FutureSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import SecuritySection from "@/components/landing/SecuritySection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <ValueProposition />
          <FutureSection />
          <FeaturesSection />
          <UseCasesSection />
          <SecuritySection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
