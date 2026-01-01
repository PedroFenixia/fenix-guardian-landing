import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-8">
                Términos de <span className="text-primary">Servicio</span>
              </h1>
              
              <div className="prose prose-invert max-w-none space-y-8">
                <p className="text-muted-foreground">
                  Última actualización: Enero 2024
                </p>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">1. Aceptación de los términos</h2>
                  <p className="text-muted-foreground">
                    Al acceder y utilizar los servicios de FENIX IA SOLUTIONS, aceptas estar sujeto a estos términos de servicio. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">2. Descripción del servicio</h2>
                  <p className="text-muted-foreground">
                    FENIX IA SOLUTIONS proporciona servicios de consultoría y desarrollo de soluciones de inteligencia artificial. Los detalles específicos de cada servicio se acordarán individualmente con cada cliente.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">3. Propiedad intelectual</h2>
                  <p className="text-muted-foreground">
                    Todo el contenido presente en este sitio web, incluyendo textos, gráficos, logos e imágenes, es propiedad de FENIX IA SOLUTIONS y está protegido por las leyes de propiedad intelectual.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">4. Limitación de responsabilidad</h2>
                  <p className="text-muted-foreground">
                    FENIX IA SOLUTIONS no será responsable de daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar nuestros servicios.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">5. Modificaciones</h2>
                  <p className="text-muted-foreground">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">6. Contacto</h2>
                  <p className="text-muted-foreground">
                    Para cualquier pregunta sobre estos términos, contáctanos en:
                  </p>
                  <p className="text-muted-foreground">
                    Email: <a href="mailto:hola@fenixia.tech" className="text-primary hover:underline">hola@fenixia.tech</a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
