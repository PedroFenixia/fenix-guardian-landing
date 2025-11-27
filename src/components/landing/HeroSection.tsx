import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import fenixLogo from "@/assets/fenix-final.png";
import DemoRequestModal from "./DemoRequestModal";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-hero-glow" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-60" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 text-sm animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-muted-foreground">Plataforma de monitorización avanzada</span>
            </div>

            {/* Headline */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Control inteligente para{" "}
              <span className="text-primary text-glow">equipos en remoto</span>
            </h1>

            {/* Subheadline */}
            <p 
              className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              La plataforma de monitorización avanzada con IA para garantizar seguridad, productividad y cumplimiento.
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <Button variant="hero" size="xl" className="group">
                Empezar prueba
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
              <DemoRequestModal />
            </div>

            {/* Trust badges */}
            <div 
              className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-4 animate-fade-in-up"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sin tarjeta requerida
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                14 días gratis
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                GDPR compliant
              </div>
            </div>
          </div>

          {/* Logo/Visual */}
          <div 
            className="relative flex items-center justify-center animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            {/* Glow rings */}
            <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full border border-primary/20 animate-pulse-glow" />
            <div className="absolute w-56 h-56 lg:w-72 lg:h-72 rounded-full border border-primary/30 animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-40 h-40 lg:w-56 lg:h-56 rounded-full border border-primary/40 animate-pulse-glow" style={{ animationDelay: '1s' }} />
            
            {/* Central glow */}
            <div className="absolute w-48 h-48 lg:w-64 lg:h-64 bg-primary/10 rounded-full blur-3xl" />
            
            {/* Logo */}
            <div className="relative w-48 h-48 lg:w-64 lg:h-64 flex items-center justify-center">
              {/* Outer glow ring behind logo */}
              <div className="absolute w-52 h-52 lg:w-72 lg:h-72 bg-primary/5 rounded-full blur-2xl" />
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/15 via-primary/5 to-transparent rounded-full" />
              {/* Logo */}
              <img 
                src={fenixLogo} 
                alt="Fenix Guardian Monitor" 
                className="relative w-44 h-44 lg:w-60 lg:h-60 object-contain animate-float"
                style={{ 
                  filter: 'drop-shadow(0 0 25px hsl(184 100% 54% / 0.4))',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
