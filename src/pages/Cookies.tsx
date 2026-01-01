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
                <p className="text-muted-foreground">
                  Última actualización: Enero 2024
                </p>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">1. ¿Qué son las cookies?</h2>
                  <p className="text-muted-foreground">
                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia de navegación y a entender cómo utilizas nuestro sitio.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">2. Tipos de cookies que utilizamos</h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio web.</li>
                    <li><strong>Cookies analíticas:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio.</li>
                    <li><strong>Cookies de preferencias:</strong> Permiten recordar tus preferencias de navegación.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">3. Gestión de cookies</h2>
                  <p className="text-muted-foreground">
                    Puedes configurar tu navegador para rechazar todas las cookies o para que te avise cuando se envía una cookie. Sin embargo, algunas funciones del sitio pueden no funcionar correctamente sin cookies.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">4. Cookies de terceros</h2>
                  <p className="text-muted-foreground">
                    Podemos utilizar servicios de terceros que también pueden establecer cookies en tu dispositivo. Estos servicios tienen sus propias políticas de privacidad.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">5. Más información</h2>
                  <p className="text-muted-foreground">
                    Si tienes preguntas sobre nuestra política de cookies, contáctanos en:
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

export default Cookies;
