import { Shield, Eye, Clock } from "lucide-react";

const securityItems = [
  {
    icon: Shield,
    title: "Solo datos públicos",
    description: "Trabajamos exclusivamente con registros oficiales: BORME, BOE, BDNS y licitaciones. Nunca accedemos a información privada.",
  },
  {
    icon: Eye,
    title: "Todo trazable",
    description: "Cada dato incluye su fuente y fecha de publicación original. Puedes verificar cualquier información en un clic.",
  },
  {
    icon: Clock,
    title: "Tus datos, tu control",
    description: "Solo procesamos lo estrictamente necesario. Tú decides cuánto tiempo conservar la información.",
  },
];

const SecuritySection = () => {
  return (
    <section id="seguridad" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Seguridad y <span className="text-primary">transparencia</span>
          </h2>
          <p className="text-lg text-foreground/80">
            Sabes exactamente de dónde viene cada dato y cómo lo tratamos.
          </p>
        </div>

        {/* Security cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {securityItems.map((item, index) => (
            <div
              key={item.title}
              className="glass-card p-8 lg:p-10 feature-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                <item.icon className="w-7 h-7 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 text-primary">
                {item.title}
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
