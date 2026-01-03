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

  const logoUrl = typeof window !== "undefined" ? `${window.location.origin}/assets/fenix-shield-logo.png` : "/assets/fenix-shield-logo.png";

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
      // Only allow http(s) and only LinkedIn domains
      const isHttp = url.protocol === "https:" || url.protocol === "http:";
      const host = url.hostname.toLowerCase();
      const isLinkedIn = host === "linkedin.com" || host.endsWith(".linkedin.com");
      return isHttp && isLinkedIn ? url.toString() : fallback;
    } catch {
      return fallback;
    }
  };

  // QR: use an URL that downloads the contact (more compatible than embedding VCARD in QR)
  const phoneClean = phone.replace(/\s/g, "");

  const vCardParams: Record<string, string> = {
    name,
    role,
    email,
    phone: phoneClean,
    auto: "1",
  };

  // Add linkedin if available
  if (linkedin) {
    vCardParams.linkedin = linkedin;
  }

  // Add photo if available
  if (photo) {
    vCardParams.photo = photo;
  }

  // Always use production domain for QR codes
  const productionDomain = "https://fenixia.tech";
  const vCardUrl = `${productionDomain}/vcard?${new URLSearchParams(vCardParams).toString()}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(vCardUrl)}&bgcolor=0D0D0D&color=FFFFFF`;

  // Build HTML to copy (escape all interpolated values to prevent HTML/script injection)
  const safeName = escapeHtml(name);
  const safeRole = escapeHtml(role);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safePhoneHref = escapeHtml(phoneClean);
  const safeLinkedinHref = escapeHtml(safeLinkedinUrl(linkedin));

  const signatureHtml = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.4; background-color: #2C2F32; padding: 16px 20px; border-radius: 10px; width: 100%; max-width: 620px; border: 1px solid rgba(21, 240, 255, 0.2); box-shadow: 0 4px 20px rgba(21, 240, 255, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3);">
  <tr>
    <td style="padding-left: 8px; padding-right: 10px; border-right: 1px solid rgba(255, 255, 255, 0.15); vertical-align: middle; text-align: center; width: 90px; background-color: #2C2F32;">
      <img src="${qrCodeUrl}" alt="Tarjeta de visita" width="75" height="75" style="display: block; margin: auto; border: 1px solid rgba(21, 240, 255, 0.3); border-radius: 5px; padding: 3px; background-color: #FFFFFF;" />
    </td>
    <td style="padding-left: 16px; padding-right: 16px; vertical-align: middle; background-color: #2C2F32;">
      <table cellpadding="0" cellspacing="0" border="0" style="margin: auto 0;">
        <tr>
          <td style="font-size: 18px; font-weight: bold; color: #FFFFFF; padding-bottom: 1px; padding-top: 4px;">${safeName}</td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #15F0FF; font-weight: 500; padding-bottom: 10px;">
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
                  <a href="mailto:${safeEmail}" style="color: #FFFFFF; text-decoration: none;">${safeEmail}</a>
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
                  <a href="tel:${safePhoneHref}" style="color: #FFFFFF; text-decoration: none;">${safePhone}</a>
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
                  <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="Web" width="16" height="16" style="display: block; filter: invert(76%) sepia(85%) saturate(1000%) hue-rotate(130deg) brightness(103%) contrast(104%);" />
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
                <td style="padding-right: 10px; vertical-align: middle;">
                  <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Dirección" width="16" height="16" style="display: block; filter: invert(45%) sepia(90%) saturate(2000%) hue-rotate(330deg) brightness(95%) contrast(95%);" />
                </td>
                <td style="vertical-align: middle;">
                  <span style="color: #FFFFFF;">C/ La Paz, 83 · 03320 Torrellano (Elche)</span>
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
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar HTML"}
          </Button>
        </div>
      </div>

      {/* Preview (no dangerouslySetInnerHTML) */}
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
              backgroundColor: "#2C2F32",
              padding: "16px 20px",
              borderRadius: 10,
              width: "100%",
              maxWidth: 620,
              border: "1px solid rgba(21, 240, 255, 0.2)",
              boxShadow: "0 4px 20px rgba(21, 240, 255, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3)",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    paddingLeft: 8,
                    paddingRight: 10,
                    borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                    verticalAlign: "middle",
                    textAlign: "center",
                    width: 90,
                    backgroundColor: "#2C2F32",
                  }}
                >
                  <img
                    src={qrCodeUrl}
                    alt="Tarjeta de visita"
                    width={75}
                    height={75}
                    style={{ display: "block", margin: "auto", border: "1px solid rgba(21, 240, 255, 0.3)", borderRadius: 5, padding: 3, backgroundColor: "#FFFFFF" }}
                  />
                </td>

                <td style={{ paddingLeft: 16, paddingRight: 16, verticalAlign: "middle", backgroundColor: "#2C2F32" }}>
                  <table cellPadding={0} cellSpacing={0} border={0}>
                    <tbody>
                      <tr>
                        <td style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF", paddingBottom: 1, paddingTop: 4 }}>{name}</td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: 13, color: "#15F0FF", fontWeight: 500, paddingBottom: 10 }}>
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
                                    style={{ color: "#FFFFFF", textDecoration: "none" }}
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
                                    style={{ color: "#FFFFFF", textDecoration: "none" }}
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
                                    style={{ display: "block", filter: "invert(76%) sepia(85%) saturate(1000%) hue-rotate(130deg) brightness(103%) contrast(104%)" }}
                                  />
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <a
                                    href="https://fenixia.tech"
                                    style={{ color: "#15F0FF", textDecoration: "none", fontWeight: 500 }}
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
                                    style={{ display: "block", filter: "invert(45%) sepia(90%) saturate(2000%) hue-rotate(330deg) brightness(95%) contrast(95%)" }}
                                  />
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <span style={{ color: "#FFFFFF" }}>
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
const Signatures = () => {
  const signatures = [
    {
      name: "Pedro Sánchez",
      role: "Co-Founder",
      email: "pedro@fenixia.tech",
      phone: "+34 620 654 925",
      linkedin: "https://www.linkedin.com/in/pedro-s%C3%A1nchez-81b4a0377",
      photo: typeof window !== "undefined" ? `${window.location.origin}/assets/pedro-original.jpeg` : "/assets/pedro-original.jpeg",
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
