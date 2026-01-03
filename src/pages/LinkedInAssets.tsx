import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import linkedinPedro2 from "@/assets/linkedin-pedro-2.png";
import linkedinCompany1 from "@/assets/linkedin-company-1.png";
import linkedinCompany2 from "@/assets/linkedin-company-2.png";
import linkedinProfileCompany from "@/assets/linkedin-profile-company.png";
import linkedinBannerBg from "@/assets/linkedin-banner-bg.png";
import linkedinBannerCompanyFinal from "@/assets/linkedin-banner-company-final.png";

interface AssetCardProps {
  title: string;
  description: string;
  imageSrc: string;
  fileName: string;
}

interface BannerData {
  name: string;
  subtitle: string;
  fileName: string;
  isCompany?: boolean;
}

const AssetCard = ({ title, description, imageSrc, fileName }: AssetCardProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-gunmetal/50">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button onClick={handleDownload} className="w-full gap-2">
        <Download className="h-4 w-4" />
        Descargar
      </Button>
    </div>
  );
};

const BannerWithOverlay = ({ name, subtitle, fileName, isCompany }: BannerData) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!bannerRef.current) return;
    
    try {
      const canvas = await html2canvas(bannerRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      
      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating banner:", error);
    }
  }, [fileName]);

  return (
    <div className="glass-card p-6 rounded-xl">
      <div 
        ref={bannerRef}
        className="aspect-[3/1] overflow-hidden rounded-lg mb-4 relative"
        style={{
          backgroundImage: `url(${linkedinBannerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-end pr-[8%]">
          <div className="text-right">
            <h2 
              className="font-bold text-white tracking-wide"
              style={{ 
                fontSize: isCompany ? "clamp(1.75rem, 5vw, 3.5rem)" : "clamp(1.5rem, 4vw, 3rem)",
                textShadow: `
                  0 0 10px rgba(255, 255, 255, 0.3),
                  0 0 20px rgba(255, 255, 255, 0.2),
                  0 4px 15px rgba(0, 0, 0, 0.8),
                  0 8px 30px rgba(0, 0, 0, 0.6)
                `,
                fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              {name}
            </h2>
            <p 
              className="font-semibold mt-2"
              style={{ 
                fontSize: "clamp(0.875rem, 2.5vw, 1.5rem)",
                color: "#15F0FF",
                textShadow: `
                  0 0 10px rgba(21, 240, 255, 0.8),
                  0 0 20px rgba(21, 240, 255, 0.6),
                  0 0 40px rgba(21, 240, 255, 0.4),
                  0 0 60px rgba(21, 240, 255, 0.2),
                  0 2px 10px rgba(0, 0, 0, 0.5)
                `,
                fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Banner {isCompany ? "FENIX IA (Empresa)" : name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {isCompany ? "Banner corporativo con fénix" : "Banner personal con fénix"}
      </p>
      <Button onClick={handleDownload} className="w-full gap-2">
        <Download className="h-4 w-4" />
        Descargar
      </Button>
    </div>
  );
};

const LinkedInAssets = () => {
  const pedroAssets = [
    {
      title: "Pedro Sánchez",
      description: "Foto de perfil profesional con camiseta FENIXIA",
      imageSrc: linkedinPedro2,
      fileName: "linkedin-pedro-sanchez.png",
    },
  ];

  const companyAssets = [
    {
      title: "FENIX IA - Perfil (Recomendado)",
      description: "Escudo fénix minimalista con brillo cyan",
      imageSrc: linkedinProfileCompany,
      fileName: "linkedin-fenixia-profile.png",
    },
    {
      title: "FENIXIA - Opción 1",
      description: "Logo corporativo con fénix y texto",
      imageSrc: linkedinCompany1,
      fileName: "linkedin-fenixia-company-1.png",
    },
    {
      title: "FENIXIA - Opción 2",
      description: "Logo corporativo con escudo y alas",
      imageSrc: linkedinCompany2,
      fileName: "linkedin-fenixia-company-2.png",
    },
  ];

  const bannerOverlays: BannerData[] = [
    {
      name: "FENIX IA",
      subtitle: "Inteligencia Artificial para Empresas",
      fileName: "linkedin-banner-fenixia.png",
      isCompany: true,
    },
    {
      name: "Pedro Sánchez",
      subtitle: "Co-Founder | FENIX IA",
      fileName: "linkedin-banner-pedro.png",
    },
    {
      name: "Jose J. Antón",
      subtitle: "Co-Founder | FENIX IA",
      fileName: "linkedin-banner-jose.png",
    },
    {
      name: "Izhar Sanz",
      subtitle: "Co-Founder | FENIX IA",
      fileName: "linkedin-banner-izhar.png",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Imágenes de <span className="text-primary">LinkedIn</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descarga las imágenes de perfil generadas para LinkedIn. Haz clic en "Descargar" para guardar cada imagen.
          </p>
        </div>

        {/* Pedro Sánchez Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Perfil de Pedro Sánchez
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {pedroAssets.map((asset) => (
              <AssetCard key={asset.fileName} {...asset} />
            ))}
          </div>
        </div>

        {/* Company Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Perfil de Empresa FENIX IA
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {companyAssets.map((asset) => (
              <AssetCard key={asset.fileName} {...asset} />
            ))}
          </div>
        </div>

        {/* Banners Section with Overlays */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Banners de LinkedIn
          </h2>
          <p className="text-center text-muted-foreground mb-6 text-sm">
            Banners generados con texto HTML para tipografía perfecta
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {bannerOverlays.map((banner) => (
              <BannerWithOverlay key={banner.fileName} {...banner} />
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Tamaño recomendado: Perfil 400x400px • Banners 1584x512px • Imágenes en alta resolución
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkedInAssets;
