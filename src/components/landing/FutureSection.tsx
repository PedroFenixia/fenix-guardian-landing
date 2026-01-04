import { Lightbulb, Users, Cpu, MessageSquare } from "lucide-react";

const highlights = [
  {
    icon: Lightbulb,
    text: "Soluciones innovadoras para problemas complejos",
  },
  {
    icon: Users,
    text: "Enfoque centrado en el cliente en cada paso",
  },
  {
    icon: Cpu,
    text: "Tecnologías de vanguardia y mejores prácticas",
  },
  {
    icon: MessageSquare,
    text: "Comunicación y entrega transparente",
  },
];

const FutureSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%)"
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                Construyendo el{" "}
                <span className="text-primary text-glow">Futuro</span>{" "}
                de la Tecnología
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-4">
                En <span className="text-primary font-semibold">FENIX IA</span>, creemos en el poder transformador de la inteligencia artificial. Como el fénix, ayudamos a los negocios a elevarse, reinventarse y alcanzar nuevas alturas a través de soluciones digitales innovadoras.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Nuestro equipo de expertos en IA, desarrolladores y estrategas trabaja de forma colaborativa para entregar soluciones que no solo satisfacen tus necesidades actuales, sino que anticipan desafíos futuros.
              </p>
            </div>

            {/* Highlight points */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 glass-card group hover:border-primary/40 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual - Fenix emblem */}
          <div className="relative flex items-center justify-center">
            {/* Glow background */}
            <div 
              className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl"
              style={{
                background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)"
              }}
            />
            
            {/* Decorative rings */}
            <div className="absolute w-72 h-72 rounded-full border border-primary/20 animate-pulse" />
            <div className="absolute w-56 h-56 rounded-full border border-primary/30" />
            <div className="absolute w-40 h-40 rounded-full border border-primary/40 bg-primary/5" />
            
            {/* Center emblem */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/50 flex items-center justify-center shadow-[0_0_60px_hsl(var(--primary)/0.3)]">
              <span className="text-5xl font-bold text-primary text-glow">F</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSection;
