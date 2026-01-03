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
  photo?: string;
}

const SignatureTemplate = ({ name, role, email, phone, linkedin, photo }: SignatureProps) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const safeLinkedinUrl = (value?: string) => {
    const fallback = "https://www.linkedin.com/company/fenixiasolutions/";
    if (!value) return fallback;
    try {
      const url = new URL(value);
      const isHttp = url.protocol === "https:" || url.protocol === "http:";
      const host = url.hostname.toLowerCase();
      const isLinkedIn = host === "linkedin.com" || host.endsWith(".linkedin.com");
      return isHttp && isLinkedIn ? url.toString() : fallback;
    } catch {
      return fallback;
    }
  };

  const phoneClean = phone.replace(/\s/g, "");

  const vCardParams: Record<string, string> = {
    name,
    role,
    email,
    phone: phoneClean,
    auto: "1",
  };

  if (linkedin) {
    vCardParams.linkedin = linkedin;
  }

  if (photo) {
    vCardParams.photo = photo;
  }

  const productionDomain = "https://fenixia.tech";
  const vCardUrl = `${productionDomain}/vcard?${new URLSearchParams(vCardParams).toString()}`;

  // White background for QR
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(vCardUrl)}&bgcolor=FFFFFF&color=1A1A1A`;

  // Logo URL - using production domain for email clients (alpha transparent PNG)
  const logoUrl = "https://fenixia.tech/assets/fenix-logo-alpha.png";

  const safeName = escapeHtml(name);
  const safeRole = escapeHtml(role);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safePhoneHref = escapeHtml(phoneClean);
  const safeLinkedinHref = escapeHtml(safeLinkedinUrl(linkedin));

  // V2: White background (#FFFFFF) for better email client compatibility
  const signatureHtml = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.4; background-color: #FFFFFF; padding: 16px 20px; border-radius: 10px; width: 100%; max-width: 620px; border: 1px solid #E0E0E0;">
  <tr>
    <td style="padding-left: 8px; padding-right: 10px; border-right: 1px solid #D0D0D0; vertical-align: middle; text-align: center; width: 90px; background-color: #FFFFFF;">
      <img src="${qrCodeUrl}" alt="Tarjeta de visita" width="75" height="75" style="display: block; margin: auto; border: 1px solid #D0D0D0; border-radius: 5px; padding: 3px; background-color: #FFFFFF;" />
    </td>
    <td style="padding-left: 16px; padding-right: 16px; vertical-align: middle; background-color: #FFFFFF;">
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
        <tr>
          <td style="font-size: 18px; font-weight: bold; color: #1A1A1A; padding-bottom: 1px; padding-top: 4px;">${safeName}</td>
          <td rowspan="6" style="vertical-align: top; text-align: right; padding-left: 10px; width: 90px;">
            <img src="${logoUrl}" alt="FENIXIA" width="85" height="85" style="display: block;" />
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #0891B2; font-weight: 500; padding-bottom: 10px;">
            ${safeRole}
            <a href="${safeLinkedinHref}" style="text-decoration: none; margin-left: 6px; vertical-align: middle;">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="16" height="16" style="display: inline-block; vertical-align: middle;" />
            </a>
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; padding-bottom: 6px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 10px; vertical-align: middle;">
                  <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" width="16" height="16" style="display: block;" />
                </td>
                <td style="vertical-align: middle;">
                  <a href="mailto:${safeEmail}" style="color: #1A1A1A; text-decoration: none;">${safeEmail}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; padding-bottom: 6px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 10px; vertical-align: middle;">
                  <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" alt="Teléfono" width="16" height="16" style="display: block;" />
                </td>
                <td style="vertical-align: middle;">
                  <a href="tel:${safePhoneHref}" style="color: #1A1A1A; text-decoration: none;">${safePhone}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; padding-bottom: 6px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 10px; vertical-align: middle;">
                  <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="Web" width="16" height="16" style="display: block; filter: invert(40%) sepia(90%) saturate(500%) hue-rotate(150deg) brightness(95%) contrast(95%);" />
                </td>
                <td style="vertical-align: middle;">
                  <a href="https://fenixia.tech" style="color: #0891B2; text-decoration: none; font-weight: 500;">fenixia.tech</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="font-size: 12px; padding-bottom: 10px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 10px; vertical-align: middle;">
                  <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Dirección" width="16" height="16" style="display: block; filter: invert(45%) sepia(90%) saturate(500%) hue-rotate(330deg) brightness(95%) contrast(95%);" />
                </td>
                <td style="vertical-align: middle;">
                  <span style="color: #1A1A1A;">C/ La Paz, 83 · 03320 Torrellano (Elche)</span>
                </td>
              </tr>
            </table>
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
    } catch {
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
        backgroundColor: "#F5F5F5",
        scale: 4, // Higher resolution for better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `firma-v2-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast({
        title: "Descargado",
        description: `Firma de ${name} guardada en alta resolución`,
      });
    } catch {
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
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl">
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
            {downloading ? "Descargando..." : "Descargar PNG HD"}
          </Button>
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar HTML"}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-lg overflow-hidden">
        <div ref={signatureRef}>
          <table
            cellPadding={0}
            cellSpacing={0}
            border={0}
            style={{
              fontFamily: "'Segoe UI', Arial, sans-serif",
              fontSize: 14,
              lineHeight: 1.4,
              backgroundColor: "#FFFFFF",
              padding: "16px 20px",
              borderRadius: 10,
              width: "100%",
              maxWidth: 620,
              border: "1px solid #E0E0E0",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    paddingLeft: 8,
                    paddingRight: 10,
                    borderRight: "1px solid #D0D0D0",
                    verticalAlign: "middle",
                    textAlign: "center",
                    width: 90,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <img
                    src={qrCodeUrl}
                    alt="Tarjeta de visita"
                    width={75}
                    height={75}
                    style={{ display: "block", margin: "auto", border: "1px solid #D0D0D0", borderRadius: 5, padding: 3, backgroundColor: "#FFFFFF" }}
                  />
                </td>

                <td style={{ paddingLeft: 16, paddingRight: 16, verticalAlign: "middle", backgroundColor: "#FFFFFF" }}>
                  <table cellPadding={0} cellSpacing={0} border={0} style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ fontSize: 18, fontWeight: "bold", color: "#1A1A1A", paddingBottom: 1, paddingTop: 4 }}>{name}</td>
                        <td rowSpan={6} style={{ verticalAlign: "top", textAlign: "right", paddingLeft: 10, width: 50 }}>
                          <img
                            src={logoUrl}
                            alt="FENIXIA"
                            width={45}
                            height={45}
                            style={{ display: "block" }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: 13, color: "#0891B2", fontWeight: 500, paddingBottom: 10 }}>
                          {role}
                          <a 
                            href={safeLinkedinUrl(linkedin)} 
                            style={{ textDecoration: "none", marginLeft: 6, verticalAlign: "middle" }}
                            className="transition-transform duration-200 hover:scale-110 inline-block"
                          >
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                              alt="LinkedIn"
                              width={16}
                              height={16}
                              style={{ display: "inline-block", verticalAlign: "middle" }}
                              className="transition-opacity duration-200 hover:opacity-80"
                            />
                          </a>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ fontSize: 13, paddingBottom: 6 }}>
                          <table cellPadding={0} cellSpacing={0} border={0}>
                            <tbody>
                              <tr>
                                <td style={{ paddingRight: 10, verticalAlign: "middle" }}>
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                                    alt="Email"
                                    width={16}
                                    height={16}
                                    style={{ display: "block" }}
                                  />
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <a 
                                    href={`mailto:${email}`} 
                                    style={{ color: "#1A1A1A", textDecoration: "none" }}
                                    className="transition-opacity duration-200 hover:opacity-70"
                                  >
                                    {email}
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ fontSize: 13, paddingBottom: 6 }}>
                          <table cellPadding={0} cellSpacing={0} border={0}>
                            <tbody>
                              <tr>
                                <td style={{ paddingRight: 10, verticalAlign: "middle" }}>
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
                                    alt="Teléfono"
                                    width={16}
                                    height={16}
                                    style={{ display: "block" }}
                                  />
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <a 
                                    href={`tel:${phoneClean}`} 
                                    style={{ color: "#1A1A1A", textDecoration: "none" }}
                                    className="transition-opacity duration-200 hover:opacity-70"
                                  >
                                    {phone}
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ fontSize: 13, paddingBottom: 6 }}>
                          <table cellPadding={0} cellSpacing={0} border={0}>
                            <tbody>
                              <tr>
                                <td style={{ paddingRight: 10, verticalAlign: "middle" }}>
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
                                    alt="Web"
                                    width={16}
                                    height={16}
                                    style={{ display: "block", filter: "invert(40%) sepia(90%) saturate(500%) hue-rotate(150deg) brightness(95%) contrast(95%)" }}
                                  />
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <a
                                    href="https://fenixia.tech"
                                    style={{ color: "#0891B2", textDecoration: "none", fontWeight: 500 }}
                                    className="transition-opacity duration-200 hover:opacity-70"
                                  >
                                    fenixia.tech
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ fontSize: 12, paddingBottom: 10 }}>
                          <table cellPadding={0} cellSpacing={0} border={0}>
                            <tbody>
                              <tr>
                                <td style={{ paddingRight: 10, verticalAlign: "middle" }}>
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                                    alt="Dirección"
                                    width={16}
                                    height={16}
                                    style={{ display: "block", filter: "invert(45%) sepia(90%) saturate(500%) hue-rotate(330deg) brightness(95%) contrast(95%)" }}
                                  />
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <span style={{ color: "#1A1A1A" }}>
                                    C/ La Paz, 83 · 03320 Torrellano (Elche)
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SignaturesV2 = () => {
  const signatures = [
    {
      name: "Pedro Sánchez",
      role: "Co-founder",
      email: "pedro@fenixia.tech",
      phone: "+34 620 654 925",
      linkedin: "https://www.linkedin.com/in/pedro-sánchez-81b4a0377/",
      photo: "https://fenixia.tech/assets/pedro-updated.jpeg",
    },
    {
      name: "Jose J. Antón",
      role: "Co-founder",
      email: "jose@fenixia.tech",
      phone: "+34 622 848 746",
    },
    {
      name: "Izhar Sanz",
      role: "Co-founder",
      email: "izhar@fenixia.tech",
      phone: "+34 622 848 746",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Firmas de Email V2</h1>
          <p className="text-muted-foreground">
            Versión con fondo claro neutro y alta resolución para mejor compatibilidad con clientes de correo.
          </p>
          <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-foreground">
              <strong>Mejoras:</strong> Fondo gris claro (#F5F5F5) para mejor integración visual, resolución 4x para mayor nitidez en descargas PNG, colores adaptados para fondos claros.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {signatures.map((sig) => (
            <SignatureTemplate key={sig.email} {...sig} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default SignaturesV2;
