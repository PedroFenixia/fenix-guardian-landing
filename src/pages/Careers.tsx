import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Careers = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Únete a <span className="text-primary">FENIX IA</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground">
                Forma parte de un equipo innovador que está transformando el futuro con inteligencia artificial.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
              ¿Por qué trabajar con nosotros?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { title: "Trabajo remoto", desc: "Flexibilidad para trabajar desde donde prefieras." },
                { title: "Formación continua", desc: "Acceso a cursos y certificaciones en IA." },
                { title: "Proyectos innovadores", desc: "Trabaja en tecnología de vanguardia." },
                { title: "Equipo colaborativo", desc: "Ambiente de trabajo positivo y de apoyo mutuo." },
                { title: "Crecimiento profesional", desc: "Oportunidades claras de desarrollo." },
                { title: "Compensación competitiva", desc: "Salarios y beneficios atractivos." },
              ].map((benefit) => (
                <div key={benefit.title} className="glass-card p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2 text-primary">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
              Posiciones <span className="text-primary">Abiertas</span>
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No hay posiciones abiertas actualmente</h3>
                    <p className="text-sm text-muted-foreground">
                      Pero siempre estamos interesados en conocer talento. Envíanos tu CV a:
                    </p>
                    <a href="mailto:contacto@fenixia.tech" className="text-primary hover:underline text-sm font-medium">
                      contacto@fenixia.tech
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                ¿Tienes preguntas?
              </h2>
              <p className="text-muted-foreground mb-6">
                Contáctanos para saber más sobre las oportunidades en FENIX IA SOLUTIONS.
              </p>
              <a 
                href="/contacto" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                Contactar
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
