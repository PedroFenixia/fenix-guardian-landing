import { useState, useRef } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface SignatureProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  linkedin?: string;
}

const SignatureTemplate = ({ name, role, email, phone, linkedin }: SignatureProps) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);

  const logoUrl = typeof window !== "undefined"
    ? `${window.location.origin}/logoFENIXIA.png`
    : "/logoFENIXIA.png";

  // QR: use an URL that downloads the contact (more compatible than embedding VCARD in QR)
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');
  const phoneClean = phone.replace(/\s/g, '');

  const vCardUrl = typeof window !== "undefined"
    ? `${window.location.origin}/vcard?${new URLSearchParams({
        name,
        role,
        email,
        phone: phoneClean,
        auto: "1",
      }).toString()}`
    : `/vcard?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phoneClean)}&auto=1`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(vCardUrl)}&bgcolor=1A1C1E&color=15F0FF`;

  const signatureHtml = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.5; background-color: #1A1C1E; padding: 32px 40px; border-radius: 8px; width: 100%; max-width: 700px;">
  <tr>
    <!-- Logo centrado -->
    <td style="padding-right: 20px; border-right: 3px solid #15F0FF; vertical-align: middle; text-align: center; width: 160px;">
      <img src="${logoUrl}" alt="Fenix IA" width="130" height="130" style="display: block; border-radius: 8px; margin: 0 auto;" />
    </td>
    <!-- Contenido central -->
    <td style="padding-left: 24px; padding-right: 24px; vertical-align: top;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 20px; font-weight: bold; color: #FFFFFF; padding-bottom: 4px;">
            ${name}
          </td>
        </tr>
        <tr>
          <td style="font-size: 14px; color: #15F0FF; font-weight: 500; padding-bottom: 14px;">
            ${role}
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; padding-bottom: 5px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 8px; vertical-align: middle;">
                  <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" width="14" height="14" style="display: block;" />
                </td>
                <td style="vertical-align: middle;">
                  <a href="mailto:${email}" style="color: #FFFFFF; text-decoration: none;">${email}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; padding-bottom: 5px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 8px; vertical-align: middle;">
                  <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" alt="Teléfono" width="14" height="14" style="display: block;" />
                </td>
                <td style="vertical-align: middle;">
                  <a href="tel:${phone.replace(/\s/g, '')}" style="color: #FFFFFF; text-decoration: none;">${phone}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; padding-bottom: 5px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 8px; vertical-align: middle;">
                  <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="Web" width="14" height="14" style="display: block;" />
                </td>
                <td style="vertical-align: middle;">
                  <a href="https://fenixia.tech" style="color: #15F0FF; text-decoration: none; font-weight: 500;">fenixia.tech</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="font-size: 12px; padding-bottom: 10px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 8px; vertical-align: middle;">
                  <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Dirección" width="14" height="14" style="display: block;" />
                </td>
                <td style="vertical-align: middle;">
                  <span style="color: #D9D9D9;">C/ La Paz, 83 · 03320 Torrellano-Elche · Alicante</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 6px;">
            <a href="${linkedin || 'https://www.linkedin.com/company/fenixiasolutions'}" style="text-decoration: none;">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="22" height="22" style="display: inline-block;" />
            </a>
          </td>
        </tr>
      </table>
    </td>
    <!-- QR a la derecha -->
    <td style="padding-left: 20px; border-left: 3px solid #15F0FF; vertical-align: middle; text-align: center; width: 120px;">
      <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
        <tr>
          <td style="text-align: center;">
            <img src="${qrCodeUrl}" alt="Tarjeta de visita" width="90" height="90" style="display: block; margin: 0 auto; border-radius: 4px;" />
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <span style="font-size: 9px; color: #D9D9D9; display: block; margin-top: 6px;">Escanea para guardar</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `.trim();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(signatureHtml);
      setCopied(true);
      toast({
        title: "Copiado",
        description: `Firma de ${name} copiada al portapapeles`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar la firma",
        variant: "destructive",
      });
    }
  };

  const downloadAsPng = async () => {
    if (!signatureRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(signatureRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement("a");
      link.download = `firma-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast({
        title: "Descargado",
        description: `Firma de ${name} guardada como imagen`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo descargar la firma",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadAsPng}
            className="gap-2"
            disabled={downloading}
          >
            <Download className="h-4 w-4" />
            {downloading ? "Descargando..." : "Descargar PNG"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar HTML"}
          </Button>
        </div>
      </div>
      
      {/* Preview */}
      <div className="rounded-lg overflow-hidden">
        <div ref={signatureRef} dangerouslySetInnerHTML={{ __html: signatureHtml }} />
      </div>
    </div>
  );
};
const Signatures = () => {
  const signatures = [
    {
      name: "Pedro Sánchez",
      role: "Co-Founder",
      email: "pedro@fenixia.tech",
      phone: "+34 620 654 925",
      linkedin: "https://www.linkedin.com/in/pedro-sánchez-81b4a0377",
    },
    {
      name: "Jose J. Antón",
      role: "Co-Founder",
      email: "jose@fenixia.tech",
      phone: "+34 966 10 10 29",
    },
    {
      name: "Izhar Sanz",
      role: "Co-Founder",
      email: "izhar@fenixia.tech",
      phone: "+34 966 10 10 29",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Firmas de <span className="text-primary">Email</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Copia el código HTML de tu firma y pégalo en la configuración de firma de tu cliente de correo.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {signatures.map((sig) => (
            <SignatureTemplate key={sig.email} {...sig} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="glass-card p-6 rounded-xl max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Instrucciones</h3>
            <ol className="text-left text-muted-foreground space-y-2 text-sm">
              <li>1. Haz clic en "Copiar HTML" para copiar el código de tu firma</li>
              <li>2. Abre la configuración de tu cliente de correo (Gmail, Outlook, etc.)</li>
              <li>3. Busca la opción de "Firma" en la configuración</li>
              <li>4. Pega el código HTML en el editor de firma</li>
              <li>5. Guarda los cambios</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signatures;
