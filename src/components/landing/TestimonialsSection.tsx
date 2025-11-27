import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Fenix Guardian nos ha permitido gestionar equipos remotos de forma segura y eficiente. La visibilidad que tenemos ahora es incomparable.",
    author: "María García",
    role: "CTO",
    company: "TechStartup España",
    type: "Startup tecnológica",
  },
  {
    quote: "La detección de anomalías con IA nos alertó de una brecha de seguridad antes de que se convirtiera en un problema mayor. Invaluable.",
    author: "Carlos Rodríguez",
    role: "Director de IT",
    company: "FinanceGroup",
    type: "Servicios financieros",
  },
  {
    quote: "Nuestro call center remoto opera ahora con total transparencia. Los informes automáticos nos ahorran horas de trabajo cada semana.",
    author: "Ana Martínez",
    role: "Operations Manager",
    company: "ContactPro",
    type: "Call center",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Casos de uso
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Empresas que <span className="text-primary">confían</span> en nosotros
          </h2>
          <p className="text-lg text-muted-foreground">
            Desde startups hasta grandes corporaciones, Fenix Guardian protege equipos remotos en todo tipo de industrias.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="glass-card p-8 rounded-2xl feature-card relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-primary/20" />
              </div>

              {/* Type badge */}
              <span className="inline-block px-3 py-1 bg-muted/50 text-muted-foreground text-xs font-medium rounded-full mb-6">
                {testimonial.type}
              </span>

              {/* Quote */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos section */}
        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground mb-8">
            Más de 500 empresas confían en Fenix Guardian
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-24 bg-muted-foreground/20 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
