import { useState } from "react";
import { Download, FolderArchive, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import JSZip from "jszip";
import linkedinPedro2 from "@/assets/linkedin-pedro-2.png";
import linkedinCompany1 from "@/assets/linkedin-company-1.png";
import linkedinCompany2 from "@/assets/linkedin-company-2.png";
import linkedinProfileCompany from "@/assets/linkedin-profile-company.png";
import linkedinBannerPedro from "@/assets/linkedin-banner-pedro.png";
import linkedinBannerJose from "@/assets/linkedin-banner-jose.png";
import linkedinBannerIzhar from "@/assets/linkedin-banner-izhar.png";
import linkedinBannerCompany from "@/assets/linkedin-banner-company-final.png";
import linkedinBannerPedroV2 from "@/assets/linkedin-banner-pedro-v2.png";
import linkedinBannerJoseV2 from "@/assets/linkedin-banner-jose-v2.png";
import linkedinBannerIzharV2 from "@/assets/linkedin-banner-izhar-v2.png";
import linkedinBannerCompanyV2 from "@/assets/linkedin-banner-company-v3.png";
import linkedinBannerPedroV3 from "@/assets/linkedin-banner-pedro-v3.png";
import linkedinBannerJoseV3 from "@/assets/linkedin-banner-jose-v3.png";
import linkedinBannerIzharV3 from "@/assets/linkedin-banner-izhar-v3.png";
import linkedinBannerCompanyV3 from "@/assets/linkedin-banner-company-v4.png";
import linkedinBannerJoseV4 from "@/assets/linkedin-banner-jose-v4.png";
import linkedinBannerJoseV5 from "@/assets/linkedin-banner-jose-v5.png";
import linkedinBannerPedroV4 from "@/assets/linkedin-banner-pedro-v4.png";
import linkedinBannerPedroV5 from "@/assets/linkedin-banner-pedro-v5.png";
import linkedinBannerIzharV4 from "@/assets/linkedin-banner-izhar-v4.png";
import linkedinBannerIzharV5 from "@/assets/linkedin-banner-izhar-v5.png";
import linkedinBannerCompanyV4 from "@/assets/linkedin-banner-company-v5.png";
import linkedinBannerCompanyV5 from "@/assets/linkedin-banner-company-v6.png";
import linkedinBannerPedroV6 from "@/assets/linkedin-banner-pedro-v6.png";
import linkedinBannerPedroV7 from "@/assets/linkedin-banner-pedro-v7.png";
import linkedinBannerIzharV6 from "@/assets/linkedin-banner-izhar-v6.png";
import linkedinBannerIzharV7 from "@/assets/linkedin-banner-izhar-v7.png";
import linkedinBannerCompanyV6 from "@/assets/linkedin-banner-company-v7.png";
import linkedinBannerCompanyV7 from "@/assets/linkedin-banner-company-v8.png";

interface AssetCardProps {
  title: string;
  description: string;
  imageSrc: string;
  fileName: string;
}

interface BannerAsset {
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

interface BannerCardProps extends AssetCardProps {
  onPreview: (imageSrc: string, title: string) => void;
}

const BannerCard = ({ title, description, imageSrc, fileName, onPreview }: BannerCardProps) => {
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
      <div 
        className="aspect-[3/1] overflow-hidden rounded-lg mb-4 bg-gunmetal/50 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
        onClick={() => onPreview(imageSrc, title)}
      >
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

interface BannerSectionProps {
  title: string;
  banners: BannerAsset[];
  zipFileName: string;
  onPreview: (imageSrc: string, title: string) => void;
}

const BannerSection = ({ title, banners, zipFileName, onPreview }: BannerSectionProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      
      for (const banner of banners) {
        const response = await fetch(banner.imageSrc);
        const blob = await response.blob();
        zip.file(banner.fileName, blob);
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error creating ZIP:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-4 mb-4">
        <h3 className="text-xl font-medium text-primary">{title}</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadAll}
          disabled={isDownloading}
          className="gap-2"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FolderArchive className="h-4 w-4" />
          )}
          {isDownloading ? "Creando ZIP..." : "Descargar todo (ZIP)"}
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {banners.map((banner) => (
          <BannerCard key={banner.fileName} {...banner} onPreview={onPreview} />
        ))}
      </div>
    </div>
  );
};

