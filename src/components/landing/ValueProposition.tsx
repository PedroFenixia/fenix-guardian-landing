import { Brain, Rocket, Users } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "Innovación con IA",
    description: "Aplicamos las últimas tecnologías de inteligencia artificial para resolver los desafíos más complejos de tu negocio.",
  },
  {
    icon: Rocket,
    title: "Impulso al crecimiento",
    description: "Nuestras soluciones están diseñadas para escalar contigo y acelerar el crecimiento de tu empresa.",
  },
  {
    icon: Users,
    title: "Equipo especializado",
    description: "Contamos con expertos en IA, machine learning y desarrollo de software listos para ayudarte.",
  },
];

const ValueProposition = () => {
  return (
    <section id="about" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            ¿Por qué <span className="text-primary">FENIX IA</span>?
          </h2>
          <p className="text-lg text-foreground/80">
            Somos tu partner estratégico en la transformación digital impulsada por inteligencia artificial.
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
