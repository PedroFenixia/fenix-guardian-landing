import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const fenixLogo = "/assets/fenix-logo-dark.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: { label: string; href: string }[] = [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={fenixLogo} 
              alt="FENIX IA Solutions" 
              className="h-10 w-auto brightness-110 contrast-110 drop-shadow-[0_0_8px_hsl(var(--primary)/0.3)] transition-all duration-300 group-hover:brightness-125 group-hover:drop-shadow-[0_0_16px_hsl(var(--primary)/0.6)]"
            />
            <span className="text-lg font-bold text-foreground">
              FENIX <span className="text-primary">IA SOLUTIONS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-3 py-1.5 text-sm font-medium text-foreground bg-muted/50 rounded-md border border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contacto">
              <Button variant="hero" size="sm">
                Contáctanos
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
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link to="/contacto" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full">
                    Contáctanos
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
