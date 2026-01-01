import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Brain, Target, Rocket, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Sobre <span className="text-primary">FENIX IA SOLUTIONS</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground">
                Somos una empresa dedicada a transformar negocios mediante soluciones innovadoras de inteligencia artificial. Nuestra misión es hacer que la IA sea accesible y útil para empresas de todos los tamaños.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="glass-card p-8 rounded-2xl">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Democratizar el acceso a la inteligencia artificial, proporcionando soluciones personalizadas que impulsen la innovación y el crecimiento sostenible de las empresas.
                </p>
              </div>
              <div className="glass-card p-8 rounded-2xl">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Rocket className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ser el partner de referencia en transformación digital impulsada por IA en el mercado hispanohablante, reconocidos por nuestra excelencia técnica y compromiso con los resultados.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Nuestros <span className="text-primary">Valores</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { title: "Innovación", desc: "Buscamos constantemente nuevas formas de aplicar la tecnología." },
                { title: "Excelencia", desc: "Nos comprometemos con la calidad en cada proyecto." },
                { title: "Colaboración", desc: "Trabajamos como un equipo unido con nuestros clientes." },
                { title: "Integridad", desc: "Actuamos con honestidad y transparencia en todo momento." },
              ].map((value) => (
                <div key={value.title} className="glass-card p-6 rounded-xl text-center">
                  <h3 className="text-lg font-semibold mb-2 text-primary">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
