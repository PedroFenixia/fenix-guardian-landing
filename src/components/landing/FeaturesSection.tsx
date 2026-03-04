import {
  Download,
  Layers,
  BadgeCheck,
  Bell
} from "lucide-react";

const features = [
  {
    icon: Download,
    title: "Recopilación diaria",
    description: "Cada mañana revisamos todas las publicaciones oficiales y extraemos lo relevante para ti.",
  },
  {
    icon: Layers,
    title: "Datos limpios y organizados",
    description: "Estandarizamos nombres, direcciones y sectores para que puedas buscar y filtrar sin complicaciones.",
  },
  {
    icon: BadgeCheck,
    title: "Empresas identificadas",
    description: "Cada oportunidad lleva asociada la empresa, su sector y su ubicación, lista para contactar.",
  },
  {
    icon: Bell,
    title: "Alertas que llegan a ti",
    description: "Cruzamos las novedades del día con tu perfil de interés y te notificamos solo lo que encaja.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="como-funciona" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Así de sencillo
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Cómo <span className="text-primary">funciona</span>
          </h2>
          <p className="text-lg text-foreground/80">
            De los registros oficiales a tu bandeja de entrada, en cuatro pasos automáticos.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 lg:p-10 feature-card group cursor-pointer"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                <feature.icon className="w-7 h-7 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2 text-primary">
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
