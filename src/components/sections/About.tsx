import { getTranslations } from "next-intl/server";
import { AboutContent } from "@/types/database";

interface AboutProps {
  about: AboutContent | null;
  locale: string;
}

export default async function About({ about, locale }: AboutProps) {
  if (!about) return null;
  const t = await getTranslations("about");
  const isEn = locale === "en";

  const bio = isEn ? about.bio_en : about.bio_cs;

  // Structured experience items (fallback to plain text if not array)
  const experienceItems = Array.isArray(about.experience) ? about.experience : null;
  const experienceText = !experienceItems
    ? (isEn ? about.experience_en : about.experience_cs)
    : null;

  // Structured workshops
  const workshopItems = Array.isArray(about.workshops) ? about.workshops : null;

  return (
    <>
      {/* Section divider */}
      <div
        id="about"
        className="pb-4 border-b border-border-dark relative z-[1] bg-white"
        style={{ paddingLeft: 54, paddingRight: 54, paddingTop: 126 }}
      >
        <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {t("title")} &bull; About
        </h3>
      </div>

      {/* About content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 pt-10 pb-[60px] relative z-[1] bg-white" style={{ paddingLeft: 54, paddingRight: 54 }}>
        {/* Bio */}
        <div>
          {bio.split("\n").map((paragraph, i) =>
            paragraph.trim() ? (
              <p
                key={i}
                className="text-sm leading-[1.9] font-light text-secondary mb-4"
              >
                {paragraph}
              </p>
            ) : null
          )}
        </div>

        {/* Info lists */}
        <div>
          {/* Education */}
          <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-light mb-[10px]">
            {t("education")}
          </div>
          <ul className="list-none">
            {about.education.map((item, i) => (
              <li
                key={i}
                className="flex justify-between border-b border-border text-[13px] font-light"
                style={{ paddingTop: 14, paddingBottom: 14 }}
              >
                {isEn ? item.text_en : item.text_cs}
                <span className="text-muted text-xs shrink-0 ml-3">
                  {isEn ? item.date_en : item.date_cs}
                </span>
              </li>
            ))}
          </ul>

          {/* Languages */}
          <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-light mb-[10px]" style={{ marginTop: 50 }}>
            {t("languages")}
          </div>
          <ul className="list-none">
            {about.languages.map((lang, i) => (
              <li
                key={i}
                className="flex justify-between border-b border-border text-[13px] font-light"
                style={{ paddingTop: 14, paddingBottom: 14 }}
              >
                {isEn ? lang.name_en : lang.name_cs}
                <span className="text-muted text-xs shrink-0 ml-3">
                  {(isEn ? lang.level_en : lang.level_cs) ?? lang.level ?? ""}
                </span>
              </li>
            ))}
          </ul>

          {/* Experience */}
          <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-light mb-[10px]" style={{ marginTop: 50 }}>
            {t("experience")}
          </div>
          {experienceItems ? (
            <ul className="list-none">
              {experienceItems.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between border-b border-border text-[13px] font-light"
                style={{ paddingTop: 14, paddingBottom: 14 }}
                >
                  {isEn ? item.text_en : item.text_cs}
                  <span className="text-muted text-xs shrink-0 ml-3">
                    {isEn ? item.date_en : item.date_cs}
                  </span>
                </li>
              ))}
            </ul>
          ) : experienceText ? (
            <p className="text-sm leading-[1.9] font-light text-secondary">
              {experienceText}
            </p>
          ) : null}

          {/* Workshops */}
          {workshopItems && workshopItems.length > 0 && (
            <>
              <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-light mb-[10px]" style={{ marginTop: 50 }}>
                {t("workshops")}
              </div>
              <ul className="list-none">
                {workshopItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-border text-[13px] font-light"
                style={{ paddingTop: 14, paddingBottom: 14 }}
                  >
                    {isEn ? item.name_en : item.name_cs}
                    <span className="text-muted text-xs shrink-0 ml-3">
                      {isEn ? item.org_en : item.org_cs}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}
