import { getTranslations } from "next-intl/server";
import { SiteSettings } from "@/types/database";

interface ContactProps {
  settings: SiteSettings | null;
  locale: string;
}

export default async function Contact({ settings, locale }: ContactProps) {
  const t = await getTranslations("contact");
  const isEn = locale === "en";

  return (
    <>
      {/* Section divider */}
      <div
        id="contact"
        className="pb-4 border-b border-border-dark relative z-[1] bg-white"
        style={{ paddingLeft: 54, paddingRight: 54, paddingTop: 88 }}
      >
        <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {t("title")} &bull; Contact
        </h3>
      </div>

      {/* Contact content */}
      <div className="grid grid-cols-1 md:grid-cols-2 pt-10 gap-6 md:gap-20 relative z-[1] bg-white" style={{ paddingLeft: 54, paddingRight: 54, paddingBottom: 136 }}>
        <div>
          <h2 className="text-[clamp(22px,3vw,34px)] font-light leading-[1.3]">
            {isEn ? (
              <>
                Have a project
                <br />
                or feel like <strong className="font-medium">collaborating</strong>?
                <br />
                Get in touch!
              </>
            ) : (
              <>
                Máte projekt
                <br />
                nebo chuť na <strong className="font-medium">spolupráci</strong>?
                <br />
                Ozvěte se!
              </>
            )}
          </h2>
        </div>
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted block">
            Email
          </span>
          {settings?.contact_email_primary && (
            <a
              href={`mailto:${settings.contact_email_primary}`}
              className="block py-3 border-b border-border text-sm transition-colors hover:text-[rgba(100,160,215,1)]"
            >
              {settings.contact_email_primary}
            </a>
          )}
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted block" style={{ marginTop: 11 }}>
            {isEn ? "School" : "Škola"}
          </span>
          {settings?.contact_email_secondary && (
            <a
              href={`mailto:${settings.contact_email_secondary}`}
              className="block py-3 border-b border-border text-sm transition-colors hover:text-[rgba(100,160,215,1)]"
            >
              {settings.contact_email_secondary}
            </a>
          )}
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted block" style={{ marginTop: 11 }}>
            {isEn ? "University" : "Univerzita"}
          </span>
          <p className="block py-3 border-b border-border text-sm">
            Fakulta architektury VUT v Brně
          </p>
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted block" style={{ marginTop: 11 }}>
            {isEn ? "Location" : "Lokace"}
          </span>
          <p className="block py-3 border-b border-border text-sm">
            Znojmo / Brno, CZ
          </p>
        </div>
      </div>
    </>
  );
}
