import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "FENIX IA nos ha ayudado a transformar nuestra visión en realidad. Su enfoque colaborativo y expertise técnico marcaron la diferencia.",
    author: "María García",
    role: "CEO",
    company: "Empresa Cliente",
    type: "Cliente satisfecho",
  },
  {
    quote: "El equipo de FENIX demostró un profundo conocimiento en IA y una capacidad excepcional para entender nuestras necesidades.",
    author: "Carlos Rodríguez",
    role: "Director de Tecnología",
    company: "Organización Partner",
    type: "Partner estratégico",
  },
  {
    quote: "Trabajar con FENIX IA ha sido una experiencia transformadora. Su compromiso con la excelencia es evidente en cada interacción.",
    author: "Ana Martínez",
    role: "Directora de Innovación",
    company: "Empresa Colaboradora",
    type: "Colaborador",
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
            Testimonios
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Lo que dicen de <span className="text-primary">nosotros</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Nuestros clientes y partners comparten su experiencia trabajando con FENIX IA SOLUTIONS.
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
      </div>
    </section>
  );
};

export default TestimonialsSection;
