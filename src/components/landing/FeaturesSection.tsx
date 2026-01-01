import { 
  Lightbulb, 
  Target, 
  Handshake, 
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Visión innovadora",
    description: "Buscamos constantemente nuevas formas de aplicar la IA para generar valor en cada proyecto.",
  },
  {
    icon: Target,
    title: "Enfoque personalizado",
    description: "Cada solución es única y está diseñada específicamente para las necesidades de tu negocio.",
  },
  {
    icon: Handshake,
    title: "Compromiso total",
    description: "Trabajamos codo a codo contigo para garantizar el éxito de cada iniciativa.",
  },
  {
    icon: TrendingUp,
    title: "Resultados medibles",
    description: "Nos enfocamos en generar impacto real y cuantificable en tu organización.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="solutions" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nuestro enfoque
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Cómo <span className="text-primary">trabajamos</span>
          </h2>
          <p className="text-lg text-foreground/80">
            Nuestra metodología se basa en la colaboración estrecha, la innovación continua y el compromiso con los resultados.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 feature-card group cursor-pointer"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/30">
                <feature.icon className="w-6 h-6 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
