import { FileText, Landmark, Award, Briefcase, Scale, AlertTriangle } from "lucide-react";

const sources = [
  {
    icon: FileText,
    name: "BORME",
    description: "Nuevas empresas, nombramientos, ampliaciones de capital y disoluciones.",
  },
  {
    icon: Landmark,
    name: "BOE Subvenciones",
    description: "Convocatorias de ayudas y subvenciones públicas del Estado.",
  },
  {
    icon: Award,
    name: "BDNS",
    description: "Subvenciones de CDTI, IVACE, red.es, AVI y más organismos.",
  },
  {
    icon: Briefcase,
    name: "PLACSP",
    description: "Licitaciones y contratos del sector público, listos para filtrar.",
  },
  {
    icon: Scale,
    name: "Edictos judiciales",
    description: "Concursos, embargos y subastas publicados en el BOE.",
  },
  {
    icon: AlertTriangle,
    name: "Registro Concursal",
    description: "Situaciones de insolvencia: desde la apertura hasta la liquidación.",
  },
];

const FutureSection = () => {
  return (
    <section id="fuentes" className="py-24 lg:py-32 relative overflow-hidden">
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
                Más de 6 fuentes oficiales{" "}
                <span className="text-primary text-glow">cada día</span>
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-4 text-justify">
                Toda la información viene directamente de registros públicos del Estado. Datos fiables, actualizados y verificables.
              </p>
            </div>

            {/* Sources grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {sources.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 glass-card group hover:border-primary/40 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">{item.name}</p>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual - Prospector emblem */}
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
              <span className="text-5xl font-bold text-primary text-glow">P</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSection;
