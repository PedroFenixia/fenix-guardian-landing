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
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">1. Responsable del Tratamiento</h2>
                  <p className="text-muted-foreground">
                    Fenix IA Solutions SL es el responsable del tratamiento de los datos personales que nos proporcione a través de este sitio web y nuestros servicios.
                  </p>
                  <ul className="text-muted-foreground space-y-2 list-none pl-0">
                    <li><strong className="text-foreground">Responsable:</strong> Fenix IA Solutions SL</li>
                    <li><strong className="text-foreground">Domicilio:</strong> C/ La Paz, 83, 03320 Torrellano-Elche, Alicante</li>
                    <li><strong className="text-foreground">Email:</strong> <a href="mailto:contacto@fenixia.tech" className="text-primary hover:underline">contacto@fenixia.tech</a></li>
                    <li><strong className="text-foreground">Teléfono:</strong> <a href="tel:+34966101029" className="text-primary hover:underline">+34 966 10 10 29</a></li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">2. Datos que Recopilamos</h2>
                  <p className="text-muted-foreground">
                    Recopilamos los siguientes tipos de datos:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Datos de identificación (nombre, email, teléfono)</li>
                    <li>Datos de navegación y uso del sitio web</li>
                    <li>Datos de audio para el análisis con IA (cuando utilice nuestros servicios)</li>
                    <li>Datos técnicos (dirección IP, tipo de navegador, etc.)</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">3. Finalidad del Tratamiento</h2>
                  <p className="text-muted-foreground">
                    Utilizamos sus datos para:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Proporcionar nuestros servicios de análisis de voz con IA</li>
                    <li>Gestionar su cuenta y relación comercial</li>
                    <li>Enviar comunicaciones comerciales (con su consentimiento)</li>
                    <li>Mejorar nuestros servicios y sitio web</li>
                    <li>Cumplir con obligaciones legales</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">4. Base Legal</h2>
                  <p className="text-muted-foreground">
                    El tratamiento de sus datos se basa en el consentimiento otorgado, la ejecución de un contrato, el interés legítimo de nuestra empresa, y el cumplimiento de obligaciones legales.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">5. Conservación de Datos</h2>
                  <p className="text-muted-foreground">
                    Conservaremos sus datos durante el tiempo necesario para cumplir con las finalidades para las que fueron recogidos y para cumplir con las obligaciones legales aplicables.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">6. Sus Derechos</h2>
                  <p className="text-muted-foreground">
                    Tiene derecho a:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Acceder a sus datos personales</li>
                    <li>Rectificar datos inexactos</li>
                    <li>Suprimir sus datos</li>
                    <li>Limitar el tratamiento</li>
                    <li>Portabilidad de datos</li>
                    <li>Oponerse al tratamiento</li>
                    <li>Retirar el consentimiento</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">7. Seguridad</h2>
                  <p className="text-muted-foreground">
                    Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold">8. Contacto</h2>
                  <p className="text-muted-foreground">
                    Para ejercer sus derechos o resolver cualquier duda sobre el tratamiento de sus datos, puede contactarnos en <a href="mailto:contacto@fenixia.tech" className="text-primary hover:underline">contacto@fenixia.tech</a>
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

export default Privacy;
