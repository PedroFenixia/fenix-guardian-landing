import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-8">
                Política de <span className="text-primary">Privacidad</span>
              </h1>
              
              <div className="prose prose-invert max-w-none space-y-8">
                <p className="text-muted-foreground">
                  Última actualización: Enero 2024
                </p>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">1. Información que recopilamos</h2>
                  <p className="text-muted-foreground">
                    En FENIX IA SOLUTIONS recopilamos información que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, número de teléfono y cualquier otra información que decidas compartir con nosotros a través de nuestros formularios de contacto.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">2. Uso de la información</h2>
                  <p className="text-muted-foreground">
                    Utilizamos la información recopilada para:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Responder a tus consultas y solicitudes</li>
                    <li>Proporcionar información sobre nuestros servicios</li>
                    <li>Mejorar nuestros servicios y la experiencia del usuario</li>
                    <li>Cumplir con obligaciones legales</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">3. Protección de datos</h2>
                  <p className="text-muted-foreground">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra accesos no autorizados, alteración, divulgación o destrucción.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">4. Tus derechos</h2>
                  <p className="text-muted-foreground">
                    Tienes derecho a acceder, rectificar, suprimir y oponerte al tratamiento de tus datos personales. Para ejercer estos derechos, puedes contactarnos en hola@fenixia.tech.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">5. Contacto</h2>
                  <p className="text-muted-foreground">
                    Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:
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

export default Privacy;
