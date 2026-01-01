import { useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function escapeVCardText(value: string) {
  // vCard 3.0 escaping: backslash, semicolon, comma, and newlines
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\n|\r/g, "\\n");
}

function buildVCard(params: {
  name: string;
  role: string;
  email: string;
  phone: string;
}) {
  const { name, role, email, phone } = params;
  const firstName = name.split(" ")[0] ?? "";
  const lastName = name.split(" ").slice(1).join(" ");
  const phoneClean = phone.replace(/\s/g, "");

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardText(lastName)};${escapeVCardText(firstName)}`,
    `FN:${escapeVCardText(name)}`,
    "ORG:FENIX IA SOLUTIONS SL",
    `TITLE:${escapeVCardText(role)}`,
    `TEL;TYPE=WORK,VOICE:${escapeVCardText(phoneClean)}`,
    `EMAIL:${escapeVCardText(email)}`,
    "URL:https://fenixia.tech",
    "ADR;TYPE=WORK:;;C/ La Paz 83;Torrellano-Elche;Alicante;03320;Spain",
    "END:VCARD",
  ].join("\r\n");
}

function downloadVcf(filename: string, vcard: string) {
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

const VCard = () => {
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const role = searchParams.get("role") ?? "";
  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";

  const vcard = useMemo(() => {
    if (!name || !email) return "";
    return buildVCard({ name, role, email, phone });
  }, [name, role, email, phone]);

  useEffect(() => {
    document.title = name ? `${name} · Contacto (VCF)` : "Contacto (VCF)";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Descarga el contacto en formato vCard (VCF) para guardarlo en tu agenda."
      );
    }

    // Auto-intent once (helpful for mobile scanners); user still has a button.
    if (vcard && searchParams.get("auto") === "1") {
      downloadVcf(`${name || "contacto"}.vcf`, vcard);
    }
  }, [name, vcard, searchParams]);

  const canDownload = Boolean(vcard);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto px-4 py-12">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Guardar contacto</h1>
          <p className="mt-2 text-muted-foreground">
            Descarga el contacto en formato vCard (VCF) y guárdalo en tu agenda.
          </p>
        </header>

        <article className="glass-card rounded-xl p-6">
          <div className="space-y-1">
            <p className="text-lg font-semibold">{name || "Contacto"}</p>
            {role ? <p className="text-muted-foreground">{role}</p> : null}
            {email ? <p className="text-muted-foreground">{email}</p> : null}
            {phone ? <p className="text-muted-foreground">{phone}</p> : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => downloadVcf(`${name || "contacto"}.vcf`, vcard)}
              disabled={!canDownload}
            >
              Descargar .vcf
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Volver</Link>
            </Button>
          </div>

          {!canDownload ? (
            <p className="mt-4 text-sm text-destructive">
              Falta información en el enlace (por ejemplo: name y email).
            </p>
          ) : null}
        </article>
      </section>

      <link rel="canonical" href="https://fenixia.tech/vcard" />
    </main>
  );
};

export default VCard;
