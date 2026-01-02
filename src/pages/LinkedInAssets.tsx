import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import linkedinPedro1 from "@/assets/linkedin-pedro-1.png";
import linkedinPedro2 from "@/assets/linkedin-pedro-2.png";
import linkedinCompany1 from "@/assets/linkedin-company-1.png";
import linkedinCompany2 from "@/assets/linkedin-company-2.png";

interface AssetCardProps {
  title: string;
  description: string;
  imageSrc: string;
  fileName: string;
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
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Perfil de Empresa FENIXIA
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {companyAssets.map((asset) => (
              <AssetCard key={asset.fileName} {...asset} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Tamaño recomendado para LinkedIn: 400x400 píxeles (perfil) • Las imágenes están en 1024x1024 para máxima calidad
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkedInAssets;
