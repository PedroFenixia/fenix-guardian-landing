import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
const fenixLogo = "/logoFENIXIA.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Producto", sectionId: "producto" },
    { label: "Fuentes", sectionId: "fuentes" },
    { label: "Cómo funciona", sectionId: "como-funciona" },
    { label: "Casos de uso", sectionId: "casos-de-uso" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? "bg-background/80 backdrop-blur-md border-b border-border/30 shadow-lg shadow-black/10"
        : "bg-background border-b border-transparent"
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={fenixLogo} alt="FENIX Guardian" className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold text-foreground">
              FENIX <span style={{ color: '#f59e0b' }}>Guardian</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.sectionId)}
                className="px-3 py-1.5 text-sm font-medium text-foreground bg-muted/50 rounded-md border border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/contacto"
              className="px-3 py-1.5 text-sm font-medium text-foreground bg-muted/50 rounded-md border border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
            >
              Contacto
            </Link>
            <a
              href="https://fenixia.tech"
              target="_blank"
              rel="noopener"
              className="px-3 py-1.5 text-sm font-medium text-foreground bg-muted/50 rounded-md border border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
            >
              Ecosistema Fenixia
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contacto">
              <Button variant="hero" size="sm">
                Solicitar demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in-up">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.sectionId)}
                  className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/contacto"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <a
                href="https://fenixia.tech"
                target="_blank"
                rel="noopener"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ecosistema Fenixia
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link to="/contacto" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full">
                    Solicitar demo
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
