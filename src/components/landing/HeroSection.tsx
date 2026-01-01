import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 text-sm animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-foreground">Soluciones de Inteligencia Artificial</span>
          </div>

          {/* Headline */}
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Transformamos tu negocio con{" "}
            <span className="text-primary text-glow">Inteligencia Artificial</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            Desarrollamos soluciones personalizadas de IA para impulsar la innovación y el crecimiento de tu empresa.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/contacto">
                Hablemos
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/nosotros">Conócenos</Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div 
            className="flex flex-wrap items-center gap-6 justify-center pt-4 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex items-center gap-2 text-sm text-foreground">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Innovación constante
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Equipo experto
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Resultados reales
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
