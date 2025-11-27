import { Brain, Shield, BarChart3 } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "Monitorización inteligente",
    description: "Seguimiento automatizado de actividad con machine learning para detectar patrones y optimizar la productividad de tu equipo.",
  },
  {
    icon: Shield,
    title: "Seguridad y cumplimiento",
    description: "Protección de datos sensibles y cumplimiento normativo GDPR con cifrado de extremo a extremo y auditorías automáticas.",
  },
  {
    icon: BarChart3,
    title: "Análisis avanzado con IA",
    description: "Informes predictivos y análisis de comportamiento que transforman datos en decisiones estratégicas para tu negocio.",
  },
];

const ValueProposition = () => {
  return (
    <section className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Protección <span className="text-primary">integral</span> para tu empresa
          </h2>
          <p className="text-lg text-muted-foreground">
            Una suite completa de herramientas diseñadas para garantizar la seguridad y productividad de equipos distribuidos.
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
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                <value.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
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
