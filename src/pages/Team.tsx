import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Linkedin, Mail } from "lucide-react";

const team = [
  {
    name: "Director General",
    role: "CEO & Fundador",
    bio: "Líder visionario con más de 15 años de experiencia en tecnología e innovación.",
    initials: "DG",
  },
  {
    name: "Director de Tecnología",
    role: "CTO",
    bio: "Experto en arquitectura de sistemas e implementación de soluciones de IA a escala.",
    initials: "DT",
  },
  {
    name: "Director de Operaciones",
    role: "COO",
    bio: "Especialista en gestión de proyectos y optimización de procesos empresariales.",
    initials: "DO",
  },
  {
    name: "Director Comercial",
    role: "CCO",
    bio: "Profesional con amplia experiencia en desarrollo de negocios y relaciones con clientes.",
    initials: "DC",
  },
];

const Team = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Nuestro <span className="text-primary">Equipo</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground">
                Un equipo multidisciplinar de expertos apasionados por la tecnología y comprometidos con tu éxito.
              </p>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="glass-card p-6 rounded-2xl text-center group">
                  {/* Avatar */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 transition-all">
                    <span className="text-2xl font-bold text-primary">{member.initials}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  
                  {/* Social links */}
                  <div className="flex justify-center gap-3">
                    <a href="#" className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                ¿Quieres unirte a nuestro equipo?
              </h2>
              <p className="text-muted-foreground mb-6">
                Siempre estamos buscando talento apasionado por la tecnología y la innovación.
              </p>
              <a 
                href="/carreras" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                Ver oportunidades
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Team;
