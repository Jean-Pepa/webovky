"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteSettings, CustomField } from "@/types/database";

interface SettingsFormProps {
  settings: SiteSettings;
  title?: string;
}

export default function SettingsForm({ settings, title = "Nastavení" }: SettingsFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    hero_title_cs: settings.hero_title_cs ?? "",
    hero_title_en: settings.hero_title_en ?? "",
    hero_subtitle_cs: settings.hero_subtitle_cs ?? "",
    hero_subtitle_en: settings.hero_subtitle_en ?? "",
    contact_email_primary: settings.contact_email_primary ?? "",
    contact_email_secondary: settings.contact_email_secondary ?? "",
    social_links: settings.social_links ?? {},
    custom_fields: settings.custom_fields ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [newLinkKey, setNewLinkKey] = useState("");
  const [newLinkValue, setNewLinkValue] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
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

  function addSocialLink() {
    if (!newLinkKey.trim()) return;
    setForm((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [newLinkKey.trim()]: newLinkValue.trim() },
    }));
    setNewLinkKey("");
    setNewLinkValue("");
  }

  function removeSocialLink(key: string) {
    setForm((prev) => {
      const updated = { ...prev.social_links };
      delete updated[key];
      return { ...prev, social_links: updated };
    });
  }

  function updateSocialLink(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [key]: value },
    }));
  }

  // Custom fields helpers
  function addCustomField() {
    setForm((prev) => ({
      ...prev,
      custom_fields: [
        ...prev.custom_fields,
        { id: crypto.randomUUID(), label_cs: "", label_en: "", value: "", type: "text" as const },
      ],
    }));
  }

  function updateCustomField(index: number, field: keyof CustomField, value: string) {
    setForm((prev) => {
      const updated = [...prev.custom_fields];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, custom_fields: updated };
    });
  }

  function removeCustomField(index: number) {
    setForm((prev) => ({
      ...prev,
      custom_fields: prev.custom_fields.filter((_, i) => i !== index),
    }));
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
            form="settings-form"
            disabled={loading}
            className="bg-black text-white text-[21px] hover:bg-black/80 transition-colors disabled:opacity-50" style={{ borderRadius: 14, paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 10 }}
          >
            {loading ? "Ukládání..." : "Uložit"}
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="border border-black/[0.06]" style={{ borderRadius: 20, padding: 40, backgroundColor: '#efefef' }}>
        <form id="settings-form" onSubmit={handleSubmit} className="max-w-[800px]">
          <div className="flex flex-col gap-7">
            {/* Hero Title */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">Hero titulek (CZ)</label>
                <input
                  type="text"
                  value={form.hero_title_cs}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero_title_cs: e.target.value }))}
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                />
              </div>
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">Hero titulek (EN)</label>
                <input
                  type="text"
                  value={form.hero_title_en}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero_title_en: e.target.value }))}
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                />
              </div>
            </div>

            {/* Hero Subtitle */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">Hero podtitulek (CZ)</label>
                <input
                  type="text"
                  value={form.hero_subtitle_cs}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero_subtitle_cs: e.target.value }))}
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                />
              </div>
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">Hero podtitulek (EN)</label>
                <input
                  type="text"
                  value={form.hero_subtitle_en}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero_subtitle_en: e.target.value }))}
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                />
              </div>
            </div>

            {/* Emails */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">Primární email</label>
                <input
                  type="email"
                  value={form.contact_email_primary}
                  onChange={(e) => setForm((prev) => ({ ...prev, contact_email_primary: e.target.value }))}
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                />
              </div>
              <div>
                <label className="block text-[20px] font-medium text-black/70 mb-1.5">Sekundární email</label>
                <input
                  type="email"
                  value={form.contact_email_secondary}
                  onChange={(e) => setForm((prev) => ({ ...prev, contact_email_secondary: e.target.value }))}
                  className="w-full border border-black/15 rounded-lg px-4 py-3 text-[21px]"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-2">
                Sociální sítě ({Object.keys(form.social_links).length})
              </label>
              {Object.entries(form.social_links).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[120px_1fr_auto] gap-2 mb-2">
                  <span className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px] bg-black/[0.02]">{key}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateSocialLink(key, e.target.value)}
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <button type="button" onClick={() => removeSocialLink(key)} className="text-red-500 text-[21px] px-2">x</button>
                </div>
              ))}
              <div className="grid grid-cols-[120px_1fr_auto] gap-2 mt-2">
                <input
                  type="text"
                  value={newLinkKey}
                  onChange={(e) => setNewLinkKey(e.target.value)}
                  placeholder="Název (instagram)"
                  className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                />
                <input
                  type="text"
                  value={newLinkValue}
                  onChange={(e) => setNewLinkValue(e.target.value)}
                  placeholder="URL"
                  className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                />
                <button type="button" onClick={addSocialLink} className="text-black/50 hover:text-black text-[21px] px-2">+</button>
              </div>
            </div>

            {/* Custom Fields */}
            <div>
              <label className="block text-[20px] font-medium text-black/70 mb-2">
                Vlastní kontaktní pole ({form.custom_fields.length})
              </label>
              {form.custom_fields.map((field, i) => (
                <div key={field.id} className="grid grid-cols-[100px_1fr_1fr_1fr_auto] gap-2 mb-2">
                  <select
                    value={field.type}
                    onChange={(e) => updateCustomField(i, "type", e.target.value)}
                    className="border border-black/15 rounded-lg px-2 py-2.5 text-[21px]"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="link">Odkaz</option>
                  </select>
                  <input
                    type="text"
                    value={field.label_cs}
                    onChange={(e) => updateCustomField(i, "label_cs", e.target.value)}
                    placeholder="Štítek CZ"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <input
                    type="text"
                    value={field.label_en}
                    onChange={(e) => updateCustomField(i, "label_en", e.target.value)}
                    placeholder="Štítek EN"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateCustomField(i, "value", e.target.value)}
                    placeholder="Hodnota"
                    className="border border-black/15 rounded-lg px-3 py-2.5 text-[21px]"
                  />
                  <button type="button" onClick={() => removeCustomField(i)} className="text-red-500 text-[21px] px-2">x</button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCustomField}
                className="text-[21px] text-black/50 hover:text-black mt-1"
              >
                + Přidat pole
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
