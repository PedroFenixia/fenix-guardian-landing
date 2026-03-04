import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useRecaptcha } from "@/hooks/use-recaptcha";

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100, "El nombre es demasiado largo"),
  email: z.string().trim().email("Email inválido").max(255, "El email es demasiado largo"),
  company: z.string().trim().max(100, "El nombre de la empresa es demasiado largo").optional().default(""),
  message: z.string().trim().min(1, "El mensaje es requerido").max(2000, "El mensaje es demasiado largo"),
});

const Contact = () => {
  const { toast } = useToast();
  const { executeRecaptcha } = useRecaptcha();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate input with zod
      const validatedData = contactSchema.parse(formData);
      
      // Get reCAPTCHA token (optional - form works without it)
      const recaptchaToken = await executeRecaptcha('contact_form');
      console.log('reCAPTCHA token:', recaptchaToken ? 'obtained' : 'not configured (skipping)');
      // Submit to database
      const { error } = await supabase
        .from('demo_requests')
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company || '',
          message: validatedData.message,
        });
      
      if (error) {
        throw new Error(error.message);
      }

      // Send to Holded CRM with reCAPTCHA token
      try {
        const holdedResponse = await supabase.functions.invoke('holded-lead', {
          body: {
            name: validatedData.name,
            email: validatedData.email,
            company: validatedData.company || '',
            message: validatedData.message,
            recaptchaToken,
          },
        });
        
        // Silent handling - errors are logged server-side
      } catch {
        // Silent handling - errors are logged server-side
      }
      
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });
      
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0]?.message || "Por favor revisa los campos del formulario",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje. Por favor intenta de nuevo.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Solicitar <span className="text-primary">demo</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground">
                ¿Quieres ver Prospector en acción? Solicita una demo personalizada y te mostraremos cómo detectar oportunidades desde fuentes públicas.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Nombre</label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">Empresa (opcional)</label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Tu empresa"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Mensaje</label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Cuéntanos sobre tu proyecto..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                  {/* reCAPTCHA notice - only show if configured */}
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>
                  <p className="text-muted-foreground mb-8">
                    Estamos aquí para ayudarte. No dudes en contactarnos por cualquiera de estos medios.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:contacto@fenixia.tech" className="text-muted-foreground hover:text-primary transition-colors">
                        contacto@fenixia.tech
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Ubicación</h3>
                      <p className="text-muted-foreground">
                        C/ La Paz, 83<br />
                        03320 Torrellano (Elche), Alicante
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="pt-6 border-t border-border/50">
                  <h3 className="font-semibold mb-4">Síguenos</h3>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
