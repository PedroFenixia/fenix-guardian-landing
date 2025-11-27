import { 
  AlertCircle, 
  Monitor, 
  FileText, 
  History, 
  Sparkles,
  Lock,
  Eye,
  Zap
} from "lucide-react";

const features = [
  {
    icon: AlertCircle,
    title: "Alertas de riesgo",
    description: "Notificaciones en tiempo real sobre comportamientos sospechosos y potenciales amenazas de seguridad.",
  },
  {
    icon: Monitor,
    title: "Control de teletrabajo",
    description: "Monitorización completa de la actividad remota con métricas de productividad y engagement.",
  },
  {
    icon: FileText,
    title: "Informes automáticos",
    description: "Generación automática de reportes detallados con insights accionables para la toma de decisiones.",
  },
  {
    icon: History,
    title: "Registro de actividad",
    description: "Historial completo de acciones con timestamps y contexto para auditorías y compliance.",
  },
  {
    icon: Sparkles,
    title: "Detección de anomalías",
    description: "Algoritmos de IA que identifican patrones inusuales antes de que se conviertan en problemas.",
  },
  {
    icon: Lock,
    title: "Gestión de accesos",
    description: "Control granular de permisos y políticas de seguridad para cada usuario y dispositivo.",
  },
  {
    icon: Eye,
    title: "Supervisión en vivo",
    description: "Vista en tiempo real de la actividad del equipo con dashboards personalizables.",
  },
  {
    icon: Zap,
    title: "Respuesta automatizada",
    description: "Acciones automáticas ante incidentes predefinidos para minimizar tiempos de respuesta.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Funcionalidades
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Todo lo que necesitas para{" "}
            <span className="text-primary">proteger</span> tu equipo
          </h2>
          <p className="text-lg text-muted-foreground">
            Herramientas avanzadas diseñadas para empresas que priorizan la seguridad sin comprometer la experiencia del empleado.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 feature-card group cursor-pointer"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/30">
                <feature.icon className="w-6 h-6 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
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
