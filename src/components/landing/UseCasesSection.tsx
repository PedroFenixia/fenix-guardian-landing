import { Target, Eye, ShieldAlert } from "lucide-react";

const useCases = [
  {
    icon: Target,
    title: "Captar nuevos clientes",
    description: "Descubre empresas recién constituidas en tu sector y territorio. Detecta señales de crecimiento como ampliaciones de capital o nuevos nombramientos.",
  },
  {
    icon: Eye,
    title: "No perder ninguna oportunidad",
    description: "Recibe alertas de subvenciones y licitaciones filtradas por tu sector y provincia, antes de que venzan los plazos.",
  },
  {
    icon: ShieldAlert,
    title: "Proteger tu cartera",
    description: "Conoce la situación de tus clientes y proveedores. Detecta concursos, embargos y disoluciones a tiempo.",
  },
];

const UseCasesSection = () => {
  return (
    <section id="casos-de-uso" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Para tu negocio
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            ¿Cómo te <span className="text-primary">ayuda</span>?
          </h2>
          <p className="text-lg text-foreground/80">
            Tres formas concretas de sacar partido a la información pública.
          </p>
        </div>

        {/* Use case cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.title}
              className="glass-card p-8 lg:p-10 feature-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                <useCase.icon className="w-7 h-7 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 text-primary">
                {useCase.title}
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
