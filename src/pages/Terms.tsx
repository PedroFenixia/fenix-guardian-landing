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
                Aviso <span className="text-primary">Legal</span>
              </h1>
              
              <div className="prose prose-invert max-w-none space-y-8">
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">1. Información General</h2>
                  <p className="text-muted-foreground">
                    En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico, se informa que este sitio web es propiedad de:
                  </p>
                  <ul className="text-muted-foreground space-y-2 list-none pl-0">
                    <li><strong className="text-foreground">Denominación social:</strong> Fenix IA Solutions SL</li>
                    <li><strong className="text-foreground">Domicilio:</strong> C/ La Paz, 83, 03320 Torrellano-Elche, Alicante</li>
                    <li><strong className="text-foreground">Email:</strong> <a href="mailto:contacto@fenixia.tech" className="text-primary hover:underline">contacto@fenixia.tech</a></li>
                    <li><strong className="text-foreground">Teléfono:</strong> <a href="tel:+34966101029" className="text-primary hover:underline">+34 966 10 10 29</a></li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">2. Objeto</h2>
                  <p className="text-muted-foreground">
                    El presente aviso legal regula el uso del sitio web de Fenix IA Solutions SL, que pone a disposición de los usuarios de Internet información sobre nuestros servicios de análisis de voz con inteligencia artificial.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">3. Condiciones de Uso</h2>
                  <p className="text-muted-foreground">
                    El acceso y uso de este sitio web implica la aceptación expresa y sin reservas de todas las condiciones establecidas en este aviso legal. Si no está de acuerdo con alguna de estas condiciones, no utilice este sitio web.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">4. Responsabilidad</h2>
                  <p className="text-muted-foreground">
                    Fenix IA Solutions SL no se hace responsable de los daños y perjuicios que pudieran derivarse del uso incorrecto de este sitio web. El usuario es el único responsable del uso que haga de los contenidos y servicios ofrecidos.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">5. Propiedad Intelectual</h2>
                  <p className="text-muted-foreground">
                    Todos los contenidos de este sitio web, incluyendo textos, imágenes, logotipos, marcas, y cualquier otro material, están protegidos por derechos de propiedad intelectual e industrial de Fenix IA Solutions SL o de terceros que han autorizado su uso.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">6. Modificaciones</h2>
                  <p className="text-muted-foreground">
                    Fenix IA Solutions SL se reserva el derecho de modificar el presente aviso legal en cualquier momento, siendo publicadas las modificaciones en este mismo sitio web.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">7. Legislación Aplicable</h2>
                  <p className="text-muted-foreground">
                    El presente aviso legal se rige por la legislación española. Para cualquier controversia que pudiera derivarse del acceso o uso de este sitio web, las partes se someten a los juzgados y tribunales de Alicante, España.
                  </p>
                </section>

                <p className="text-muted-foreground pt-4 border-t border-border/50">
                  Última actualización: Julio 2025
                </p>
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
