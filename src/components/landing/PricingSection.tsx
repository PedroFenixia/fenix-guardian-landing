import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Básico",
    price: "29",
    description: "Para equipos pequeños que empiezan con el teletrabajo.",
    features: [
      "Hasta 10 usuarios",
      "Monitorización básica",
      "Informes semanales",
      "Soporte por email",
      "Retención de datos 30 días",
    ],
    cta: "Empezar gratis",
    featured: false,
  },
  {
    name: "Pro",
    price: "79",
    description: "Para empresas en crecimiento con necesidades avanzadas.",
    features: [
      "Hasta 50 usuarios",
      "Monitorización avanzada con IA",
      "Alertas en tiempo real",
      "Informes personalizados",
      "API access",
      "Soporte prioritario",
      "Retención de datos 1 año",
    ],
    cta: "Empezar prueba",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    description: "Para grandes organizaciones con requisitos específicos.",
    features: [
      "Usuarios ilimitados",
      "Implementación on-premise",
      "SSO y LDAP",
      "SLA garantizado",
      "Account manager dedicado",
      "Formación personalizada",
      "Retención ilimitada",
    ],
    cta: "Contactar ventas",
    featured: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 lg:py-32 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Tarifas
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Planes que <span className="text-primary">escalan</span> contigo
          </h2>
          <p className="text-lg text-muted-foreground">
            Elige el plan que mejor se adapte a tu organización. Sin compromisos a largo plazo.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card p-8 rounded-2xl pricing-card flex flex-col ${
                plan.featured ? 'featured lg:scale-105' : ''
              }`}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                    Más popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                {plan.price === "Personalizado" ? (
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">€{plan.price}</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.featured ? "hero" : "hero-outline"}
                className="w-full"
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
