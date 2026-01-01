import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface SignatureProps {
  name: string;
  role: string;
  email: string;
  phone: string;
}

const SignatureTemplate = ({ name, role, email, phone }: SignatureProps) => {
  const [copied, setCopied] = useState(false);

  const signatureHtml = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.5; background-color: #1A1C1E; padding: 24px 32px; border-radius: 8px; width: 100%; max-width: 600px;">
  <tr>
    <td style="padding-right: 24px; border-right: 3px solid #15F0FF; vertical-align: top;">
      <img src="https://fenixia.tech/logoFENIXIA.png" alt="Fenix IA" width="110" height="110" style="display: block; border-radius: 8px;" />
    </td>
    <td style="padding-left: 24px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 20px; font-weight: bold; color: #FFFFFF; padding-bottom: 6px;">
            ${name}
          </td>
        </tr>
        <tr>
          <td style="font-size: 14px; color: #15F0FF; font-weight: 500; padding-bottom: 16px;">
            ${role}
          </td>
        </tr>
        <tr>
          <td style="font-size: 14px; padding-bottom: 6px;">
            <a href="mailto:${email}" style="color: #FFFFFF; text-decoration: none;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="font-size: 14px; padding-bottom: 6px;">
            <a href="tel:${phone.replace(/\s/g, '')}" style="color: #FFFFFF; text-decoration: none;">${phone}</a>
          </td>
        </tr>
        <tr>
          <td style="font-size: 14px; padding-bottom: 12px;">
            <a href="https://fenixia.tech" style="color: #15F0FF; text-decoration: none; font-weight: 500;">fenixia.tech</a>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px;">
            <a href="https://www.linkedin.com/company/fenixia" style="text-decoration: none;">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="24" height="24" style="display: inline-block;" />
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top: 20px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="font-size: 12px; color: #D9D9D9; border-top: 1px solid #3B3D3F; padding-top: 16px;">
            <strong style="color: #15F0FF;">FENIX IA SOLUTIONS SL</strong><br />
            C/ La Paz, 83 · 03320 Torrellano-Elche · Alicante
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

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
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
      
      {/* Preview */}
      <div className="bg-white p-6 rounded-lg">
        <div dangerouslySetInnerHTML={{ __html: signatureHtml }} />
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
