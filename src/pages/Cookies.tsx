import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-8">
                Política de <span className="text-primary">Cookies</span>
              </h1>
              
              <div className="prose prose-invert max-w-none space-y-8">
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">1. ¿Qué son las Cookies?</h2>
                  <p className="text-muted-foreground">
                    Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. Nos ayudan a mejorar su experiencia de navegación y a entender cómo utiliza nuestro sitio.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">2. Tipos de Cookies que Utilizamos</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Cookies Técnicas (Necesarias)</h3>
                      <p className="text-muted-foreground">
                        Son esenciales para el funcionamiento del sitio web. Sin estas cookies, el sitio no puede funcionar correctamente.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Cookies de Análisis</h3>
                      <p className="text-muted-foreground">
                        Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, proporcionándonos información sobre las páginas visitadas, el tiempo de permanencia, etc.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Cookies de Funcionalidad</h3>
                      <p className="text-muted-foreground">
                        Permiten que el sitio web recuerde las elecciones que hace (como su idioma o región) y proporcionan características mejoradas y más personales.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">3. Cookies de Terceros</h2>
                  <p className="text-muted-foreground">
                    Nuestro sitio web puede utilizar cookies de terceros para servicios como análisis web, mapas, videos integrados, etc. Estas cookies están sujetas a las políticas de privacidad de los respectivos terceros.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">4. Gestión de Cookies</h2>
                  <p className="text-muted-foreground">
                    Puede gestionar las cookies a través de la configuración de su navegador:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Aceptar o rechazar cookies</li>
                    <li>Eliminar cookies existentes</li>
                    <li>Configurar notificaciones antes de recibir cookies</li>
                    <li>Bloquear cookies de sitios específicos</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">5. Configuración por Navegador</h2>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <strong className="text-foreground min-w-20">Chrome</strong>
                      <span className="text-muted-foreground">Configuración → Privacidad y seguridad → Cookies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className="text-foreground min-w-20">Firefox</strong>
                      <span className="text-muted-foreground">Opciones → Privacidad y seguridad → Cookies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className="text-foreground min-w-20">Safari</strong>
                      <span className="text-muted-foreground">Preferencias → Privacidad → Cookies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className="text-foreground min-w-20">Edge</strong>
                      <span className="text-muted-foreground">Configuración → Privacidad → Cookies</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">6. Consentimiento</h2>
                  <p className="text-muted-foreground">
                    Al continuar navegando por nuestro sitio web, acepta el uso de cookies de acuerdo con esta política. Puede retirar su consentimiento en cualquier momento modificando la configuración de su navegador.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">7. Contacto</h2>
                  <p className="text-muted-foreground">
                    Si tiene alguna pregunta sobre nuestra política de cookies, puede contactarnos en <a href="mailto:contacto@fenixia.tech" className="text-primary hover:underline">contacto@fenixia.tech</a> o en el teléfono <a href="tel:+34966101029" className="text-primary hover:underline">+34 966 10 10 29</a>
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

export default Cookies;
