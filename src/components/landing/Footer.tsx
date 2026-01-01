import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    empresa: [
      { label: "Sobre nosotros", href: "/nosotros" },
      { label: "Carreras", href: "/carreras" },
    ],
    contacto: [
      { label: "contacto@fenixia.tech", href: "mailto:contacto@fenixia.tech" },
      { label: "+34 966 10 10 29", href: "tel:+34966101029" },
    ],
    dirección: [
      { label: "C/ La Paz, 83", href: "https://maps.google.com/?q=C/+La+Paz,+83,+03320+Torrellano-Elche,+Alicante" },
      { label: "03320 Torrellano-Elche", href: "https://maps.google.com/?q=C/+La+Paz,+83,+03320+Torrellano-Elche,+Alicante" },
      { label: "Alicante, España", href: "https://maps.google.com/?q=C/+La+Paz,+83,+03320+Torrellano-Elche,+Alicante" },
    ],
  };

  return (
    <footer id="footer" className="py-16 lg:py-20 border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <span className="text-lg font-bold text-foreground">
                FENIX <span className="text-primary">IA SOLUTIONS</span>
              </span>
            </Link>
            <p className="text-sm text-foreground/80 mb-6 max-w-xs">
              Transformamos empresas con soluciones de inteligencia artificial innovadoras y personalizadas.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4 capitalize">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/80">
            © 2026 FENIX IA SOLUTIONS SL. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/terminos" className="hover:text-foreground transition-colors">Aviso Legal</Link>
            <Link to="/privacidad" className="hover:text-foreground transition-colors">Política de Privacidad</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Política de Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