const LinkedInAssets = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handlePreview = (imageSrc: string, title: string) => {
    setPreviewImage({ src: imageSrc, title });
    setPreviewOpen(true);
  };

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

  const companyBanners = [
    { title: "V1 - Escudo izquierda", description: "Diseño original", imageSrc: linkedinBannerCompany, fileName: "linkedin-banner-fenixia-v1.png" },
    { title: "V2 - Escudo cerca", description: "Desplazado a la derecha", imageSrc: linkedinBannerCompanyV2, fileName: "linkedin-banner-fenixia-v2.png" },
    { title: "V3 - Escudo derecha", description: "Escudo a la derecha del texto", imageSrc: linkedinBannerCompanyV3, fileName: "linkedin-banner-fenixia-v3.png" },
    { title: "V4 - Llama sutil (izq)", description: "Brillo ámbar inferior", imageSrc: linkedinBannerCompanyV4, fileName: "linkedin-banner-fenixia-v4.png" },
    { title: "V5 - Llama sutil (der)", description: "Brillo ámbar, escudo derecha", imageSrc: linkedinBannerCompanyV5, fileName: "linkedin-banner-fenixia-v5.png" },
    { title: "V6 - Llama intensa (izq)", description: "Llamas intensas, escudo izq", imageSrc: linkedinBannerCompanyV6, fileName: "linkedin-banner-fenixia-v6.png" },
    { title: "V7 - Llama intensa (der)", description: "Llamas intensas, escudo der", imageSrc: linkedinBannerCompanyV7, fileName: "linkedin-banner-fenixia-v7.png" },
  ];

  const pedroBanners = [
    { title: "V1 - Escudo izquierda", description: "Diseño original", imageSrc: linkedinBannerPedro, fileName: "linkedin-banner-pedro-v1.png" },
    { title: "V2 - Escudo cerca", description: "Desplazado a la derecha", imageSrc: linkedinBannerPedroV2, fileName: "linkedin-banner-pedro-v2.png" },
    { title: "V3 - Escudo derecha", description: "Escudo a la derecha del texto", imageSrc: linkedinBannerPedroV3, fileName: "linkedin-banner-pedro-v3.png" },
    { title: "V4 - Llama sutil (izq)", description: "Brillo ámbar inferior", imageSrc: linkedinBannerPedroV4, fileName: "linkedin-banner-pedro-v4.png" },
    { title: "V5 - Llama sutil (der)", description: "Brillo ámbar, escudo derecha", imageSrc: linkedinBannerPedroV5, fileName: "linkedin-banner-pedro-v5.png" },
    { title: "V6 - Llama intensa (izq)", description: "Llamas intensas, escudo izq", imageSrc: linkedinBannerPedroV6, fileName: "linkedin-banner-pedro-v6.png" },
    { title: "V7 - Llama intensa (der)", description: "Llamas intensas, escudo der", imageSrc: linkedinBannerPedroV7, fileName: "linkedin-banner-pedro-v7.png" },
  ];

  const joseBanners = [
    { title: "V1 - Escudo izquierda", description: "Diseño original", imageSrc: linkedinBannerJose, fileName: "linkedin-banner-jose-v1.png" },
    { title: "V2 - Escudo cerca", description: "Sin llama, escudo izquierda", imageSrc: linkedinBannerJoseV2, fileName: "linkedin-banner-jose-v2.png" },
    { title: "V3 - Escudo derecha", description: "Sin llama, escudo derecha", imageSrc: linkedinBannerJoseV3, fileName: "linkedin-banner-jose-v3.png" },
    { title: "V4 - Con llamas (izq)", description: "Llamas en la parte inferior", imageSrc: linkedinBannerJoseV4, fileName: "linkedin-banner-jose-v4.png" },
    { title: "V5 - Con llamas (der)", description: "Llamas, escudo derecha", imageSrc: linkedinBannerJoseV5, fileName: "linkedin-banner-jose-v5.png" },
  ];

  const izharBanners = [
    { title: "V1 - Escudo izquierda", description: "Diseño original", imageSrc: linkedinBannerIzhar, fileName: "linkedin-banner-izhar-v1.png" },
    { title: "V2 - Escudo cerca", description: "Desplazado a la derecha", imageSrc: linkedinBannerIzharV2, fileName: "linkedin-banner-izhar-v2.png" },
    { title: "V3 - Escudo derecha", description: "Escudo a la derecha del texto", imageSrc: linkedinBannerIzharV3, fileName: "linkedin-banner-izhar-v3.png" },
    { title: "V4 - Llama sutil (izq)", description: "Brillo ámbar inferior", imageSrc: linkedinBannerIzharV4, fileName: "linkedin-banner-izhar-v4.png" },
    { title: "V5 - Llama sutil (der)", description: "Brillo ámbar, escudo derecha", imageSrc: linkedinBannerIzharV5, fileName: "linkedin-banner-izhar-v5.png" },
    { title: "V6 - Llama intensa (izq)", description: "Llamas intensas, escudo izq", imageSrc: linkedinBannerIzharV6, fileName: "linkedin-banner-izhar-v6.png" },
    { title: "V7 - Llama intensa (der)", description: "Llamas intensas, escudo der", imageSrc: linkedinBannerIzharV7, fileName: "linkedin-banner-izhar-v7.png" },
  ];

  const allBanners = [...companyBanners, ...pedroBanners, ...joseBanners, ...izharBanners];

  const handleDownloadAllBanners = async () => {
    setIsDownloadingAll(true);
    try {
      const zip = new JSZip();
      
      // Create folders for each person/company
      const folders = {
        empresa: companyBanners,
        pedro: pedroBanners,
        jose: joseBanners,
        izhar: izharBanners,
      };

      for (const [folderName, banners] of Object.entries(folders)) {
        for (const banner of banners) {
          const response = await fetch(banner.imageSrc);
          const blob = await response.blob();
          zip.file(`${folderName}/${banner.fileName}`, blob);
        }
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "todos-los-banners-fenixia.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error creating ZIP:", error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

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

        {/* Pedro Sánchez Profile Section */}
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

        {/* Company Profile Section */}
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

        {/* Banners Section - Grouped by Person */}
        <div className="mb-12">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Banners de LinkedIn
            </h2>
            <p className="text-center text-muted-foreground mb-4 text-sm">
              3 versiones por persona: V1 (escudo izquierda), V2 (escudo cerca del nombre), V3 (escudo derecha)
            </p>
            <Button 
              onClick={handleDownloadAllBanners}
              disabled={isDownloadingAll}
              className="gap-2"
            >
              {isDownloadingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FolderArchive className="h-4 w-4" />
              )}
              {isDownloadingAll ? "Creando ZIP..." : `Descargar todos los banners (${allBanners.length})`}
            </Button>
          </div>

          <BannerSection 
            title="FENIX IA (Empresa)" 
            banners={companyBanners} 
            zipFileName="banners-fenixia-empresa.zip" 
            onPreview={handlePreview}
          />

          <BannerSection 
            title="Pedro Sánchez" 
            banners={pedroBanners} 
            zipFileName="banners-pedro-sanchez.zip" 
            onPreview={handlePreview}
          />

          <BannerSection 
            title="Jose J. Antón" 
            banners={joseBanners} 
            zipFileName="banners-jose-anton.zip" 
            onPreview={handlePreview}
          />

          <BannerSection 
            title="Izhar Sanz" 
            banners={izharBanners} 
            zipFileName="banners-izhar-sanz.zip" 
            onPreview={handlePreview}
          />
        </div>

        {/* Preview Modal */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm border-border">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {previewImage && (
              <div className="p-4">
                <img
                  src={previewImage.src}
                  alt={previewImage.title}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-center mt-4 text-lg font-medium text-foreground">
                  {previewImage.title}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
