import { Database, Search, Bell } from "lucide-react";

const values = [
  {
    icon: Database,
    title: "Monitorización automática",
    description: "Cada día revisamos BORME, BOE, BDNS, licitaciones y registros concursales por ti. Tú solo recibes lo relevante.",
  },
  {
    icon: Search,
    title: "Datos verificados y completos",
    description: "Identificamos cada empresa con su NIF, sector, ubicación y perfil comercial desde fuentes oficiales.",
  },
  {
    icon: Bell,
    title: "Alertas personalizadas",
    description: "Define qué te interesa: sector, territorio o tipo de oportunidad. Te avisamos en cuanto aparezca algo relevante.",
  },
];

const ValueProposition = () => {
  return (
    <section id="producto" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            ¿Qué hace <span className="text-primary">Prospector</span>?
          </h2>
          <p className="text-lg text-foreground/80">
            Convierte datos públicos en oportunidades de negocio. Sin esfuerzo manual, sin perder el tiempo buscando.
          </p>
        </div>

        {/* Value cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="glass-card p-8 lg:p-10 feature-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                <value.icon className="w-7 h-7 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 text-primary">
                {value.title}
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
