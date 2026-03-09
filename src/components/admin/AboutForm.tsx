"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AboutContent, EducationItem, LanguageItem, ExperienceItem, WorkshopItem, CustomSection, CustomSectionItem } from "@/types/database";
import ImageUpload from "./ImageUpload";

interface AboutFormProps {
  about: AboutContent;
  title?: string;
}

export default function AboutForm({ about, title = "O mně" }: AboutFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    bio_cs: about.bio_cs ?? "",
    bio_en: about.bio_en ?? "",
    profile_image_url: about.profile_image_url ?? "",
    education: about.education ?? [],
    languages: about.languages ?? [],
    experience: about.experience ?? [],
    workshops: about.workshops ?? [],
    custom_sections: about.custom_sections ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tab, setTab] = useState<"cs" | "en">("cs");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Chyba při ukládání");
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neznámá chyba");
    } finally {
      setLoading(false);
    }
  }

  // Dynamic list helpers
  function addEducation() {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { date_cs: "", date_en: "", text_cs: "", text_en: "" }],
    }));
  }

  function updateEducation(index: number, field: keyof EducationItem, value: string) {
    setForm((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  }

  function removeEducation(index: number) {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }

  function addLanguage() {
    setForm((prev) => ({
      ...prev,
      languages: [...prev.languages, { name_cs: "", name_en: "", level_cs: "", level_en: "" }],
    }));
  }

  function updateLanguage(index: number, field: keyof LanguageItem, value: string) {
    setForm((prev) => {
      const updated = [...prev.languages];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, languages: updated };
    });
  }

  function removeLanguage(index: number) {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  }

  function addExperience() {
    setForm((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), { text_cs: "", text_en: "", date_cs: "", date_en: "" }],
    }));
  }

  function updateExperience(index: number, field: keyof ExperienceItem, value: string) {
    setForm((prev) => {
      const updated = [...(prev.experience || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  }

  function removeExperience(index: number) {
    setForm((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index),
    }));
  }

  function addWorkshop() {
    setForm((prev) => ({
      ...prev,
      workshops: [...(prev.workshops || []), { name_cs: "", name_en: "", org_cs: "", org_en: "" }],
    }));
  }

  function updateWorkshop(index: number, field: keyof WorkshopItem, value: string) {
    setForm((prev) => {
      const updated = [...(prev.workshops || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workshops: updated };
    });
  }

  function removeWorkshop(index: number) {
    setForm((prev) => ({
      ...prev,
      workshops: (prev.workshops || []).filter((_, i) => i !== index),
    }));
  }

  // Custom sections helpers
  function addCustomSection() {
    setForm((prev) => ({
      ...prev,
      custom_sections: [
        ...prev.custom_sections,
        { id: crypto.randomUUID(), name_cs: "", name_en: "", type: "two_column" as const, items: [] },
      ],
    }));
  }

  function updateCustomSection(index: number, field: keyof CustomSection, value: string) {
    setForm((prev) => {
      const updated = [...prev.custom_sections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, custom_sections: updated };
    });
  }

  function removeCustomSection(index: number) {
    setForm((prev) => ({
      ...prev,
      custom_sections: prev.custom_sections.filter((_, i) => i !== index),
    }));
  }

  function moveCustomSection(index: number, dir: -1 | 1) {
    setForm((prev) => {
      const arr = [...prev.custom_sections];
      const target = index + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...prev, custom_sections: arr };
    });
  }

  function addCustomSectionItem(sectionIndex: number) {
    setForm((prev) => {
      const sections = [...prev.custom_sections];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items: [...sections[sectionIndex].items, { col1_cs: "", col1_en: "", col2_cs: "", col2_en: "" }],
      };
      return { ...prev, custom_sections: sections };
    });
  }

  function updateCustomSectionItem(sectionIndex: number, itemIndex: number, field: keyof CustomSectionItem, value: string) {
    setForm((prev) => {
      const sections = [...prev.custom_sections];
      const items = [...sections[sectionIndex].items];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      sections[sectionIndex] = { ...sections[sectionIndex], items };
      return { ...prev, custom_sections: sections };
    });
  }

  function removeCustomSectionItem(sectionIndex: number, itemIndex: number) {
    setForm((prev) => {
      const sections = [...prev.custom_sections];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items: sections[sectionIndex].items.filter((_, i) => i !== itemIndex),
      };
      return { ...prev, custom_sections: sections };
    });
  }

  return (
    <div>
      {/* Page header with save */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[30px] font-light tracking-wide uppercase">{title}</h1>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-600 text-[21px]">{error}</span>}
          {success && <span className="text-green-600 text-[21px]">Uloženo!</span>}
          <button
            type="submit"
            form="about-form"
            disabled={loading}
            className="bg-black text-white text-[21px] hover:bg-black/80 transition-colors disabled:opacity-50" style={{ borderRadius: 14, paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 10 }}
          >
            {loading ? "Ukládání..." : "Uložit"}
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="border border-black/[0.06]" style={{ borderRadius: 20, padding: 40, backgroundColor: '#efefef' }}>
        <form id="about-form" onSubmit={handleSubmit} className="max-w-[800px]">
          {/* Language tabs */}
          <div className="flex gap-0 mb-6">
            <button type="button" onClick={() => setTab("cs")} className={`px-6 py-2 text-[21px] rounded-l-xl ${tab === "cs" ? "bg-black text-white" : "bg-black/5 text-black/60"}`}>
              Čeština
            </button>
            <button type="button" onClick={() => setTab("en")} className={`px-6 py-2 text-[21px] rounded-r-xl ${tab === "en" ? "bg-black text-white" : "bg-black/5 text-black/60"}`}>
              English
            </button>
          </div>

          <div className="flex flex-col gap-7">
            {/* Bio */}
            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-1.5">Bio ({tab === "cs" ? "CZ" : "EN"})</label>
              <textarea
                value={tab === "cs" ? form.bio_cs : form.bio_en}
                onChange={(e) => setForm((prev) => ({ ...prev, [tab === "cs" ? "bio_cs" : "bio_en"]: e.target.value }))}
                rows={6}
                className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px] resize-y"
              />
            </div>

            {/* Profile Image */}
            <ImageUpload
              value={form.profile_image_url}
              onChange={(url) => setForm((prev) => ({ ...prev, profile_image_url: url }))}
              folder="about"
              label="Profilový obrázek"
            />

            {/* Education */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[20px] font-medium text-black/70">Vzdělání ({form.education.length})</label>
                <button type="button" onClick={addEducation} className="text-[21px] text-black/50 hover:text-black">+ Přidat</button>
              </div>
              {form.education.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-3 mb-3">
                  <input
                    type="text"
                    value={tab === "cs" ? item.date_cs : item.date_en}
                    onChange={(e) => updateEducation(i, tab === "cs" ? "date_cs" : "date_en", e.target.value)}
                    placeholder="Datum"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <input
                    type="text"
                    value={tab === "cs" ? item.text_cs : item.text_en}
                    onChange={(e) => updateEducation(i, tab === "cs" ? "text_cs" : "text_en", e.target.value)}
                    placeholder="Vzdělání"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <button type="button" onClick={() => removeEducation(i)} className="text-red-500 text-[21px] px-2">x</button>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[20px] font-medium text-black/70">Jazyky ({form.languages.length})</label>
                <button type="button" onClick={addLanguage} className="text-[21px] text-black/50 hover:text-black">+ Přidat</button>
              </div>
              {form.languages.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-3">
                  <input
                    type="text"
                    value={tab === "cs" ? item.name_cs : item.name_en}
                    onChange={(e) => updateLanguage(i, tab === "cs" ? "name_cs" : "name_en", e.target.value)}
                    placeholder="Jazyk"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <input
                    type="text"
                    value={tab === "cs" ? (item.level_cs ?? item.level ?? "") : (item.level_en ?? item.level ?? "")}
                    onChange={(e) => updateLanguage(i, tab === "cs" ? "level_cs" : "level_en", e.target.value)}
                    placeholder="Úroveň"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <button type="button" onClick={() => removeLanguage(i)} className="text-red-500 text-[21px] px-2">x</button>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[20px] font-medium text-black/70">Zkušenosti ({(form.experience || []).length})</label>
                <button type="button" onClick={addExperience} className="text-[21px] text-black/50 hover:text-black">+ Přidat</button>
              </div>
              {(form.experience || []).map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-3 mb-3">
                  <input
                    type="text"
                    value={tab === "cs" ? item.date_cs : item.date_en}
                    onChange={(e) => updateExperience(i, tab === "cs" ? "date_cs" : "date_en", e.target.value)}
                    placeholder="Datum"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <input
                    type="text"
                    value={tab === "cs" ? item.text_cs : item.text_en}
                    onChange={(e) => updateExperience(i, tab === "cs" ? "text_cs" : "text_en", e.target.value)}
                    placeholder="Zkušenost"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <button type="button" onClick={() => removeExperience(i)} className="text-red-500 text-[21px] px-2">x</button>
                </div>
              ))}
            </div>

            {/* Workshops */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[20px] font-medium text-black/70">Workshopy ({(form.workshops || []).length})</label>
                <button type="button" onClick={addWorkshop} className="text-[21px] text-black/50 hover:text-black">+ Přidat</button>
              </div>
              {(form.workshops || []).map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-3">
                  <input
                    type="text"
                    value={tab === "cs" ? item.name_cs : item.name_en}
                    onChange={(e) => updateWorkshop(i, tab === "cs" ? "name_cs" : "name_en", e.target.value)}
                    placeholder="Název"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <input
                    type="text"
                    value={tab === "cs" ? item.org_cs : item.org_en}
                    onChange={(e) => updateWorkshop(i, tab === "cs" ? "org_cs" : "org_en", e.target.value)}
                    placeholder="Organizace"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <button type="button" onClick={() => removeWorkshop(i)} className="text-red-500 text-[21px] px-2">x</button>
                </div>
              ))}
            </div>

            {/* Custom Sections */}
            {form.custom_sections.map((section, si) => (
              <div key={section.id} className="border border-black/15 p-4" style={{ borderRadius: 12 }}>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={tab === "cs" ? section.name_cs : section.name_en}
                    onChange={(e) => updateCustomSection(si, tab === "cs" ? "name_cs" : "name_en", e.target.value)}
                    placeholder={`Název sekce (${tab === "cs" ? "CZ" : "EN"})`}
                    className="border border-black/15 rounded-lg px-3 py-2 text-[21px] flex-1"
                  />
                  <select
                    value={section.type}
                    onChange={(e) => updateCustomSection(si, "type", e.target.value)}
                    className="border border-black/15 rounded-lg px-3 py-2 text-[21px]"
                  >
                    <option value="two_column">Dva sloupce</option>
                    <option value="single">Jeden sloupec</option>
                  </select>
                  <button type="button" onClick={() => moveCustomSection(si, -1)} className="text-black/40 hover:text-black text-[21px] px-1" title="Nahoru">&uarr;</button>
                  <button type="button" onClick={() => moveCustomSection(si, 1)} className="text-black/40 hover:text-black text-[21px] px-1" title="Dolů">&darr;</button>
                  <button type="button" onClick={() => removeCustomSection(si)} className="text-red-500 text-[21px] px-1">x</button>
                </div>
                {section.items.map((item, ii) => (
                  <div key={ii} className={`grid gap-3 mb-2 ${section.type === "two_column" ? "grid-cols-[1fr_1fr_auto]" : "grid-cols-[1fr_auto]"}`}>
                    <input
                      type="text"
                      value={tab === "cs" ? item.col1_cs : item.col1_en}
                      onChange={(e) => updateCustomSectionItem(si, ii, tab === "cs" ? "col1_cs" : "col1_en", e.target.value)}
                      placeholder={section.type === "two_column" ? "Hlavní text" : "Text"}
                      className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                    />
                    {section.type === "two_column" && (
                      <input
                        type="text"
                        value={tab === "cs" ? item.col2_cs : item.col2_en}
                        onChange={(e) => updateCustomSectionItem(si, ii, tab === "cs" ? "col2_cs" : "col2_en", e.target.value)}
                        placeholder="Vedlejší text"
                        className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                      />
                    )}
                    <button type="button" onClick={() => removeCustomSectionItem(si, ii)} className="text-red-500 text-[21px] px-2">x</button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addCustomSectionItem(si)}
                  className="text-[21px] text-black/50 hover:text-black mt-1"
                >
                  + Přidat položku
                </button>
              </div>
            ))}

            {/* Add custom section button */}
            <button
              type="button"
              onClick={addCustomSection}
              className="w-full py-4 text-[21px] text-black/40 hover:text-black/70 border-2 border-dashed border-black/15 hover:border-black/30 transition-colors"
              style={{ borderRadius: 12 }}
            >
              + Přidat vlastní sekci
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
