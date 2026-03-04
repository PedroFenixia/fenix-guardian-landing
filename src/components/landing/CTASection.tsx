import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 lg:p-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Empieza a detectar <span className="text-primary">oportunidades</span>
          </h2>
          <p className="text-lg text-foreground/80 mb-8">
            Solicita una demo y descubre cómo Prospector puede ayudarte a encontrar nuevos clientes y oportunidades cada día.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/contacto">
                Solicitar demo
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#como-funciona">Ver cómo funciona</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
