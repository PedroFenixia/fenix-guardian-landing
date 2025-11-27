import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import fenixLogo from "@/assets/fenix-final.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Producto", href: "#features" },
    { label: "Tarifas", href: "#pricing" },
    { label: "Casos de uso", href: "#testimonials" },
    { label: "Contacto", href: "#footer" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative p-0.5 rounded-lg bg-gradient-to-br from-primary/30 via-primary/10 to-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.2)] transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              <div className="rounded-md overflow-hidden bg-background/20 backdrop-blur-sm">
                <img 
                  src={fenixLogo} 
                  alt="Fenix Guardian Monitor" 
                  className="h-9 w-9 object-contain"
                  style={{ filter: 'drop-shadow(0 0 8px hsl(184 100% 54% / 0.3))' }}
                />
              </div>
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:block">
              Fenix <span className="text-primary">Guardian</span> <span className="text-muted-foreground font-medium">Monitor</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
            <Button variant="hero" size="sm">
              Empezar prueba
            </Button>
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
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Button variant="ghost" size="sm" className="justify-start">
                  Iniciar sesión
                </Button>
                <Button variant="hero" size="sm">
                  Empezar prueba
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
